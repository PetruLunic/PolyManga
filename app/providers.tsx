"use client"
import React from "react";
import {NextUIProvider} from "@nextui-org/react";
import {ThemeProvider} from "next-themes";

interface Props{
  children: React.ReactNode;
}

export default function Providers({children}: Props) {

 return (
  <NextUIProvider>
    <ThemeProvider
      attribute="class"
      defaultTheme="dark"
    >
      {children}
    </ThemeProvider>
  </NextUIProvider>
 );
};