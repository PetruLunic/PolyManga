"use client"

import {Button} from "@heroui/react";
import {cleanAwsBucket} from "@/app/(pages)/admin/actions";

export default function Page() {

 return (
  <div>
   <Button onPress={() => {
     cleanAwsBucket()
   }}>
    Clean aws bucket
   </Button>
  </div>
 );
};