"use client"

import {Navbar, NavbarBrand, NavbarContent, NavbarItem} from "@nextui-org/react";
import Link from "next/link";
import {Input} from "@nextui-org/input";
import {useParams} from "next/navigation";
import NavbarChapter from "@/app/_components/NavbarChapter";


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
     <NavbarContent justify="end">
       <NavbarItem>
         <Input size="sm" placeholder="Search" variant="bordered"/>
       </NavbarItem>
     </NavbarContent>
   </Navbar>
 );
};