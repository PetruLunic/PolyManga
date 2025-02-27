import {notFound} from "next/navigation";
import {GET_CHAPTER, GET_CHAPTER_METADATA, GET_NAVBAR_CHAPTER, GET_STATIC_CHAPTERS} from "@/app/lib/graphql/queries";
import {transformChapter} from "@/app/(pages)/[locale]/manga/[id]/chapter/[number]/_utils/transformChapter";
import NavbarChapter from "@/app/_components/navbar/NavbarChapter";
import ChapterBookmarkFetch from "@/app/(pages)/[locale]/manga/[id]/chapter/[number]/_components/ChapterBookmarkFetch";
import {Metadata} from "next";
import {domain, seoMetaData, siteName, type} from "@/app/lib/seo/metadata";
import {ChapterLanguageFull, LocaleType} from "@/app/types";
import {queryGraphql} from "@/app/lib/utils/graphqlUtils";
import ChapterImagesList from "@/app/_components/ChapterImagesList";
import {extractChapterTitle, extractMangaTitle} from "@/app/lib/utils/extractionUtils";
import {locales} from "@/i18n/routing";
import {getTranslations} from "next-intl/server";

export async function generateMetadata({params}: Props): Promise<Metadata> {
  const {id, number: numberString, locale} = await params;
  const number = Number.parseFloat(numberString);

  if (Number.isNaN(number)) return await seoMetaData.manga(locale);

  const {data} = await queryGraphql(GET_CHAPTER_METADATA, {slug: id, number});

  if (!data?.chapter) return await seoMetaData.manga(locale);
  const {chapter} = data;

  const t = await getTranslations({
    locale,
    namespace: "pages.chapter.metadata"
  });

  const chapterTitle = extractChapterTitle(chapter.versions, locale as LocaleType);
  const chapterTitleLower = chapterTitle?.toLowerCase();
  const mangaTitle = extractMangaTitle(chapter.manga.title, locale as LocaleType);
  const languagesList = chapter.languages
    .map(lang => ChapterLanguageFull[lang])
    .join(", ")
    .toLowerCase();

  return {
    title: t("title", {
      manga: mangaTitle,
      chapter: chapterTitleLower,
      siteName
    }),
    description: t("description", {
      manga: mangaTitle,
      chapter: chapterTitleLower,
      languages: languagesList
    }),
    keywords: t("keywords", {
      manga: mangaTitle,
      number: chapter.number,
      chapter: chapterTitleLower,
      languages: languagesList
    }),
    openGraph: {
      title: t("openGraph.title", {
        manga: mangaTitle,
        chapter: chapterTitle,
        siteName
      }),
      description: t("openGraph.description", {
        manga: mangaTitle,
        chapter: chapterTitle
      }),
      url: `${domain}/${locale}/manga/${id}/chapter/${number}`,
      type,
      images: [chapter.manga.image],
    },
  };
}

export const dynamicParams = true;

export async function generateStaticParams(): Promise<Params[]> {
  const {data} = await queryGraphql(GET_STATIC_CHAPTERS);

  if (!data?.mangas) return [];

  return locales.map(locale =>
    data.mangas.map(manga =>
      manga.chapters
        // Generate the chapter page if it supports the selected locale
        .filter(chapter => chapter.languages.some(lang => lang.toLowerCase() === locale))
        .map(chapter => ({
        id: manga.slug,
        number: chapter.number.toString(),
        locale
      })
    )
  )).flat(2)
}

interface Params {
  id: string,
  number: string,
  locale: string
}

interface Props{
  params: Promise<Params>
}

// 6 hours revalidation
export const revalidate = 21600;

export default async function Page({params}: Props) {
  const {id: mangaId, number: numberString} = await params;
  const number = Number.parseFloat(numberString);
  if (Number.isNaN(number)) notFound();

  const [
    {data: chapterData},
    {data: navbarData}
  ] = await Promise.all([
    queryGraphql(GET_CHAPTER, {number, slug: mangaId}),
    queryGraphql(GET_NAVBAR_CHAPTER, {slug: mangaId, number})
  ])
  if (!chapterData || !navbarData) notFound();

  const chapter = transformChapter(chapterData.chapter);

  return (
      <div>
        <NavbarChapter data={JSON.parse(JSON.stringify(navbarData))}/>
        <div className="flex flex-col gap-3 min-h-screen">
          <ChapterImagesList images={JSON.parse(JSON.stringify(chapter.images))} />
        </div>
        <ChapterBookmarkFetch slug={mangaId} number={chapter.number}/>
      </div>
  );
};