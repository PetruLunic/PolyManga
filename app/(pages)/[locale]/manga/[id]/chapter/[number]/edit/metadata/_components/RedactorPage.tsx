"use client"

import React, {useCallback, useEffect, useState} from 'react';
import {RndDragCallback, RndResizeCallback} from 'react-rnd';
import {ChapterLanguage, ChapterLanguageFull, ChapterMetadata, LocaleType, TextItem} from "@/app/types";
import {ChapterQuery} from "@/app/__generated__/graphql";
import NextImage from "next/image";
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Image,
  Select,
  SelectItem, useDisclosure
} from "@heroui/react";
import {nanoid} from "nanoid";
import {CoordsItem} from "@/app/lib/graphql/schema";
import EditableMetadataBox
  from "@/app/(pages)/[locale]/manga/[id]/chapter/[number]/edit/metadata/_components/EditableMetadataBox";
import {locales} from "@/i18n/routing";
import {
  saveMetadata, scanOCR,
} from "@/app/(pages)/[locale]/manga/[id]/chapter/[number]/edit/metadata/actions";
import {useScrollHeight} from "@/app/lib/hooks/useScrollHeight";
import {transformMetadata} from "@/app/lib/utils/transformMetadata";
import TranslateModal
  from "@/app/(pages)/[locale]/manga/[id]/chapter/[number]/edit/metadata/_components/TranslateModal";
import {MetadataSchema} from "@/app/lib/utils/zodSchemas";

export interface Box {
  id: string;
  coords: Partial<Record<LocaleType, CoordsItem>>,
  translatedTexts: Partial<Record<LocaleType, TextItem>>,
}

const BUCKET_URL = process.env.NEXT_PUBLIC_BUCKET_URL;
const FONT_SIZES = Array.from({length: 30}, (_, index) => 10 + index * 2);
const BOX_SIZES = Array.from({length: 20}, (_, index) => -50 + index * 5);
const SCROLL_OFFSET = 1000;

interface Props {
  chapter: ChapterQuery["chapter"];
  metadata: ChapterMetadata["content"];
}

const API_URL = process.env.NEXT_PUBLIC_OCR_API_URL + "/ws";

export default function RedactorPage({chapter, metadata}: Props) {
  const [isSaving, setIsSaving] = useState(false);
  const [boxes, setBoxes] = useState<Box[]>([]);
  const [imagesLanguage, setImagesLanguage] = useState<LocaleType>(chapter.languages[0].toLowerCase() as LocaleType);
  const [textLanguage, setTextLanguage] = useState<LocaleType>(locales[0]);
  const images = chapter.versions.find(({language: lang}) => lang.toLowerCase() === imagesLanguage)?.images;
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [socketState, setSocketState] = useState({
    connecting: true,
    connected: false,
    processing: false
  })
  const [socketMessage, setSocketMessage] = useState<unknown>();
  const scrollHeight = useScrollHeight();
  const {onOpenChange, onOpen, isOpen} = useDisclosure();

  function scanOCR() {
    if (!socketState.connected) return;

    setSocketState(prev => ({...prev, processing: true}));
    socket?.send(JSON.stringify({
      data: images?.map(img => BUCKET_URL + img.src),
      chapterId: chapter.id,
      stage: "start"
    }))
  }

  function processOCRMetadata(message: any) {
    try {
      if (!message && typeof message !== "string") return;

      const data = JSON.parse(message).data;
      const result = MetadataSchema.safeParse(data);
      const processedData = result.data?.flat();

      if (processedData) {

        // @ts-ignore
        const metadata = transformMetadata({content: processedData});
        if (!metadata) return;
        setSocketState(prev => ({...prev, processing: false}));
        setBoxes(metadata.map(item => ({...item, id: nanoid()})))
      } else {
        console.log(result.error?.toString());
      }
    } catch (e) {
      console.warn(e);
    }
  }

  console.log(boxes.map(box => box.translatedTexts.en?.text ?? "Empty box"))

  function connectSocket() {
    if (!API_URL) throw new Error("NEXT_PUBLIC_OCR_API_URL .env variable missing");
    if (socket) {
      socket.close()
    }

    setSocketState(prev => ({...prev, connecting: true}));
    const newSocket = new WebSocket(API_URL);
    setSocket(newSocket);
  }

  useEffect(() => {
    connectSocket()
  }, []);

  useEffect(() => {
    if (!socket) return;

    socket.onopen = function() {
      console.log('Conexiune WebSocket deschisă');
      setSocketState(prev => ({...prev, connecting: false, connected: true}));
    };

    socket.onmessage = function(event) {
        processOCRMetadata(event.data)
        setSocketMessage(event.data);
    };

    socket.onopen = () => {
      setSocketState(prev => ({...prev, connecting: false, connected: true}));
    }

    socket.onclose = () => {
      setSocketState(prev => ({...prev, connecting: false, connected: false}));
      setSocket(null);
    }

    socket.onmessage = message => {
      processOCRMetadata(message.data)
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

  useEffect(() => {
    setBoxes(metadata?.map(item => ({...item, id: nanoid()})))
  }, [metadata]);

  // Handle drag stop event
  const handleDragStop: (id: string) => RndDragCallback = useCallback((id: string) => (e, d) => {
    setBoxes((prevBoxes) =>
      prevBoxes.map((box) =>
      (box.id === id && box.coords[imagesLanguage])
          ? {
            ...box,
            coords: {
              ...box.coords,
              [imagesLanguage]: {
                x1: d.x,
                x2: d.x + (box.coords[imagesLanguage].x2 - box.coords[imagesLanguage].x1),
                y1: d.y,
                y2: d.y + (box.coords[imagesLanguage].y2 - box.coords[imagesLanguage].y1),
              }
            },
          }
          : box
      )
    );
  }, [imagesLanguage]);

  // Handle resize stop event
  const handleResizeStop:
    (id: string, imagesLanguage: LocaleType)
      => RndResizeCallback = useCallback((id, imagesLanguage) => (e, direction, ref, delta, position) => {
    setBoxes((prevBoxes) =>
      prevBoxes.map((box) =>
        box.id === id && box.coords[imagesLanguage]
          ? {
            ...box,
            coords: {
              ...box.coords,
              [imagesLanguage]: {
                x1: position.x,
                x2: position.x + ref.offsetWidth,
                y1: position.y,
                y2: position.y + ref.offsetHeight,
              }},
          }
          : box
      )
    );
  }, []);

  // Handle text save event
  const handleTextSave = useCallback((id: string, language: LocaleType, text: string) => {
    setBoxes((prevBoxes) =>
      prevBoxes.map((box) =>
        box.id === id
          ? {
        ...box,
            translatedTexts: {
          ...box.translatedTexts,
              [language]: {
            ...box.translatedTexts[language],
                text
          }
        }
      }
          : box
      )
    );
  }, []);

  const handleFontSizeChange = useCallback((id: string, languages: LocaleType[], fontSize: number) => {
    setBoxes((prevBoxes) =>
      prevBoxes.map((box) =>
        box.id === id
          ? {
            ...box,
            translatedTexts: languages.reduce((acc, lang) => ({
              ...acc,
              [lang]: {
                ...box.translatedTexts[lang],
                fontSize
              }
            }), box.translatedTexts)
          }
          : box
      )
    );
  }, []);

  const handleAllFontSizeChange = (fontSize: number, language: LocaleType) => {
    setBoxes((prevBoxes) =>
      prevBoxes.map((box) => {
        if (!box.translatedTexts[language]) return box;

        return {
          ...box,
          translatedTexts: {
            ...box.translatedTexts,
            [language]: {
              text: box.translatedTexts[language].text,
              fontSize
            }
          }
        }}
      )
    );
  }

  const handleAllBoxSizesChange = (size: number, language: LocaleType) => {
    setBoxes((prevBoxes) =>
      prevBoxes.map((box) => {
        const coords = box.coords[language];
        if (!coords) return box;

        return {
          ...box,
          coords: {
            ...box.coords,
            [language]: {
              x1: coords.x1 - Math.floor((coords.x2 - coords.x1) * (size/100)),
              x2: coords.x2 + Math.floor((coords.x2 - coords.x1) * (size/100)),
              y1: coords.y1 - Math.floor((coords.y2 - coords.y1) * (size/100)),
              y2: coords.y2 + Math.floor((coords.y2 - coords.y1) * (size/100)),
            }
          }
        }}
      )
    );
  }

  // Share all coordinates between images
  const handleCoordsShare = (sourceLanguage: LocaleType, targetLanguage: LocaleType) => {
    setBoxes((prevBoxes) =>
      prevBoxes.map((box) => ({
        ...box,
        coords: {
          ...box.coords,
          [targetLanguage]: box.coords[sourceLanguage]
        }
      }))
    )
  }

  const onNewBox = () => {
    setBoxes(prevBoxes => [
      ...prevBoxes,
      {
        id: nanoid(),
        translatedTexts: {},
        coords: {
          [imagesLanguage]: {
            x1: 0,
            x2: 200,
            y1: Math.round(window.scrollY + window.innerHeight / 2),
            y2: Math.round(window.scrollY + window.innerHeight / 2 + 200)
          }
        }
      }
    ])
  }

  const onDelete = useCallback((id: string) => {
    setBoxes((prevBoxes) =>
      prevBoxes.filter(box => box.id !== id)
    )
  }, []);

  return (
    <>
      <div className="relative">
        {images?.map((image, index) =>
          <Image
            key={image.src}
            as={NextImage}
            src={BUCKET_URL + image.src}
            alt={image.src}
            priority={index < 2}
            width={image.width ?? images[index].width}
            height={image.height ?? images[index].height}
            classNames={{
              img: "object-contain"
            }}
            radius="none"
          />
        )}
        {boxes
          .filter(box => {
            const coords = box.coords[imagesLanguage];
            if (!coords) return false;
            return coords.y2 > scrollHeight - SCROLL_OFFSET && coords.y1 < scrollHeight + window.innerHeight + SCROLL_OFFSET;
          })
          .map((box) =>
          <EditableMetadataBox
            key={box.id}
            box={box}
            onSave={handleTextSave}
            handleFontSizeChange={handleFontSizeChange}
            onDelete={onDelete}
            defaultTextLanguage={textLanguage}
            handleDragStop={handleDragStop(box.id)}
            handleResizeStop={handleResizeStop(box.id, imagesLanguage)}
            imagesLanguage={imagesLanguage}
          />
        )}
      </div>
      <div className="fixed right-5 top-10 flex flex-col gap-3 min-w-48">
        <Button
          onPress={() => socketState.connected ? socket?.close() : connectSocket()}
          isLoading={socketState.connecting}
        >
          {socketState.connected ? "(Connected) Disconnect" : "(Closed) Connect"}
        </Button>
        <Button
          isDisabled={!socketState.connected || !images}
          isLoading={socketState.processing}
          onPress={scanOCR}
        >
          Scan OCR
        </Button>
        <Button
          onPress={onOpen}
        >
          Translate
        </Button>
        {Boolean(socketMessage) && <Card className="max-h-60 max-w-60">
          <CardHeader>
            Latest OCR process..
          </CardHeader>
          <CardBody>
            {JSON.stringify(socketMessage)}
          </CardBody>
        </Card>}
      </div>
      <div className="fixed right-5 bottom-20 flex flex-col gap-3 min-w-40">
        <Select
          label={`Change boxes sizes`}
          className="w-full"
          onSelectionChange={keys => {
            handleAllBoxSizesChange(Number.parseInt(keys.currentKey ?? "0"), imagesLanguage);
          }}
        >
          {BOX_SIZES.map(size =>
            <SelectItem key={size}>
              {size.toString()} %
            </SelectItem>
          )}
        </Select>
        <Select
          label={`Take coords from...`}
          className="w-full"
          onSelectionChange={keys => {
            handleCoordsShare(keys.currentKey as LocaleType, imagesLanguage);
          }}
        >
          {chapter.languages.map(lang =>
            <SelectItem key={lang.toLowerCase()}>
              {ChapterLanguageFull[lang]}
            </SelectItem>
          )}
        </Select>
        <Select
          label={`${textLanguage} font sizes`}
          className="w-full"
          onSelectionChange={keys => {
            handleAllFontSizeChange(Number.parseInt(keys.currentKey ?? "22"), textLanguage);
          }}
        >
          {FONT_SIZES.map(font =>
            <SelectItem key={font}>
              {font.toString()}
            </SelectItem>
          )}
        </Select>
        <Button
          onPress={onNewBox}
        >
          New box
        </Button>
        <Select
          selectedKeys={[imagesLanguage]}
          disallowEmptySelection
          label="Images language"
          className="w-full"
          onSelectionChange={keys => {
            setImagesLanguage((keys.currentKey ?? "en") as LocaleType)
          }}
        >
          {chapter.languages.map(lang =>
            <SelectItem key={lang.toLowerCase()}>
              {ChapterLanguageFull[lang]}
            </SelectItem>
          )}
        </Select>
        <Select
          selectedKeys={[textLanguage]}
          disallowEmptySelection
          label="Text language"
          className="w-full"
          onSelectionChange={keys => {
            setTextLanguage((keys.currentKey ?? locales[0]) as LocaleType)
          }}
        >
          {locales.map(lang =>
            <SelectItem key={lang.toLowerCase()}>
              {ChapterLanguageFull[(lang[0].toUpperCase() + lang[1]) as ChapterLanguage]}
            </SelectItem>
          )}
        </Select>
        <Button
          color="primary"
          isLoading={isSaving}
          onPress={async () => {
            try {
              setIsSaving(true);
              await saveMetadata(boxes, chapter.id)
            } catch (e) {
              console.error(e);
            } finally {
              setIsSaving(false)
            }
          }}
        >
          Save
        </Button>
      </div>
      <TranslateModal
        onOpenChange={onOpenChange}
        boxes={boxes}
        setBoxes={setBoxes}
        chapterId={chapter.id}
        isOpen={isOpen}
        />
    </>
  );
}