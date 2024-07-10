"use client"

import {useSession} from "next-auth/react";
import {useModal} from "@/app/lib/contexts/ModalsContext";
import {IoBookmarks} from "react-icons/io5";
import {Button, Dropdown, DropdownItem, DropdownMenu, DropdownSection, DropdownTrigger} from "@nextui-org/react";
import {useEffect, useRef, useState} from "react";
import {BookmarkType, bookmarkTypes} from "@/app/types";
import {ADD_BOOKMARK, DELETE_BOOKMARK} from "@/app/lib/graphql/mutations";
import {useMutation, useQuery} from "@apollo/client";
import {IS_BOOKMARKED} from "@/app/lib/graphql/queries";
import {FiTrash2} from "react-icons/fi";
import {useAlert} from "@/app/lib/contexts/AlertContext";

const bookmarkDoc: Record<BookmarkType | "delete", string> = {
  reading: "Reading",
  inPlans: "In plans",
  favourite: "Favourite",
  finished: "Finished",
  dropped: "Dropped",
  delete: "Delete"
}

interface Props{
  mangaId: string
}

export default function BookmarkButton({mangaId}: Props) {
  const session = useSession();
  const {onOpen} = useModal("signIn");

 return (
     <>
       {session.status === "authenticated"
       ? <BookmarkDropdown mangaId={mangaId}/>
       : <Button
               className="w-full"
               variant="bordered"
               startContent={<IoBookmarks />}
               onClick={onOpen}
           >
             Bookmark
           </Button>
       }
     </>
 );
};


function BookmarkDropdown ({mangaId}: Props) {
  const [addBookmark, { loading: loadingAddBookmark}] = useMutation(ADD_BOOKMARK);
  const [deleteBookmark, {loading: loadingDeleteBookmark}] = useMutation(DELETE_BOOKMARK);
  const {data, loading: loadingQuery} = useQuery(IS_BOOKMARKED, {variables: {mangaId}});
  const [bookmark, setBookmark] = useState<(BookmarkType | "delete")[]>(data?.isBookmarked ? [data?.isBookmarked as BookmarkType] : []);
  const isFirstLoad = useRef<boolean>(true);
  const {addAlert} = useAlert();

  // Set the bookmark if it's already bookmarked
  useEffect(() => {
    if (data && !data?.isBookmarked) {
      isFirstLoad.current = false;
      return
    }
    if (!data) return;

    setBookmark([data.isBookmarked as BookmarkType]);
  }, [data]);

  // Mutate the bookmark on every bookmark change
  useEffect(() => {
    if (bookmark.length === 0) return;
    if (isFirstLoad.current) {
      isFirstLoad.current = false;
      return
    }

    (async () => {
      try {
        if (bookmark[0] === "delete") {
          await deleteBookmark({variables: {mangaId}});

          addAlert({message: "Bookmark deleted!", type: "success"});
          setBookmark([]);
        } else {
          await addBookmark({
            variables: {input: {
                mangaId,
                type: bookmark[0]
              }}});

          addAlert({message: "Bookmark added!", type: "success"});
        }
      } catch(e) {
        console.error(e);
        addAlert({message: "Unexpected error!", type: "danger"});
      }
    })()
  }, [bookmark]);

  return (
      <Dropdown>
        <DropdownTrigger>
          <Button
              className="w-full"
              variant="bordered"
              startContent={<IoBookmarks />}
              isLoading={loadingQuery || loadingAddBookmark || loadingDeleteBookmark}
          >
            {bookmark[0] ? bookmarkDoc[bookmark[0]] : "Bookmark"}
          </Button>
        </DropdownTrigger>
        <DropdownMenu
            aria-label="Select bookmark"
            variant="flat"
            selectionMode="single"
            selectedKeys={bookmark}
            onSelectionChange={value => {
              if (value === "all") return;
              const key = Array.from(value.keys())[0];
              if (!key) return;
              setBookmark([key as BookmarkType])
            }}
        >
          <DropdownSection showDivider={!!bookmark.length}>
            {bookmarkTypes.map(key =>
                <DropdownItem key={key}>
                  {bookmarkDoc[key]}
                </DropdownItem>
            )}
          </DropdownSection>
          <DropdownSection className={`${!bookmark.length && "hidden"}`}>
            <DropdownItem
                key="delete"
                startContent={<FiTrash2 />}
                color="danger"
                isDisabled={!bookmark.length}
                className={`text-danger ${!bookmark.length && "hidden"}`}
            >
                Delete bookmark
            </DropdownItem>
          </DropdownSection>
        </DropdownMenu>
      </Dropdown>
  )
}