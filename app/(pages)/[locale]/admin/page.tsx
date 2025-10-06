"use client"

import {Button} from "@heroui/react";
import {cleanAwsBucket} from "@/app/(pages)/[locale]/admin/actions";
export default function Page() {

 return (
  <div>
   <Button onPress={() => {
     cleanAwsBucket()
   }}>
    Clean aws bucket
   </Button>
    {/*<Button*/}
    {/*  onPress={deleteChapterDuplicates}*/}
    {/*>*/}
    {/*  deleteChapterDuplicates*/}
    {/*</Button>*/}
  </div>
 );
};