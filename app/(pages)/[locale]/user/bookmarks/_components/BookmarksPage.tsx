"use client"

import {BookmarksQuery} from "@/app/__generated__/graphql"
import {Tab, Tabs} from "@heroui/react";
import {useQueryParams} from "@/app/lib/hooks/useQueryParams";
import {useSearchParams} from "next/navigation";
import MangaList from "@/app/_components/MangaList";
import {getFragmentData} from "@/app/__generated__";
import {MANGA_CARD} from "@/app/lib/graphql/queries";
import MangaCard from "@/app/_components/MangaCard";
import {useLocale, useTranslations} from "next-intl";
import {LocaleType} from "@/app/types";

interface Props{
  data?: BookmarksQuery
}

export default function BookmarksPage({data}: Props) {
  const t = useTranslations("components.buttons.bookmark");
  const locale = useLocale();
  const {setParam} = useQueryParams();
  const bookmarkType = useSearchParams().get("type");
  const bookmarks = data?.user?.bookmarks

 return (
  <div className="flex flex-col gap-4">
    <Tabs
        size="lg"
        aria-label="Bookmarks tabs"
        variant="underlined"
        defaultSelectedKey={bookmarkType as any}
        onSelectionChange={key => {
          setParam({type: key as string})
        }}
        classNames={{
          tabList: "gap-0 md:gap-3",
          tab: "px-2 text-sm md:text-base"
    }}
    >
      <Tab key="reading" title={`${t("reading")} (${bookmarks?.reading?.length})`}>
        <MangaList>
          {getFragmentData(MANGA_CARD, bookmarks?.reading)?.map(manga =>
            <MangaCard manga={manga} key={manga.id} locale={locale as LocaleType} isExtendable/>
          )}
        </MangaList>
      </Tab>
      <Tab key="inPlans" title={`${t("inPlans")} (${bookmarks?.inPlans?.length})`}>
        <MangaList>
          {getFragmentData(MANGA_CARD, bookmarks?.inPlans)?.map(manga =>
              <MangaCard manga={manga} key={manga.id} locale={locale as LocaleType} isExtendable/>
          )}
        </MangaList>
      </Tab>
      <Tab key="finished" title={`${t("finished")} (${bookmarks?.finished?.length})`}>
        <MangaList>
          {getFragmentData(MANGA_CARD, bookmarks?.finished)?.map(manga =>
              <MangaCard manga={manga} key={manga.id} locale={locale as LocaleType} isExtendable/>
          )}
        </MangaList>
      </Tab>
      <Tab key="dropped" title={`${t("dropped")} (${bookmarks?.dropped?.length})`}>
        <MangaList>
          {getFragmentData(MANGA_CARD, bookmarks?.dropped)?.map(manga =>
              <MangaCard manga={manga} key={manga.id} locale={locale as LocaleType} isExtendable/>
          )}
        </MangaList>
      </Tab>
      <Tab key="favourite" title={`${t("favourite")} (${bookmarks?.favourite?.length})`}>
        <MangaList>
          {getFragmentData(MANGA_CARD, bookmarks?.favourite)?.map(manga =>
              <MangaCard manga={manga} key={manga.id} locale={locale as LocaleType} isExtendable/>
          )}
        </MangaList>
      </Tab>
    </Tabs>

  </div>
 );
};