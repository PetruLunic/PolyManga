import {Manga, MangaStatusBadgeColor} from "@/app/types";
import {Badge, Card, CardBody, Image} from "@nextui-org/react";
import { FaStar } from "react-icons/fa";
import Link from "next/link";

interface Props{
  manga: Manga
}

export default async function MangaCard({manga}: Props) {

 return (
     <Card shadow="sm" isPressable isBlurred>
       <Link href={`/manga/${manga.id}`}>
         <Badge
             className="right-0 translate-x-0"
             size="lg"
             content={manga.status}
             color={MangaStatusBadgeColor[manga.status]}
         >
           <CardBody className="overflow-visible p-0">
             <Image
                 shadow="sm"
                 width="100%"
                 alt={manga.title}
                 className="object-cover h-[270px]"
                 src={"/manga/" + manga.image}
             />
             <p className="block font-bold p-2">{manga.title}</p>
             <div className="flex justify-between px-2 pb-2">
               <span className="text-default-500 text-sm">Chapter {manga.chapters.length - 1}</span>
               <span className="flex gap-1 items-center">
               <FaStar color="orange"/>
              <span>{manga.rating?.value}</span>
             </span>
             </div>
           </CardBody>
         </Badge>
       </Link>
     </Card>
 );
};