import {ComicsStatusBadgeColor, ComicsTypeBadgeColor} from "@/app/types";
import {Badge, Card, CardBody, Image} from "@nextui-org/react";
import { FaStar } from "react-icons/fa";
import Link from "next/link";
import {MangasQuery} from "@/app/__generated__/graphql";

interface Props {
  manga: MangasQuery["mangas"][number]
}

export default async function MangaCard({manga}: Props) {

 return (
     <Card shadow="sm" isPressable isBlurred isHoverable>
       <Link href={`/manga/${manga.id}`}>
         <Badge
             className="right-0 translate-x-0"
             size="lg"
             content={manga.status}
             color={ComicsStatusBadgeColor[manga?.status]}
         >
           <CardBody className="overflow-visible p-0">
             <Badge
                 className="translate-x-1 translate-y-1"
                 placement="bottom-left"
                 size="lg"
                 content={manga?.type?.toUpperCase()}
                 color={ComicsTypeBadgeColor[manga.type]}
             >
               <Image
                   shadow="sm"
                   width="100%"
                   alt={manga.title}
                   className="object-cover h-[270px]"
                   src={"/manga/" + manga.image}
               />
             </Badge>
             <p className="block font-bold p-2">{manga.title}</p>
             <div className="flex justify-between px-2 pb-2">
               <span className="text-default-500 text-sm">Chapter {manga.latestChapter?.number}</span>
               <span className="flex gap-1 items-center">
               <FaStar color="orange"/>
              <span>{manga.stats.rating?.value}</span>
             </span>
             </div>
           </CardBody>
         </Badge>
       </Link>
     </Card>
 );
};