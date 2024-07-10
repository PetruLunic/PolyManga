"use client"

import {Dropdown, DropdownItem, DropdownMenu, DropdownTrigger, Image} from "@nextui-org/react";
import {useEffect, useState} from "react";
import {MultiLanguageImage} from "@/app/(pages)/manga/[id]/[chapter]/_utils/transformChapter";
import {ChapterLanguage} from "@/app/__generated__/graphql";
import {useSearchParams} from "next/navigation";
import {isStringInEnum} from "@/app/lib/utils/isStringinEnum";
import NextImage from "next/image";

interface Props{
  image: MultiLanguageImage
}

const awsURL = "https://manga-image.s3.eu-central-1.amazonaws.com/"

export default function ChapterImage({image}: Props) {
  const languageQuery = useSearchParams().get("language");
  const [language, setLanguage] = useState<ChapterLanguage>(Object.keys(image)[0] as ChapterLanguage);
  const [offset, setOffset] = useState<number>(0);

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
             <Image
                 as={NextImage}
                 src={image[language]?.src}
                 alt={image[language]?.src.split("/").pop()}
                 width={image[language]?.width}
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