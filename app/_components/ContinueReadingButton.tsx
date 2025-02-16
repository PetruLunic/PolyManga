"use client"

import {Button, ButtonProps} from "@heroui/react";
import {GET_BOOKMARKED_CHAPTER} from "@/app/lib/graphql/queries";
import {useQuery} from "@apollo/client";
import {Link} from "@/i18n/routing";
import {useTranslations} from "next-intl";

interface Props extends ButtonProps{
  mangaSlug: string,
  firstChapterId?: string
}

export default function ContinueReadingButton({mangaSlug, firstChapterId, ...props}: Props) {
  const {data} = useQuery(GET_BOOKMARKED_CHAPTER, {variables: {slug: mangaSlug}});
  const t = useTranslations("components.buttons.continueReading");

  const chapterTitle = data?.getBookmarkedChapter?.chapter?.title;

 return (
   <Button
     className="w-full"
     color="primary"
     as={Link}
     href={`/manga/${mangaSlug}/${firstChapterId}`}
     isDisabled={!firstChapterId}
     {...props}
   >
     {chapterTitle
       ? `${t("continue")} ${chapterTitle}`
       : t("firstChapter")}
   </Button>
 );
};