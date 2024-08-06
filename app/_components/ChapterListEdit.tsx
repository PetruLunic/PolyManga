"use client"

import {Button, Checkbox, CheckboxGroup} from "@nextui-org/react";
import {motion} from "framer-motion";
import {HiOutlineSortAscending, HiOutlineSortDescending} from "react-icons/hi";
import Link from "next/link";
import {useState} from "react";
import {ChaptersQuery} from "@/app/__generated__/graphql";
import {FaRegEdit} from "react-icons/fa";
import {FaRegTrashCan} from "react-icons/fa6";
import createApolloClient from "@/app/lib/utils/apollo-client";
import {useMutation} from "@apollo/client";
import {DELETE_CHAPTERS} from "@/app/lib/graphql/mutations";
import {useAlert} from "@/app/lib/contexts/AlertContext";

type ChapterList = Exclude<ChaptersQuery["manga"], undefined | null>["chapters"]

interface Props{
  chapters?: ChapterList,
  mangaId: string
}

export default function ChapterListEdit({chapters, mangaId}: Props) {
  const [currentChapters, setCurrentChapters] = useState<ChapterList | undefined>(chapters);
  const [descending, setDescending] = useState(true);
  const [selectedChapters, setSelectedChapters] = useState<string[]>([]);
  const [deleteChapters, {loading, error, data}] = useMutation(DELETE_CHAPTERS);
  const {addAlert} = useAlert()

  const onDeleteMany = async () => {
    try {
      await deleteChapters({variables: {mangaId, ids: selectedChapters}});
      addAlert({type: "success", message: "Chapters deleted"})
    } catch (e) {
      console.error(e);
    }

  }

 return (
     <div className="flex flex-col gap-4">
       <div className="flex gap-3 self-end">
         <Button
             variant="light"
             className=""
             onPress={() => setDescending(prev => !prev)}
         >
           {descending ? "Descending" : "Ascending"}
           <motion.div
               initial={{ opacity: 0, rotate: 0 }}
               animate={{ opacity: 1, rotate: descending ? 0 : 360 }}
               transition={{ duration: 0.2 }}
           >
             {descending
                 ? <HiOutlineSortDescending className="text-xl"/>
                 : <HiOutlineSortAscending className="text-xl"/>}
           </motion.div>
         </Button>
         <Button
             color={selectedChapters.length ? "danger" : "default"}
             isDisabled={!selectedChapters.length}
             startContent={<FaRegTrashCan />}
             onPress={() => deleteChapters()}
             isLoading={loading}
         >
           Delete selected ({selectedChapters.length})
         </Button>
       </div>
       <CheckboxGroup
           classNames={{wrapper: `flex flex-col gap-6 ${descending && "flex-col-reverse"}`}}
           onValueChange={setSelectedChapters}
       >
         {chapters
             ? chapters.map((chapter, index) =>
                 // <Checkbox key={chapter.id} value={chapter.id}>
                   <Button
                       key={chapter.id}
                       as={Checkbox}
                       value={chapter.id}
                       classNames={{label: "flex justify-between w-full items-center before:hidden"}}
                       variant="flat"
                       className="w-full justify-start h-auto flex max-w-full gap-2 py-1"
                   >
                     <div className="flex gap-3">
                       <span>Chapter {chapter.number}</span>
                     </div>
                     <div className="flex gap-1 items-center">
                       <span>{new Date(parseInt(chapter.createdAt)).toLocaleDateString()}</span>
                       <Button
                           isIconOnly
                           radius="full"
                           variant="light"
                       >
                         <FaRegEdit />
                       </Button>
                       <Button
                           isIconOnly
                           color="danger"
                           radius="full"
                           variant="light"
                           isDisabled={loading}
                       >
                         <FaRegTrashCan />
                       </Button>
                     </div>
                   </Button>
                 // </Checkbox>
             )
             : <div className="text-center text-gray-500 my-10">No chapter</div>
         }
       </CheckboxGroup>
     </div>
 );
};