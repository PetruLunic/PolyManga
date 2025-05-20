"use client"

import {
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Modal, ModalBody,
  ModalContent, ModalFooter, ModalHeader,
  useDisclosure
} from "@heroui/react";
import {BsThreeDotsVertical} from "react-icons/bs";
import {usePathname} from "next/navigation";
import {useSession} from "next-auth/react";
import {FiEdit, FiTrash2, FiUpload} from "react-icons/fi";
import {useMutation} from "@apollo/client";
import {DELETE_MANGA} from "@/app/lib/graphql/mutations";
import {useAlert} from "@/app/lib/contexts/AlertContext";
import {MdAutorenew} from "react-icons/md";
import {Link} from "@/i18n/routing";

interface Props {
  className?: string;
  mangaId: string;
}

export default function MangaSettingsDropdown({className, mangaId}: Props) {
  const path = usePathname();
  const session = useSession();
  const {onOpen, onClose, onOpenChange, isOpen} = useDisclosure();
  const [deleteManga, {loading}] = useMutation(DELETE_MANGA, {variables: {id: mangaId}})
  const {addAlert} = useAlert();

  // User must be admin or moderator
  if (!session.data || (session.data.user.role !== "MODERATOR" && session.data.user.role !== "ADMIN")) return;

  const onDelete = async () => {
    try {
      await deleteManga();
      addAlert({message: "Comics deleted!", type: "success"});
      onClose();

    } catch(e) {
      console.error(e);
      addAlert({message: "Unexpected error!", type: "danger"});
    }
  }

 return (
     <>
       <Dropdown>
         <DropdownTrigger>
           <Button
               variant="light"
               radius="full"
               size="lg"
               className={className}
               isIconOnly
           >
             <BsThreeDotsVertical />
           </Button>
         </DropdownTrigger>
         <DropdownMenu>
           <DropdownItem key="edit" aria-label="edit" href={path + "/edit"} startContent={<FiEdit />}>
             Edit
           </DropdownItem>
           <DropdownItem key="editChapters" aria-label="edit chapters" href={path + "/edit/chapters"} startContent={<FiEdit />}>
             Edit Chapters
           </DropdownItem>
           <DropdownItem key="upload" aria-label="upload" href={path + "/upload"} startContent={<FiUpload />}>
             Upload
           </DropdownItem>
           <DropdownItem
             startContent={<MdAutorenew />}
             key="scrap"
             href={path + "/scrap"}
           >
             Scrap
           </DropdownItem>
           <DropdownItem
               key="delete"
               color="danger"
               className="text-danger"
               startContent={<FiTrash2 />}
               aria-label="delete"
               onPress={onOpen}
           >
             Delete
           </DropdownItem>
         </DropdownMenu>
       </Dropdown>
       <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
         <ModalContent>
           {(onClose) => (
               <>
                 <ModalHeader className="flex flex-col gap-1">
                   Delete Manga
                 </ModalHeader>
                 <ModalBody>
                   <p>Are you sure?</p>
                   <p>If you delete the manga, all the chapters, with all the images will be deleted too.</p>
                 </ModalBody>
                 <ModalFooter>
                   <Button color="primary" variant="light" onPress={onClose}>
                     Close
                   </Button>
                   <Button color="danger" onPress={onDelete} isLoading={loading}>
                     Delete
                   </Button>
                 </ModalFooter>
               </>
           )}
         </ModalContent>
       </Modal>
     </>
 );
};