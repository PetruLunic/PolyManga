import createApolloClient from "@/app/lib/utils/apollo-client";
import {GET_MANGA_EDIT} from "@/app/lib/graphql/queries";
import EditMangaForm from "@/app/(pages)/[locale]/manga/[id]/edit/EditMangaForm";
import {notFound} from "next/navigation";
import {getMangaIdFromURL} from "@/app/lib/utils/URLFormating";

interface Props{
  params: Promise<{id: string}>
}

export const revalidate = 10;

export default async function Page({params}: Props) {
  const {id} = await params;
  const client = createApolloClient();
  const {data} = await client.query({query: GET_MANGA_EDIT, variables: {id}})
      .catch(() => notFound());

  if (!data.manga) notFound();

  return (
      <EditMangaForm manga={JSON.parse(JSON.stringify(data.manga))}/>
  );
};