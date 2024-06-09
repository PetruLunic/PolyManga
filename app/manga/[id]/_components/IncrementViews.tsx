"use client"

import {useMutation} from "@apollo/client";
import {INCREMENT_VIEWS} from "@/app/lib/graphql/mutations";
import {memo, useEffect, useRef} from "react";

interface Props{
  mangaId?: string;
}

export default memo(function IncrementViews({ mangaId }: Props) {
  const [increment] = useMutation(INCREMENT_VIEWS);
  const isFirstLoad = useRef(true);

  useEffect(() => {
    if (!isFirstLoad.current) return;
    if (!mangaId) return;

    isFirstLoad.current = false;
    increment({ variables: { id: mangaId } }).catch(error => {
      console.error('Error incrementing views:', error);
    });
  }, [mangaId, increment]);

  return <div className="hidden" />;
});