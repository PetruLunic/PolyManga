"use client";

import {GetLatestUploadedChaptersQuery} from "@/app/__generated__/graphql";
import {Card, Image} from "@heroui/react";
import Link from "next/link";
import {LocaleType} from "@/app/types";
import {useTimeSince} from "@/app/lib/hooks/useTimeSince";


interface Props{
 chapter: GetLatestUploadedChaptersQuery["latestChapters"][number],
  locale?: LocaleType
}

export default function ChapterUpdateCard({chapter, locale = 'en'}: Props) {
  const mangaTitle = chapter.manga.title.find(({language, value}) => locale === language.toLowerCase())?.value ?? chapter.manga.title[0].value;
  const timeSince = useTimeSince(new Date(Number(chapter.createdAt)));

 return (
  <Card
    as={Link}
    className="h-24"
    isPressable
    isBlurred
    isHoverable
    fullWidth
    href={`/manga/${chapter.manga.slug}/${chapter.id}`}
  >
   <div className="flex gap-5 items-center w-full h-full justify-between">
     <Image
         src={chapter.manga.image}
         alt={mangaTitle}
         className="object-cover h-24 w-20"
     />
     <div className="flex flex-col gap-2 items-start justify-between flex-1">
       <p>
         {mangaTitle}
       </p>
       <div className="flex gap-5 items-center justify-between w-full">
         <p className="text-sm">
           {chapter.title}
         </p>
         <p className="text-xs px-4">
           {timeSince}
         </p>
       </div>
     </div>
   </div>
  </Card>
 );
};