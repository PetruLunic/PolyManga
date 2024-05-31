import UploadChapterForm from "@/app/manga/[id]/upload/_components/UploadChapterForm";
import {useQuery} from "@apollo/client";
import {GET_MANGA_CHAPTER_UPLOAD} from "@/app/lib/graphql/queries";
import createApolloClient from "@/app/lib/utils/apollo-client";
import {notFound} from "next/navigation";

interface Props {
  params: {
    id: string
  }
}

export const revalidate = 10;

export default async function Page({params: {id}}: Props) {
  const client = createApolloClient();
  const {data} = await client.query({query: GET_MANGA_CHAPTER_UPLOAD,
    variables: {id}
  })

  return (
      <div className="flex flex-col gap-4">
        <h2 className="text-xl">Create Chapter</h2>
        <UploadChapterForm mangaId={id} latestChapterNumber={data.manga?.latestChapter?.number}/>
      </div>
  )
};