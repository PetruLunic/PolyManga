"use client";

import {GetLatestUploadedChaptersQuery} from "@/app/__generated__/graphql";
import {Card, Image} from "@nextui-org/react";
import Link from "next/link";
import {mangaTitleAndIdToURL} from "@/app/lib/utils/URLFormating";
import {timeSince} from "@/app/lib/utils/dateUtils";


interface Props{
 chapter: GetLatestUploadedChaptersQuery["latestChapters"][number]
}

export default function ChapterUpdateCard({chapter}: Props) {

 return (
  <Card
    as={Link}
    className="h-24"
    isPressable
    isBlurred
    isHoverable
    fullWidth
    href={`/manga/${mangaTitleAndIdToURL(chapter.manga.title, chapter.manga.id)}/${chapter.id}`}
  >
   <div className="flex gap-5 items-center w-full h-full justify-between">
     <Image
         src={chapter.manga.image}
         alt={chapter.manga.title}
         className="object-cover h-24 w-20"
     />
     <div className="flex flex-col gap-2 items-start justify-between flex-1">
       <p>
         {chapter.manga.title}
       </p>
       <div className="flex gap-5 items-center justify-between w-full">
         <p className="text-sm">
           {chapter.title}
         </p>
         <p className="text-xs px-4">
           {timeSince(new Date(Number(chapter.createdAt)))} ago
         </p>
       </div>
     </div>
   </div>
  </Card>
 );
};