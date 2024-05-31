"use client"

import { Navbar, NavbarBrand, NavbarContent, NavbarItem} from "@nextui-org/react";
import Link from "next/link";
import {useParams} from "next/navigation";
import NavbarChapter from "@/app/_components/navbar/NavbarChapter";
import SignUpButton from "@/app/_components/navbar/SignUpButton";


export default function NavbarRoot() {
  const params = useParams<{id: string, chapter: string}>();

  if (params.chapter)
    return <NavbarChapter/>

 return (
   <Navbar shouldHideOnScroll>
     <NavbarBrand>
       <Link href={"/"}>
         <p className="font-bold text-inherit">MANGA</p>
       </Link>
     </NavbarBrand>
     <NavbarContent justify="end" className="items-center">
       <NavbarItem>
        <SignUpButton/>
       </NavbarItem>
     </NavbarContent>
   </Navbar>
 );
};