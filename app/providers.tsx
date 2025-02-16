"use client"
import React from "react";
import {HeroUIProvider} from "@heroui/react";
import {ThemeProvider} from "next-themes";
import ApolloClientProvider from "@/app/_components/ApolloClientProvider";
import {SessionProvider, SessionProviderProps} from "next-auth/react";
import {ModalsProvider} from "@/app/lib/contexts/ModalsContext";
import {AlertProvider} from "@/app/lib/contexts/AlertContext";
import {ZodErrorMapProvider} from "@/app/_components/ZodErrorMapProvider";

interface Props{
  children: React.ReactNode;
  session: SessionProviderProps["session"]
}

export default function Providers({children, session}: Props) {

 return (
   <SessionProvider session={session}>
     <ApolloClientProvider>
       <HeroUIProvider>
         <ThemeProvider
             attribute="class"
             defaultTheme="dark"
         >
           <ZodErrorMapProvider>
             <AlertProvider>
               <ModalsProvider>
                 {children}
               </ModalsProvider>
             </AlertProvider>
           </ZodErrorMapProvider>
         </ThemeProvider>
       </HeroUIProvider>
     </ApolloClientProvider>
   </SessionProvider>
 );
};