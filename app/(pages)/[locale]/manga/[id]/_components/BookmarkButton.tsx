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
import {useTranslations} from "next-intl";

interface Props{
  slug: string
}

export default function BookmarkButton({slug}: Props) {
  const t = useTranslations("components.buttons.bookmark");
  const session = useSession();
  const {onOpen} = useModal("signIn");

 return (
     <>
       {session.status === "authenticated"
       ? <BookmarkDropdown slug={slug}/>
       : <Button
               className="w-full"
               variant="bordered"
               startContent={<IoBookmarks />}
               onPress={onOpen}
           >
           {t("default")}
           </Button>
       }
     </>
 );
};

function BookmarkDropdown ({slug}: Props) {
  const t = useTranslations("components.buttons.bookmark");
  const {data} = useQuery(IS_BOOKMARKED, {variables: {slug}});
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
        await deleteBookmark({variables: {slug}});

        setBookmark([]);
      } else {
        await addBookmark({
          variables: {input: {
              slug,
              type: key
            }}});

        setBookmark([key]);
      }
    } catch(e) {
      console.error(e);
      addAlert({message: t("alerts.error"), type: "danger"});
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
            {bookmark[0] ? t(bookmark[0]) : t("default")}
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
                  {t(key)}
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
              {t("delete")}
            </DropdownItem>
          </DropdownSection>
        </DropdownMenu>
      </Dropdown>
  )
}