import {GrFormNext} from "react-icons/gr";
import {Button, Link} from "@nextui-org/react";


interface Props{
  nextChapterId?: string,
  isLast: boolean,
  mangaId: string
}

export default async function NextButton({isLast, nextChapterId, mangaId}: Props) {

 return (
     <Button
         color="primary"
         endContent={<GrFormNext />}
         isDisabled={isLast}
         href={`${process.env.NEXT_PUBLIC_SITE_URL}/manga/${mangaId}/${nextChapterId}`}
         as={Link}
     >Next</Button>
 );
};