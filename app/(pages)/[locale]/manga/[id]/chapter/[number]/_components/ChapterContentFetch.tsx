import {queryGraphql} from "@/app/lib/utils/graphqlUtils";
import {GET_CHAPTER} from "@/app/lib/graphql/queries";
import {Suspense} from "react";
import NavigationButtons from "@/app/(pages)/[locale]/manga/[id]/chapter/[number]/_components/NavigationButtons";
import ChapterBookmarkFetch from "@/app/(pages)/[locale]/manga/[id]/chapter/[number]/_components/ChapterBookmarkFetch";
import {notFound} from "next/navigation";
import ChapterContent from "@/app/(pages)/[locale]/manga/[id]/chapter/[number]/_components/ChapterContent";
import {transformMetadata} from "@/app/lib/utils/transformMetadata";

interface Props {
  id: string,
  number: number,
  locale: string
}

export async function ChapterContentFetch({id, number, locale}: Props) {
  const {data} = await queryGraphql(GET_CHAPTER, {number, slug: id, locale});
  if (!data) notFound();

  const chapter = data.chapter;
  const metadata = transformMetadata(chapter.metadata)

  return (
    <>

      <div className="flex flex-col gap-6 min-h-screen pb-10">
        <Suspense>
          <ChapterContent chapter={JSON.parse(JSON.stringify(chapter))} metadata={JSON.parse(JSON.stringify(metadata))}/>
        </Suspense>
        <NavigationButtons
          prevChapter={chapter.prevChapter?.number}
          nextChapter={chapter.nextChapter?.number}
          mangaId={id}
        />
      </div>
      <ChapterBookmarkFetch slug={id} number={chapter.number} locale={locale}/>
    </>
  );
}