import Image from "next/image";
import dbConnect from "@/app/lib/dbConnect";
import {Chapter} from "@/app/types";


const chapter: Chapter = {
  title: "Reaper of the drifting moon",
  images: [
    {
      src: "reaper-of-the-drifting-moon-chapter-0-1.jpeg",
      height: 1401,
      width: 800
    },
    {
      src: "reaper-of-the-drifting-moon-chapter-0-2.jpeg",
      height: 12950,
      width: 800
    }
  ]
}

export default async function Page() {
  await dbConnect();

  // const manga = await fetch("http://localhost:3000/api/manga/65d896a66e4a7a7e9e4e0c42").then(res => res.json());
  //
  // console.log(manga);

  return (
      <div className="flex flex-col items-center bg-gray-500">
        {chapter.images.map(img =>
            <Image key={img.src} src={`/manga/${img.src}`} alt={img.src} width={img.width} height={img.height}/>
        )}
      </div>
  );
};