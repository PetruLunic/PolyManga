import createApolloClient from "@/app/lib/utils/apollo-client";
import {GET_CHAPTERS} from "@/app/lib/graphql/queries";
import ChapterListEdit from "@/app/_components/ChapterListEdit";
import {notFound} from "next/navigation";

export const revalidate = 5;

interface Props{
  params: Promise<{id: string}>
}

export default async function Page({params}: Props) {
  const {id: slug} = await params;
  const client = createApolloClient();
  const {data} = await client.query({query: GET_CHAPTERS, variables: {slug}});

  if (!data.manga) return notFound();

 return (
  <div className="flex flex-col gap-4">
    <h2 className="text-lg">Edit chapters</h2>
    <ChapterListEdit chapters={data.manga?.chapters} slug={slug}/>
  </div>
 );
};