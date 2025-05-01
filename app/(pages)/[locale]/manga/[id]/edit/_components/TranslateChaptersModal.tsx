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
import {ChapterList} from "@/app/_components/ChapterListEdit";
import {translateChapterTitles} from "@/app/lib/translations/translateChapters";
import {useAlert} from "@/app/lib/contexts/AlertContext";
import {saveChaptersTitles} from "@/app/(pages)/[locale]/manga/[id]/edit/chapters/actions";
import {extractMangaTitle} from "@/app/lib/utils/extractionUtils";

interface Props extends Omit<ModalProps, "children"> {
  chapters?: ChapterList,
  selectedChapters: string[]
}

export default function TranslateChaptersModal({onOpenChange, isOpen, chapters, selectedChapters}: Props) {
  const [isTranslating, setIsTranslating] = useState<boolean>(false);
  const [sourceLang, setSourceLang] = useState<LocaleType>(locales[0]);
  const [targetLangs, setTargetLangs] = useState<LocaleType[]>([]);
  const {addAlert} = useAlert();

  async function translate() {
    if (!chapters) return;

    try {
      setIsTranslating(true);
      let titles: string[] = [];

      // Extracting the source language's titles
      const chaptersToTranslate =  chapters.filter(chapter => selectedChapters.includes(chapter.id));

      chaptersToTranslate.forEach(chapter => {
        const title = extractMangaTitle(chapter.titles, sourceLang);
        if (!title) throw new Error(`Title not found for ${sourceLang} in chapter ${chapter.number}`);
        titles.push(title);
      })

      const response = await translateChapterTitles({
        sourceLanguage: sourceLang,
        titles,
        targetLanguages: targetLangs
      });
      console.log(response);

      const chaptersInput = chaptersToTranslate.map((chapter, index) => ({
        id: chapter.id,
        titles: response[index]
      }))

      await saveChaptersTitles(chaptersInput);
      addAlert({type: "success", message: "Chapters successfully translated!"});
    } catch (e) {
      console.error(e);
      addAlert({type: "danger", message: "Error at translating!"});
    } finally {
      setIsTranslating(false);
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
              Translate ({selectedChapters.length}) chapters
            </ModalHeader>
            <ModalBody className="gap-4">
              <div className="flex justify-between gap-5">
                <Select
                  label={`Source language`}
                  className="w-full"
                  isDisabled={isTranslating}
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
                  isDisabled={isTranslating}
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
                onPress={translate}
                isLoading={isTranslating}
                isDisabled={!chapters}
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