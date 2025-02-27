"use client"

import {useLocale, useTranslations} from "next-intl";
import {Select, SelectItem, SelectProps} from "@heroui/react";
import {locales, usePathname} from "@/i18n/routing";
import {ChapterLanguage, ChapterLanguageFull} from "@/app/types";

type Props = Omit<SelectProps, "children">;

export default function LocaleSelect({className, ...props}: Props) {
  const selectedLocale = useLocale();
  const t = useTranslations("form");
  const pathname = usePathname();

 return (
   <Select
     disallowEmptySelection
     selectedKeys={[selectedLocale]}
     aria-label={t("language")}
     className={`min-w-28 text-xs md:text-base ${className ?? ""}`}
     classNames={{
       trigger: "bg-transparent"
     }}
     disabledKeys={[selectedLocale]}
     {...props}
   >
     {locales.map(locale =>
        <SelectItem
          key={locale}
          href={`/${locale}${pathname}`}
        >
          {ChapterLanguageFull[(locale[0].toUpperCase() + locale.substring(1)) as ChapterLanguage]}
        </SelectItem>
     )}
   </Select>
 );
};