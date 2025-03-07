"use client"

import {Button} from "@heroui/react";
import {Link} from "@/i18n/routing";
import {FaChevronLeft, FaChevronRight} from "react-icons/fa";
import {useTranslations} from "next-intl";

interface Props{
  mangaId: string
  prevChapter?: number,
  nextChapter?: number
}

export default function NavigationButtons({prevChapter, nextChapter, mangaId}: Props) {
  const t = useTranslations("components.buttons");
 return (
   <div className="flex justify-between px-3">
     <Button
       as={Link}
       href={`/manga/${mangaId}/chapter/${prevChapter}`}
       isDisabled={!prevChapter}
       variant="flat"
       startContent={<FaChevronLeft />}
     >
       {t("previous")}
     </Button>
     <Button
       as={Link}
       href={`/manga/${mangaId}/chapter/${nextChapter}`}
       isDisabled={!nextChapter}
       variant="flat"
       endContent={<FaChevronRight />}
     >
       {t("next")}
     </Button>
   </div>
 );
};