import dbConnect from "@/app/lib/dbConnect";
import {getMangas} from "@/app/lib/service/mangaAPI";
import MangaCard from "@/app/components/MangaCard";

export default async function Page() {
  await dbConnect();

  const mangas = await getMangas()

  return (
      <div>
        {mangas.map((manga, index) =>
            <MangaCard key={index} manga={manga}/>
        )}
      </div>
  );
};