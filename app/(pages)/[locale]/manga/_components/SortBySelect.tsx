"use client"

import {Select, SelectItem} from "@heroui/react";
import {useSearchParams} from "next/navigation";
import {useQueryParams} from "@/app/lib/hooks/useQueryParams";
import {useEffect} from "react";
import {useTranslations} from "next-intl";

const sortByList = ["views", "likes", "rating", "bookmarks", "chapters", "createdAt"] as const;

export default function SortBySelect() {
  const t = useTranslations("pages.manga")
  const searchParams = useSearchParams();
  const sortBy = searchParams.get("sortBy") as typeof sortByList[number] | null;
  const {replaceParam, deleteParam} = useQueryParams();

  // Validating query param
  useEffect(() => {
    if (sortBy && !sortByList.includes(sortBy)) {
      deleteParam("sortBy");
    }
  }, [sortBy, deleteParam]);

 return (
     <Select
         label={t(`placeholders.sortBy`)}
         defaultSelectedKeys={sortBy?.length ? [sortBy] : ["views"]}
         disallowEmptySelection
         onSelectionChange={value => {
           if (value === "all") return;
           const keys = Array.from(value.keys());
           replaceParam({"sortBy": keys as string[]});
         }}
     >
       {sortByList.map((sortType) =>
           <SelectItem key={sortType}>
             {t(`sortByOptions.${sortType}`)}
           </SelectItem>
       )}
     </Select>
 );
};