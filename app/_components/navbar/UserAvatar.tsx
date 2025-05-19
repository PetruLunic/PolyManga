"use client"

import {Avatar, Dropdown, DropdownItem, DropdownMenu, DropdownSection, DropdownTrigger} from "@heroui/react";
import {signOut, useSession} from "next-auth/react";
import {IoBookmarks, IoSettingsSharp} from "react-icons/io5";
import {CiLogout} from "react-icons/ci";
import {MdAutorenew, MdHistory} from "react-icons/md";
import {useTranslations} from "next-intl";
import {Link} from "@/i18n/routing";
import {USER_NO_IMAGE_SRC} from "@/app/lib/utils/constants";
import {FaPlus} from "react-icons/fa";

export default function UserAvatar() {
  const session = useSession();
  const t = useTranslations("components.navbar.userDropdown");

  if (session.status !== "authenticated") return;

  let imageSrc = session.data?.user?.image!

  // If image is relative and is not the default one then prepend the bucket url
  if (!imageSrc.startsWith("https") && imageSrc !== USER_NO_IMAGE_SRC) {
    imageSrc = process.env.NEXT_PUBLIC_BUCKET_URL + imageSrc;
  }

  return (
     <Dropdown placement="bottom-end">
       <DropdownTrigger>
         <Avatar
             as="button"
             className="transition-transform"
             src={imageSrc}
         />
       </DropdownTrigger>
       <DropdownMenu aria-label="Profile Actions" variant="flat">
         <DropdownSection showDivider>
           <DropdownItem
             key="profile"
             className="h-14 gap-2"
           >
             <p className="font-semibold">{session.data.user?.name}</p>
           </DropdownItem>
           <DropdownItem
             startContent={<IoBookmarks />}
             key="bookmarks"
             as={Link}
             href={`/user/bookmarks`}
           >
             {t("bookmarks")}
           </DropdownItem>
           <DropdownItem
             startContent={<MdHistory />}
             key="history"
             as={Link}
             href={`/user/history`}
           >
             {t("history")}
           </DropdownItem>
           <DropdownItem
             startContent={<IoSettingsSharp />}
             key="settings"
             as={Link}
             href={`/user/settings`}
           >
             {t("settings")}
           </DropdownItem>
         </DropdownSection>

         {(session.data.user.role === "MODERATOR" || session.data.user.role === "ADMIN")
           ? <DropdownSection showDivider>
              <DropdownItem
                  startContent={<FaPlus />}
                  key="manga"
                  as={Link}
                  href={`/manga/create`}
              >
                  Add Manga
              </DropdownItem>
              <DropdownItem
                  startContent={<MdAutorenew />}
                  key="scrap"
                  as={Link}
                  href={`/scrap`}
              >
                  Scrap
              </DropdownItem>
          </DropdownSection>
           : <DropdownItem key="hidden" className="hidden">f</DropdownItem>
         }
         <DropdownSection>
           <DropdownItem
               startContent={<CiLogout />}
               key="logout"
               color="danger"
               className="text-danger"
               onPress={() => signOut()}
           >
             {t("logOut")}
           </DropdownItem>
         </DropdownSection>
       </DropdownMenu>
     </Dropdown>
 );
};