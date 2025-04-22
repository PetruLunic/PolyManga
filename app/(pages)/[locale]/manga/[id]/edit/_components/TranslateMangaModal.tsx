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
import {MangaEditQuery} from "@/app/__generated__/graphql";
import {translateManga} from "@/app/lib/translations/translateMangaTitleAndDescription";
import {UseFormSetValue} from "react-hook-form";
import {EditMangaForm} from "@/app/(pages)/[locale]/manga/[id]/edit/_components/EditMangaForm";

interface Props extends Omit<ModalProps, "children"> {
  manga: Exclude<MangaEditQuery["manga"], null | undefined>;
  setValue: UseFormSetValue<EditMangaForm>
}

export default function TranslateMangaModal({onOpenChange, isOpen, manga, setValue}: Props) {
  const [isTranslating, setIsTranslating] = useState<boolean>(false);
  const [sourceLang, setSourceLang] = useState<LocaleType>(locales[0]);
  const [targetLangs, setTargetLangs] = useState<LocaleType[]>([]);

  async function translate() {
    try {
      setIsTranslating(true);
      const title = manga.title.find(({language}) => language.toLowerCase() === sourceLang)?.value;
      const description = manga.description.find(({language}) => language.toLowerCase() === sourceLang)?.value;

      if (!title || !description) throw new Error(`No title and/or description for ${sourceLang} language`);

      const result = await translateManga({
        language: sourceLang,
        title,
        description,
        targetLanguages: targetLangs
      })

      // Transform languages from en => En
      result.titles.forEach((_, index) => {
        const {language} = result.titles[index];
        result.titles[index].language = language[0].toUpperCase() + language.slice(1);
        result.descriptions[index].language = language[0].toUpperCase() + language.slice(1);
      })

      // Concat old titles and descriptions that weren't translated
      const concatenatedTitles = result.titles;
      manga.title.forEach(oldTitle => {
        if (!concatenatedTitles.some(title => title.language === oldTitle.language)) {
          concatenatedTitles.unshift(oldTitle);
        }
      })

      const concatenatedDescriptions = result.descriptions;
      manga.description.forEach(oldDescription => {
        if (!concatenatedDescriptions.some(description => description.language === oldDescription.language)) {
          concatenatedDescriptions.unshift(oldDescription);
        }
      })

      setValue("title", concatenatedTitles);
      setValue("description", concatenatedDescriptions);
    } catch (e) {
      console.error(e);
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
              Translate {manga.title[0].value}
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