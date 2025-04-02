import {queryGraphql} from "@/app/lib/utils/graphqlUtils";
import {GET_CHAPTER} from "@/app/lib/graphql/queries";
import {transformChapter} from "@/app/(pages)/[locale]/manga/[id]/chapter/[number]/_utils/transformChapter";
import {Suspense} from "react";
import ChapterImagesList from "@/app/_components/ChapterImagesList";
import NavigationButtons from "@/app/(pages)/[locale]/manga/[id]/chapter/[number]/_components/NavigationButtons";
import ChapterBookmarkFetch from "@/app/(pages)/[locale]/manga/[id]/chapter/[number]/_components/ChapterBookmarkFetch";
import {notFound} from "next/navigation";

interface Props {
  id: string,
  number: number,
}

export async function ChapterContent({id, number}: Props) {
  const {data} = await queryGraphql(GET_CHAPTER, {number, slug: id});
  if (!data) notFound();

  const chapter = transformChapter(data.chapter);

  return (
    <>
      <div className="flex flex-col gap-6 min-h-screen pb-10">
        <Suspense>
          <ChapterImagesList images={JSON.parse(JSON.stringify(chapter.images))}/>
        </Suspense>
        <NavigationButtons
          prevChapter={chapter.prevChapter?.number}
          nextChapter={chapter.nextChapter?.number}
          mangaId={id}
        />
      </div>
      <ChapterBookmarkFetch slug={id} number={chapter.number}/>
    </>
  );
}