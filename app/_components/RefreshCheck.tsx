"use client"

import {useSearchParams} from "next/navigation";
import {useEffect} from "react";
import {useQueryParams} from "@/app/lib/hooks/useQueryParams";
import {useRouter} from "@/i18n/routing";

export default function RefreshCheck() {
  const refresh = useSearchParams().get("refresh");
  const writeParams = useQueryParams();

  useEffect(() => {
    if (refresh === "true") {
      writeParams.deleteParam("refresh");
      setTimeout(() => {
        location.reload();
      }, 2000)
    }
  }, [refresh]);

 return (
  <></>
 );
};