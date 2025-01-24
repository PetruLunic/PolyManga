"use client"

import {useSession} from "next-auth/react";
import {useModal} from "@/app/lib/contexts/ModalsContext";
import {IoBookmarks} from "react-icons/io5";
import {Button, Dropdown, DropdownItem, DropdownMenu, DropdownSection, DropdownTrigger} from "@nextui-org/react";
import {useEffect, useState} from "react";
import {BookmarkType, bookmarkTypes} from "@/app/types";
import {ADD_BOOKMARK, DELETE_BOOKMARK} from "@/app/lib/graphql/mutations";
import {useMutation} from "@apollo/client";
import {FiTrash2} from "react-icons/fi";
import {useAlert} from "@/app/lib/contexts/AlertContext";
import {MangaQuery} from "@/app/__generated__/graphql";

const bookmarkDoc: Record<BookmarkType | "delete", string> = {
  reading: "Reading",
  inPlans: "In plans",
  favourite: "Favourite",
  finished: "Finished",
  dropped: "Dropped",
  delete: "Delete"
}

interface Props{
  mangaId: string,
  isBookmarked: MangaQuery["isBookmarked"]
}

export default function BookmarkButton({mangaId, isBookmarked}: Props) {
  const session = useSession();
  const {onOpen} = useModal("signIn");

 return (
     <>
       {session.status === "authenticated"
       ? <BookmarkDropdown isBookmarked={isBookmarked} mangaId={mangaId}/>
       : <Button
               className="w-full"
               variant="bordered"
               startContent={<IoBookmarks />}
               onPress={onOpen}
           >
             Bookmark
           </Button>
       }
     </>
 );
};

let prevBookmark: BookmarkType | "delete" | null = null;

function BookmarkDropdown ({mangaId, isBookmarked}: Props) {
  const [addBookmark, { loading: loadingAddBookmark}] = useMutation(ADD_BOOKMARK);
  const [deleteBookmark, {loading: loadingDeleteBookmark}] = useMutation(DELETE_BOOKMARK);
  const [bookmark, setBookmark] = useState<(BookmarkType | "delete")[]>(isBookmarked ? [isBookmarked as BookmarkType] : []);
  const {addAlert} = useAlert();

  // Mutate the bookmark on every bookmark change
  useEffect(() => {
    if (bookmark.length === 0) return;
    if (isBookmarked === bookmark[0] && !prevBookmark) return;

    prevBookmark = bookmark[0];

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
              isLoading={loadingAddBookmark || loadingDeleteBookmark}
          >
            {bookmark[0]
                ? bookmarkDoc[bookmark[0]]
                : isBookmarked
                    ? bookmarkDoc[isBookmarked as BookmarkType]
                    : "Bookmark"}
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