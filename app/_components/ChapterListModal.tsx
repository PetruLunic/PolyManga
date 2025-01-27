"use client"

import {Button, Modal, ModalBody, ModalContent, ModalHeader, useDisclosure} from "@heroui/react";
import {Manga_ChapterQuery} from "@/app/__generated__/graphql";
import ChapterList from "@/app/_components/ChapterList";
import {useParams} from "next/navigation";

interface Props{
  data: Manga_ChapterQuery
}

export default function ChapterListModal({data}: Props) {
  const {isOpen, onOpen, onOpenChange} = useDisclosure();
  const {chapter} = useParams<{id: string, chapter: string}>();
  const maxNumberOfMangaTitleCharacters = data.chapter.languages.length > 1 ? 10 : 20;

 return (
  <>
    <Button
        variant="flat"
        radius="none"
        className="h-full px-3 flex-col justify-evenly gap-0 md:px-6 md:max-w-none"
        onPress={() => setTimeout(onOpen, 10)}
    >
      <div className="sm:hidden">
        {data.manga && data.manga.title.length > maxNumberOfMangaTitleCharacters
          ? data.manga?.title.slice(0, maxNumberOfMangaTitleCharacters) + "..."
          : data.manga?.title}
      </div>
      <div className="hidden sm:block">
        {data.manga?.title}
      </div>
      <div className="text-xs text-gray-200">
        Chapter {data.chapter.number}
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
          Chapters
        </ModalHeader>
        <ModalBody>
          <ChapterList
            chapters={data.manga?.chapters}
            selectedChapter={chapter}
            mangaTitle={data.manga?.title}
          />
        </ModalBody>
      </ModalContent>
    </Modal>
  </>
 );
};