import createApolloClient from "@/app/lib/utils/apollo-client";
import {GET_CHAPTERS} from "@/app/lib/graphql/queries";
import ChapterListEdit from "@/app/_components/ChapterListEdit";

export const revalidate = 5000;

interface Props{
  params: {id: string}
}

export default async function Page({params: {id}}: Props) {
  const client = createApolloClient();
  const {data} = await client.query({query: GET_CHAPTERS, variables: {id}});

 return (
  <div>
    <ChapterListEdit chapters={data.manga?.chapters} mangaId={id}/>
  </div>
 );
};