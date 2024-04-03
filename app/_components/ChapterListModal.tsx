"use client"

import {Button, Modal, ModalBody, ModalContent, ModalHeader, useDisclosure} from "@nextui-org/react";
import {Manga_ChapterQuery} from "@/app/__generated__/graphql";
import ChapterList from "@/app/_components/ChapterList";
import {useParams} from "next/navigation";

interface Props{
  data: Manga_ChapterQuery
}

export default function ChapterListModal({data}: Props) {
  const {isOpen, onOpen, onOpenChange} = useDisclosure();
  const {chapter} = useParams<{id: string, chapter: string}>();

 return (
  <>
    <Button
        variant="flat"
        radius="none"
        className="h-full px-3 flex-col justify-evenly gap-0 md:px-6"
        onClick={onOpen}
    >
      <div>
        {data.manga?.title}
      </div>
      <div className="text-xs text-gray-200">
        Chapter {data.chapter.number}
      </div>
    </Button>
    <Modal placement="center" isOpen={isOpen} onOpenChange={onOpenChange} size="5xl">
      <ModalContent>
        <ModalHeader>
          Chapters
        </ModalHeader>
        <ModalBody>
          <ChapterList chapters={data.manga?.chapters} selectedChapter={chapter}/>
        </ModalBody>
      </ModalContent>
    </Modal>
  </>
 );
};