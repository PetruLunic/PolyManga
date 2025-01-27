"use client"

import {FaFilterCircleXmark} from "react-icons/fa6";
import {Button} from "@heroui/react";
import {useQueryParams} from "@/app/lib/hooks/useQueryParams";

export default function ClearFiltersButton() {
  const {deleteParam} = useQueryParams();

  const onFiltersClear = () => {
    deleteParam(["type", "status", "genre", "language"]);
  }

 return (
     <Button
         variant="light"
         onPress={onFiltersClear}
         endContent={<FaFilterCircleXmark />}
     >
       Clear
     </Button>
 );
};