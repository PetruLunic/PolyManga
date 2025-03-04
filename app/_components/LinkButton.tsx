"use client"

import {Button, ButtonProps} from "@heroui/react";
import {Link} from "@/i18n/routing";
import {LinkProps} from "next/link";

export default function LinkButton(props: ButtonProps & LinkProps) {

 return (
   <Button
     {...props}
     as={Link}
   >
     {props.children}
   </Button>
 );
};