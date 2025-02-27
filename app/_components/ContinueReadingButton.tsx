"use client"

import {Button, ButtonProps} from "@heroui/react";
import {GET_BOOKMARKED_CHAPTER} from "@/app/lib/graphql/queries";
import {useQuery} from "@apollo/client";
import {Link} from "@/i18n/routing";
import {useLocale, useTranslations} from "next-intl";
import {extractChapterTitle} from "@/app/lib/utils/extractionUtils";
import {LocaleType} from "@/app/types";

interface Props extends ButtonProps{
  mangaSlug: string,
  firstChapterNumber?: number
}

export default function ContinueReadingButton({mangaSlug, firstChapterNumber, ...props}: Props) {
  const {data} = useQuery(GET_BOOKMARKED_CHAPTER, {variables: {slug: mangaSlug}});
  const t = useTranslations("components.buttons.continueReading");
  const locale = useLocale();

  const chapterTitle = data?.getBookmarkedChapter
    ? extractChapterTitle(data?.getBookmarkedChapter?.chapter?.versions, locale as LocaleType)
    : null;

 return (
   <Button
     className="w-full"
     color="primary"
     as={Link}
     href={`/manga/${mangaSlug}/chapter/${data?.getBookmarkedChapter?.chapter?.number ?? firstChapterNumber}`}
     isDisabled={typeof firstChapterNumber === "undefined"}
     {...props}
   >
     {chapterTitle
       ? `${t("continue")} ${chapterTitle}`
       : t("firstChapter")}
   </Button>
 );
};