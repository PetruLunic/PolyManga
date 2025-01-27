"use client"

import {useSession} from "next-auth/react";
import {useModal} from "@/app/lib/contexts/ModalsContext";
import {IoBookmarks} from "react-icons/io5";
import {
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownSection,
  DropdownTrigger,
} from "@heroui/react";
import {useEffect, useState} from "react";
import {BookmarkType, bookmarkTypes} from "@/app/types";
import {ADD_BOOKMARK, DELETE_BOOKMARK} from "@/app/lib/graphql/mutations";
import {useMutation, useQuery} from "@apollo/client";
import {FiTrash2} from "react-icons/fi";
import {useAlert} from "@/app/lib/contexts/AlertContext";
import {IS_BOOKMARKED} from "@/app/lib/graphql/queries";

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
               onPress={onOpen}
           >
             Bookmark
           </Button>
       }
     </>
 );
};

function BookmarkDropdown ({mangaId}: Props) {
  const {data} = useQuery(IS_BOOKMARKED, {variables: {mangaId}});
  const [addBookmark, { loading: loadingAddBookmark}] = useMutation(ADD_BOOKMARK);
  const [deleteBookmark, {loading: loadingDeleteBookmark}] = useMutation(DELETE_BOOKMARK);
  const [bookmark, setBookmark] = useState<(BookmarkType | "delete")[]>([]);
  const {addAlert} = useAlert();

  useEffect(() => {
    setBookmark(data?.isBookmarked ? [data.isBookmarked as BookmarkType] : []);
  }, [data]);

  const onPress = (key: BookmarkType | "delete") => async () => {
    if (key === bookmark[0]) return;

    try {
      if (key === "delete") {
        await deleteBookmark({variables: {mangaId}});

        addAlert({message: "Bookmark deleted!", type: "success"});
        setBookmark([]);
      } else {
        await addBookmark({
          variables: {input: {
              mangaId,
              type: key
            }}});

        setBookmark([key]);
        addAlert({message: "Bookmark added!", type: "success"});
      }
    } catch(e) {
      console.error(e);
      addAlert({message: "Unexpected error!", type: "danger"});
    }
  }

  return (
      <Dropdown>
        <DropdownTrigger>
          <Button
              className="w-full"
              variant="bordered"
              startContent={<IoBookmarks />}
              isLoading={loadingAddBookmark || loadingDeleteBookmark}
          >
            {bookmark[0] ? bookmark[0][0].toUpperCase() + bookmark[0].substring(1) : "Bookmark"}
          </Button>
        </DropdownTrigger>
        <DropdownMenu
            aria-label="Select bookmark"
            variant="flat"
            selectionMode="single"
            selectedKeys={bookmark}
        >
          <DropdownSection showDivider={!!bookmark.length}>
            {bookmarkTypes.map(key =>
                <DropdownItem key={key} onPress={onPress(key)}>
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
                onPress={onPress("delete")}
                className={`text-danger ${!bookmark.length && "hidden"}`}
            >
                Delete bookmark
            </DropdownItem>
          </DropdownSection>
        </DropdownMenu>
      </Dropdown>
  )
}