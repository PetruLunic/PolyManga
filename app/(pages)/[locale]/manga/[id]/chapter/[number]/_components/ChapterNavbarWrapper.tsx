import {queryGraphql} from "@/app/lib/utils/graphqlUtils";
import {GET_NAVBAR_CHAPTER} from "@/app/lib/graphql/queries";
import NavbarChapter from "@/app/_components/navbar/NavbarChapter";
import {notFound} from "next/navigation";

interface Props {
  id: string,
  number: number,
}

export async function ChapterNavbarWrapper({id, number}: Awaited<Props>) {
  const {data} = await queryGraphql(GET_NAVBAR_CHAPTER, {slug: id, number});
  if (!data) notFound();

  return (
    <NavbarChapter data={JSON.parse(JSON.stringify(data))}/>
  );
}