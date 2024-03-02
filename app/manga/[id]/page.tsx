import {getManga} from "@/app/lib/service/mangaAPI";
import {Button, Card, CardBody, Image} from "@nextui-org/react";
import {FaStar} from "react-icons/fa";
import {IoBookmarks} from "react-icons/io5";


interface Props{
  params: {id: string}
}

export default async function Page({params: {id}}: Props) {
  const manga = await getManga(id);

  return (
  <div className="md:px-4">
    <Card isBlurred>
      <CardBody className="p-2 md:p-4">
        <div className="flex flex-col items-center md:flex-row gap-4">
          <div className="flex flex-col gap-3 w-full items-center">
            <Image src={"/manga/" + manga.image} className="w-[250px]" alt={manga.title} isBlurred/>
            <Button color="primary" className="w-full" startContent={<IoBookmarks />}>
              Bookmark
            </Button>
            <div className="flex gap-2">
              <div className="flex gap-1 items-center">
                <FaStar color="orange"/>
                {manga.rating?.value}
              </div>

            </div>
          </div>
          <div className="grow-0">
            <h2 className="text-xl font-bold text-center md:text-left">
              {manga.title}
            </h2>
            <p className="text-default-600 text-sm h-32 overflow-scroll md:h-auto md:overflow-auto">
              {manga.description}
            </p>
          </div>
        </div>
      </CardBody>
    </Card>
  </div>
 );
};