import {Button} from "@nextui-org/react";
import Link from "next/link";
import {Manga_ChapterQuery} from "@/app/__generated__/graphql";

type ChapterList = Exclude<Manga_ChapterQuery["manga"], undefined | null>["chapters"]

interface Props{
  chapters?: ChapterList,
  selectedChapter?: string
}

export default function ChapterList({chapters, selectedChapter}: Props) {

 return (
   <div className="flex flex-col gap-2">
     {chapters
         ? chapters.map((chapter, index) =>
       <Button
           key={chapter.id}
           variant={selectedChapter === chapter.id ? "solid" : "faded"}
           className="w-full justify-between"
           as={Link}
           href={`/manga/${chapter.mangaId}/${chapter.id}`}
       >
         <span>Chapter {chapter.number}</span>
         <span>{new Date(chapter.postedOn).toLocaleDateString()}</span>
       </Button>
     )
         : <div className="text-center text-gray-500 my-10">No chapter</div>
     }
   </div>
 );
};