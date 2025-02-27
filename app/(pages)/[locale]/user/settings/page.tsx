import {auth} from "@/auth";
import SettingsPage from "@/app/(pages)/[locale]/user/settings/_components/SettingsPage";
import {getTranslations} from "next-intl/server";

export default async function Page() {
  const t = await getTranslations("pages.user.settings");
  const session = await auth();

  if (!session) {
    return;
  }

 return (
  <div className="px-2">
    <h1 className="text-lg">{t("settings")}</h1>
    <SettingsPage user={session.user}/>
  </div>
 );
};