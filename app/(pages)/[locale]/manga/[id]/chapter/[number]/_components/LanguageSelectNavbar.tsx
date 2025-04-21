"use client"

import {NavbarContent} from "@heroui/react";
import Navbar from "@/app/_components/Navbar";
import LanguageSelect from "@/app/_components/navbar/LanguageSelect";
import {LocaleType} from "@/app/types";
import {Suspense, useEffect, useState} from "react";
import {createPortal} from "react-dom";
import {useTranslations} from "next-intl";

interface Props {
  languages: Readonly<LocaleType[]>,
  nativeLanguages: LocaleType[]
}

export default function LanguageSelectNavbar({languages, nativeLanguages}: Props) {
  const [portalDiv, setPortalDiv] = useState<Element | null>(null);
  const t = useTranslations("components.languageSelect");

  useEffect(() => {
    setPortalDiv(document.querySelector("#language-navbar-portal"));
  }, [])

  if (!portalDiv) return;
  return (
    createPortal(
      <Navbar
      positioning="bottom"
      shouldHideOnScroll
      scrollThreshold={500}
      classNames={{
        base: "bottom-0 left-0",
        wrapper: "p-1"
      }}
    >
      <NavbarContent justify="start" className="gap-1">
        <Suspense>
          <LanguageSelect
            nativeLanguages={nativeLanguages}
            languages={languages}
            queryName="source_lang"
            className="min-w-36 sm:min-w-44"
            placeholder={t("placeholders.source")}
            label={t("labels.source")}
          />
        </Suspense>
      </NavbarContent>
      <NavbarContent justify="end" className="gap-1">
        <Suspense>
          <LanguageSelect
            nativeLanguages={nativeLanguages}
            languages={languages}
            queryName="target_lang"
            className="min-w-36 sm:min-w-44"
            placeholder={t("placeholders.target")}
            label={t("labels.target")}
          />
        </Suspense>
      </NavbarContent>
    </Navbar>, portalDiv)
  );
};