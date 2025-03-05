"use client"

import {Dropdown, DropdownItem, DropdownMenu, DropdownTrigger, Image} from "@heroui/react";
import {useEffect, useState} from "react";
import {ChapterLanguage} from "@/app/__generated__/graphql";
import {isStringInEnum} from "@/app/lib/utils/isStringinEnum";
import NextImage from "next/image";
import {useSession} from "next-auth/react";
import {MultiLanguageImage} from "@/app/(pages)/[locale]/manga/[id]/chapter/[number]/_utils/transformChapter";
import {useLocale} from "next-intl";

interface Props{
  image: MultiLanguageImage,
  languageQuery: string | null,
  priority?: boolean
}

export default function ChapterImage({image, languageQuery}: Props) {
  const session = useSession();
  const locale = useLocale();
  const languages = Object.keys(image);
  const [language, setLanguage] = useState<ChapterLanguage>((languages[0] as ChapterLanguage));
  const [offset, setOffset] = useState<number>(0);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  let preferredLanguage = session.data?.user?.preferences?.language

  useEffect(() => {
    if (!languageQuery) return;
    if (!isStringInEnum(languageQuery, ChapterLanguage)) return;

    setLanguage(languageQuery as ChapterLanguage);
  }, [languageQuery]);

  // Set the locale language as default if exists in chapter
  useEffect(() => {
    const lang = languages.find(lang => lang.toLowerCase() === locale) as ChapterLanguage;
    if (!lang) return;
    setLanguage(lang);
  }, [locale]);

  // If the image has not this language
  if (!image[language]) return null;

  // If the user is logged in, he has preferred language and the chapter has this language then render one-click image
  if (session
      && preferredLanguage
      && Object.keys(image).includes(preferredLanguage[0].toUpperCase() + preferredLanguage.substring(1))) {
    return <Image
        as={NextImage}
        src={image[language]?.src}
        alt={image[language]?.src.split("/").pop()}
        width={image[language]?.width}
        height={image[language]?.height}
        style={{height: "auto"}}
        priority
        onClick={() => {
          if (preferredLanguage) {
            setLanguage(preferredLanguage[0].toUpperCase() + preferredLanguage.substring(1) as ChapterLanguage);

            // Switch back the language if it's set the preferenced one
            if (preferredLanguage[0].toUpperCase() + preferredLanguage.substring(1) === language) {

              // If there is no language query then set the first language
              if (!languageQuery) {
                setLanguage(Object.keys(image)[0] as ChapterLanguage);
              } else {
                setLanguage(languageQuery as ChapterLanguage);
              }
            }
          }
        }}
        radius="none"
    />
  }

  const handleInteraction = (event: React.MouseEvent<HTMLImageElement> | React.TouchEvent<HTMLImageElement>) => {
    if (event.type === "click") {
      event.preventDefault();
    }

    // Get the bounding client rect of the target element
    const rect = (event.target as HTMLImageElement).getBoundingClientRect();

    let clientY: number;

    // Determine if it's a mouse or touch event
    if ("clientY" in event) {
      // MouseEvent
      clientY = event.clientY;
    } else if (event.touches && event.touches.length > 0 && !isMenuOpen) {
      // TouchEvent
      clientY = event.touches[0].clientY;
    } else {
      return; // No valid clientY found
    }

    // Calculate offset
    const calculatedOffset = rect.top - clientY;
    setOffset(calculatedOffset);
  };

  // Return the default multi-language dropdown image
  return (
      <Dropdown
        placement="top"
        offset={offset}
        onOpenChange={isOpen => setIsMenuOpen(isOpen)}
        size="sm"
        isDisabled={Object.keys(image).length <= 1} // If image has only one image then disable the dropdown
      >
         <DropdownTrigger
           onClick={handleInteraction}
           onTouchStart={handleInteraction}
         >
             <Image
                 as={NextImage}
                 src={image[language]?.src}
                 alt={image[language]?.src.split("/").pop()}
                 width={image[language]?.width}
                 height={image[language]?.height}
                 style={{height: "auto"}}
                 priority
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
 );
};