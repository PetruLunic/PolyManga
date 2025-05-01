import {Button, Card, CardBody, Image, Divider} from "@heroui/react";
import {IoBookmarksOutline, IoEyeOutline} from "react-icons/io5";
import {CHAPTERS_LIST, GET_MANGA, GET_MANGA_METADATA, GET_STATIC_MANGAS} from "@/app/lib/graphql/queries";
import BookmarkButton from "@/app/(pages)/[locale]/manga/[id]/_components/BookmarkButton";
import LikeButton from "@/app/(pages)/[locale]/manga/[id]/_components/LikeButton";
import RatingButton from "@/app/(pages)/[locale]/manga/[id]/_components/RatingButton";
import IncrementViews from "@/app/(pages)/[locale]/manga/[id]/_components/IncrementViews";
import MangaSettingsDropdown from "@/app/(pages)/[locale]/manga/[id]/_components/MangaSettingsDropdown";
import {Metadata} from "next";
import {domain, seoMetaData, siteName, type} from "@/app/lib/seo/metadata";
import {formatNumber} from "@/app/lib/utils/formatNumber";
import {queryGraphql} from "@/app/lib/utils/graphqlUtils";
import ContinueReadingButton from "@/app/_components/ContinueReadingButton";
import {notFound} from "next/navigation";
import {getTranslations, setRequestLocale} from "next-intl/server";
import {routing} from "@/i18n/routing";
import LinkButton from "@/app/_components/LinkButton";
import ChapterListWrapper from "@/app/_components/ChapterListWrapper";
import {getFragmentData} from "@/app/__generated__";

export async function generateMetadata({ params}: Props): Promise<Metadata> {
  const {id, locale} = await params;
  const {data} = await queryGraphql(GET_MANGA_METADATA, {id, locale});
  const mangaT = await getTranslations({locale, namespace: "common.manga"});
  const metadataT = await getTranslations({locale, namespace: "pages.mangaDetails.metadata"});

  if (!data?.manga) return await seoMetaData.manga(locale);

  const {manga} = data;

  const genres = manga.genres.slice(0, 4).map(genre => mangaT(`genres.${genre}`)).join(", ");

  return {
    title: `${manga.title} | ${siteName}`,
    description: manga.description.substring(0, 250), // Optimal meta description length,
    keywords: metadataT("keywords", {type: mangaT(`type.${manga?.type}`), genres}),

    openGraph: {
      title: manga.title,
      description: manga.description.substring(0, 160),
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
  const {data} = await queryGraphql(GET_MANGA, {id, offset: 0, limit: 30});

  if (!data) notFound();
  const mangaT = await getTranslations({locale, namespace:"common.manga"});
  const pageT = await getTranslations({locale, namespace:"pages.mangaDetails"});

  const {manga} = data;

  if (!manga) notFound();

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
                alt={manga.title}
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
              {manga.title}
            </h2>
            <Divider/>
            <div className="flex justify-center md:justify-start items-center text-sm flex-wrap">
              <RatingButton
                slug={id}
                mangaTitle={manga.title}
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
              {manga.description}
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
          <ChapterListWrapper
            slug={id}
            languages={manga.languages}
            initialChapters={JSON.parse(JSON.stringify(getFragmentData(CHAPTERS_LIST, manga.chapters)))}
          />
        </div>
      </CardBody>
    </Card>
    <IncrementViews mangaId={id}/>
  </div>
 );
};