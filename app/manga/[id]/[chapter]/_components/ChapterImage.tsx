"use client"

import {Dropdown, DropdownItem, DropdownMenu, DropdownTrigger, Image} from "@nextui-org/react";
import {useEffect, useState} from "react";
import {MultiLanguageImage} from "@/app/manga/[id]/[chapter]/_utils/transformChapter";
import {ChapterLanguage} from "@/app/types";
import {useSearchParams} from "next/navigation";
import {isStringInEnum} from "@/app/lib/utils/isStringinEnum";

interface Props{
  image: MultiLanguageImage
}

export default function ChapterImage({image}: Props) {
  const [language, setLanguage] = useState<ChapterLanguage>(ChapterLanguage.en);
  const [offset, setOffset] = useState<number>(0);
  const languageQuery = useSearchParams().get("language");

  useEffect(() => {
    if (!languageQuery) return;
    if (!isStringInEnum(languageQuery, ChapterLanguage)) return;

    setLanguage(languageQuery as ChapterLanguage);
  }, [languageQuery]);

  return (
   <>
     {image[language] &&
       <Dropdown placement="top" offset={offset} size="sm">
         <DropdownTrigger onClick={(event) => setOffset(
               event.currentTarget.getBoundingClientRect().top - event.clientY
           )}>
             <Image src={`/manga/${"2FOjpRfEafdpCY0alA-YI"}/${language}/` + image[language]?.src}
                    alt={image[language]?.src} width={image[language]?.width}
                    height={image[language]?.height}
                    radius="none"
             />
         </DropdownTrigger>
         <DropdownMenu
             aria-label="Image language"
             selectedKeys={[language]}
             selectionMode="single"
             disallowEmptySelection
             onAction={(key) => setLanguage(key as ChapterLanguage)}
         >
           {Object.keys(image).map(lang =>
               <DropdownItem key={lang}>
                 {lang}
               </DropdownItem>
           )}
         </DropdownMenu>
       </Dropdown>
     }
   </>
 );
};