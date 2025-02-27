"use client"

import {ChapterLanguageFull} from "@/app/types";
import {Select, SelectItem} from "@heroui/react";
import {useSearchParams} from "next/navigation";
import {useQueryParams} from "@/app/lib/hooks/useQueryParams";
import {useEffect} from "react";
import {isStringInEnum} from "@/app/lib/utils/isStringinEnum";
import {ChapterLanguage} from "@/app/__generated__/graphql";
import {useLocale, useTranslations} from "next-intl";

interface Props{
  languages: ChapterLanguage[]
}

interface SelectItem {
  key: ChapterLanguage,
  value: ChapterLanguageFull
}

export default function LanguageSelect({languages}: Props) {
  const t = useTranslations("components.languageSelect");
  const locale = useLocale();
  const queryParams = useSearchParams();
  const writableParams = useQueryParams();
  const languagesMap: SelectItem[] = languages.map(language => ({key: language, value: ChapterLanguageFull[language]}));
  const language = queryParams.get("language")
    ?? (languagesMap.find(({key}) => key.toLowerCase() === locale)
        ? locale[0].toUpperCase() + locale.slice(1) // set locale language if available in chapter
        : languages[0]) // else set the first available language

  // Check if changed query language is in ChapterLanguage enum
  useEffect(() => {
    if (isStringInEnum(language, ChapterLanguage)) return;

    writableParams.setParam({language: languages[0]});
  }, [language]);

 return (
   <Select
    items={languagesMap}
    placeholder={t("placeholder")}
    label={t("label")}
    size="sm"
    className="w-24 md:w-36 max-w-xs"
    classNames={{
      trigger: "bg-transparent"
    }}
    selectedKeys={[language]}
    disallowEmptySelection
    onSelectionChange={value => {
      if (value === "all") return;
      const key = Array.from(value.keys())[0];
      writableParams.setParam({language: key as string});
    }}
   >
     {(language) => <SelectItem key={language.key}>{language.value}</SelectItem> }
   </Select>
 );
};