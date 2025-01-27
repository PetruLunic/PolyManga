"use client"

import {useEffect} from "react";
import {useSearchParams} from "next/navigation";
import {useQueryParams} from "@/app/lib/hooks/useQueryParams";
import {motion} from "framer-motion";
import {HiOutlineSortAscending, HiOutlineSortDescending} from "react-icons/hi";
import {Button} from "@heroui/react";

export default function SortButton() {
  const searchParams = useSearchParams();
  const sort = searchParams.get("sort");
  const {replaceParam} = useQueryParams();

  // Validate query params
  useEffect(() => {
    if (sort && sort !== "asc" && sort !== "desc") {
      replaceParam({"sort": "desc"});
    }

  }, [sort, replaceParam]);

  const onSortChange = () => {
    const sort = searchParams.get("sort");

    if (!sort || sort === "desc") {
      replaceParam({"sort": "asc"});
    } else {
      replaceParam({"sort": "desc"});
    }
  }

 return (
     <Button
         variant="light"
         className="self-end"
         onPress={onSortChange}
     >
       {sort === "asc" ? "Ascending" : "Descending"}
       <motion.div
           initial={{ opacity: 0, rotate: 0 }}
           animate={{ opacity: 1, rotate: sort === "desc" ? 0 : 360 }}
           transition={{ duration: 0.2 }}
       >
         {sort === "asc"
             ? <HiOutlineSortAscending className="text-xl"/>
             :<HiOutlineSortDescending className="text-xl"/>}
       </motion.div>
     </Button>
 );
};