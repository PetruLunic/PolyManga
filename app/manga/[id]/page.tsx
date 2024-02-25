import {getManga} from "@/app/lib/service/mangaAPI";


interface Props{
  params: {id: string}
}

export default async function Page({params: {id}}: Props) {
  const manga = await getManga(id);

  return (
  <div>
    {JSON.stringify(manga)}
  </div>
 );
};