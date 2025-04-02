"use client"

import {createPortal} from "react-dom";
import {useEffect, useState} from "react";
import Navbar from "@/app/_components/Navbar";

export default function ChapterNavbarSkeleton() {
  const [portalDiv, setPortalDiv] = useState<Element | null>(null);

  useEffect(() => {
    setPortalDiv(document.querySelector("#navbar-portal"));
  }, [])

  if (!portalDiv) return;

  return (
    <>
      {createPortal(
        <Navbar
          shouldHideOnScroll
          scrollThreshold={500}
        >
        </Navbar>,
        portalDiv)}
    </>
  );
};