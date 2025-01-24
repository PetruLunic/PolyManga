import UploadChapterForm from "@/app/(pages)/manga/[id]/upload/_components/UploadChapterForm";
import {GET_MANGA_CHAPTER_UPLOAD} from "@/app/lib/graphql/queries";
import createApolloClient from "@/app/lib/utils/apollo-client";
import {notFound} from "next/navigation";
import {getMangaIdFromURL} from "@/app/lib/utils/URLFormating";

interface Props {
  params: Promise<{
    id: string
  }>
}

export const revalidate = 10;

export default async function Page({params}: Props) {
  const {id} = await params;
  const client = createApolloClient();
  const {data} = await client.query({query: GET_MANGA_CHAPTER_UPLOAD,
    variables: {id}
  }).catch(() => notFound())

  return (
      <div className="flex flex-col gap-4">
        <h2 className="text-xl">Create Chapter</h2>
        <UploadChapterForm mangaId={getMangaIdFromURL(id)} latestChapterNumber={data.manga?.latestChapter?.number}/>
      </div>
  )
};