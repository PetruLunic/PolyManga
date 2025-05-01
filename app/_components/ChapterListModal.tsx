"use client"

import {Button, Modal, ModalBody, ModalContent, ModalHeader, useDisclosure} from "@heroui/react";
import {ChapterQuery} from "@/app/__generated__/graphql";
import {useTranslations} from "next-intl";
import ChapterListWrapper from "@/app/_components/ChapterListWrapper";
import {notFound, useParams} from "next/navigation";

interface Props{
  data: ChapterQuery
}

export default function ChapterListModal({data}: Props) {
  const t = useTranslations("common.manga");
  const {id} = useParams<{id: string}>();
  const {isOpen, onOpen, onOpenChange} = useDisclosure();

  if (!data.manga) notFound();

 return (
  <>
    <Button
        variant="flat"
        radius="none"
        className="h-full px-2 sm:px-3 flex-col justify-evenly gap-0 md:px-6 max-w-40 md:max-w-none"
        onPress={() => setTimeout(onOpen, 10)}
    >
      <div className="max-w-full truncate">
        {data.manga.title}
      </div>
      <div className="max-w-full text-xs text-gray-200 truncate">
        {data.chapter.title}
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
          <ChapterListWrapper
            slug={id}
            languages={data.manga.languages}
          />
        </ModalBody>
      </ModalContent>
    </Modal>
  </>
 );
};