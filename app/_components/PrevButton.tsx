import {Button, Link} from "@nextui-org/react";
import {FaChevronLeft, FaChevronRight} from "react-icons/fa";


interface Props{
  isFirst: boolean,
  prevChapterId?: string
  mangaId: string
}

export default function PrevButton({isFirst, prevChapterId, mangaId}: Props) {

 return (
     <Button
         variant="light"
         isDisabled={isFirst}
         isIconOnly
         radius="none"
         className="h-full md:w-[--navbar-height]"
         href={`/manga/${mangaId}/${prevChapterId}`}
         as={Link}
     >
       <FaChevronLeft />
     </Button>
 );
};