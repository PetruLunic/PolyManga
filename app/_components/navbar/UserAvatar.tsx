"use client"

import {Avatar, Dropdown, DropdownItem, DropdownMenu, DropdownSection, DropdownTrigger} from "@nextui-org/react";
import {signOut, useSession} from "next-auth/react";

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
           {/*<p className="font-semibold">{session.data.user}</p>*/}
         </DropdownItem>
         <DropdownItem key="bookmarks" href={`/user/${session.data.user.id}/bookmarks`}>
           Bookmarks
         </DropdownItem>
         <DropdownItem key="settings">
           Settings
         </DropdownItem>
         <DropdownSection>
           <DropdownItem
               key="logout"
               color="danger"
               className="text-danger"
               onClick={() => signOut({redirect: false})}
           >
             Log Out
           </DropdownItem>
         </DropdownSection>
       </DropdownMenu>
     </Dropdown>
 );
};