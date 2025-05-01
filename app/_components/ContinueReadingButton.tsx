"use client"

import {Button, ButtonProps} from "@heroui/react";
import {GET_BOOKMARKED_CHAPTER} from "@/app/lib/graphql/queries";
import {useQuery} from "@apollo/client";
import {Link} from "@/i18n/routing";
import {useLocale, useTranslations} from "next-intl";

interface Props extends ButtonProps{
  mangaSlug: string,
  firstChapterNumber?: number
}

export default function ContinueReadingButton({mangaSlug, firstChapterNumber, ...props}: Props) {
  const t = useTranslations("components.buttons.continueReading");
  const locale = useLocale();
  const {data} = useQuery(GET_BOOKMARKED_CHAPTER, {variables: {slug: mangaSlug, locale}});
  const chapter = data?.getBookmarkedChapter?.chapter;

 return (
   <Button
     className="w-full"
     color="primary"
     as={Link}
     href={`/manga/${mangaSlug}/chapter/${chapter?.number ?? firstChapterNumber}`}
     isDisabled={typeof firstChapterNumber === "undefined"}
     {...props}
   >
     {chapter?.title
       ? `${t("continue")} ${chapter?.title}`
       : t("firstChapter")}
   </Button>
 );
};