import {notFound} from "next/navigation";
import createApolloClient from "@/app/lib/utils/apollo-client";
import {GET_CHAPTER} from "@/app/lib/graphql/queries";
import ChapterImage from "@/app/(pages)/manga/[id]/[chapter]/_components/ChapterImage";
import {transformChapter} from "@/app/(pages)/manga/[id]/[chapter]/_utils/transformChapter";

interface Props{
  params: {id: string, chapter: string}
}

export default async function Page({params: {chapter: chapterId, id}}: Props) {
  const client = createApolloClient();
  const {data, error} = await client.query({query: GET_CHAPTER, variables: {id: chapterId}});

  if (error) throw new Error("Unexpected error");

  const chapter = transformChapter(data.chapter);

  if (chapter.mangaId !== id) notFound();

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-col items-center">
        {chapter.images.map((img, index) =>
            <ChapterImage key={index} image={img}/>
        )}
      </div>
    </div>
  );
};