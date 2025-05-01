"use client"

import {Button} from "@heroui/react";
import {cleanAwsBucket, migrate} from "@/app/(pages)/[locale]/admin/actions";
export default function Page() {

 return (
  <div>
   <Button onPress={() => {
     cleanAwsBucket()
   }}>
    Clean aws bucket
   </Button>
    <Button
      onPress={migrate}
    >
      migrate
    </Button>
  </div>
 );
};