"use client"

import {useSession} from "next-auth/react";
import {useEffect, useRef} from "react";
import {useMutation, useQuery} from "@apollo/client";
import {ADD_CHAPTER_BOOKMARK} from "@/app/lib/graphql/mutations";
import {GET_BOOKMARKED_CHAPTER} from "@/app/lib/graphql/queries";

interface Props{
  slug: string;
  number: number;
  locale: string;
}

export default function ChapterBookmarkFetch({slug, number, locale}: Props) {
  const session = useSession();
  const [addBookmark] = useMutation(ADD_CHAPTER_BOOKMARK);
  const {data} = useQuery(GET_BOOKMARKED_CHAPTER, {variables: {slug, locale}});
  const firstFetchRef = useRef(false);

  // On mount add bookmark on this chapter if the user is logged in, and it's number is bigger than the previous one
  useEffect(() => {
    if (firstFetchRef.current) return;
    if (!session.data) return;
    if (data?.getBookmarkedChapter?.chapter?.number && number <= data.getBookmarkedChapter?.chapter?.number) return;

    try {
      // Fetching only one time
      firstFetchRef.current = true;
      addBookmark({variables: {slug, number}});
    } catch (e) {
      console.error(e);
    }
  }, [session, data]);
 return (
  <></>
 );
};