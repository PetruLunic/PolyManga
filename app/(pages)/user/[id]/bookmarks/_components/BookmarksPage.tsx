"use client"

import {BookmarksQuery} from "@/app/__generated__/graphql"
import {Tab, Tabs} from "@nextui-org/react";
import {useQueryParams} from "@/app/lib/hooks/useQueryParams";
import {useSearchParams} from "next/navigation";
import MangaList from "@/app/_components/MangaList";
import {getFragmentData} from "@/app/__generated__";
import {MANGA_CARD} from "@/app/lib/graphql/queries";
import MangaCard from "@/app/_components/MangaCard";

interface Props{
  data?: BookmarksQuery
}

export default function BookmarksPage({data}: Props) {
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
      <Tab key="reading" title={`Reading (${bookmarks?.reading?.length})`}>
        <MangaList>
          {getFragmentData(MANGA_CARD, bookmarks?.reading)?.map(manga =>
            <MangaCard manga={manga} key={manga.id}/>
          )}
        </MangaList>
      </Tab>
      <Tab key="inPlans" title={`In plans (${bookmarks?.inPlans?.length})`}>
        <MangaList>
          {getFragmentData(MANGA_CARD, bookmarks?.inPlans)?.map(manga =>
              <MangaCard manga={manga} key={manga.id}/>
          )}
        </MangaList>
      </Tab>
      <Tab key="finished" title={`Finished (${bookmarks?.finished?.length})`}>
        <MangaList>
          {getFragmentData(MANGA_CARD, bookmarks?.finished)?.map(manga =>
              <MangaCard manga={manga} key={manga.id}/>
          )}
        </MangaList>
      </Tab>
      <Tab key="dropped" title={`Dropped (${bookmarks?.dropped?.length})`}>
        <MangaList>
          {getFragmentData(MANGA_CARD, bookmarks?.dropped)?.map(manga =>
              <MangaCard manga={manga} key={manga.id}/>
          )}
        </MangaList>
      </Tab>
      <Tab key="favourite" title={`Favourite (${bookmarks?.favourite?.length})`}>
        <MangaList>
          {getFragmentData(MANGA_CARD, bookmarks?.favourite)?.map(manga =>
              <MangaCard manga={manga} key={manga.id}/>
          )}
        </MangaList>
      </Tab>
    </Tabs>

  </div>
 );
};