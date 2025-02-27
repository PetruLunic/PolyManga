"use client";

import {GetLatestUploadedChaptersQuery} from "@/app/__generated__/graphql";
import {Badge, Card, Image, Tooltip} from "@heroui/react";
import {LocaleType} from "@/app/types";
import {useTimeSince} from "@/app/lib/hooks/useTimeSince";
import {extractChapterTitle} from "@/app/lib/utils/extractionUtils";
import {IoLanguage} from "react-icons/io5";
import {Link} from "@/i18n/routing";
import {useTranslations} from "next-intl";


interface Props{
 chapter: GetLatestUploadedChaptersQuery["latestChapters"][number],
  locale?: LocaleType
}

export default function ChapterUpdateCard({chapter, locale = 'en'}: Props) {
  const t = useTranslations("common.badges.languageAvailability");
  const hasLocale = chapter.languages.some(lang => lang.toLowerCase() === locale);
  const mangaTitle = chapter.manga.title.find(({language, value}) => locale === language.toLowerCase())?.value ?? chapter.manga.title[0].value;
  const timeSince = useTimeSince(new Date(Number(chapter.createdAt)));
  const chapterTitle = extractChapterTitle(chapter.versions, locale);

 return (
  <Card
    as={Link}
    className="h-24"
    isPressable
    isBlurred
    isHoverable
    fullWidth
    href={`/manga/${chapter.manga.slug}/chapter/${chapter.number}`}
  >
    <Badge
      className="translate-x-0 translate-y-0 text-xs sm:text-sm justify-start opacity-80"
      size="sm"
      content={
        <>
          {hasLocale
            ? <Tooltip
              aria-label={t("tooltips.available", {item: t("items.chapter")})}
              content={t("tooltips.available", {item: t("items.chapter")})}
            >
              <span className="flex gap-1 items-center">{t("available")} <IoLanguage size={15}/></span>
            </Tooltip>
            : <Tooltip
              aria-label={t("tooltips.unavailable", {item: t("items.chapter")})}
              content={t("tooltips.unavailable", {item: t("items.chapter")})}
            >
              <span className="flex gap-1 items-center">{t("unavailable")} <IoLanguage size={15} color="white"/></span>
            </Tooltip>}
        </>
      }
      showOutline={false}
      color={hasLocale ? "success" : "default"}
      classNames={{
        base: "h-full"
      }}
    >
     <div className="flex gap-2 sm:gap-5 items-center w-full h-full justify-between">
       <Image
           src={chapter.manga.image}
           alt={mangaTitle}
           className="object-cover h-24 w-20"
       />
       <div className="flex flex-col gap-2 items-start justify-between flex-1">
         <p className="text-sm sm:text-base">
           {mangaTitle}
         </p>
         <div className="flex gap-2 sm:gap-5 items-center justify-between w-full">
           <p className="text-xs sm:text-sm">
             {chapterTitle}
           </p>
           <p className="text-xs px-4">
             {timeSince}
           </p>
         </div>
       </div>
     </div>
    </Badge>
  </Card>
 );
};