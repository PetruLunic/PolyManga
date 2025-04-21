import {Button, Card, CardBody, Image, Divider} from "@heroui/react";
import {IoBookmarksOutline, IoEyeOutline} from "react-icons/io5";
import {GET_MANGA, GET_MANGA_METADATA, GET_STATIC_MANGAS} from "@/app/lib/graphql/queries";
import ChapterList from "@/app/_components/ChapterList";
import BookmarkButton from "@/app/(pages)/[locale]/manga/[id]/_components/BookmarkButton";
import LikeButton from "@/app/(pages)/[locale]/manga/[id]/_components/LikeButton";
import RatingButton from "@/app/(pages)/[locale]/manga/[id]/_components/RatingButton";
import IncrementViews from "@/app/(pages)/[locale]/manga/[id]/_components/IncrementViews";
import MangaSettingsDropdown from "@/app/(pages)/[locale]/manga/[id]/_components/MangaSettingsDropdown";
import {Metadata} from "next";
import {domain, seoMetaData, siteName, type} from "@/app/lib/seo/metadata";
import {getMangaIdFromURL} from "@/app/lib/utils/URLFormating";
import {formatNumber} from "@/app/lib/utils/formatNumber";
import {queryGraphql} from "@/app/lib/utils/graphqlUtils";
import ContinueReadingButton from "@/app/_components/ContinueReadingButton";
import {notFound} from "next/navigation";
import {getTranslations, setRequestLocale} from "next-intl/server";
import {routing} from "@/i18n/routing";
import {extractMangaTitle} from "@/app/lib/utils/extractionUtils";
import {LocaleType} from "@/app/types";
import LinkButton from "@/app/_components/LinkButton";

export async function generateMetadata({ params}: Props): Promise<Metadata> {
  const {id, locale} = await params;
  const {data} = await queryGraphql(GET_MANGA_METADATA, {id});
  const mangaT = await getTranslations({locale, namespace: "common.manga"});
  const metadataT = await getTranslations({locale, namespace: "pages.mangaDetails.metadata"});

  if (!data?.manga) return await seoMetaData.manga(locale);

  const {manga} = data;
  const title = extractMangaTitle(manga?.title, locale as LocaleType);
  const description = manga.description.find(({language}) => locale === language.toLowerCase())?.value ?? manga.description[0].value;

  const genres = manga.genres.slice(0, 4).map(genre => mangaT(`genres.${genre}`)).join(", ");

  return {
    title: `${title} | ${siteName}`,
    description: description.substring(0, 250), // Optimal meta description length,
    keywords: metadataT("keywords", {type: mangaT(`type.${manga?.type}`), genres}),

    openGraph: {
      title,
      description: description.substring(0, 160),
      url: `${domain}/${locale}/manga/${id}`,
      type,
      images: [manga.image],
    },
  }
}

export const dynamicParams = true;

export async function generateStaticParams() {
  const {data} = await queryGraphql(GET_STATIC_MANGAS);

  if (!data?.mangas) return [];

  return routing.locales.map(locale =>
    data.mangas.map(manga => ({
      locale,
      id: manga.slug
   }))
  ).flat()
}

interface Props{
  params: Promise<{
    id: string,
    locale: string
  }>
}

// 2 hours revalidate
export const revalidate = 7200;

export default async function Page({params}: Props) {
  const {id, locale} = await params;
  setRequestLocale(locale);
  const {data} = await queryGraphql(GET_MANGA, {id});

  if (!data) notFound();
  const mangaT = await getTranslations({locale, namespace:"common.manga"});
  const pageT = await getTranslations({locale, namespace:"pages.mangaDetails"});

  const {manga} = data;

  if (!manga) notFound();

  const title = manga?.title.find(({language}) => locale === language.toLowerCase())?.value ?? manga?.title[0].value;
  const description = manga?.description.find(({language}) => locale === language.toLowerCase())?.value ?? manga?.description[0].value;

  return (
  <div className="md:px-4 flex flex-col gap-3">
    <Card isBlurred>
      <CardBody className="p-2 md:p-4 relative">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Left column of the card*/}
          <div className="flex flex-col gap-3 w-full items-center md:w-1/3">
            <MangaSettingsDropdown mangaId={id} className="absolute right-2 top-2"/>
            <Image
                className="w-[250px] h-[350px] object-cover"
                src={process.env.NEXT_PUBLIC_BUCKET_URL + manga?.image}
                width={250}
                height={350}
                alt={title}
                isBlurred
            />
            <ContinueReadingButton mangaSlug={id} firstChapterNumber={manga?.firstChapter?.number}/>
            <BookmarkButton slug={id}/>
            <div className="flex gap-3">
              <div className="flex gap-1 items-center">
                {pageT("status")}
                <LinkButton
                  href={`/manga/?status=${manga?.status}`}
                  variant="flat"
                  size="sm"
                  className="font-light text-sm"
                  as="span"
                >
                  {mangaT(`status.${manga?.status}`)}
                </LinkButton>
              </div>
              <div className="flex gap-1 items-center">
                {pageT("type")}
                <LinkButton
                  href={`/manga/?type=${manga?.type}`}
                  variant="flat"
                  size="sm"
                  className="font-light text-sm"
                >
                  {mangaT(`type.${manga?.type}`)}
                </LinkButton>
              </div>
            </div>
          </div>

          {/*Right column of the card*/}
          <div className="gap-3 flex flex-col w-full md:w-2/3">
            <h2 className="text-xl font-bold text-center md:text-left">
              {title}
            </h2>
            <Divider/>
            <div className="flex justify-center md:justify-start items-center text-sm flex-wrap">
              <RatingButton
                slug={getMangaIdFromURL(id)}
                mangaTitle={title}
                rating={manga?.stats.rating.value}
                nrVotes={manga?.stats.rating.nrVotes}
              />
              <Button
                  size="sm"
                  variant="light"
                  className="px-1 text-sm gap-1"
              >
                <IoEyeOutline size={22}/>
                {formatNumber(manga?.stats?.views ?? 0)}
              </Button>
              <LikeButton slug={id} nrLikes={manga?.stats.likes}/>
              <Button
                  size="sm"
                  variant="light"
                  className="px-1 text-sm gap-1"
              >
                <IoBookmarksOutline size={22}/>
                {formatNumber(manga?.stats?.bookmarks ?? 0)}
              </Button>
            </div>
            <p className="text-default-600 text-sm">
              {description}
            </p>
            <div className="flex flex-col gap-3">
              <div className="flex flex-col gap-1 md:flex-row md:gap-6">
                <div className="flex flex-col">
                  <p>{pageT("author")}</p>
                  <p className="text-gray-300 font-light">
                    {manga?.author}
                  </p>
                </div>
                <Divider className="hidden md:block" orientation="vertical"/>
                <div className="flex flex-col">
                  <p>{pageT("releasedOn")}</p>
                  <p className="text-gray-300 font-light">
                    {manga?.releaseYear}
                  </p>
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <p>{pageT("genres")}</p>
                <div className="flex flex-wrap gap-2">
                  {manga?.genres.map(genre =>
                    <LinkButton
                      key={genre}
                      href={`/manga/?genre=${genre}`}
                      variant="flat"
                      size="sm"
                      className="font-light text-sm"
                    >
                      {mangaT(`genres.${genre}`)}
                    </LinkButton>
                  )}
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <p>{pageT("languages")}</p>
                <div className="flex flex-wrap gap-2">
                  {manga?.languages.map(language =>
                      <div key={language} className="text-gray-300 font-light">
                        <LinkButton
                          key={language}
                          href={`/manga/?language=${language}`}
                          variant="flat"
                          size="sm"
                          className="font-light text-sm"
                        >
                          {language}
                        </LinkButton>
                      </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardBody>
    </Card>
    <Card isBlurred>
      <CardBody className="p-2 md:p-4">
        <div className="flex flex-col gap-4">
          <h3 className="text-center text-lg font-bold md:text-left">{pageT("chaptersList")}</h3>
            <ChapterList chapters={JSON.parse(JSON.stringify(manga?.chapters))} mangaSlug={id} languages={manga.languages}/>
        </div>
      </CardBody>
    </Card>
    <IncrementViews mangaId={id}/>
  </div>
 );
};

// import {GET_LATEST_UPLOADED_CHAPTERS, GET_MANGA_CARDS, MANGA_CARD} from "@/app/lib/graphql/queries";
// import {getFragmentData} from "@/app/__generated__";
// import PopularMangaList from "@/app/_components/PopularMangaList";
// import LatestChaptersList from "@/app/_components/LatestChaptersList";
// import {queryGraphql} from "@/app/lib/utils/graphqlUtils";
// import {LocaleType} from "@/app/types";
// import {locales} from "@/i18n/routing";
// import {setRequestLocale} from "next-intl/server";
//
// export const dynamicParams = true;
//
// // 1 hours revalidation
// export const revalidate = 7;
//
// interface Props {
//   params: Promise<{
//     locale: string,
//     id: string
//   }>
// }
//
// export default async function Page({params}: Props) {
//   const {locale, id} = await params;
//   console.log(`rendering ${id} page chapter`);
//   setRequestLocale(locale);
//   const [{data: dailyMangaData},
//     {data: weeklyMangaData},
//     {data: monthlyMangaData},
//     {data: latestChapters}] = await Promise.all([
//     queryGraphql(GET_MANGA_CARDS, {
//       limit: 10,
//       sortBy: "dailyViews"
//     }),
//     queryGraphql(GET_MANGA_CARDS, {
//       limit: 10,
//       sortBy: "weeklyViews"
//     }),
//     queryGraphql(GET_MANGA_CARDS, {
//       limit: 10,
//       sortBy: "monthlyViews"
//     }),
//     queryGraphql(GET_LATEST_UPLOADED_CHAPTERS, {
//       limit: 16
//     })
//   ]);
//
//   return (
//     <div className="flex flex-col gap-3 mx-3">
//       <PopularMangaList
//         locale={locale as LocaleType}
//         daily={JSON.parse(JSON.stringify(getFragmentData(MANGA_CARD, dailyMangaData?.mangas) ?? []))}
//         weekly={JSON.parse(JSON.stringify(getFragmentData(MANGA_CARD, weeklyMangaData?.mangas) ?? []))}
//         monthly={JSON.parse(JSON.stringify(getFragmentData(MANGA_CARD, monthlyMangaData?.mangas) ?? []))}
//       />
//       <LatestChaptersList initialChapters={JSON.parse(JSON.stringify(latestChapters?.latestChapters ?? []))}/>
//     </div>
//
//   );
// };