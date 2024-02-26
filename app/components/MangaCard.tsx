import {Manga} from "@/app/types";
import {Card, CardBody, CardFooter, Image} from "@nextui-org/react";

interface Props{
  manga: Manga
}

export default async function MangaCard({manga}: Props) {
  console.log(manga)
 return (
     <Card shadow="sm" isPressable>
       <CardBody className="overflow-visible p-0">
         <Image
             shadow="sm"
             width="100%"
             alt={manga.title}
             className="object-cover h-[270px]"
             src={"/manga/" + manga.image}
         />
         <p className="block font-bold p-2">{manga.title}</p>
         <p className="text-default-500 text-sm px-2 pb-2">Chapter {manga.chapters.length - 1}</p>
       </CardBody>
     </Card>
 );
};