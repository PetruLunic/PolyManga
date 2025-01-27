"use client";

import {Button} from "@heroui/react";
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
           onPress={() => signIn("google")}
       >
         <FaGoogle className="text-xl" />
       </Button>
       <Button
           isIconOnly
           variant="light"
           radius="full"
           size="lg"
           onPress={() => signIn("facebook")}
       >
         <FaFacebookF className="text-xl"/>
       </Button>
     </div>
 );
};