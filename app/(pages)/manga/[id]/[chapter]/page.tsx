import {notFound} from "next/navigation";
import createApolloClient from "@/app/lib/utils/apollo-client";
import {GET_CHAPTER, GET_NAVBAR_CHAPTER} from "@/app/lib/graphql/queries";
import ChapterImage from "@/app/(pages)/manga/[id]/[chapter]/_components/ChapterImage";
import {transformChapter} from "@/app/(pages)/manga/[id]/[chapter]/_utils/transformChapter";
import NavbarChapter from "@/app/_components/navbar/NavbarChapter";
import ChapterBookmarkFetch from "@/app/(pages)/manga/[id]/[chapter]/_components/ChapterBookmarkFetch";
import {cookies} from "next/headers";

interface Props{
  params: {id: string, chapter: string}
}

export const revalidate = 4;

export default async function Page({params: {chapter: chapterId, id: mangaId}}: Props) {
  const client = createApolloClient();
  const {data, error} = await client.query({query: GET_CHAPTER, variables: {id: chapterId}});
  const {data: navbarData} = await client.query({
    query: GET_NAVBAR_CHAPTER,
    variables: {mangaId, chapterId},
    context: {headers: {cookie: cookies()}}
  });

  if (error) throw new Error("Unexpected error");

  const chapter = transformChapter(data.chapter);

  if (chapter.mangaId !== mangaId) notFound();

  return (
      <div>
        <NavbarChapter data={navbarData}/>
        <div className="flex flex-col gap-3">
          <div className="flex flex-col items-center">
            {chapter.images.map((img, index) =>
                <ChapterImage key={index} image={img} priority={index <= 1}/>
            )}
          </div>
        </div>
        <ChapterBookmarkFetch chapterId={chapter.id} chapterNumber={chapter.number} bookmarkedChapterNumber={navbarData.manga?.bookmarkedChapter?.number}/>
      </div>
  );
};