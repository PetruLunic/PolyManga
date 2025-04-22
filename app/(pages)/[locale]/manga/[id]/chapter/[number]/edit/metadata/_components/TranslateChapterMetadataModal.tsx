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

interface Props extends Omit<ModalProps, "children"> {
  boxes: Box[],
  setBoxes: React.Dispatch<React.SetStateAction<Box[]>>,
  chapterId: string
}

type TranslateStatus = "pending" | "finished" | "error" | "processing"

export default function TranslateChapterMetadataModal({onOpenChange, isOpen, boxes, setBoxes, chapterId}: Props) {
  const [isTranslating, setIsTranslating] = useState<Partial<Record<LocaleType, TranslateStatus>>>({});
  const [sourceLang, setSourceLang] = useState<LocaleType>(locales[0]);
  const [targetLangs, setTargetLangs] = useState<LocaleType[]>([]);

  async function handleTranslate() {
    setIsTranslating(targetLangs.reduce((acc, lang) => ({...acc, [lang]: "pending"}), {}));
    for (const lang of targetLangs) {
      await translateTexts(sourceLang, lang);
    }
  }

  async function translateTexts(sourceLang: LocaleType, targetLang: LocaleType) {
    try {
      setIsTranslating(prev => ({...prev, [targetLang]: "processing"}));
      const originalTexts: string[] = boxes.map(box => box.translatedTexts[sourceLang]?.text ?? "Empty box");
      const translatedTexts = await translateWithGemini(originalTexts, sourceLang, targetLang);

      const newMetadata = boxes.map((box, index) => ({
        ...box,
        translatedTexts: {
          ...box.translatedTexts,
          [targetLang]: {
            text: translatedTexts[index],
            fontSize: box.translatedTexts[sourceLang]?.fontSize ?? 34
          }
        }
      }))

      await saveMetadata(newMetadata, chapterId)
      setBoxes(newMetadata);
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
                 label={`Source language`}
                 className="w-full"
                 isDisabled={Object.values(isTranslating).includes("processing")}
                 selectedKeys={[sourceLang]}
                 onSelectionChange={keys => {
                   setSourceLang(keys.currentKey as LocaleType);
                 }}
               >
                 {locales.map(lang =>
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