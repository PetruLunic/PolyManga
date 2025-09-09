"use client"

import {
  Button, Card, CardBody, CardHeader,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalProps, Select, SelectItem,
} from "@heroui/react";
import { ChapterList } from "@/app/_components/ChapterListEdit";
import React, { useEffect, useState, useRef } from "react";
import { scanOCR, checkOCRStatus } from "@/app/(pages)/[locale]/manga/[id]/chapter/[number]/edit/metadata/actions";
import { ChapterLanguage, ChapterLanguageFull, LocaleType } from "@/app/types";

interface Props extends Omit<ModalProps, "children"> {
  chapters?: ChapterList,
  selectedChapters: string[]
}

type ProcessStatus = "pending" | "finished" | "error" | "processing";

const POLL_INTERVAL = 20000; // 20 seconds
const POLL_TIMEOUT = 60000; // 1 minute initial delay before starting to poll

export default function ProcessOcrModal({ onOpenChange, isOpen, selectedChapters, chapters }: Props) {
  const [imagesLanguage, setImagesLanguage] = useState<LocaleType>("en");
  const [processingStatuses, setProcessingStatuses] = useState<Partial<Record<string, ProcessStatus>>>({});
  const [currentChapterIndex, setCurrentChapterIndex] = useState<number>(-1);
  const [isPolling, setIsPolling] = useState(false);

  // Use refs to store the latest values for the polling function
  const pollIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const currentChapterIndexRef = useRef(-1);
  const selectedChaptersRef = useRef<string[]>([]);
  const processingStatusesRef = useRef<Partial<Record<string, ProcessStatus>>>({});
  const isProcessing = Object.values(processingStatuses).some(status => status === "processing");

  // Update refs when state changes
  useEffect(() => {
    currentChapterIndexRef.current = currentChapterIndex;
  }, [currentChapterIndex]);

  useEffect(() => {
    selectedChaptersRef.current = selectedChapters;
  }, [selectedChapters]);

  useEffect(() => {
    processingStatusesRef.current = processingStatuses;
  }, [processingStatuses]);

  const processingChapter = currentChapterIndex >= 0 ? selectedChapters[currentChapterIndex] : null;

  // Poll OCR status
  const pollOCRStatus = async () => {
    try {
      const result = await checkOCRStatus();

      if (!result.success) {
        console.error('OCR status check failed:', result.error);
        // Handle error but continue polling
        return;
      }

      // If OCR is available (not busy), process next chapter
      if (result.status === "available") {
        console.log("OCR is available, processing next chapter");

        const currentIndex = currentChapterIndexRef.current;
        const chapters = selectedChaptersRef.current;

        if (currentIndex >= 0 && currentIndex < chapters.length) {
          // Mark current chapter as finished
          setProcessingStatuses(prev => ({
            ...prev,
            [chapters[currentIndex]]: "finished"
          }));
        }

        // Move to next chapter
        const nextIndex = currentIndex + 1;

        if (nextIndex < chapters.length) {
          setCurrentChapterIndex(nextIndex);
          setProcessingStatuses(prev => ({
            ...prev,
            [chapters[nextIndex]]: "processing"
          }));

          // Start OCR for next chapter
          try {
            await scanOCR(chapters[nextIndex], imagesLanguage);
          } catch (error) {
            console.error('OCR scan failed:', error);
            setProcessingStatuses(prev => ({
              ...prev,
              [chapters[nextIndex]]: "error"
            }));
          }
        } else {
          // All chapters processed
          console.log("All chapters processed");
          stopPolling();
        }
      } else if (result.status === "error") {
        console.error("OCR API returned error status");
        if (processingChapter) {
          setProcessingStatuses(prev => ({
            ...prev,
            [processingChapter]: "error"
          }));
        }
        stopPolling();
      }
      // If status is "busy", continue polling
    } catch (error) {
      console.error('Error during OCR status polling:', error);
    }
  };

  const startPolling = () => {
    if (pollIntervalRef.current) {
      clearInterval(pollIntervalRef.current);
    }

    setIsPolling(true);
    pollIntervalRef.current = setInterval(pollOCRStatus, POLL_INTERVAL);
  };

  const stopPolling = () => {
    if (pollIntervalRef.current) {
      clearInterval(pollIntervalRef.current);
      pollIntervalRef.current = null;
    }
    setIsPolling(false);
    setCurrentChapterIndex(-1);
  };

  async function processOCR() {
    if (selectedChapters.length === 0) return;

    // Initialize all chapters as pending
    const initialStatuses = selectedChapters.reduce((acc, id, index) => ({
      ...acc,
      [id]: index === 0 ? "processing" : "pending"
    }), {});

    setProcessingStatuses(initialStatuses);
    setCurrentChapterIndex(0);

    try {
      // Start OCR for the first chapter
      console.log("Starting OCR for first chapter:", selectedChapters[0]);
      await scanOCR(selectedChapters[0], imagesLanguage);

      // Start polling after initial delay
      setTimeout(() => {
        startPolling();
      }, POLL_TIMEOUT);

    } catch (error) {
      console.error('Failed to start OCR process:', error);
      setProcessingStatuses(prev => ({
        ...prev,
        [selectedChapters[0]]: "error"
      }));
    }
  }

  const getStatusDisplay = (status: ProcessStatus) => {
    switch (status) {
      case "pending":
        return { text: "Pending", color: "text-gray-500" };
      case "processing":
        return { text: "Processing...", color: "text-blue-500" };
      case "finished":
        return { text: "Completed", color: "text-green-500" };
      case "error":
        return { text: "Error", color: "text-red-500" };
      default:
        return { text: "Unknown", color: "text-gray-500" };
    }
  };

  return (
    <Modal
      size="full"
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
                  isDisabled={isPolling}
                >
                  {Object.keys(ChapterLanguage).map(lang =>
                    <SelectItem key={lang.toLowerCase()}>
                      {ChapterLanguageFull[lang as ChapterLanguage]}
                    </SelectItem>
                  )}
                </Select>

                {isPolling && (
                  <div className="flex items-center gap-2 text-sm text-blue-600">
                    <div className="w-2 h-2 bg-blue-600 rounded-full animate-pulse"></div>
                    Polling OCR status...
                  </div>
                )}
              </div>

              <Card>
                <CardHeader>
                  <h3 className="text-lg font-semibold">Processing Status</h3>
                </CardHeader>
                <CardBody>
                  <div className="flex flex-col gap-3 max-h-96 overflow-y-auto">
                    {selectedChapters.map((id, index) => {
                      const chapter = chapters?.find(ch => ch.id === id);
                      const status = processingStatuses[id];
                      const statusDisplay = status ? getStatusDisplay(status) : null;

                      return (
                        <div key={id} className="flex items-center justify-between p-3 border rounded-lg">
                          <div className="flex-1">
                            <p className="font-medium">
                              {chapter?.titles[0]?.value || `Chapter ${index + 1}`}
                            </p>
                            <p className="text-sm text-gray-600">ID: {id}</p>
                          </div>
                          {statusDisplay && (
                            <div className={`font-medium ${statusDisplay.color}`}>
                              {statusDisplay.text}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </CardBody>
              </Card>
            </ModalBody>
            <ModalFooter>
              <Button
                onPress={onClose}
                color="danger"
              >
                Close
              </Button>
              <Button
                color="primary"
                isLoading={isProcessing}
                onPress={processOCR}
                isDisabled={isProcessing || selectedChapters.length === 0}
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
