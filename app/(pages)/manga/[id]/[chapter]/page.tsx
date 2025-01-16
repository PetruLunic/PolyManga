import {notFound} from "next/navigation";
import createApolloClient from "@/app/lib/utils/apollo-client";
import {GET_CHAPTER, GET_CHAPTER_METADATA, GET_MANGA_METADATA, GET_NAVBAR_CHAPTER} from "@/app/lib/graphql/queries";
import ChapterImage from "@/app/(pages)/manga/[id]/[chapter]/_components/ChapterImage";
import {transformChapter} from "@/app/(pages)/manga/[id]/[chapter]/_utils/transformChapter";
import NavbarChapter from "@/app/_components/navbar/NavbarChapter";
import ChapterBookmarkFetch from "@/app/(pages)/manga/[id]/[chapter]/_components/ChapterBookmarkFetch";
import {cookies} from "next/headers";
import {Metadata} from "next";
import {domain, seoMetaData, siteName, type} from "@/app/lib/seo/metadata";
import {ChapterLanguageFull} from "@/app/types";
import {getMangaIdFromURL, mangaTitleAndIdToURL} from "@/app/lib/utils/URLFormating";

export async function generateMetadata({params}: Props): Promise<Metadata> {
  const {id, chapter: chapterId} = await params;

  const client = createApolloClient();
  const {data: {chapter}} = await client.query({
    query: GET_CHAPTER_METADATA, variables: {id: chapterId}
  })

  if (!chapter) return seoMetaData.manga;

  return {
    title: `${chapter.manga.title} read ${chapter.title.toLowerCase()} | ${siteName}`,
    description: `${chapter.manga.title} read ${chapter.title.toLowerCase()} for free in ${chapter.languages.map(lang => ChapterLanguageFull[lang]).join(", ").toLowerCase()}`,
    keywords: `${chapter.manga.title}, ${chapter.number}, ${chapter.title}, read manga in ${chapter.languages.map(lang => ChapterLanguageFull[lang]).join(", ").toLowerCase()}, best manga, free manga, read manga online, popular manga`,

    openGraph: {
      title: `${chapter.manga.title} read ${chapter.title} | ${siteName}`,
      description: `${chapter.manga.title} read ${chapter.title} for free`,
      url: `${domain}/manga/${mangaTitleAndIdToURL(chapter.manga.title, id)}/${chapterId}`,
      type,
      images: [chapter.manga.image],
    },
  }
}

interface Props{
  params: Promise<{id: string, chapter: string}>
}

export const revalidate = 3600;

export default async function Page({params}: Props) {
  const {id: mangaId, chapter: chapterId} = await params;
  const client = createApolloClient();
  const {data, error} = await client.query({query: GET_CHAPTER, variables: {id: chapterId}});
  const {data: navbarData} = await client.query({
    query: GET_NAVBAR_CHAPTER,
    variables: {mangaId, chapterId},
    context: {headers: {cookie: await cookies()}}
  });

  if (error) throw new Error("Unexpected error");

  const chapter = transformChapter(data.chapter);

  if (chapter.mangaId !== getMangaIdFromURL(mangaId)) notFound();

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