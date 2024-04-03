import {GrFormNext} from "react-icons/gr";
import {Button, Link} from "@nextui-org/react";
import {FaChevronRight} from "react-icons/fa";


interface Props{
  nextChapterId?: string,
  isLast: boolean,
  mangaId: string
}

export default function NextButton({isLast, nextChapterId, mangaId}: Props) {

 return (
   <Button
       variant="light"
       isDisabled={isLast}
       isIconOnly
       radius="none"
       className="h-full md:w-[--navbar-height]"
       href={`/manga/${mangaId}/${nextChapterId}`}
       as={Link}
   >
     <FaChevronRight />
   </Button>
 );
};