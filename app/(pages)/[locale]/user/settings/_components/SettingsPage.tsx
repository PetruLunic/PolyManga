"use client"

import {Tab, Tabs} from "@heroui/react";
import {useQueryParams} from "@/app/lib/hooks/useQueryParams";
import {useSearchParams} from "next/navigation";
import {Session} from "next-auth";
import InfoSection from "@/app/(pages)/[locale]/user/settings/_components/InfoSection";
import SecuritySection from "@/app/(pages)/[locale]/user/settings/_components/SecuritySection";
import PreferencesSection from "@/app/(pages)/[locale]/user/settings/_components/PreferencesSection";
import {useTranslations} from "next-intl";

interface Props{
  user: Session["user"]
}

export default function SettingsPage({user}: Props) {
  const t = useTranslations("pages.user.settings");
  const {setParam} = useQueryParams();
  const section = useSearchParams().get("section");

 return (
  <div>
    <Tabs
        size="lg"
        aria-label="Bookmarks tabs"
        variant="underlined"
        defaultSelectedKey={section as string}
        onSelectionChange={key => {
          setParam({section: key as string})
        }}
        classNames={{
          tabList: "gap-0 md:gap-3",
          tab: "px-2 text-sm md:text-base"
        }}
    >
      <Tab
        key="information"
        title={t("information")}
      >
        <InfoSection user={user}/>
      </Tab>
      <Tab
        key="security"
        title={t("security")}
      >
        <SecuritySection/>
      </Tab>
      <Tab
        key="preferences"
        title={t("preferences")}
      >
        <PreferencesSection user={user}/>
      </Tab>
    </Tabs>
  </div>
 );
};