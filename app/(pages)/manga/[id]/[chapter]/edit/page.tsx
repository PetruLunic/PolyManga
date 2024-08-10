import createApolloClient from "@/app/lib/utils/apollo-client";
import {GET_CHAPTER_EDIT} from "@/app/lib/graphql/queries";
import {notFound} from "next/navigation";
import EditChapterForm from "@/app/(pages)/manga/[id]/[chapter]/edit/_components/EditChapterForm";

interface Props{
  params: {chapter: string}
}

export default async function Page({params: {chapter}}: Props) {
  const client = createApolloClient();
  const {data} = await client.query({query: GET_CHAPTER_EDIT,
    variables: {id: chapter}
  }).catch(() => notFound())

 return (
  <div className="flex flex-col gap-4">
    <h2>Edit Chapter</h2>
    <EditChapterForm chapter={data.chapter}/>
  </div>
 );
};