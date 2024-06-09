"use client"

import {BookmarksQuery} from "@/app/__generated__/graphql"
import {Tab, Tabs} from "@nextui-org/react";
import {useQueryParams} from "@/app/lib/hooks/useQueryParams";
import {useSearchParams} from "next/navigation";
import MangaList from "@/app/_components/MangaList";
import {getFragmentData} from "@/app/__generated__";
import {MANGA_CARD} from "@/app/lib/graphql/queries";

interface Props{
  data?: BookmarksQuery
}

export default function BookmarksPage({data}: Props) {
  const {set} = useQueryParams();
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
          set({type: key as string})
        }}
        classNames={{
          tabList: "gap-0 md:gap-3",
          tab: "px-2 text-sm md:text-base"
    }}
    >
      <Tab key="reading" title={`Reading (${bookmarks?.reading?.length})`}>
        <MangaList mangas={getFragmentData(MANGA_CARD, bookmarks?.reading)}/>
      </Tab>
      <Tab key="inPlans" title={`In plans (${bookmarks?.inPlans?.length})`}>
        <MangaList mangas={getFragmentData(MANGA_CARD, bookmarks?.inPlans)}/>
      </Tab>
      <Tab key="finished" title={`Finished (${bookmarks?.finished?.length})`}>
        <MangaList mangas={getFragmentData(MANGA_CARD, bookmarks?.finished)}/>
      </Tab>
      <Tab key="dropped" title={`Dropped (${bookmarks?.dropped?.length})`}>
        <MangaList mangas={getFragmentData(MANGA_CARD, bookmarks?.dropped)}/>
      </Tab>
      <Tab key="favourite" title={`Favourite (${bookmarks?.favourite?.length})`}>
        <MangaList mangas={getFragmentData(MANGA_CARD, bookmarks?.favourite)}/>
      </Tab>
    </Tabs>

  </div>
 );
};