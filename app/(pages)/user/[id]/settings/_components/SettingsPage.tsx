"use client"

import {Tab, Tabs} from "@nextui-org/react";
import {useQueryParams} from "@/app/lib/hooks/useQueryParams";
import {useSearchParams} from "next/navigation";
import {Session} from "next-auth";
import InfoSection from "@/app/(pages)/user/[id]/settings/_components/InfoSection";
import SecuritySection from "@/app/(pages)/user/[id]/settings/_components/SecuritySection";

interface Props{
  user: Session["user"]
}

export default function SettingsPage({user}: Props) {
  const {set} = useQueryParams();
  const section = useSearchParams().get("section");

 return (
  <div>
    <Tabs
        size="lg"
        aria-label="Bookmarks tabs"
        variant="underlined"
        defaultSelectedKey={section as string}
        onSelectionChange={key => {
          set({section: key as string})
        }}
        classNames={{
          tabList: "gap-0 md:gap-3",
          tab: "px-2 text-sm md:text-base"
        }}
    >
      <Tab
        key="information"
        title="Information"
      >
        <InfoSection user={user}/>
      </Tab>
      <Tab
        key="security"
        title="Security"
      >
        <SecuritySection user={user}/>
      </Tab>
    </Tabs>
  </div>
 );
};