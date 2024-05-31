"use client"

import {Button, Link, Navbar, NavbarContent, NavbarItem} from "@nextui-org/react";
import {useParams} from "next/navigation";
import { IoArrowBackSharp } from "react-icons/io5";
import {GET_NAVBAR_CHAPTER} from "@/app/lib/graphql/queries";
import {useQuery} from "@apollo/client";
import LanguageSelect from "@/app/_components/navbar/LanguageSelect";
import NextButton from "@/app/_components/navbar/NextButton";
import PrevButton from "@/app/_components/navbar/PrevButton";
import ChapterListModal from "@/app/_components/ChapterListModal";

export default function NavbarChapter() {
 const {id, chapter} = useParams<{id: string, chapter: string}>();
 const {data} =  useQuery(GET_NAVBAR_CHAPTER,
     {variables: {mangaId: id, chapterId: chapter}});

 return (
  <Navbar shouldHideOnScroll classNames={{ wrapper: "p-1" }}>
   <NavbarContent justify="start" className="gap-1">
     <NavbarItem className="h-full">
       <Button
           radius="none"
           variant="light"
           as={Link}
           href={`/manga/${id}`}
           size="lg"
           isIconOnly
           className="h-full"
       >
         <IoArrowBackSharp size={20}/>
       </Button>
     </NavbarItem>
     <NavbarItem className="h-full">
       {data && <ChapterListModal data={data}/>}
     </NavbarItem>
   </NavbarContent>
  <NavbarContent justify="end" className="gap-1">
    <NavbarItem>
      {data && <LanguageSelect languages={data.chapter.languages}/>}
    </NavbarItem>
    <NavbarItem className="h-full">
      {data && <PrevButton isFirst={data.chapter.isFirst} mangaId={id} prevChapterId={data.chapter.prevChapter?.id}/>}
    </NavbarItem>
    <NavbarItem className="h-full">
      {data && <NextButton isLast={data.chapter.isLast} mangaId={id} nextChapterId={data.chapter.nextChapter?.id}/>}
    </NavbarItem>
  </NavbarContent>
  </Navbar>
 );
};