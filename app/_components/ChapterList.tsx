"use client"

import {Button} from "@heroui/react";
import Link from "next/link";
import {Manga_ChapterQuery} from "@/app/__generated__/graphql";
import {useEffect, useState} from "react";
import {HiOutlineSortAscending, HiOutlineSortDescending} from "react-icons/hi";
import { motion } from 'framer-motion';
import {IoBookmark, IoBookmarkOutline} from "react-icons/io5";
import {ADD_CHAPTER_BOOKMARK, DELETE_CHAPTER_BOOKMARK} from "@/app/lib/graphql/mutations";
import {useMutation, useQuery} from "@apollo/client";
import {useAlert} from "@/app/lib/contexts/AlertContext";
import {useSession} from "next-auth/react";
import {useModal} from "@/app/lib/contexts/ModalsContext";
import {mangaTitleAndIdToURL} from "@/app/lib/utils/URLFormating";
import {GET_BOOKMARKED_CHAPTER} from "@/app/lib/graphql/queries";
import {useTranslations} from "next-intl";

type ChapterList = Exclude<Manga_ChapterQuery["manga"], undefined | null>["chapters"]

interface Props{
  chapters?: ChapterList,
  mangaSlug: string,
  selectedChapter?: string
}

export default function ChapterList({chapters, selectedChapter, mangaSlug}: Props) {
  const t = useTranslations("components.chaptersList");
  const mangaId = (chapters && chapters.length > 0) ? chapters[0].mangaId : null;
  const [descending, setDescending] = useState(true);
  const session = useSession();
  const {onOpen} = useModal("signIn");
  const {addAlert} = useAlert();
  const [bookmarkedChapterState, setBookmarkedChapterState] = useState<string | undefined>();
  const [addBookmark, {loading: loadingAddBookmark}] = useMutation(ADD_CHAPTER_BOOKMARK);
  const [deleteBookmark, {loading: loadingDeleteBookmark}] = useMutation(DELETE_CHAPTER_BOOKMARK);
  const {data, error} = useQuery(GET_BOOKMARKED_CHAPTER, {variables: {slug: mangaSlug}});

  useEffect(() => {
    if (!data?.getBookmarkedChapter) return;

    setBookmarkedChapterState(data.getBookmarkedChapter.chapterId);
  }, [data]);

  const onChapterBookmark = (id: string) => () => {
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
        addBookmark({variables: {chapterId: id}});
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

 return (
   <div className="flex flex-col gap-2">
     <Button
       variant="light"
       className="self-end"
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
     <div className={`flex flex-col gap-2 ${descending && "flex-col-reverse"}`}>
       {chapters
           ? chapters.map((chapter) =>
               <Button
                   key={chapter.id}
                   variant={selectedChapter === chapter.id ? "solid" : "flat"}
                   className="w-full justify-between px-0"
                   as="div"
               >
                 <Button
                   isIconOnly
                   radius="full"
                   isDisabled={loadingAddBookmark || loadingDeleteBookmark}
                   variant="light"
                   size="lg"
                   onPress={onChapterBookmark(chapter.id)}
                   >
                   {chapter.id === bookmarkedChapterState
                    ? <IoBookmark/>
                    : <IoBookmarkOutline />}
                 </Button>
                 <Button
                   as={Link}
                   className="w-full flex justify-between items-center h-full"
                   variant={selectedChapter === chapter.id ? "solid" : "light"}
                   href={`/manga/${mangaSlug}/${chapter.id}`}
                 >
                   <span>{chapter.title}</span>
                   <span
                     className="tracking-wider">{new Date(parseInt(chapter.createdAt)).toLocaleDateString('en-GB')}</span>
                 </Button>
               </Button>
         )
         : <div className="text-center text-gray-500 my-10">{t("noChapter")}</div>
       }
     </div>
   </div>
 );
};