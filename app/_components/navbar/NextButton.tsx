import {Button, Link} from "@heroui/react";
import {FaChevronRight} from "react-icons/fa";


interface Props{
  isLast: boolean,
  href: string
}

export default function NextButton({isLast, href}: Props) {

 return (
   <Button
       variant="light"
       isDisabled={isLast}
       isIconOnly
       radius="none"
       className="h-full md:w-[--navbar-height]"
       href={href}
       as={Link}
   >
     <FaChevronRight />
   </Button>
 );
};