import {GrFormPrevious} from "react-icons/gr";
import {Button, Link} from "@nextui-org/react";


interface Props{
  isFirst: boolean,
  prevChapterId?: string
  mangaId: string
}

export default async function PrevButton({isFirst, prevChapterId, mangaId}: Props) {

 return (
     <Button
         color="primary"
         startContent={<GrFormPrevious />}
         as={Link}
         isDisabled={isFirst}
         href={`${process.env.NEXT_PUBLIC_SITE_URL}/manga/${mangaId}/${prevChapterId}`}
     >Prev</Button>
 );
};