"use client"

import {Button} from "@nextui-org/react";
import Link from "next/link";
import {Manga_ChapterQuery} from "@/app/__generated__/graphql";
import {MouseEventHandler, useRef, useState} from "react";
import {HiOutlineSortAscending, HiOutlineSortDescending} from "react-icons/hi";
import { motion } from 'framer-motion';
import {IoBookmark, IoBookmarkOutline} from "react-icons/io5";
import {ADD_CHAPTER_BOOKMARK, DELETE_CHAPTER_BOOKMARK} from "@/app/lib/graphql/mutations";
import {useMutation} from "@apollo/client";
import {useAlert} from "@/app/lib/contexts/AlertContext";
import {useSession} from "next-auth/react";
import {useModal} from "@/app/lib/contexts/ModalsContext";

type ChapterList = Exclude<Manga_ChapterQuery["manga"], undefined | null>["chapters"]

interface Props{
  chapters?: ChapterList,
  selectedChapter?: string,
  bookmarkedChapter?: string
}

export default function ChapterList({chapters, selectedChapter, bookmarkedChapter}: Props) {
  const [descending, setDescending] = useState(true);
  const session = useSession();
  const {onOpen} = useModal("signIn");
  const {addAlert} = useAlert();
  const [bookmarkedChapterState, setBookmarkedChapterState] = useState<string | undefined>(bookmarkedChapter);
  const [addBookmark, {loading: loadingAddBookmark}] = useMutation(ADD_CHAPTER_BOOKMARK);
  const [deleteBookmark, {loading: loadingDeleteBookmark}] = useMutation(DELETE_CHAPTER_BOOKMARK);

  const onChapterBookmark: (id: string) => MouseEventHandler<HTMLButtonElement> = (id: string) => (e) => {
    e.preventDefault();
    e.stopPropagation();

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
       {descending ? "Descending" : "Ascending"}
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
           ? chapters.map((chapter, index) =>
               <Button
                   key={chapter.id}
                   variant={selectedChapter === chapter.id ? "solid" : "flat"}
                   className="w-full justify-between"
                   as={Link}
                   href={`/manga/${chapter.mangaId}/${chapter.id}`}
               >
                 <div className="flex gap-2 items-center">
                   <Button
                     isIconOnly
                     radius="full"
                     isDisabled={loadingAddBookmark || loadingDeleteBookmark}
                     variant="light"
                     size="lg"
                     onClick={onChapterBookmark(chapter.id)}
                     >
                     {chapter.id === bookmarkedChapterState
                      ? <IoBookmark/>
                      : <IoBookmarkOutline />}
                   </Button>
                   <span>{chapter.title}</span>
                 </div>
                 <span>{new Date(parseInt(chapter.createdAt)).toLocaleDateString()}</span>
               </Button>
           )
           : <div className="text-center text-gray-500 my-10">No chapter</div>
       }
     </div>
   </div>
 );
};