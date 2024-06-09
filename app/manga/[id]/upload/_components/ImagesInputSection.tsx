import {Divider} from "@nextui-org/divider";
import ImageInput from "@/app/manga/[id]/upload/_components/ImageInput";
import {Button, Image, Select, SelectItem, useDisclosure} from "@nextui-org/react";
import {ChapterLanguage} from "@/app/types";
import {FaTrashAlt} from "react-icons/fa";
import {Dispatch, SetStateAction} from "react";
import {ImageInputSection, SelectItem as ISelectItem} from "@/app/manga/[id]/upload/_components/UploadChapterForm";
import {Modal, ModalBody, ModalContent} from "@nextui-org/react";

interface Props{
  id: string,
  setImageInputSections:  Dispatch<SetStateAction<ImageInputSection>>,
  imageInputSections: ImageInputSection,
  languagesMap: ISelectItem[],
  errorMessage?: string
}

export default function ImagesInputSection({id, setImageInputSections, imageInputSections, languagesMap, errorMessage}: Props) {
  const {isOpen, onOpen, onOpenChange, onClose} = useDisclosure();

 return (
     <>
       <div key={id} className="flex flex-col gap-3">
         <Divider/>
         <div className="flex flex-col-reverse justify-between gap-3 md:flex-row md:gap-5">
           <ImageInput id={id} setImageInputSections={setImageInputSections} isInvalid={!!(errorMessage && imageInputSections[id].images.length === 0)}/>
           <div className="flex justify-between items-center md:justify-start md:flex-col md:gap-5">
             <Select
                 className="w-36"
                 label="Language"
                 placeholder="Enter chapter language"
                 name="chapterLanguage"
                 disallowEmptySelection
                 defaultSelectedKeys={[languagesMap[0].key]}
                 selectedKeys={[imageInputSections[id].language]}
                 onSelectionChange={value => {
                   // Changing the language on key id
                   if (value === "all") return;
                   const key = Array.from(value.keys())[0];
                   setImageInputSections({...imageInputSections, [id]: {...imageInputSections[id], language: key as ChapterLanguage}})
                 }}
             >
               {languagesMap.map(({key, value}) =>
                   <SelectItem key={key} value={key}>
                     {value}
                   </SelectItem>
               )}
             </Select>
             {imageInputSections[id].images.length > 0 &&
                 <Button
                  onClick={onOpen}
                 >
                     Preview
                 </Button>}
             {Object.keys(imageInputSections).length > 1 &&
                 <Button
                     color="danger"
                     radius="full"
                     isIconOnly
                     variant="bordered"
                     onClick={() => {
                       delete imageInputSections[id];
                       setImageInputSections({...imageInputSections})
                     }}
                 >
                     <FaTrashAlt />
                 </Button>}
           </div>
         </div>
         {errorMessage
             && imageInputSections[id].images.length === 0
             && <div className="text-tiny text-danger">{errorMessage}</div>}
         <Modal
             size="full"
             scrollBehavior="outside"
             isOpen={isOpen}
             onClose={onClose}
             onOpenChange={onOpenChange}
             classNames={{
               base: "bg-transparent my-0 static",
               closeButton: "z-20 fixed text-xl right-5 top-5",
             }}
         >
           <ModalContent>
             {(onClose) => (
                 <>
                   <ModalBody className="flex flex-col items-center gap-0" onClick={onClose}>
                     {imageInputSections[id].images.map(image =>
                         <Image
                             onClick={(e) => e.stopPropagation()}
                             radius="none"
                             key={image.name}
                             src={URL.createObjectURL(image)}
                             style={{width: "700px"}}
                             alt={`Image ${image.name}`}
                         />
                     )}
                   </ModalBody>
                 </>
             )}
           </ModalContent>
         </Modal>
       </div>

     </>
 );
};