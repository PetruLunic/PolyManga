import dbConnect from "@/app/lib/dbConnect";
import {getMangas} from "@/app/lib/service/mangaAPI";
import {Button} from "@nextui-org/button";
import MangaCard from "@/app/components/MangaCard";

export default async function Page() {
  await dbConnect();

  const mangas = await getMangas();

  return (
      <div>
        <MangaCard manga={mangas[0]}/>
      </div>
  );
};