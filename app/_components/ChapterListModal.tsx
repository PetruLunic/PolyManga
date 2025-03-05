"use client"

import {Button, Modal, ModalBody, ModalContent, ModalHeader, useDisclosure} from "@heroui/react";
import {Manga_ChapterQuery} from "@/app/__generated__/graphql";
import ChapterList from "@/app/_components/ChapterList";
import {useParams} from "next/navigation";
import {extractChapterTitle, extractMangaTitle} from "@/app/lib/utils/extractionUtils";
import {useLocale, useTranslations} from "next-intl";
import {LocaleType} from "@/app/types";

interface Props{
  data: Manga_ChapterQuery
}

export default function ChapterListModal({data}: Props) {
  const t = useTranslations("common.manga");
  const {isOpen, onOpen, onOpenChange} = useDisclosure();
  const {number, id} = useParams<{id: string, number: string}>();
  const maxNumberOfMangaTitleCharacters = data.chapter.languages.length > 1 ? 10 : 15;
  const locale = useLocale();
  const mangaTitle = extractMangaTitle(data.manga?.title ?? [], locale as LocaleType)
  const chapterTitle = extractChapterTitle(data.chapter.versions, locale as LocaleType);

 return (
  <>
    <Button
        variant="flat"
        radius="none"
        className="h-full px-2 sm:px-3 flex-col justify-evenly gap-0 md:px-6 md:max-w-none"
        onPress={() => setTimeout(onOpen, 10)}
    >
      <div className="sm:hidden text-sm">
        {mangaTitle.length > maxNumberOfMangaTitleCharacters
          ? mangaTitle.slice(0, maxNumberOfMangaTitleCharacters) + "..."
          : mangaTitle}
      </div>
      <div className="hidden sm:block">
        {mangaTitle}
      </div>
      <div className="text-xs text-gray-200">
        {chapterTitle}
      </div>
    </Button>
    <Modal
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      size="full"
      scrollBehavior="inside"
      isDismissable={false}
    >
      <ModalContent>
        <ModalHeader>
          {t("chapters")}
        </ModalHeader>
        <ModalBody>
          <ChapterList
            chapters={data.manga?.chapters}
            selectedChapter={number}
            mangaSlug={id}
            languages={data.manga?.languages ?? []}
          />
        </ModalBody>
      </ModalContent>
    </Modal>
  </>
 );
};