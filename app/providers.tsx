"use client"
import React from "react";
import {NextUIProvider} from "@nextui-org/react";
import {ThemeProvider} from "next-themes";
import ApolloClientProvider from "@/app/_components/ApolloClientProvider";
import {SessionProvider, SessionProviderProps} from "next-auth/react";
import {ModalsProvider} from "@/app/lib/contexts/ModalsContext";

interface Props{
  children: React.ReactNode;
  session: SessionProviderProps["session"]
}

export default function Providers({children, session}: Props) {

 return (
   <SessionProvider session={session}>
     <ApolloClientProvider>
       <NextUIProvider>
         <ThemeProvider
             attribute="class"
             defaultTheme="dark"
         >
           <ModalsProvider>
             {children}
           </ModalsProvider>
         </ThemeProvider>
       </NextUIProvider>
     </ApolloClientProvider>
   </SessionProvider>
 );
};