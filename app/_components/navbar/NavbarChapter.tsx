"use client"

import {Button, Link, Navbar, NavbarContent, NavbarItem} from "@nextui-org/react";
import {useParams} from "next/navigation";
import { IoArrowBackSharp } from "react-icons/io5";
import LanguageSelect from "@/app/_components/navbar/LanguageSelect";
import NextButton from "@/app/_components/navbar/NextButton";
import PrevButton from "@/app/_components/navbar/PrevButton";
import ChapterListModal from "@/app/_components/ChapterListModal";
import {Manga_ChapterQuery} from "@/app/__generated__/graphql";
import {createPortal} from "react-dom";
import {useEffect, useMemo, useState} from "react";
import {mangaTitleAndIdToURL} from "@/app/lib/utils/URLFormating";

interface Props {
  data: Manga_ChapterQuery
}

export default function NavbarChapter({data}: Props) {
 const {id, chapter} = useParams<{id: string, chapter: string}>();
  const [portalDiv, setPortalDiv] = useState<Element | null>(null);

  useEffect(() => {
    setPortalDiv(document.querySelector("#navbar-portal"));
  }, [])

 if (!portalDiv) return;

 return (
     <>
       {createPortal(<Navbar shouldHideOnScroll classNames={{ wrapper: "p-1" }}>
         <NavbarContent justify="start" className="gap-1">
           <NavbarItem className="h-full">
             <Button
                 radius="none"
                 variant="light"
                 as={Link}
                 href={`/manga/${mangaTitleAndIdToURL(data.manga?.title ?? "", id)}`}
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
             {data && <PrevButton
                 isFirst={data.chapter.isFirst}
                 href={`/manga/${mangaTitleAndIdToURL(data.manga?.title ?? "", id)}/${data.chapter.prevChapter?.id}`}
             />}
           </NavbarItem>
           <NavbarItem className="h-full">
             {data && <NextButton
                 isLast={data.chapter.isLast}
                 href={`/manga/${mangaTitleAndIdToURL(data.manga?.title ?? "", id)}/${data.chapter.nextChapter?.id}`}
             />}
           </NavbarItem>
         </NavbarContent>
       </Navbar>,
       portalDiv)}
     </>
 );
};