import createApolloClient from "@/app/lib/utils/apollo-client";
import {GET_MANGA_EDIT} from "@/app/lib/graphql/queries";
import EditMangaForm from "@/app/(pages)/manga/[id]/edit/EditMangaForm";
import {notFound} from "next/navigation";

interface Props{
  params: {id: string}
}

export const revalidate = 10;

export default async function Page({params: {id}}: Props) {
  const client = createApolloClient();
  const {data} = await client.query({query: GET_MANGA_EDIT, variables: {id}})
      .catch(() => notFound());

  if (!data.manga) notFound();

  return (
      <EditMangaForm manga={data.manga}/>
  );
};