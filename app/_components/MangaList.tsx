import {MangaCardFragment} from "@/app/__generated__/graphql";
import MangaCard from "@/app/_components/MangaCard";

interface Props{
  mangas?: readonly MangaCardFragment[] | null
}

export default function MangaList({mangas}: Props) {

 return (
     <div className="flex justify-center gap-3 flex-wrap md:justify-start">
       {mangas?.length !== 0
         ? mangas?.map((manga, index) =>
           <MangaCard key={index} manga={manga}/>
       )
           : <div className="text-gray-400">There is no manga...</div>}
     </div>
 );
};