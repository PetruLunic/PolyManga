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
import {ChapterList} from "@/app/_components/ChapterListEdit";
import React, {useEffect, useState} from "react";
import {Input} from "@heroui/input";
import {useQuery} from "@apollo/client";
import {POLL_CHAPTER_METADATA} from "@/app/lib/graphql/queries";
import {scanOCR} from "@/app/(pages)/[locale]/manga/[id]/chapter/[number]/edit/metadata/actions";
import {ChapterLanguage, ChapterLanguageFull, LocaleType} from "@/app/types";

interface Props extends Omit<ModalProps, "children"> {
  chapters?: ChapterList,
  selectedChapters: string[]
}

type ProcessStatus = "pending" | "finished" | "error" | "processing";

const POLL_INTERVAL = 1000 * 20; // 20 seconds
const POLL_TIMEOUT = 1000 * 60 * 3 ; // 3 minutes

export default function ProcessOcrModal({onOpenChange, isOpen, selectedChapters, chapters}: Props) {
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [imagesLanguage, setImagesLanguage] = useState<LocaleType>("en");
  const [socketState, setSocketState] = useState({
    connecting: false,
    connected: false,
    processing: false
  })
  const [socketMessage, setSocketMessage] = useState<unknown>();
  const [ocrURL, setOcrURL] = useState<string | null>(null);
  const [processingStatuses, setProcessingStatuses] = useState<Partial<Record<string, ProcessStatus>>>({});
  const processingChapter = Object.entries(processingStatuses).find(([_, status]) => status === "processing")?.at(0);
  const {
    data, 
    previousData, 
    variables,
    fetchMore,
    startPolling, 
    stopPolling
  } = useQuery(POLL_CHAPTER_METADATA, {
    variables: {chapterId: processingChapter ?? ""},
    skip: !processingChapter,
  })

  async function processOCR() {
    // Set the first chapter processing, the rest pending
    setProcessingStatuses(selectedChapters.reduce((acc, id, index) => 
      ({
        ...acc, 
        [id]: index === 0 ? "processing" : "pending"
      }), {}));
  }

  function connectSocket(url: string | null) {
    if (!url) return;
    if (socket) {
      socket.close()
    }

    setSocketState(prev => ({...prev, connecting: true}));
    const newSocket = new WebSocket(url + "/ws");
    setSocket(newSocket);
  }

  useEffect(() => {
    if (!ocrURL || !processingChapter) return;

    (async () => {
      try {
        console.log("Start scanning OCR")
        await scanOCR(ocrURL + "/api/sync", processingChapter, imagesLanguage);
        // Start polling after the timeout
        setTimeout(() => startPolling(POLL_INTERVAL), POLL_TIMEOUT);
      } catch (e) {
        console.error(e);
        setProcessingStatuses(prev => ({
          ...prev, [processingChapter]: "error"
        }))
      }
    })();

  }, [processingChapter]);

  // Subscribe to changing the processing chapter's metadata
  useEffect(() => {
    console.log({variables, processingChapter, data, previousData});
    if (
      !data?.metadata ||
      !Number.isInteger(data?.metadata?.version) ||
      !previousData ||
      (previousData.metadata && data.metadata.id !== previousData.metadata?.id)|| // If it's not the same metadata
      !processingChapter
    ) return;
    
    const currentVersion = data?.metadata?.version;
    const previousVersion = previousData.metadata?.version;
    
    // If the metadata was changed
    if (currentVersion !== previousVersion) {
      console.log("Starting to process next chapter");
      stopPolling();
      setProcessingStatuses(prev => {
        const nextChapterIndex = selectedChapters.indexOf(processingChapter) + 1;
        
        // If it's not the last chapter
        if (nextChapterIndex < selectedChapters.length) {
          fetchMore({variables: {chapterId: selectedChapters[nextChapterIndex]}});
          
          return {
            ...prev,
            [processingChapter]: "finished",
            [selectedChapters[nextChapterIndex]]: "processing"
          }
        }
        
        // If it's the last processed chapter
        return {
        ...prev,
        [processingChapter]: "finished",
        }
      })
    }
  }, [data, previousData, variables, processingChapter, selectedChapters]);

  useEffect(() => {
    const url = localStorage.getItem("ocrURL");
    setOcrURL(url);
  }, []);

  useEffect(() => {
    if (!socket) return;

    socket.onopen = function() {
      setSocketState(prev => ({...prev, connecting: false, connected: true}));
    };

    socket.onmessage = function(event) {
      setSocketMessage(event.data);
      console.log(event);
    };

    socket.onopen = () => {
      setSocketState(prev => ({...prev, connecting: false, connected: true}));
    }

    socket.onclose = () => {
      setSocketState(prev => ({...prev, connecting: false, connected: false}));
      setSocket(null);
    }

    socket.onmessage = message => {
      setSocketMessage(message.data);
    }

    socket.onerror = (() => {
      setSocketState(prev => ({...prev, connecting: false, connected: false}));
      setSocket(null);
    })

    return () => {
      socket.close()
    }
  }, [socket]);

  useEffect(() => {
    if (!socket || !socketState.connected || socketState.processing || socketState.connecting) return;

    const authPayload = {
      api_key: 'e:nveTTn.ZVNKU[qW>yj%@QF2S)VEb)r'
    };

    socket?.send(JSON.stringify(authPayload));
  }, [socket, socketState]);

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
               >
                 {Object.keys(ChapterLanguage).map(lang =>
                   <SelectItem key={lang.toLowerCase()}>
                     {ChapterLanguageFull[lang as ChapterLanguage]}
                   </SelectItem>
                 )}
               </Select>
               <Input
                 label={"OCR URL"}
                 isDisabled={socketState.connecting || socketState.processing}
                 value={ocrURL ?? ""}
                 onValueChange={value => {
                   setOcrURL(value);
                   localStorage.setItem("ocrURL", value);
                 }}
               />
             </div>
             <Card className="max-h-60 max-w-60">
               <CardHeader>
                 Latest OCR process..
               </CardHeader>
               <CardBody>
                 {JSON.stringify(socketMessage)}
               </CardBody>
             </Card>
             <div className="flex flex-col gap-2">
               {Object.entries(processingStatuses).map(([id, status]) =>
                 <div key={id}>
                   {chapters?.find(ch => ch.id === id)?.titles[0].value} - {status}
                 </div>
               )}
             </div>
           </ModalBody>
           <ModalFooter>
             <Button
               onPress={onClose}
               color="danger"
             >
               Close
             </Button>
             <Button
               onPress={() => socketState.connected ? socket?.close() : connectSocket(ocrURL)}
               isLoading={socketState.connecting}
             >
               {socketState.connected ? "(Connected) Disconnect" : "(Closed) Connect"}
             </Button>
             <Button
               color="primary"
               isDisabled={!socketState.connected}
               isLoading={!!processingChapter}
               onPress={processOCR}
             >
               Scan OCR
             </Button>
           </ModalFooter>
         </>
       )}
     </ModalContent>
   </Modal>
 );
};