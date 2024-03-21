"use client"
import React from "react";
import {NextUIProvider} from "@nextui-org/react";
import {ThemeProvider} from "next-themes";
import ApolloClientProvider from "@/app/components/ApolloClientProvider";

interface Props{
  children: React.ReactNode;
}

export default function Providers({children}: Props) {

 return (
   <ApolloClientProvider>
     <NextUIProvider>
       <ThemeProvider
           attribute="class"
           defaultTheme="dark"
       >
         {children}
       </ThemeProvider>
     </NextUIProvider>
   </ApolloClientProvider>
 );
};