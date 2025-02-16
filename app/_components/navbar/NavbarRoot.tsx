"use client"

import {Button, Navbar, NavbarBrand, NavbarContent, NavbarItem} from "@heroui/react";
import Link from "next/link";
import {useParams} from "next/navigation";
import SignUpButton from "@/app/_components/navbar/SignUpButton";
import {useTranslations} from "next-intl";


export default function NavbarRoot() {
  const params = useParams<{id: string, chapter: string}>();
  const t = useTranslations("components.navbar");

  // No client side navbar on chapter page
  if (params.chapter)
    return <></>;

 return (
   <Navbar shouldHideOnScroll>
     <NavbarBrand className="flex gap-3">
       <Link href={"/"}>
         <p className="font-bold text-inherit">{process.env.NEXT_PUBLIC_PROJECT_NAME ?? "MANGA"}</p>
       </Link>
       <Button
           className="text-xs tracking-wide font-semibold"
           size="sm"
           as={Link}
           href="/manga"
        variant="light"
       >
         {t("catalog").toUpperCase()}
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