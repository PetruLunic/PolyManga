import {useLocale} from "next-intl";
import {useSession} from "next-auth/react";
import {useEffect, useState} from "react";
import {LocaleType} from "@/app/types";
import {locales} from "@/i18n/routing";
import {useSearchParams} from "next/navigation";


interface Props {
  queryName: "source_lang" | "target_lang"
}

export function useChapterLanguage({queryName}: Props): LocaleType {
  const locale = useLocale();
  const user = useSession().data?.user;
  const [language, setLanguage] = useState<LocaleType>(locale as LocaleType);
  const queryLanguage = useSearchParams().get(queryName) as LocaleType | null;

  useEffect(() => {
    setLanguage(locale as LocaleType);

    const storeLanguage = localStorage.getItem(queryName) as LocaleType | null;

    if (storeLanguage && locales.includes(storeLanguage)) {
      setLanguage(storeLanguage)
    }

    if (user?.preferences.sourceLanguage && queryName === "source_lang") {
      setLanguage(user.preferences.sourceLanguage);
    } else if (user?.preferences.targetLanguage && queryName === "target_lang") {
      setLanguage(user.preferences.targetLanguage);
    }

    if (queryLanguage && locales.includes(queryLanguage)) {
      setLanguage(queryLanguage);
    }
  }, [user, locale, queryName, queryLanguage]);

  return language;
}