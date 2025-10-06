import {queryGraphql} from "@/app/lib/utils/graphqlUtils";
import {GET_CHAPTER} from "@/app/lib/graphql/queries";
import {Suspense} from "react";
import {notFound} from "next/navigation";
import RedactorPage from "@/app/(pages)/[locale]/manga/[id]/chapter/[number]/edit/metadata/_components/RedactorPage";
import {transformMetadata} from "@/app/lib/utils/transformMetadata";

interface Props {
  params: Promise<{
    id: string,
    number: string,
    locale: string
  }>
}

export default async function Page({params}: Props) {
  const {number: numberString, id, locale} = await params;
  const number = Number.parseFloat(numberString);
  if (Number.isNaN(number)) notFound();

  const {data} = await queryGraphql(
    GET_CHAPTER,
    {number, slug: id, locale},
    { tags: [`chapter-${id}-${number}`, `chapter-${id}-${number}-${locale}`]}
  );
  if (!data) notFound();

  const chapter = data.chapter;
  const metadata = transformMetadata(chapter.metadata) ?? [];

  return (
    <>
      <div className="flex flex-col gap-6 min-h-screen pb-10">
        <Suspense>
          <RedactorPage chapter={JSON.parse(JSON.stringify(chapter))} metadata={JSON.parse(JSON.stringify(metadata))}/>
        </Suspense>
      </div>
    </>
  );
}