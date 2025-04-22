"use client"

import {usePathname} from "@/i18n/routing";
import {useEffect} from "react";

export default function ScrollOnTop() {
  const pathname = usePathname();

  useEffect(() => {
    window.scroll(0, 0);
  }, [pathname]);

 return (
  <></>
 );
};