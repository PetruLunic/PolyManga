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
  const locale = useLocale();
  const mangaTitle = extractMangaTitle(data.manga?.title ?? [], locale as LocaleType)
  const chapterTitle = extractChapterTitle(data.chapter.versions, locale as LocaleType);

 return (
  <>
    <Button
        variant="flat"
        radius="none"
        className="h-full px-2 sm:px-3 flex-col justify-evenly gap-0 md:px-6 max-w-40 md:max-w-none"
        onPress={() => setTimeout(onOpen, 10)}
    >
      <div className="max-w-full truncate">
        {mangaTitle}
      </div>
      <div className="max-w-full text-xs text-gray-200 truncate">
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
        <ModalBody className="px-4 sm:px-6">
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