"use client"

import {Button} from "@nextui-org/react";
import Link from "next/link";
import {Manga_ChapterQuery} from "@/app/__generated__/graphql";
import {useState} from "react";
import {HiOutlineSortAscending, HiOutlineSortDescending} from "react-icons/hi";
import { motion } from 'framer-motion';

type ChapterList = Exclude<Manga_ChapterQuery["manga"], undefined | null>["chapters"]

interface Props{
  chapters?: ChapterList,
  selectedChapter?: string,
}

export default function ChapterList({chapters, selectedChapter}: Props) {
  const [descending, setDescending] = useState(true);

 return (
   <div className="flex flex-col gap-2">
     <Button
       variant="light"
       className="self-end"
       onPress={() => setDescending(prev => !prev)}
       >
       {descending ? "Descending" : "Ascending"}
       <motion.div
           initial={{ opacity: 0, rotate: 0 }}
           animate={{ opacity: 1, rotate: descending ? 0 : 360 }}
           transition={{ duration: 0.2 }}
       >
       {descending
        ? <HiOutlineSortDescending className="text-xl"/>
        : <HiOutlineSortAscending className="text-xl"/>}
       </motion.div>
     </Button>
     <div className={`flex flex-col gap-2 ${descending && "flex-col-reverse"}`}>
       {chapters
           ? chapters.map((chapter, index) =>
               <Button
                   key={chapter.id}
                   variant={selectedChapter === chapter.id ? "solid" : "flat"}
                   className="w-full justify-between"
                   as={Link}
                   href={`/manga/${chapter.mangaId}/${chapter.id}`}
               >
                 <span>Chapter {chapter.number}</span>
                 <span>{new Date(parseInt(chapter.createdAt)).toLocaleDateString()}</span>
               </Button>
           )
           : <div className="text-center text-gray-500 my-10">No chapter</div>
       }
     </div>
   </div>
 );
};