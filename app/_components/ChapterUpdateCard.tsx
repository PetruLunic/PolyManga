"use client";

import {GetLatestUploadedChaptersQuery} from "@/app/__generated__/graphql";
import {Card, Image} from "@nextui-org/react";
import Link from "next/link";
import {timeSince} from "@/app/lib/utils/timeSince";
import {mangaTitleAndIdToURL} from "@/app/lib/utils/URLFormating";


interface Props{
 chapter: GetLatestUploadedChaptersQuery["latestChapters"][number]
}

export default function ChapterUpdateCard({chapter}: Props) {

 return (
  <Card className="max-h-28" isPressable isBlurred isHoverable fullWidth>
   <Link className="w-full h-full" href={`/manga/${mangaTitleAndIdToURL(chapter.manga.title, chapter.manga.id)}/${chapter.id}`}>
     <div className="flex gap-5 items-center w-full h-full">
       <Image
           src={chapter.manga.image}
           alt={chapter.manga.title}
           className="object-cover max-h-28 w-20"
       />
       <div className="flex flex-col gap-2 items-start">
         <p className="">
           {chapter.manga.title}
         </p>
         <div className="flex gap-5 items-center">
           <p className="text-sm">
             {chapter.title}
           </p>
           <p className="text-xs">
             {timeSince(new Date(Number(chapter.createdAt)))} ago
           </p>
         </div>
       </div>
     </div>
   </Link>
  </Card>
 );
};