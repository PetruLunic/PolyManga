import {ComicsStatusBadgeColor, ComicsTypeBadgeColor} from "@/app/types";
import {Badge, Card, CardBody, Image} from "@nextui-org/react";
import { FaStar } from "react-icons/fa";
import Link from "next/link";
import {MangaCardFragment} from "@/app/__generated__/graphql";

interface Props {
  manga: MangaCardFragment
}

export default function MangaCard({manga}: Props) {

  // If it's path is not absolute, then the image is from local public folder
  const imageUrl = !manga.image.startsWith("https://") ? "/manga/" + manga.image : manga.image;

 return (
     <Card shadow="sm" className="w-44" isPressable isBlurred isHoverable>
       <Link href={`/manga/${manga.id}`} className="h-full">
         <Badge
             className="right-0 translate-x-0"
             size="lg"
             content={manga.status}
             color={ComicsStatusBadgeColor[manga?.status]}
             classNames={{
               base: "h-full"
             }}
         >
           <CardBody className="overflow-visible p-0 h-full justify-between">
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
                   className="object-cover w-44 h-[210px]"
                   src={imageUrl}
               />
             </Badge>
             <div className="flex flex-col justify-between h-full">
               <p className="block font-medium p-2 text-sm">{manga.title}</p>
               <div className="flex justify-between px-2 pb-2">
                 <span className="text-default-500 text-sm">{manga.latestChapter ? `Chapter ${manga.latestChapter?.number}` : "No chapter"}</span>
                 <span className="flex gap-1 items-center">
               <FaStar color="orange"/>
              <span className="text-sm">{manga.stats.rating?.value}</span>
             </span>
               </div>
             </div>
           </CardBody>
         </Badge>
       </Link>
     </Card>
 );
};