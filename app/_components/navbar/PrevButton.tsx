import {Button, Link} from "@heroui/react";
import {FaChevronLeft, FaChevronRight} from "react-icons/fa";


interface Props{
  isFirst: boolean,
  href: string
}

export default function PrevButton({isFirst, href}: Props) {

 return (
     <Button
         variant="light"
         isDisabled={isFirst}
         isIconOnly
         radius="none"
         className="h-full md:w-[--navbar-height]"
         href={href}
         as={Link}
     >
       <FaChevronLeft />
     </Button>
 );
};