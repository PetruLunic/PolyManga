"use client"

import {useSession} from "next-auth/react";
import {useEffect, useRef} from "react";
import {useMutation} from "@apollo/client";
import {ADD_CHAPTER_BOOKMARK} from "@/app/lib/graphql/mutations";

interface Props{
  chapterId: string;
  chapterNumber: number;
  bookmarkedChapterNumber?: number
}

export default function ChapterBookmarkFetch({chapterId, chapterNumber, bookmarkedChapterNumber}: Props) {
  const session = useSession();
  const [addBookmark, {loading: loadingAddBookmark}] = useMutation(ADD_CHAPTER_BOOKMARK);
  const firstFetchRef = useRef(false);

  // On mount add bookmark on this chapter if the user is logged in, and it's number is bigger than the previous one
  useEffect(() => {
    if (firstFetchRef.current) return;
    if (!session.data) return;
    if (bookmarkedChapterNumber && chapterNumber <= bookmarkedChapterNumber) return;

    try {
      // Fetching only one time
      firstFetchRef.current = true;
      addBookmark({variables: {chapterId}});
    } catch (e) {
      console.error(e);
    }
  }, [session]);
 return (
  <></>
 );
};