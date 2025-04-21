import {GET_CHAPTER_METADATA, GET_STATIC_CHAPTERS} from "@/app/lib/graphql/queries";
import {Metadata} from "next";
import {domain, seoMetaData, siteName, type} from "@/app/lib/seo/metadata";
import {ChapterLanguageFull, LocaleType} from "@/app/types";
import {queryGraphql} from "@/app/lib/utils/graphqlUtils";
import {extractChapterTitle, extractMangaTitle} from "@/app/lib/utils/extractionUtils";
import {locales} from "@/i18n/routing";
import {getTranslations, setRequestLocale} from "next-intl/server";
import {Suspense} from "react";
import {ChapterContentFetch} from "@/app/(pages)/[locale]/manga/[id]/chapter/[number]/_components/ChapterContentFetch";
import {
  ChapterNavbarWrapper
} from "@/app/(pages)/[locale]/manga/[id]/chapter/[number]/_components/ChapterNavbarWrapper";
import {notFound} from "next/navigation";
import {Spinner} from "@heroui/react";
// import ChapterNavbarSkeleton
//   from "@/app/(pages)/[locale]/manga/[id]/chapter/[number]/_components/ChapterNavbarSkeleton";
// import Loading from "@/app/(pages)/[locale]/loading";

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

  // Process each manga separately and then flatten results
  return locales.flatMap(locale =>
    data.mangas.flatMap(manga => {
      // Get chapters for this manga that support the current locale
      const mangaChapters = manga.chapters
        .filter(chapter => chapter.languages.some(lang => lang.toLowerCase() === locale))
        .map(chapter => ({
          id: manga.slug,
          number: chapter.number.toString(),
          locale
        }));

      // Apply first and last 2 chapters PER MANGA
      if (mangaChapters.length >= 4) {
        return [
          ...mangaChapters.slice(0, 2),                   // First 2 chapters
          ...mangaChapters.slice(mangaChapters.length - 2)  // Last 2 chapters
        ];
      } else {
        return mangaChapters;  // If fewer than 4 chapters, keep all
      }
    })
  );
}

interface Params {
  id: string,
  number: string,
  locale: string
}

interface Props {
  params: Promise<Params>
}

// 6 hours revalidation
export const revalidate = 21600;

export default async function Page({params}: Props) {
  const {locale, id, number: numberString} = await params;
  setRequestLocale(locale);

  const number = Number.parseFloat(numberString);
  if (Number.isNaN(number)) notFound();

  return (
    <>
      <Suspense fallback={<Spinner />} key={id + numberString + "navbar"}>
        <ChapterNavbarWrapper id={id} number={number} />
      </Suspense>
      <Suspense fallback={<Spinner />} key={id + numberString + "content"}>
        <ChapterContentFetch id={id} number={number} />
      </Suspense>
    </>
  );
};