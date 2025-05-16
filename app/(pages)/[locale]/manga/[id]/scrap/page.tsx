"use client"

import {useParams} from "next/navigation";
import {Button} from "@heroui/react";
import scrapManga from "@/app/(pages)/[locale]/manga/[id]/scrap/actions";
import {Input} from "@heroui/input";
import {useEffect, useState} from "react";

interface Props{
  params: {
    id: string,
    locale: string
  }
}

export default function Page() {
  const {id, locale} = useParams<Props["params"]>();
  const [url, setUrl] = useState<string | null>(null);

  useEffect(() => {
    setUrl(localStorage.getItem(id + "-scrap"))
  }, [id]);

 return (
  <div className="flex flex-col gap-3">
    <Input
      label="Scrap URL"
      value={url ?? ""}
      onValueChange={(value) => {
        setUrl(value);
        localStorage.setItem(id + "-scrap", value);
      }}
    />
   <Button
     disabled={!url}
    onPress={() => scrapManga(id, url ?? "")}
   >
     Scrap
   </Button>
  </div>
 );
};