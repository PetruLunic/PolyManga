"use client"

import {Button, Select, SelectItem} from "@heroui/react";
import {Manga_ChapterQuery} from "@/app/__generated__/graphql";
import {useEffect, useMemo, useState} from "react";
import {HiOutlineSortAscending, HiOutlineSortDescending} from "react-icons/hi";
import { motion } from 'framer-motion';
import {IoBookmark, IoBookmarkOutline} from "react-icons/io5";
import {ADD_CHAPTER_BOOKMARK, DELETE_CHAPTER_BOOKMARK} from "@/app/lib/graphql/mutations";
import {useMutation, useQuery} from "@apollo/client";
import {useAlert} from "@/app/lib/contexts/AlertContext";
import {useSession} from "next-auth/react";
import {useModal} from "@/app/lib/contexts/ModalsContext";
import {GET_BOOKMARKED_CHAPTER} from "@/app/lib/graphql/queries";
import {useLocale, useTranslations} from "next-intl";
import {extractChapterTitle} from "@/app/lib/utils/extractionUtils";
import {ChapterLanguage, ChapterLanguageFull, LocaleType} from "@/app/types";
import {Link, locales} from "@/i18n/routing";

type ChapterList = Exclude<Manga_ChapterQuery["manga"], undefined | null>["chapters"]

interface Props{
  chapters?: ChapterList,
  mangaSlug: string,
  selectedChapter?: string,
  languages: ChapterLanguage[]
}

type LanguageSelectItem = ChapterLanguage | "all";

export default function ChapterList({chapters, selectedChapter, mangaSlug, languages}: Props) {
  const t = useTranslations("components.chaptersList");
  const locale = useLocale();
  const [descending, setDescending] = useState(true);
  const session = useSession();
  const {onOpen} = useModal("signIn");
  const {addAlert} = useAlert();
  const [bookmarkedChapterState, setBookmarkedChapterState] = useState<string | undefined>();
  const [addBookmark, {loading: loadingAddBookmark}] = useMutation(ADD_CHAPTER_BOOKMARK);
  const [deleteBookmark, {loading: loadingDeleteBookmark}] = useMutation(DELETE_CHAPTER_BOOKMARK);
  const {data, error} = useQuery(GET_BOOKMARKED_CHAPTER, {variables: {slug: mangaSlug}});
  const [languageFilter, setLanguageFilter] = useState<LanguageSelectItem>(
    languages?.find(lang => lang.toLowerCase() === locale) ?? "all"
  )
  useEffect(() => {
    if (!data?.getBookmarkedChapter) return;

    setBookmarkedChapterState(data.getBookmarkedChapter.chapterId);
  }, [data]);

  const onChapterBookmark = (id: string, number: number) => () => {
    // If user is not logged in then open signIn modal
    if (!session.data) {
      onOpen();
      return;
    }

    try {
      // If click on the bookmarked chapter then delete it else add it
      if (bookmarkedChapterState === id) {
        deleteBookmark({variables: {chapterId: id}});
        // Change optimistic the state of the bookmark
        setBookmarkedChapterState(undefined);
      } else {
        addBookmark({variables: {slug: mangaSlug, number}});
        // Change optimistic the state of the bookmark
        setBookmarkedChapterState(id);
      }
    } catch (e) {
      console.error(e);
      addAlert({type: "danger", message: "Unexpected error occurred."});

      // Rollback the state on error
      setBookmarkedChapterState(bookmarkedChapterState);
    }
  }

  const filteredChapters = useMemo(() => {
    if (!chapters) return null;
    if (languageFilter === "all") {
      return chapters.length > 0 ? chapters : null;
    }

    const filteredChapters =  chapters.filter(chapter =>
        chapter.versions.some(({language}) => language === languageFilter))

    if (filteredChapters.length === 0) return null;

    return filteredChapters;
  }, [languageFilter, chapters])

 return (
   <div className="flex flex-col gap-2">
     <div className="flex gap-1 sm:gap-3 justify-between items-center">
       <Select
           disallowEmptySelection
           selectedKeys={[languageFilter]}
           label={t("languageFilter")}
           className={`min-w-28 max-w-40 text-xs md:text-base`}
           classNames={{
             trigger: "bg-transparent"
           }}
           onSelectionChange={(keys) => setLanguageFilter(keys.currentKey as LanguageSelectItem)}
           disabledKeys={[languageFilter]}
       >
         <>
           {languages.map(lang =>
             <SelectItem
               key={lang}
             >
               {ChapterLanguageFull[lang as ChapterLanguage]}
             </SelectItem>
           )}
           <SelectItem
             key={"all"}
           >
             {t("all")}
           </SelectItem>
         </>
       </Select>
       <Button
         variant="light"
         onPress={() => setDescending(prev => !prev)}
       >
         {descending ? t("descending") : t("ascending")}
         <motion.div
           initial={{ opacity: 0, rotate: 0 }}
           animate={{ opacity: 1, rotate: descending ? 0 : 360 }}
           transition={{ duration: 0.2 }}
         >
           {descending
             ? <HiOutlineSortDescending className="text-xl"/>
             : <HiOutlineSortAscending className="text-xl"/>}
         </motion.div>
       </Button>
     </div>
     <div className={`flex flex-col gap-2 ${descending && "flex-col-reverse"}`}>
       {filteredChapters
           ? filteredChapters
           .map((chapter) => {
             const chapterTitle = extractChapterTitle(chapter.versions, locale as LocaleType);

           return <Button
             key={chapter.id}
             variant={selectedChapter === chapter.number.toString() ? "solid" : "flat"}
             className="w-full justify-between px-0"
             as="div"
           >
             <Button
               isIconOnly
               radius="full"
               isDisabled={loadingAddBookmark || loadingDeleteBookmark}
               variant="light"
               size="lg"
               onPress={onChapterBookmark(chapter.id, chapter.number)}
             >
               {chapter.id === bookmarkedChapterState
                 ? <IoBookmark/>
                 : <IoBookmarkOutline/>}
             </Button>
             <Button
               as={Link}
               className="w-full flex justify-between items-center h-full"
               variant={selectedChapter === chapter.number.toString() ? "solid" : "light"}
               href={`/manga/${mangaSlug}/chapter/${chapter.number}`}
             >
               <span>{chapterTitle}</span>
               <span
                 className="tracking-wider">{new Date(parseInt(chapter.createdAt)).toLocaleDateString(locale)}</span>
             </Button>
           </Button>
         })
         : <div className="text-center text-gray-500 my-10">{t("noChapter")}</div>
       }
     </div>
   </div>
 );
};