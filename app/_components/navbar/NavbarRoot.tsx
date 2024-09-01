"use client"

import {Button, Navbar, NavbarBrand, NavbarContent, NavbarItem} from "@nextui-org/react";
import Link from "next/link";
import {useParams} from "next/navigation";
import NavbarChapter from "@/app/_components/navbar/NavbarChapter";
import SignUpButton from "@/app/_components/navbar/SignUpButton";


export default function NavbarRoot() {
  const params = useParams<{id: string, chapter: string}>();

  // No client side navbar on chapter page
  if (params.chapter)
    return <></>;

 return (
   <Navbar shouldHideOnScroll>
     <NavbarBrand className="flex gap-3">
       <Link href={"/"}>
         <p className="font-bold text-inherit">MANGA</p>
       </Link>
       <Button
           className="text-xs tracking-wide font-semibold"
           size="sm"
           as={Link}
           href="/manga"
        variant="light"
       >
         CATALOG
       </Button>
     </NavbarBrand>
     <NavbarContent justify="end" className="items-center">
       <NavbarItem>
        <SignUpButton/>
       </NavbarItem>
     </NavbarContent>
   </Navbar>
 );
};