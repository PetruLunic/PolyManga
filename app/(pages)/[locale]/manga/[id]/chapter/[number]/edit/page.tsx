import createApolloClient from "@/app/lib/utils/apollo-client";
import {GET_CHAPTER_EDIT} from "@/app/lib/graphql/queries";
import {notFound} from "next/navigation";
import EditChapterForm from "@/app/(pages)/[locale]/manga/[id]/chapter/[number]/edit/_components/EditChapterForm";

interface Props{
  params: Promise<{
    number: string,
    id: string,
    locale: string
  }>
}

export const revalidate = 0;

export default async function Page({params}: Props) {
  const {id: slug, number: numberStr, locale} = await params;
  const number = Number.parseFloat(numberStr);
  if (Number.isNaN(number)) notFound();

  const client = createApolloClient();
  const {data} = await client.query({query: GET_CHAPTER_EDIT,
    variables: {slug, number}
  }).catch(() => notFound())

 return (
  <div className="flex flex-col gap-4">
    <h2>Edit Chapter</h2>
    <EditChapterForm chapter={data.chapter}/>
  </div>
 );
};