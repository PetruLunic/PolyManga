"use client"

import {ChapterLanguageFull} from "@/app/types";
import {Select, SelectItem} from "@nextui-org/react";
import {useSearchParams} from "next/navigation";
import {useQueryParams} from "@/app/lib/hooks/useQueryParams";
import {useEffect} from "react";
import {isStringInEnum} from "@/app/lib/utils/isStringinEnum";
import {ChapterLanguage} from "@/app/__generated__/graphql";

interface Props{
  languages: ChapterLanguage[]
}

interface SelectItem {
  key: ChapterLanguage,
  value: ChapterLanguageFull
}

export default function LanguageSelect({languages}: Props) {
  const queryParams = useSearchParams();
  const writableParams = useQueryParams();
  const language = queryParams.get("language") || languages[0];
  const languagesMap: SelectItem[] = languages.map(language => ({key: language, value: ChapterLanguageFull[language]}));

  // Check if changed query language is in ChapterLanguage enum
  useEffect(() => {
    if (isStringInEnum(language, ChapterLanguage)) return;

    writableParams.setParam({language: languages[0]});
  }, [language]);

 return (
   <Select
    items={languagesMap}
    placeholder="Select a language"
    label="Language"
    size="sm"
    className="w-24 md:w-36 max-w-xs"
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