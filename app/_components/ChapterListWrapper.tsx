"use client"

import { ChaptersListFragment } from "@/app/__generated__/graphql";
import { useLocale, useTranslations } from "next-intl";
import React, { useMemo, useState } from "react"; // Removed useEffect for data sync
import { useQuery } from "@apollo/client";
import { CHAPTERS_LIST, GET_CHAPTERS } from "@/app/lib/graphql/queries";
import { useInfiniteScroll } from "@/app/lib/hooks/useInfiniteScroll";
import { ChapterLanguage, ChapterLanguageFull } from "@/app/types";
import { Button, Select, SelectItem, Spinner } from "@heroui/react";
import { motion } from "framer-motion";
import { HiOutlineSortAscending, HiOutlineSortDescending } from "react-icons/hi";
import { getFragmentData } from "@/app/__generated__";
import ChapterList from "@/app/_components/ChapterList";

interface Props {
 slug: string;
 initialChapters?: ChaptersListFragment[]; // Optional now, cache is primary
 languages: ChapterLanguage[];
}

export type LanguageSelectItem = ChapterLanguage | "all";

export default function ChapterListWrapper({ initialChapters, languages, slug }: Props) {
 const locale = useLocale();
 const t = useTranslations("components.chaptersList");
 const [isDescending, setIsDescending] = useState(true);
 const [languageFilter, setLanguageFilter] = useState<LanguageSelectItem>("all");
 const limit = 30; // Number of items per page
 // const [chapters, setChapters] = useState(initialChapters); // REMOVED - Rely on Apollo cache
 const [hasMore, setHasMore] = useState(true); // Still needed for infinite scroll logic

 // --- Apollo Query ---
 const { loading, error, data, fetchMore } = useQuery(GET_CHAPTERS, {
  variables: {
   id: slug,
   limit,
   offset: 0,
   locale,
   isDescending,
  },
  notifyOnNetworkStatusChange: true, // Useful for showing loading state during fetchMore
  skip: initialChapters && initialChapters?.length < limit
 });

 // Extract chapters from cached data using useMemo for stability
 const chaptersToDisplay = useMemo(() => {
  const chaptersData = data?.manga?.chapters;
  // Use getFragmentData if chaptersData exists, otherwise default to initialChapters or empty array
  return chaptersData
    ? getFragmentData(CHAPTERS_LIST, chaptersData)
    : initialChapters; // Use initialChapters as fallback while loading/if data undefined
 }, [data, initialChapters]);

 // --- Infinite Scroll Logic ---
 const loadMore = async () => {
  // Prevent fetching if already loading or no more data
  if (loading || !hasMore) return;

  const currentLength = chaptersToDisplay?.length ?? 0; // Get length from derived data

  try {
   const { data: fetchMoreData } = await fetchMore({
    variables: {
     // Calculate offset based on the current number of items *in the cache*
     offset: currentLength,
     limit, // Keep other variables consistent
     id: slug,
     locale,
     isDescending,
    },
   });

   // Check if the fetchMore call returned fewer items than requested
   const newChapters = fetchMoreData?.manga?.chapters;
   if (!newChapters || newChapters.length < limit) {
    setHasMore(false);
   }
  } catch (err) {
   console.error("Failed to fetch more chapters:", err);
  }
 };

 const [loaderRef] = useInfiniteScroll({
  onLoadMore: loadMore,
  hasMore,
 });

 // --- Event Handlers ---
 const handleSortPress = () => {
  setIsDescending(prev => !prev);
  setHasMore(true);
 };

 const handleLanguageChange = (keys: any) => { // Use appropriate type for keys if available from HeroUI
  const newLang = keys.currentKey as LanguageSelectItem;
  setLanguageFilter(newLang);
  // Note: Filtering is currently handled purely client-side in ChapterList.
  // If language filtering required a backend refetch, you'd add `languageFilter`
  // to useQuery variables and potentially call `refetch` or handle it like sorting.
 }

 // --- Rendering ---
 if (error) {
  // Handle error state appropriately
  return <div>Error loading chapters: {error.message}</div>;
 }

 return (
   <div className="flex flex-col gap-2">
    <div className="flex gap-1 sm:gap-3 justify-between items-center">
     <Select
       disallowEmptySelection
       selectedKeys={[languageFilter]}
       label={t("languageFilter")}
       className={`min-w-28 max-w-40 text-xs md:text-base`}
       classNames={{ trigger: "bg-transparent" }}
       onSelectionChange={handleLanguageChange}
       disabledKeys={[languageFilter]}
     >
      <>
       {languages.map(lang => (
         <SelectItem key={lang}>
          {ChapterLanguageFull[lang as ChapterLanguage]}
         </SelectItem>
       ))}
       <SelectItem key={"all"}>{t("all")}</SelectItem>
      </>
     </Select>
     <Button variant="light" onPress={handleSortPress} isLoading={loading && data?.manga?.chapters?.length === 0}>
      {isDescending ? t("descending") : t("ascending")}
      <motion.div
        initial={{ opacity: 0, rotate: 0 }}
        animate={{ opacity: 1, rotate: isDescending ? 0 : 360 }}
        transition={{ duration: 0.2 }}
      >
       {isDescending
         ? <HiOutlineSortDescending className="text-xl" />
         : <HiOutlineSortAscending className="text-xl" />}
      </motion.div>
     </Button>
    </div>

    {/* Pass the derived chapters list */}
    <ChapterList
      chapters={chaptersToDisplay ?? []}
      mangaSlug={slug}
      languageFilter={languageFilter} // Client-side filtering happens here
    />

    {/* Loader: Show spinner if loading more or if initial load is happening */}
    {(loading || hasMore) && (
      <div ref={loaderRef} className="flex justify-center py-4">
       {loading && <Spinner />} {/* Show spinner only when actively loading */}
      </div>
    )}
    {/* Fallback if loaderRef isn't visible but we know there's more */}
    {!loading && hasMore && chaptersToDisplay && chaptersToDisplay.length > 0 && (
      <div className="h-1" ref={loaderRef}></div>
    )}

   </div>
 );
};
