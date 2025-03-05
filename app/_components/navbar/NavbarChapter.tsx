"use client"

import {Button, NavbarContent, NavbarItem} from "@heroui/react";
import {useParams} from "next/navigation";
import { IoArrowBackSharp } from "react-icons/io5";
import LanguageSelect from "@/app/_components/navbar/LanguageSelect";
import ChapterListModal from "@/app/_components/ChapterListModal";
import {Manga_ChapterQuery} from "@/app/__generated__/graphql";
import {createPortal} from "react-dom";
import {useEffect, useRef, useState} from "react";
import {FaChevronLeft, FaChevronRight} from "react-icons/fa";
import {Link} from "@/i18n/routing";
import Navbar from "@/app/_components/Navbar";

interface Props {
  data: Manga_ChapterQuery
}

export default function NavbarChapter({data}: Props) {
  const {id} = useParams<{id: string, chapter: string}>();
  const [portalDiv, setPortalDiv] = useState<Element | null>(null);
  const [shouldHideOnScroll, setShouldHideOnScroll] = useState(true);
  const noLanguageSelect = data.chapter.languages.length < 2;
  const prevPositionRef = useRef(0);

  useEffect(() => {
    setPortalDiv(document.querySelector("#navbar-portal"));
  }, [])

 if (!portalDiv) return;

 return (
     <>
       {createPortal(
         <Navbar
           shouldHideOnScroll
           scrollThreshold={500}
           classNames={{ wrapper: "p-1 gap-2 sm:gap-4" }}
         >
         <NavbarContent justify="start" className="gap-1">
           <NavbarItem className="h-full">
             <Button
                 radius="none"
                 variant="light"
                 as={Link}
                 href={`/manga/${id}`}
                 size="lg"
                 isIconOnly
                 className={`h-full md:w-[--navbar-height]`}
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
             {data && !noLanguageSelect && <LanguageSelect languages={data.chapter.languages}/>}
           </NavbarItem>
           <NavbarItem className="h-full">
             {data && <Button
                 variant="light"
                 isDisabled={data.chapter.isFirst}
                 isIconOnly
                 radius="none"
                 className={`h-full ${noLanguageSelect ? "w-14" : ""} md:w-[--navbar-height]`}
                 href={`/manga/${id}/chapter/${data.chapter.prevChapter?.number}`}
                 as={Link}
             >
                 <FaChevronLeft />
             </Button>}
           </NavbarItem>
           <NavbarItem className="h-full">
             {data && <Button
                 variant="light"
                 isDisabled={data.chapter.isLast}
                 isIconOnly
                 radius="none"
                 className={`h-full ${noLanguageSelect ? "w-14" : ""} md:w-[--navbar-height]`}
                 href={`/manga/${id}/chapter/${data.chapter.nextChapter?.number}`}
                 as={Link}
             >
                 <FaChevronRight />
             </Button>}
           </NavbarItem>
         </NavbarContent>
       </Navbar>,
       portalDiv)}
     </>
 );
};