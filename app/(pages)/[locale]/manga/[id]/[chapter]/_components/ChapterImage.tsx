"use client"

import {Dropdown, DropdownItem, DropdownMenu, DropdownTrigger, Image} from "@heroui/react";
import {useEffect, useState} from "react";
import {MultiLanguageImage} from "@/app/(pages)/manga/[id]/[chapter]/_utils/transformChapter";
import {ChapterLanguage} from "@/app/__generated__/graphql";
import {isStringInEnum} from "@/app/lib/utils/isStringinEnum";
import NextImage from "next/image";
import {useSession} from "next-auth/react";

interface Props{
  image: MultiLanguageImage,
  languageQuery: string | null,
  priority?: boolean
}

export default function ChapterImage({image, languageQuery, priority}: Props) {
  const session = useSession();
  const [language, setLanguage] = useState<ChapterLanguage>(Object.keys(image)[0] as ChapterLanguage);
  const [offset, setOffset] = useState<number>(0);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  let preferredLanguage = session.data?.user?.preferences?.language

  useEffect(() => {
    if (!languageQuery) return;
    if (!isStringInEnum(languageQuery, ChapterLanguage)) return;

    setLanguage(languageQuery as ChapterLanguage);
  }, [languageQuery]);

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
        priority={priority}
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
                 priority={priority}
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