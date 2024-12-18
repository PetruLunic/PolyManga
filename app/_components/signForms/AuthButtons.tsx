"use client";

import {Button} from "@nextui-org/react";
import {FaFacebookF, FaGoogle} from "react-icons/fa";
import React from "react";
import {signIn} from "next-auth/react";

interface Props{
  className?: string
}

export default function AuthButtons({className}: Props) {

 return (
     <div className={`flex gap-1 justify-center ${className}`}>
       <Button
           isIconOnly
           variant="light"
           radius="full"
           size="lg"
           onClick={() => signIn("google")}
       >
         <FaGoogle className="text-xl" />
       </Button>
       <Button
           isIconOnly
           variant="light"
           radius="full"
           size="lg"
           onClick={() => signIn("facebook")}
       >
         <FaFacebookF className="text-xl"/>
       </Button>
     </div>
 );
};