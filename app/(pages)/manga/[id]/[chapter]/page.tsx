import {notFound} from "next/navigation";
import createApolloClient from "@/app/lib/utils/apollo-client";
import {GET_CHAPTER, GET_CHAPTER_METADATA, GET_NAVBAR_CHAPTER, GET_STATIC_CHAPTERS} from "@/app/lib/graphql/queries";
import ChapterImage from "@/app/(pages)/manga/[id]/[chapter]/_components/ChapterImage";
import {transformChapter} from "@/app/(pages)/manga/[id]/[chapter]/_utils/transformChapter";
import NavbarChapter from "@/app/_components/navbar/NavbarChapter";
import ChapterBookmarkFetch from "@/app/(pages)/manga/[id]/[chapter]/_components/ChapterBookmarkFetch";
import {Metadata} from "next";
import {domain, seoMetaData, siteName, type} from "@/app/lib/seo/metadata";
import {ChapterLanguageFull} from "@/app/types";
import {getMangaIdFromURL, mangaTitleAndIdToURL} from "@/app/lib/utils/URLFormating";
import {queryGraphql} from "@/app/lib/utils/graphqlUtils";
import {Suspense} from "react";
import ChapterImagesList from "@/app/_components/ChapterImagesList";

export async function generateMetadata({params}: Props): Promise<Metadata> {
  const {id, chapter: chapterId} = await params;
  const {data} = await queryGraphql(GET_CHAPTER_METADATA, {id: chapterId});

  if (!data?.chapter) return seoMetaData.manga;
  const {chapter} = data;

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

export const dynamicParams = true;

export async function generateStaticParams(): Promise<{id: string, chapter: string}[]> {
  const {data} = await queryGraphql(GET_STATIC_CHAPTERS);

  if (!data?.mangas) return [];

  return data.mangas.map(manga =>
    manga.chapters.map(chapter => ({
      id: mangaTitleAndIdToURL(manga.title, manga.id),
      chapter: chapter.id
    }))
  ).flat();
}

interface Props{
  params: Promise<{id: string, chapter: string}>
}

// 6 hours revalidation
export const revalidate = 21600;

export default async function Page({params}: Props) {
  const {id: mangaId, chapter: chapterId} = await params;
  const [
    {data: chapterData},
    {data: navbarData}
  ] = await Promise.all([
    queryGraphql(GET_CHAPTER, {id: chapterId}),
    queryGraphql(GET_NAVBAR_CHAPTER, {mangaId, chapterId})
  ])

  if (!chapterData || !navbarData) notFound();

  const chapter = transformChapter(chapterData.chapter);

  if (chapter.mangaId !== getMangaIdFromURL(mangaId)) notFound();

  return (
      <div>
        <NavbarChapter data={JSON.parse(JSON.stringify(navbarData))}/>
        <div className="flex flex-col gap-3 min-h-screen">
          <ChapterImagesList images={JSON.parse(JSON.stringify(chapter.images))} />
        </div>
        <ChapterBookmarkFetch chapterId={chapter.id} chapterNumber={chapter.number}/>
      </div>
  );
};