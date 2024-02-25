import {Navbar, NavbarBrand, NavbarContent, NavbarItem} from "@nextui-org/react";
import Link from "next/link";
import {Button} from "@nextui-org/button";
import {Input} from "@nextui-org/input";


export default async function NavBar() {

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