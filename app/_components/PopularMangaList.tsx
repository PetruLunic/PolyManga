"use client"

import MangaCard from "@/app/_components/MangaCard";
import MangaList from "@/app/_components/MangaList";
import {Tab, Tabs} from "@heroui/react";
import {MangaCardFragment} from "@/app/__generated__/graphql";
import {LocaleType} from "@/app/types";
import {useTranslations} from "next-intl";

interface Props{
  locale: LocaleType;
  daily: MangaCardFragment[];
  weekly: MangaCardFragment[];
  monthly: MangaCardFragment[];
}

export default function PopularMangaList({daily, weekly, monthly, locale}: Props) {
  const t = useTranslations("pages.home");

 return (
     <div className="flex flex-col gap-3">
       <h3 className="text-xl">
         <span className="mr-2">{t("popular")}</span>
         <Tabs aria-label="Popular comics" defaultSelectedKey={"weekly"} variant="light" size="lg">
           <Tab key="daily" title={t("day")}>
             <MangaList isHorizontal>
               {daily.map(manga =>
                   <MangaCard manga={manga} key={manga.id} locale={locale}/>
               )}
             </MangaList>
           </Tab>
           <Tab key="weekly" title={t("week")}>
             <MangaList isHorizontal>
               {weekly.map(manga =>
                   <MangaCard manga={manga} key={manga.id} locale={locale}/>
               )}
             </MangaList>
           </Tab>
           <Tab key="montly" title={t("month")}>
             <MangaList isHorizontal>
               {monthly.map(manga =>
                   <MangaCard manga={manga} key={manga.id} locale={locale}/>
               )}
             </MangaList>
           </Tab>
         </Tabs>
       </h3>

     </div>

 );
};