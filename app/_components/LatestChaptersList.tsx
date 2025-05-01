"use client"

import {GetLatestUploadedChaptersQuery} from "@/app/__generated__/graphql";
import ChapterUpdateCard from "@/app/_components/ChapterUpdateCard";
import React, {useState} from "react";
import {useQuery} from "@apollo/client";
import {GET_LATEST_UPLOADED_CHAPTERS} from "@/app/lib/graphql/queries";
import {useInfiniteScroll} from "@/app/lib/hooks/useInfiniteScroll";
import {Spinner} from "@heroui/react";
import {useLocale, useTranslations} from "next-intl";
import {LocaleType} from "@/app/types";

interface Props{
 initialChapters: GetLatestUploadedChaptersQuery["latestChapters"]
}

export default function LatestChaptersList({initialChapters}: Props) {
  const locale = useLocale();
  const t = useTranslations("pages.home");
  const limit = 16; // Number of items per page
  const [chapters, setChapters] = useState(initialChapters); // Combined list of chapters
  const [hasMore, setHasMore] = useState(true); // Whether there are more chapters to load

  const {  loading, fetchMore } = useQuery(GET_LATEST_UPLOADED_CHAPTERS, {
    variables: {
      limit,
      offset: initialChapters.length, // Start fetching after the initial data
      locale
    },
    skip: true
  });

  // Load more chapters
  const loadMore = async () => {
    if (loading || !hasMore) return;

    const { data: newChapters } = await fetchMore({
      variables: {
        offset: chapters.length, // Fetch items after the current list length
      },
    });

    if (newChapters?.latestChapters?.length < limit) {
      setHasMore(false); // No more items to load if fewer than `limit` are returned
    }

    setChapters((prev) => [...prev, ...newChapters.latestChapters]);
  };

  const [loaderRef] = useInfiniteScroll({
    onLoadMore: loadMore,
    hasMore
  })

    return (
    <div className="flex flex-col gap-3">
     <h3 className="text-xl">
       {t("latestChapter")}
     </h3>
     <div className="flex flex-col gap-1 md:grid md:grid-cols-2">
      {chapters.map(chapter =>
          <ChapterUpdateCard
              chapter={chapter}
              locale={locale as LocaleType}
              key={chapter.id}
          />
      )}
     </div>
      {/* Loader */}
      {hasMore && (
        <div className="flex justify-center py-4">
          <Spinner ref={loaderRef}/>
        </div>
      )}
    </div>
 );
};