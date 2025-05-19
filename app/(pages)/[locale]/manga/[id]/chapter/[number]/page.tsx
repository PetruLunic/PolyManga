import {GET_CHAPTER, GET_CHAPTER_METADATA, GET_STATIC_CHAPTERS} from "@/app/lib/graphql/queries";
import {Metadata} from "next";
import {domain, seoMetaData, siteName, type} from "@/app/lib/seo/metadata";
import {ChapterLanguageFull} from "@/app/types";
import {queryGraphql} from "@/app/lib/utils/graphqlUtils";
import {locales} from "@/i18n/routing";
import {getTranslations, setRequestLocale} from "next-intl/server";
import {Suspense} from "react";
import {notFound} from "next/navigation";
import {transformMetadata} from "@/app/lib/utils/transformMetadata";
import ChapterContent from "@/app/(pages)/[locale]/manga/[id]/chapter/[number]/_components/ChapterContent";
import NavigationButtons from "@/app/(pages)/[locale]/manga/[id]/chapter/[number]/_components/NavigationButtons";
import ChapterBookmarkFetch from "@/app/(pages)/[locale]/manga/[id]/chapter/[number]/_components/ChapterBookmarkFetch";
import NavbarChapter from "@/app/_components/navbar/NavbarChapter";

export async function generateMetadata({params}: Props): Promise<Metadata> {
  const {id, number: numberString, locale} = await params;
  const number = Number.parseFloat(numberString);

  if (Number.isNaN(number)) return await seoMetaData.manga(locale);

  const {data} = await queryGraphql(GET_CHAPTER_METADATA, {slug: id, number, locale});

  if (!data?.chapter) return await seoMetaData.manga(locale);
  const {chapter} = data;
  const {manga} = chapter;

  const t = await getTranslations({
    locale,
    namespace: "pages.chapter.metadata"
  });

  const languagesList = chapter.languages
    .map(lang => ChapterLanguageFull[lang])
    .join(", ")
    .toLowerCase();

  return {
    title: t("title", {
      manga: manga.title,
      chapter: chapter.title.toLowerCase(),
      siteName
    }),
    description: t("description", {
      manga: manga.title,
      chapter: chapter.title.toLowerCase(),
      languages: languagesList
    }),
    keywords: t("keywords", {
      manga: manga.title,
      number: chapter.number,
      chapter: chapter.title.toLowerCase(),
      languages: languagesList
    }),
    metadataBase: domain ? new URL(domain) : null,
    openGraph: {
      title: t("openGraph.title", {
        manga: manga.title,
        chapter: chapter.title,
        siteName
      }),
      description: t("openGraph.description", {
        manga: manga.title,
        chapter: chapter.title
      }),
      url: `${domain}/${locale}/manga/${id}/chapter/${number}`,
      type,
      images: [process.env.NEXT_PUBLIC_BUCKET_URL + chapter.manga.image],
      siteName
    },
  };
}

export const dynamicParams = true;

export async function generateStaticParams(): Promise<Params[]> {
  if (process.env.SKIP_GENERATE_STATIC_PARAMS === 'true') return [];
  const {data} = await queryGraphql(GET_STATIC_CHAPTERS);

  if (!data?.mangas) return [];

  // Process each manga separately and then flatten results
  return locales.flatMap(locale =>
    data.mangas.flatMap(manga => {
      // Get chapters for this manga that support the current locale
      const mangaChapters = manga.chapters
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

  const {data} = await queryGraphql(GET_CHAPTER, {number, slug: id, locale});
  if (!data) notFound();

  const chapter = data.chapter;
  const metadata = transformMetadata(chapter.metadata)

  return (
    <>
      <NavbarChapter data={JSON.parse(JSON.stringify(data))}/>
      <div className="flex flex-col gap-6 min-h-screen pb-10">
        <Suspense>
          <ChapterContent
            chapter={JSON.parse(JSON.stringify(chapter))}
            metadata={JSON.parse(JSON.stringify(metadata))}
          />
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