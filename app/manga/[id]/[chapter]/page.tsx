import {getChapter} from "@/app/lib/service/mangaAPI";
import Image from "next/image";
import {notFound} from "next/navigation";

interface Props{
  params: {id: string, chapter: string}
}

export default async function Page({params: {id, chapter: chapterNr}}: Props) {
  const chapter = await getChapter(id, parseInt(chapterNr));

  return (
  <div className="flex flex-col items-center">
    <h2>{chapter.title}</h2>
    {chapter.images.map(img =>
      <Image key={img.src} src={"/manga/" + img.src} alt={img.src} width={img.width} height={img.height}/>
    )}
  </div>
  );
};