"use client"

import {Select, SelectItem} from "@nextui-org/react";
import {useSearchParams} from "next/navigation";
import {useQueryParams} from "@/app/lib/hooks/useQueryParams";
import {useEffect} from "react";

const sortByList = ["views", "likes", "rating", "bookmarks", "chapters", "createdAt"];

export default function SortBySelect() {
  const searchParams = useSearchParams();
  const sortBy = searchParams.get("sortBy");
  const {replaceParam, deleteParam} = useQueryParams();

  // Validating query param
  useEffect(() => {
    if (sortBy && !sortByList.includes(sortBy)) {
      deleteParam("sortBy");
    }
  }, [sortBy, deleteParam]);

 return (
     <Select
         label="Sort By"
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
             {sortType[0].toUpperCase() + sortType.substring(1)}
           </SelectItem>
       )}
     </Select>
 );
};