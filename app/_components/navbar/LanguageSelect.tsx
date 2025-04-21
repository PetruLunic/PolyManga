"use client"

import {ChapterLanguageFull, LocaleType} from "@/app/types";
import {Select, SelectItem, SelectProps, SelectSection} from "@heroui/react";
import {useSearchParams} from "next/navigation";
import {useQueryParams} from "@/app/lib/hooks/useQueryParams";
import {useEffect} from "react";
import {isStringInEnum} from "@/app/lib/utils/isStringinEnum";
import {ChapterLanguage} from "@/app/__generated__/graphql";
import {useLocale, useTranslations} from "next-intl";
import {locales} from "@/i18n/routing";
import {useChapterLanguage} from "@/app/lib/hooks/useChapterLanguage";

interface Props extends Omit<SelectProps, 'children'> {
  nativeLanguages: LocaleType[],
  languages: Readonly<LocaleType[]>,
  queryName: "source_lang" | "target_lang"
}

interface SelectItem {
  key: LocaleType,
  value: ChapterLanguageFull
}

export default function LanguageSelect({languages, queryName, nativeLanguages, ...props}: Props) {
  const t = useTranslations("components.languageSelect");
  const writableParams = useQueryParams();
  const nativeLanguagesMap: SelectItem[] =
    nativeLanguages.map(language => ({key: language, value: ChapterLanguageFull[(language[0].toUpperCase() + language[1]) as ChapterLanguage]}));
  const languagesMap: SelectItem[] =
    languages
      .filter(lang => !nativeLanguages.includes(lang))
      .map(language => ({key: language, value: ChapterLanguageFull[(language[0].toUpperCase() + language[1]) as ChapterLanguage]}));
  const language = useChapterLanguage({queryName})

 return (
   <Select
    placeholder={props.placeholder ?? t("placeholders.default")}
    label={props.label ?? t("labels.default")}
    size="sm"
    className={`w-24 md:w-36 max-w-xs ${props.className ?? ""}`}
    classNames={{
      trigger: `bg-transparent ${props.classNames?.trigger ?? ""}`,
      ...props.classNames
    }}
    selectedKeys={[language]}
    disallowEmptySelection
    onSelectionChange={value => {
      if (value === "all") return;
      const key = Array.from(value.keys())[0];
      writableParams.setParam({[queryName]: key as string});
      localStorage.setItem(queryName, key as string);
    }}
   >
     <SelectSection
      showDivider
      title={t("sections.edited")}
     >
       {nativeLanguagesMap.map(language =>
         <SelectItem key={language.key}>{language.value}</SelectItem>)}
     </SelectSection>
     <SelectSection
       title={t("sections.AI")}
       className="truncate"
     >
       {languagesMap.map(language =>
         <SelectItem key={language.key}>{language.value}</SelectItem>)}
     </SelectSection>
   </Select>
 );
};