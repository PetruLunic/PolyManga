import dbConnect from "@/app/lib/dbConnect";
import {getMangas} from "@/app/lib/service/mangaAPI";
import {Button} from "@nextui-org/button";

export default async function Page() {
  await dbConnect();

  const mangas = await getMangas();

  return (
      <div>
        {JSON.stringify(mangas)}
        <Button>button</Button>
      </div>
  );
};