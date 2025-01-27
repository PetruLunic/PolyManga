"use client"

import Link from "next/link";
import {Button, ButtonProps} from "@heroui/react";
import {GET_BOOKMARKED_CHAPTER} from "@/app/lib/graphql/queries";
import {getMangaIdFromURL} from "@/app/lib/utils/URLFormating";
import {useQuery} from "@apollo/client";

interface Props extends ButtonProps{
  mangaSlug: string,
  firstChapterId?: string
}

export default function ContinueReadingButton({mangaSlug, firstChapterId, ...props}: Props) {
  const {data} = useQuery(GET_BOOKMARKED_CHAPTER, {variables: {mangaId: getMangaIdFromURL(mangaSlug)}});

  const chapterTitle = data?.getBookmarkedChapter?.chapter?.title;

 return (
   <Button
     as={Link}
     href={`/manga/${mangaSlug}/${firstChapterId}`}
     className="w-full"
     color="primary"
     isDisabled={!firstChapterId}
     {...props}
   >
    {chapterTitle
      ? "Continue " + chapterTitle
      : "First Chapter"}
   </Button>
 );
};