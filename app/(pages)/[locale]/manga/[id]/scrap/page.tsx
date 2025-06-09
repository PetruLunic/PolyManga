"use client"

import {Button, Spinner} from "@heroui/react";
import scrapManga from "@/app/(pages)/[locale]/manga/[id]/scrap/actions";
import {Input} from "@heroui/input";
import {useEffect, useState} from "react";
import { useQuery } from "@apollo/client/react";
import {GET_SCRAP_MANGA} from "@/app/lib/graphql/queries";
import {useParams} from "next/navigation";

interface Props{
  params: {
    id: string,
    locale: string
  }
}

export default function Page() {
  const {id} = useParams<Props["params"]>();
  const {data, loading} = useQuery(GET_SCRAP_MANGA, {variables: {id}});
  const scrapUrl = data?.manga?.scrapSources?.asurascans

 return (
   <>
     {loading
       ? <Spinner/>
       : <div className="flex flex-col gap-3">
        <div>Scrap URL: {scrapUrl}</div>
         <div>Latest current chapter: {data?.manga?.latestChapter?.number}</div>
         <Button
           disabled={!scrapUrl}
           onPress={() => scrapManga(id, scrapUrl ?? "", data?.manga?.latestChapter?.number)}
         >
           Scrap
         </Button>
       </div>}
   </>
 );
};