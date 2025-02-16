"use client"

import {LocaleType} from "@/app/types";
import {Badge, Card, CardBody, CardProps, Image} from "@heroui/react";
import { FaStar } from "react-icons/fa";
import {MangaCardFragment} from "@/app/__generated__/graphql";
import {Link} from "@/i18n/routing";
import {useTranslations} from "next-intl";

const comicsStatusBadgeColor = {
  "ONGOING": "primary",
  "FINISHED": "success",
  "PAUSED": "warning",
  "DROPPED": "danger"
} as const

const comicsTypeBadgeColor = {
  "manhwa": "danger",
  "manga": "default",
  "manhua": "secondary"
} as const

interface Props extends CardProps{
  manga: MangaCardFragment,
  type?: "default" | "history" | "bookmark",
  locale?: LocaleType,
  bookmarkedChapter?: string,
  chapterBookmarkCreationDate?: Date
  isExtendable?: boolean
}

export default function MangaCard({manga, type, bookmarkedChapter, chapterBookmarkCreationDate, isExtendable, locale = 'en', ...props}: Props) {
  const mangaTitle = manga.title.find(({language, value}) => locale === language.toLowerCase())?.value ?? manga.title[0].value;
  const t = useTranslations('common.manga');

 return (
     <Card
       as={Link}
       shadow="sm"
       className={`${isExtendable ? "w-full" : "min-w-36 max-w-36 sm:min-w-44 sm:max-w-44"}`}
       href={`/manga/${manga.slug}`}
       isPressable
       isBlurred
       isHoverable
       {...props}
     >
       <Badge
           className="right-0 translate-x-0 text-xs sm:text-sm"
           size="lg"
           content={t(`status.${manga.status}`)}
           color={comicsStatusBadgeColor[manga?.status]}
           classNames={{
             base: "h-full"
           }}
       >
         <CardBody className="overflow-visible p-0 h-full justify-between">
           <Badge
               className="translate-x-1 translate-y-1 text-xs sm:text-sm"
               placement="bottom-left"
               size="lg"
               content={t(`type.${manga.type}`)}
               color={comicsTypeBadgeColor[manga.type]}
           >
             <Image
                 shadow="sm"
                 width="100%"
                 alt={mangaTitle}
                 className={`object-cover ${isExtendable ? "w-full aspect-[3/4]" : "w-36 h-44 sm:w-44 sm:h-[210px]"} `}
                 src={manga.image}
             />
           </Badge>
           <div className="flex flex-col justify-between h-full">
             <p className="block font-medium p-2 text-xs sm:text-sm">{mangaTitle}</p>
             <div className="flex justify-between px-2 pb-2">
               <span className="text-default-500 text-xs sm:text-sm">
                 {type === "history"
                     ? bookmarkedChapter
                     : manga.latestChapter ? `${t('chapter')} ${manga.latestChapter?.number}` : t('noChapter')}
               </span>
               <span className="flex gap-1 items-center">
             {type !== "history" && <FaStar className="text-lg sm:text-xl" color="orange"/>}
            <span className="text-xs sm:text-sm">
              {type === "history"
                ? chapterBookmarkCreationDate?.toLocaleDateString()
                  : manga.stats.rating?.value}
            </span>
           </span>
             </div>
           </div>
         </CardBody>
       </Badge>
     </Card>
 );
};