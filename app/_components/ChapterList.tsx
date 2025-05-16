"use client"

import {Button} from "@heroui/react";
import {ChaptersListFragment} from "@/app/__generated__/graphql";
import {useEffect, useMemo, useState} from "react";
import {IoBookmark, IoBookmarkOutline} from "react-icons/io5";
import {ADD_CHAPTER_BOOKMARK, DELETE_CHAPTER_BOOKMARK} from "@/app/lib/graphql/mutations";
import {useMutation, useQuery} from "@apollo/client";
import {useAlert} from "@/app/lib/contexts/AlertContext";
import {useSession} from "next-auth/react";
import {useModal} from "@/app/lib/contexts/ModalsContext";
import {GET_BOOKMARKED_CHAPTER} from "@/app/lib/graphql/queries";
import {useTranslations} from "next-intl";
import {Link} from "@/i18n/routing";
import {useChapterLanguage} from "@/app/lib/hooks/useChapterLanguage";
import {LanguageSelectItem} from "@/app/_components/ChapterListWrapper";
import {useParams} from "next/navigation";


interface Props{
  chapters: ChaptersListFragment[],
  mangaSlug: string,
  languageFilter: LanguageSelectItem
}

export default function ChapterList({chapters, mangaSlug, languageFilter}: Props) {
  const {locale, number} = useParams<{locale: string, number: string}>()
  const session = useSession();
  const t = useTranslations("components.chaptersList");
  const {onOpen} = useModal("signIn");
  const {addAlert} = useAlert();
  const [bookmarkedChapterState, setBookmarkedChapterState] = useState<string | undefined>();
  const [addBookmark, {loading: loadingAddBookmark}] = useMutation(ADD_CHAPTER_BOOKMARK);
  const [deleteBookmark, {loading: loadingDeleteBookmark}] = useMutation(DELETE_CHAPTER_BOOKMARK);
  const {data} = useQuery(
    GET_BOOKMARKED_CHAPTER,
    {
      variables: {slug: mangaSlug, locale},
      skip: !locale
    });
  const targetLang = useChapterLanguage({queryName: "target_lang"});
  const sourceLang = useChapterLanguage({queryName: "source_lang"});
  const queryString = `?source_lang=${sourceLang}&target_lang=${targetLang}`;

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
        chapter.languages.some((language) => language === languageFilter))

    if (filteredChapters.length === 0) return null;

    return filteredChapters;
  }, [languageFilter, chapters])

 return (
   <div className={`flex flex-col gap-2`}>
     {filteredChapters
         ? filteredChapters
         .map((chapter) =>
         <Button
           key={chapter.id}
           variant={number === chapter.number.toString() ? "solid" : "flat"}
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
             prefetch={false}
             scroll={false}
             className="w-full flex justify-between items-center h-full text-sm"
             variant={number === chapter.number.toString() ? "solid" : "light"}
             href={`/manga/${mangaSlug}/chapter/${chapter.number}${queryString}`}
           >
             <span className="truncate">{chapter.title}</span>
             <span
               className="tracking-wider">{new Date(parseInt(chapter.createdAt)).toLocaleDateString(locale)}</span>
           </Button>
         </Button>
       )
       : <div className="text-center text-gray-500 my-10">{t("noChapter")}</div>
     }
   </div>
 );
};