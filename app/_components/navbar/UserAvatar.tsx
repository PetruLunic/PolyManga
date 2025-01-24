"use client"

import {Avatar, Dropdown, DropdownItem, DropdownMenu, DropdownSection, DropdownTrigger} from "@nextui-org/react";
import {signOut, useSession} from "next-auth/react";
import {IoBookmarks, IoSettingsSharp} from "react-icons/io5";
import {CiLogout} from "react-icons/ci";
import {MdHistory} from "react-icons/md";

export default function UserAvatar() {
  const session = useSession();

  if (session.status !== "authenticated") return;

 return (
     <Dropdown placement="bottom-end">
       <DropdownTrigger>
         <Avatar
             as="button"
             className="transition-transform"
             src={session.data?.user?.image!}
         />
       </DropdownTrigger>
       <DropdownMenu aria-label="Profile Actions" variant="flat">
         <DropdownItem key="profile" className="h-14 gap-2">
           <p className="font-semibold">{session.data.user?.name}</p>
         </DropdownItem>
         <DropdownItem
             startContent={<IoBookmarks />}
             key="bookmarks"
             href={`/user/${session.data.user.id}/bookmarks`}
         >
           Bookmarks
         </DropdownItem>
         <DropdownItem
             startContent={<MdHistory />}
             key="history"
             href={`/user/${session.data.user.id}/history`}
         >
           History
         </DropdownItem>
         <DropdownItem
             startContent={<IoSettingsSharp />}
             key="settings"
             href={`/user/${session.data.user.id}/settings`}
         >
           Settings
         </DropdownItem>
         <DropdownSection>
           <DropdownItem
               startContent={<CiLogout />}
               key="logout"
               color="danger"
               className="text-danger"
               onPress={() => signOut()}
           >
             Log Out
           </DropdownItem>
         </DropdownSection>
       </DropdownMenu>
     </Dropdown>
 );
};