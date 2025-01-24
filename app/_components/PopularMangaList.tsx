"use client"

import MangaCard from "@/app/_components/MangaCard";
import MangaList from "@/app/_components/MangaList";
import {Tab, Tabs} from "@nextui-org/react";
import {MangaCardFragment} from "@/app/__generated__/graphql";

interface Props{
  daily: MangaCardFragment[];
  weekly: MangaCardFragment[];
  monthly: MangaCardFragment[];
}

export default function PopularMangaList({daily, weekly, monthly}: Props) {

 return (
     <div className="flex flex-col gap-3">
       <h3 className="text-xl">
         <span className="mr-2">Popular this</span>
         <Tabs aria-label="Popular comics" defaultSelectedKey={"weekly"} variant="light" size="lg">
           <Tab key="daily" title="day">
             <MangaList isHorizontal>
               {daily.map(manga =>
                   <MangaCard manga={manga} key={manga.id}/>
               )}
             </MangaList>
           </Tab>
           <Tab key="weekly" title="week">
             <MangaList isHorizontal>
               {weekly.map(manga =>
                   <MangaCard manga={manga} key={manga.id}/>
               )}
             </MangaList>
           </Tab>
           <Tab key="montly" title="month">
             <MangaList isHorizontal>
               {monthly.map(manga =>
                   <MangaCard manga={manga} key={manga.id}/>
               )}
             </MangaList>
           </Tab>
         </Tabs>
       </h3>

     </div>

 );
};