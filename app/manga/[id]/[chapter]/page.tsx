import Image from "next/image";
import {notFound} from "next/navigation";
import createApolloClient from "@/app/lib/apollo-client";
import {GET_CHAPTER} from "@/app/lib/graphql/queries";
import PrevButton from "@/app/manga/[id]/[chapter]/PrevButton";
import NextButton from "@/app/manga/[id]/[chapter]/NextButton";

interface Props{
  params: {id: string, chapter: string}
}

export default async function Page({params: {chapter: chapterId, id}}: Props) {
  const client = createApolloClient();
  const {data, error} = await client.query({query: GET_CHAPTER, variables: {id: chapterId}});

  if (error) throw new Error("Unexpected error");

  const {chapter} = data;

  if (chapter.mangaId !== id) notFound();

  return (
    <div className="flex flex-col gap-3">
      <div className="flex justify-between items-center mx-2">
        <h2 className="text-xl">Chapter {chapter.number}</h2>
        <div className="flex gap-2">
          <PrevButton isFirst={chapter.isFirst} prevChapterId={chapter.prevChapter?.id} mangaId={id}/>
          <NextButton isLast={chapter.isLast} mangaId={id} nextChapterId={chapter.nextChapter?.id}/>
        </div>
      </div>
      <div className="flex flex-col items-center">
        {chapter.images.map(img =>
            <Image key={img.src} src={"/manga/" + img.src} alt={img.src} width={img.width} height={img.height}/>
        )}
      </div>
      <div className="flex justify-between mx-2">
        <PrevButton isFirst={chapter.isFirst} prevChapterId={chapter.prevChapter?.id} mangaId={id}/>
        <NextButton isLast={chapter.isLast} mangaId={id} nextChapterId={chapter.nextChapter?.id}/>
      </div>
    </div>

  );
};