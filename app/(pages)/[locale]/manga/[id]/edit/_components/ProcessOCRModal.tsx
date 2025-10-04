"use client"

import {
  Button, Card, CardBody, CardHeader,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalProps, Select, SelectItem, Spinner,
} from "@heroui/react";
import { ChapterList } from "@/app/_components/ChapterListEdit";
import React, { useEffect, useState, useRef } from "react";
import { ChapterLanguage, ChapterLanguageFull, LocaleType } from "@/app/types";
import {OcrWsClient} from "@/app/lib/utils/OcrWsClient";

interface Props extends Omit<ModalProps, "children"> {
  chapters?: ChapterList,
  selectedChapters: string[]
}

interface ChapterForOcr {
  id: string;
  images: { src: string }[];
}

const BUCKET_URL = process.env.NEXT_PUBLIC_BUCKET_URL as string;
const WS_URL = process.env.NEXT_PUBLIC_OCR_API_URL as string;

type SocketStatus = "disconnected" | "connecting" | "connected" | "authenticated" | "error";

export default function ProcessOcrModal({ onOpenChange, isOpen, selectedChapters }: Props) {
  const [imagesLanguage, setImagesLanguage] = useState<LocaleType>("en");
  const [ocrToken, setOcrToken] = useState<string | null>(null);
  const [ocrChapters, setOcrChapters] = useState<ChapterForOcr[]>([]);
  const [fetchLoading, setFetchLoading] = useState(false);
  const [fetchError, setFetchError] = useState<string | null>(null);

  const [processingStatuses, setProcessingStatuses] = useState<Partial<Record<string, "pending" | "processing" | "finished" | "error">>>({});
  const [currentChapterIndex, setCurrentChapterIndex] = useState(-1);

  const [socketStatus, setSocketStatus] = useState<SocketStatus>("disconnected");
  const [metaMessage, setMetaMessage] = useState<string | null>(null);
  const wsRef = useRef<OcrWsClient | null>(null);

  const processingChapter = currentChapterIndex >= 0 ? selectedChapters[currentChapterIndex] : null;
  const isProcessing = Object.values(processingStatuses).some(status => status === "processing");

  const currentChapterIndexRef = useRef(currentChapterIndex);

  useEffect(() => {
    currentChapterIndexRef.current = currentChapterIndex;
  }, [currentChapterIndex]);


  // --- Fetch OCR data on modal open, language or chapters change ---
  useEffect(() => {
    async function fetchOcrData() {
      if (isOpen && selectedChapters.length > 0) {
        setFetchLoading(true);
        setFetchError(null);
        setOcrChapters([]);
        setOcrToken(null);

        try {
          const res = await fetch("/api/ocr/get-chapter-ocr-data", {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ chapterIds: selectedChapters, imagesLanguage })
          });
          const data = await res.json();
          if (!res.ok || !data.token) {
            setFetchError("Failed to retrieve OCR token.");
          } else {
            setOcrToken(data.token);
            setOcrChapters(data.chapters); // [{id, images: [...] }]
          }
        } catch (err) {
          setFetchError("Network error or unauthorized.");
        }
        setFetchLoading(false);
      }
    }
    if (isOpen) fetchOcrData();
    // eslint-disable-next-line
  }, [isOpen, selectedChapters, imagesLanguage]);

  // --- Guard before connect/start ---
  const canConnect = !!ocrToken && ocrChapters.length === selectedChapters.length && !fetchLoading;
  const canStartOcr = socketStatus === "authenticated" && canConnect && !isProcessing;

  // --- Connect WS ---
  const connectWS = () => {
    if (!canConnect || !ocrToken) return;
    if (wsRef.current) wsRef.current.close();

    setSocketStatus("connecting");
    setMetaMessage(null);

    wsRef.current = new OcrWsClient({
      url: WS_URL + "/ws",
      apiKey: ocrToken,
      handlers: {
        onAuthenticated: (frame) => {
          setSocketStatus("authenticated");
          setMetaMessage(frame.message);
          // if (frame.status === "authenticated" && "processing_status" in frame && typeof frame.processing_status === "string") {
          //   if (frame.processing_status === "available") handleAvailable();
          // }
        },
        onProcessingStatus: (frame) => {
          if ("processing_status" in frame) {
            if (frame.processing_status === "available" && frame.status !== "authenticated") {
              handleAvailable();
            }
            else if (frame.processing_status === "busy") setMetaMessage("OCR processor busy...");
            else if (frame.processing_status === "error") {
              setMetaMessage("OCR error!");
              if (processingChapter) updateStatus(processingChapter, "error");
            }
          }
        },
        onNotification: (frame) => setMetaMessage("Notification: " + frame.message),
        onSuccess: (frame) => {
          setMetaMessage("Success: " + frame.message);
          handleAvailable();
        },
        onError: (_frame) => setSocketStatus("error"),
        onMetadata: (data) => {}, // handle as you want
        onClose: () => {
          setSocketStatus("disconnected");
          setMetaMessage(null);
        }
      }
    });

    wsRef.current.connect();
  };

  // --- Disconnect WS ---
  const disconnectWS = () => {
    wsRef.current?.close();
    wsRef.current = null;
    setSocketStatus("disconnected");
    setMetaMessage(null);
  };


  // --- Handle next chapter when available ---
  function handleAvailable() {
    if (!ocrChapters.length) return;
    const chs = selectedChapters;
    const currentIdx = currentChapterIndexRef.current;
    if (currentIdx >= 0 && currentIdx < chs.length) {
      updateStatus(chs[currentIdx], "finished");
    }


    const nextIdx = currentIdx + 1;
    if (nextIdx < chs.length) {
      setCurrentChapterIndex(nextIdx);
      updateStatus(chs[nextIdx], "processing");
      const chapter = ocrChapters.find(ch => ch.id === chs[nextIdx]);
      const imgUrls = chapter?.images.map(img => BUCKET_URL + img.src) || [];
      if (chapter) {
        wsRef.current?.sendStart({ chapterId: chapter.id, images: imgUrls });
      }
    } else {
      setMetaMessage("All chapters processed!");
      disconnectWS();
    }
  }

  function updateStatus(chapterId: string, status: "pending" | "processing" | "finished" | "error") {
    setProcessingStatuses(prev => ({ ...prev, [chapterId]: status }));
  }

  // --- Start OCR process ---
  function processOCR() {
    if (!wsRef.current || !ocrChapters.length || socketStatus !== "authenticated") return;
    if (selectedChapters.length === 0) return;

    // Mark statuses
    const initial = selectedChapters.reduce((acc, id, idx) => ({
      ...acc,
      [id]: idx === 0 ? "processing" : "pending"
    }), {});
    setProcessingStatuses(initial);
    setCurrentChapterIndex(0);

    // Send start job for first chapter
    const chapter = ocrChapters.find(ch => ch.id === selectedChapters[0]);
    const imgUrls = chapter?.images.map(img => BUCKET_URL + img.src) || [];
    if (chapter) {
      wsRef.current?.sendStart({ chapterId: chapter.id, images: imgUrls });
      setMetaMessage("Started OCR for chapter " + chapter.id);
    }
  }

  // --- Reset on modal close ---
  // useEffect(() => {
  //   if (!isOpen) {
  //     disconnectWS();
  //     setProcessingStatuses({});
  //     setCurrentChapterIndex(-1);
  //   }
  //   // eslint-disable-next-line
  // }, [isOpen]);

  // --- Status Display ---
  const statusColors: Record<SocketStatus, string> = {
    "disconnected": "text-gray-500",
    "connecting": "text-blue-500 animate-pulse",
    "connected": "text-blue-600",
    "authenticated": "text-green-600",
    "error": "text-red-600",
  };

  // --- Render Modal ---
  return (
    <Modal
      size="full"
      scrollBehavior="inside"
      onOpenChange={onOpenChange}
      isOpen={isOpen}
    >
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader>
              Process OCR ({selectedChapters.length}) chapters
            </ModalHeader>
            <ModalBody className="gap-4">
              <div className="flex gap-3 justify-between">
                <Select
                  selectedKeys={[imagesLanguage]}
                  disallowEmptySelection
                  label="Images language"
                  onSelectionChange={keys => {
                    setImagesLanguage((keys.currentKey ?? "en") as LocaleType)
                  }}
                  isDisabled={isProcessing || fetchLoading}
                >
                  {Object.keys(ChapterLanguage).map(lang =>
                    <SelectItem key={lang.toLowerCase()}>
                      {ChapterLanguageFull[lang as ChapterLanguage]}
                    </SelectItem>
                  )}
                </Select>
              </div>

              {/* OCR data loading spinner and errors */}
              {fetchLoading && (
                <div className="flex items-center gap-2 my-3 text-blue-600"><Spinner size="sm" />Fetching chapters & token...</div>
              )}
              {fetchError && (
                <div className="my-3 text-red-600">Error: {fetchError}</div>
              )}
              {ocrChapters.length === selectedChapters.length && !fetchLoading && (
                <div className={`font-medium mt-2 mb-3 ${statusColors[socketStatus]}`}>
                  WebSocket Status: {socketStatus[0].toUpperCase() + socketStatus.substring(1)}
                  {metaMessage && (
                    <span className="ml-2 text-sm text-gray-600">| {metaMessage}</span>
                  )}
                </div>
              )}

                  <h3 className="text-lg font-semibold">Processing Status</h3>
                  <div className="flex flex-col gap-3">
                    {selectedChapters.map((id, index) => {
                      const chapter = ocrChapters.find(ch => ch.id === id);
                      const status = processingStatuses[id];
                      const color =
                        status === "pending"
                          ? "text-gray-500"
                          : status === "processing"
                            ? "text-blue-500"
                            : status === "finished"
                              ? "text-green-500"
                              : status === "error"
                                ? "text-red-500"
                                : "text-gray-500";
                      return (
                        <div key={id} className="flex items-center justify-between p-3 border rounded-lg">
                          <div className="flex-1">
                            <p className="font-medium">
                              {chapter ? `Chapter ${index + 1}` : "(loading...)"}
                            </p>
                            <p className="text-sm text-gray-600">ID: {id}</p>
                          </div>
                          {status && (
                            <div className={`font-medium ${color}`}>
                              {status[0].toUpperCase() + status.substring(1)}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
            </ModalBody>
            <ModalFooter className="flex gap-3">
              <Button
                onPress={onClose}
                color="danger"
              >
                Close
              </Button>
              <Button
                color={socketStatus === "disconnected" || socketStatus === "error" ? "primary" : "secondary"}
                onPress={socketStatus === "disconnected" || socketStatus === "error" ? connectWS : disconnectWS}
                isDisabled={!canConnect}
              >
                {socketStatus === "disconnected" || socketStatus === "error" ? "Connect WS" : "Disconnect"}
              </Button>
              <Button
                color="primary"
                isLoading={isProcessing}
                onPress={processOCR}
                isDisabled={!canStartOcr}
              >
                {isProcessing ? "Processing..." : "Start OCR"}
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}