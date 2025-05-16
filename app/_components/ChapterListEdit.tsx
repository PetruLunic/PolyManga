"use client"

import {
  Button,
  Checkbox,
  CheckboxGroup, Chip,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader, Popover, PopoverContent, PopoverTrigger, useDisclosure
} from "@heroui/react";
import {motion} from "framer-motion";
import {HiOutlineSortAscending, HiOutlineSortDescending} from "react-icons/hi";
import {useState} from "react";
import {ChaptersEditQuery} from "@/app/__generated__/graphql";
import {FaRegEdit} from "react-icons/fa";
import {FaRegTrashCan} from "react-icons/fa6";
import {useMutation} from "@apollo/client";
import {DELETE_CHAPTERS} from "@/app/lib/graphql/mutations";
import {useAlert} from "@/app/lib/contexts/AlertContext";
import {useLocale} from "next-intl";
import {LocaleType} from "@/app/types";
import {Link} from "@/i18n/routing";
import {IoLanguage} from "react-icons/io5";
import TranslateChaptersModal from "@/app/(pages)/[locale]/manga/[id]/edit/_components/TranslateChaptersModal";
import {extractMangaTitle} from "@/app/lib/utils/extractionUtils";
import ProcessOcrModal from "@/app/(pages)/[locale]/manga/[id]/edit/_components/ProcessOCRModal";

export type ChapterList = Exclude<ChaptersEditQuery["manga"], undefined | null>["chapters"]

interface Props{
  chapters?: ChapterList,
  slug: string,
}

export default function ChapterListEdit({chapters, slug}: Props) {
  const locale = useLocale();
  const deleteDisclosure = useDisclosure();
  const translateDisclosure = useDisclosure();
  const ocrDisclosure = useDisclosure();
  const [currentChapters, setCurrentChapters] = useState<ChapterList | undefined>(chapters);
  const [descending, setDescending] = useState(true);
  const [selectedChapters, setSelectedChapters] = useState<string[]>([]);
  const [deleteChapters, {loading, data}] = useMutation(DELETE_CHAPTERS);
  const {addAlert} = useAlert()

  const onDeleteMany = async () => {
    try {
      await deleteChapters({variables: {slug, ids: selectedChapters}});
      addAlert({type: "success", message: `${selectedChapters.length} chapters deleted`});

      // Delete the selected chapters from the current chapters
      setCurrentChapters(prev => prev?.filter(chapter => !selectedChapters.includes(chapter.id)));
      setSelectedChapters([]);

      // Close the modal
      deleteDisclosure.onClose();
    } catch (e) {
      console.error(e);
      addAlert({type: "danger", message: "Unexpected error!"});
    }
  }

  const onDeleteOne = (selectedChapter: ChapterList[number]) => async () => {
    try {
      await deleteChapters({variables: {slug, ids: [selectedChapter.id]}});
      const title = extractMangaTitle(selectedChapter.titles, locale as LocaleType);
      addAlert({type: "success", message: `${title} was deleted!`});

      // Delete the chapter from the current chapters
      setCurrentChapters(prev => prev?.filter(chapter => selectedChapter.id !== chapter.id));

      // Delete the deleted chapter from the selected chapters
      setSelectedChapters(prev => prev.filter(chapter => chapter !== selectedChapter.id));
    } catch (e) {
      console.error(e);
      addAlert({type: "danger", message: "Unexpected error!"});
    }
  }

 return (
   <>
     <div className="flex flex-col gap-4">
       <div className="flex gap-3 self-end">
         <Button
           variant="light"
           className=""
           onPress={() => setDescending(prev => !prev)}
         >
           {descending ? "Descending" : "Ascending"}
           <motion.div
             initial={{opacity: 0, rotate: 0}}
             animate={{opacity: 1, rotate: descending ? 0 : 360}}
             transition={{duration: 0.2}}
           >
             {descending
               ? <HiOutlineSortDescending className="text-xl"/>
               : <HiOutlineSortAscending className="text-xl"/>}
           </motion.div>
         </Button>
         <Button
           color={selectedChapters.length ? "danger" : "default"}
           isDisabled={!selectedChapters.length}
           startContent={<FaRegTrashCan/>}
           onPress={deleteDisclosure.onOpen}
           isLoading={loading}
         >
           Delete selected ({selectedChapters.length})
         </Button>
         <Button
           color={selectedChapters.length ? "primary" : "default"}
           isDisabled={!selectedChapters.length}
           startContent={<IoLanguage/>}
           onPress={translateDisclosure.onOpen}
         >
           Translate selected ({selectedChapters.length})
         </Button>
         <Button
           color={selectedChapters.length ? "primary" : "default"}
           isDisabled={!selectedChapters.length}
           startContent={<IoLanguage/>}
           onPress={ocrDisclosure.onOpen}
         >
           Process OCR selected ({selectedChapters.length})
         </Button>
       </div>
       <CheckboxGroup
         classNames={{wrapper: `flex flex-col gap-6 ${descending && "flex-col-reverse"}`}}
         value={selectedChapters}
         onValueChange={setSelectedChapters}
       >
         {currentChapters
           ? currentChapters.map((chapter) =>
               <Button
                 key={chapter.id}
                 as={Checkbox}
                 value={chapter.id}
                 classNames={{label: "flex justify-between w-full items-center before:hidden"}}
                 variant="flat"
                 className="w-full justify-start h-auto flex max-w-full gap-2 py-1"
               >
                 <div className="flex gap-3">
                   <span>{extractMangaTitle(chapter.titles, locale as LocaleType)}</span>
                 </div>
                 <div className="flex gap-1 items-center">
                   <Chip
                     color={chapter.isAIProcessedAt ? "success" : chapter.metadata ? "primary" : "default"}
                   >
                     {chapter.isAIProcessedAt ? "Redacted" : chapter.metadata ? "Processed OCR" : "Not Processed"}
                   </Chip>
                   <span>{new Date(parseInt(chapter.createdAt)).toLocaleDateString(locale)}</span>
                   <Button
                     isIconOnly
                     radius="full"
                     variant="light"
                     className="z-10"
                     as={Link}
                     href={`/manga/${slug}/chapter/${chapter.number}/edit`}
                   >
                     <FaRegEdit/>
                   </Button>
                   <Button
                     variant="light"
                     className="z-10"
                     as={Link}
                     href={`/manga/${slug}/chapter/${chapter.number}/edit/metadata`}
                   >
                     Metadata <FaRegEdit/>
                   </Button>
                   <Popover placement="right">
                     <PopoverTrigger>
                       <Button
                         isIconOnly
                         color="danger"
                         radius="full"
                         variant="light"
                         isDisabled={loading}
                       >
                         <FaRegTrashCan/>
                       </Button>
                     </PopoverTrigger>
                     <PopoverContent>
                       <div className="flex flex-col gap-3 p-2">
                         <div className="text-small font-bold">Are you sure?</div>
                         <Button
                           isIconOnly
                           color="danger"
                           className="w-full"
                           onPress={onDeleteOne(chapter)}
                           isLoading={loading}
                         >
                           Delete
                         </Button>
                       </div>
                     </PopoverContent>
                   </Popover>

                 </div>
               </Button>
           )
           : <div className="text-center text-gray-500 my-10">No chapter</div>
         }
       </CheckboxGroup>
     </div>
     <Modal isOpen={deleteDisclosure.isOpen} onOpenChange={deleteDisclosure.onOpenChange}>
       <ModalContent>
         {(onClose) => (
           <>
             <ModalHeader className="flex flex-col gap-1">
               Delete Chapters
             </ModalHeader>
             <ModalBody>
              Are you sure? This is an irreversible action!
             </ModalBody>
             <ModalFooter>
               <Button color="primary" variant="light" onPress={onClose} isDisabled={loading}>
                 Cancel
               </Button>
               <Button color="danger" onPress={onDeleteMany} isLoading={loading}>
                 Delete
               </Button>
             </ModalFooter>
           </>
         )}
       </ModalContent>
     </Modal>
     <TranslateChaptersModal
       chapters={chapters}
       selectedChapters={selectedChapters}
       {...translateDisclosure}
     />
     <ProcessOcrModal
       selectedChapters={selectedChapters}
       chapters={chapters}
       {...ocrDisclosure}
     />
   </>
 );
};