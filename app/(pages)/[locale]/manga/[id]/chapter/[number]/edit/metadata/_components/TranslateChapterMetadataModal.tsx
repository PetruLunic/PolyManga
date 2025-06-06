import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalProps,
  Select,
  SelectItem
} from "@heroui/react";
import {LocaleType} from "@/app/types";
import {locales} from "@/i18n/routing";
import React, {useState} from "react";
import {
  saveMetadata,
  translateWithGemini
} from "@/app/(pages)/[locale]/manga/[id]/chapter/[number]/edit/metadata/actions";
import {Box} from "@/app/(pages)/[locale]/manga/[id]/chapter/[number]/edit/metadata/_components/RedactorPage";
import retryPromise from "@/app/lib/utils/retryPromise";

interface Props extends Omit<ModalProps, "children"> {
  boxes: Box[],
  setBoxes: React.Dispatch<React.SetStateAction<Box[]>>,
  chapterId: string
}

type TranslateStatus = "pending" | "finished" | "error" | "processing"

function calculateAdjustedFontSize (
  sourceLength: number,
  targetLength: number,
  sourceFontSize: number,
  minFontSize = 14,
  maxFontSize = 100,
  smoothingFactor = 0.6
): number {
  if (targetLength === 0) {
    return sourceFontSize; // Or a default minimum
  }

  const ratio = sourceLength / targetLength;
  const adjustedRatio = (smoothingFactor * ratio) + (1 - smoothingFactor);

  let newFontSize = Math.floor(adjustedRatio * sourceFontSize);
  newFontSize = Math.max(minFontSize, Math.min(newFontSize, maxFontSize));
  return newFontSize;
}

export default function TranslateChapterMetadataModal({onOpenChange, isOpen, boxes, setBoxes, chapterId}: Props) {
  const translatedLangs = boxes.length !== 0
      ? Object.keys(boxes[0]?.translatedTexts) as LocaleType[]
      : [];
  const [isTranslating, setIsTranslating] = useState<Partial<Record<LocaleType, TranslateStatus>>>({});
  const [sourceLangs, setSourceLangs] = useState<LocaleType[]>([locales[0]]);
  const [targetLangs, setTargetLangs] = useState<LocaleType[]>([]);

  function handleSelectAllLanguages() {
    setTargetLangs(locales.filter(locale => !sourceLangs.includes(locale)));
  }

  function handleSelectMissingLanguages() {
    setTargetLangs(locales.filter(locale => !boxes.some(box => box.translatedTexts[locale])));
  }

  async function handleTranslate() {
    setIsTranslating(targetLangs.reduce((acc, lang) => ({...acc, [lang]: "pending"}), {}));
    for (const lang of targetLangs) {
      await translateTexts(sourceLangs, lang);
    }
  }

  async function translateTexts(sourceLangs: LocaleType[], targetLang: LocaleType) {
    try {
      setIsTranslating(prev => ({...prev, [targetLang]: "processing"}));
      const originalTexts: Record<LocaleType, string[]> = sourceLangs.reduce((acc, sourceLang) => {
        acc[sourceLang] = boxes.map(box => box.translatedTexts[sourceLang]?.text ?? "Empty box");
        return acc;
      }, {} as Record<LocaleType, string[]>)

      // Try to translate 3 times
      const response = await retryPromise(
        () => translateWithGemini(originalTexts, sourceLangs[0], targetLang),
        3,
        1000
      );

      const translatedTexts = response.data;
      if (!translatedTexts) {
        setIsTranslating(prev => ({...prev, [targetLang]: "error"}));
        return;
      }

      // Convert font sizes by the length of the strings
      const targetLangFontSizes = boxes.map((box, index) => {
        const sourceLangText = box.translatedTexts[sourceLangs[0]];
        if (!sourceLangText || !sourceLangText.fontSize) return 30;
        return calculateAdjustedFontSize(sourceLangText.text.length, translatedTexts[index].length, sourceLangText.fontSize);
      })

      let newMetadata: Box[] = [];
      setBoxes(prev => {
        newMetadata = prev.map((box, index) => ({
          ...box,
          translatedTexts: {
            ...box.translatedTexts,
            [targetLang]: {
              text: translatedTexts[index],
              fontSize: targetLangFontSizes[index]
            }
          }
        }))
        return newMetadata;
      })

      if (newMetadata.length === 0) {
        setIsTranslating(prev => ({...prev, [targetLang]: "error"}));
        return;
      }

      await saveMetadata(newMetadata, chapterId)
      setIsTranslating(prev => ({...prev, [targetLang]: "finished"}));
    } catch (e) {
      console.error(e);
      setIsTranslating(prev => ({...prev, [targetLang]: "error"}));
    }
  }

 return (
   <Modal
     size="5xl"
     onOpenChange={onOpenChange}
     isOpen={isOpen}
   >
     <ModalContent>
       {(onClose) => (
         <>
           <ModalHeader>
             Translate chapter
           </ModalHeader>
           <ModalBody className="gap-4">
             <div className="flex justify-between gap-5">
               <Select
                 label={`Source languages`}
                 className="w-full"
                 selectionMode="multiple"
                 isDisabled={Object.values(isTranslating).includes("processing")}
                 selectedKeys={sourceLangs}
                 onSelectionChange={keys => {
                   setSourceLangs(Array.from(keys) as LocaleType[]);
                 }}
               >
                 {translatedLangs.map(lang =>
                   <SelectItem key={lang}>
                     {lang}
                   </SelectItem>
                 )}
               </Select>
               <Select
                 label={`Target languages`}
                 className="w-full"
                 selectionMode="multiple"
                 isDisabled={Object.values(isTranslating).includes("processing")}
                 selectedKeys={targetLangs}
                 onSelectionChange={keys => {
                   setTargetLangs(Array.from(keys) as LocaleType[]);
                 }}
               >
                 {locales.map(lang =>
                   <SelectItem key={lang}>
                     {lang}
                   </SelectItem>
                 )}
               </Select>
             </div>
             <div className="flex flex-col gap-2">
               {Object.entries(isTranslating).map(([lang, status]) =>
                 <div key={lang}>
                   {lang} - {status}
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
               onPress={handleSelectMissingLanguages}
               isDisabled={Object.values(isTranslating).includes("processing")}
             >
               Select missing
             </Button>
             <Button
              onPress={handleSelectAllLanguages}
              isDisabled={Object.values(isTranslating).includes("processing")}
             >
               Select all
             </Button>
             <Button
               color="primary"
               onPress={handleTranslate}
               isLoading={Object.values(isTranslating).includes("processing")}
             >
               Translate
             </Button>
           </ModalFooter>
         </>
       )}
     </ModalContent>
   </Modal>
 );
};