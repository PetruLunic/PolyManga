import {auth} from "@/auth";
import {redirect} from "next/navigation";
import SettingsPage from "@/app/(pages)/user/[id]/settings/_components/SettingsPage";

interface Props{
  params: Promise<{id: string}>
}

export default async function Page({params}: Props) {
  const {id} = await params;
  const session = await auth();

  // Forbidden is auth id is not the same as id in the url's path
  if (!session || id !== session.user.id) {
    redirect("/forbidden");
  }

 return (
  <div className="px-2">
    <h2 className="text-lg">Settings</h2>
    <SettingsPage user={session.user}/>
  </div>
 );
};