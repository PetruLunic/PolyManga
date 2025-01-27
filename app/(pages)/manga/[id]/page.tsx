import {Button, Card, CardBody, Image, Divider} from "@heroui/react";
import {IoBookmarksOutline, IoEyeOutline} from "react-icons/io5";
import {GET_MANGA, GET_MANGA_METADATA, GET_STATIC_MANGAS} from "@/app/lib/graphql/queries";
import Link from "next/link";
import ChapterList from "@/app/_components/ChapterList";
import BookmarkButton from "@/app/(pages)/manga/[id]/_components/BookmarkButton";
import LikeButton from "@/app/(pages)/manga/[id]/_components/LikeButton";
import RatingButton from "@/app/(pages)/manga/[id]/_components/RatingButton";
import IncrementViews from "@/app/(pages)/manga/[id]/_components/IncrementViews";
import MangaSettingsDropdown from "@/app/(pages)/manga/[id]/_components/MangaSettingsDropdown";
import {Metadata} from "next";
import {domain, seoMetaData, siteName, type} from "@/app/lib/seo/metadata";
import {getMangaIdFromURL, mangaTitleAndIdToURL} from "@/app/lib/utils/URLFormating";
import {formatNumber} from "@/app/lib/utils/formatNumber";
import {queryGraphql} from "@/app/lib/utils/graphqlUtils";
import ContinueReadingButton from "@/app/_components/ContinueReadingButton";
import {notFound} from "next/navigation";

export async function generateMetadata({ params}: Props): Promise<Metadata> {
  const {id} = await params;
  const {data} = await queryGraphql(GET_MANGA_METADATA, {id});

  if (!data?.manga) return seoMetaData.manga;

  const {manga} = data;

  // Getting first 4 genres and formating from "martial_arts" to "martial arts"
  const genres = manga.genres.slice(0, 4).map(genre => genre.replace("_", " "));

  return {
    title: `${manga.title} | ${siteName}`,
    description: manga.description.substring(0, 250), // Optimal meta description length,
    keywords: `manga, read manga, read ${manga.type}, best manga, free manga, read manga online, popular manga, ${genres.join(", ")}`,

    openGraph: {
      title: manga.title,
      description: manga.description.substring(0, 160),
      url: `${domain}/manga/${mangaTitleAndIdToURL(manga.title, id)}`,
      type,
      images: [manga.image],
    },
  }
}

export const dynamicParams = true;

export async function generateStaticParams() {
  const {data} = await queryGraphql(GET_STATIC_MANGAS);

  if (!data?.mangas) return [];

  return data.mangas.map(manga => ({
    id: mangaTitleAndIdToURL(manga.title, manga.id)
  }))
}

interface Props{
  params: Promise<{id: string}>
}

// 2 hours revalidate
export const revalidate = 7200;

export default async function Page({params}: Props) {
  const {id} = await params;
  const {data} = await queryGraphql(GET_MANGA, {id});

  if (!data) notFound();

  const {manga} = data;

  return (
  <div className="md:px-4 flex flex-col gap-3">
    <Card isBlurred>
      <CardBody className="p-2 md:p-4 relative">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Left column of the card*/}
          <div className="flex flex-col gap-3 w-full items-center md:w-1/3">
            <MangaSettingsDropdown mangaId={getMangaIdFromURL(id)} className="absolute right-2 top-2"/>
            <Image
                className="w-[250px] h-[350px] object-cover"
                src={manga?.image}
                width={250}
                height={350}
                alt={manga?.title}
                isBlurred
            />
            <ContinueReadingButton mangaSlug={id} firstChapterId={manga?.firstChapter?.id}/>
            <BookmarkButton mangaId={getMangaIdFromURL(id)}/>
            <div className="flex gap-3">
              <div className="flex gap-1 items-center">
                Status
                <Button
                    variant="flat"
                    as={Link}
                    href={`/manga/?status=${manga?.status}`}
                    size="sm"
                    className="font-light text-sm"
                >
                  {manga?.status}
                </Button>
              </div>
              <div className="flex gap-1 items-center">
                Type
                <Button
                    variant="flat"
                    as={Link}
                    href={`/manga/?type=${manga?.type}`}
                    size="sm"
                    className="font-light text-sm"
                >
                  {manga?.type}
                </Button>
              </div>
            </div>
          </div>

          {/*Right column of the card*/}
          <div className="gap-3 flex flex-col w-full md:w-2/3">
            <h2 className="text-xl font-bold text-center md:text-left">
              {manga?.title}
            </h2>
            <Divider/>
            <div className="flex justify-center md:justify-start items-center text-sm flex-wrap">
              <RatingButton
                mangaId={getMangaIdFromURL(id)}
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
              <LikeButton mangaId={getMangaIdFromURL(id)} nrLikes={manga?.stats.likes}/>
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
              {manga?.description}
            </p>
            <div className="flex flex-col gap-3">
              <div className="flex flex-col gap-1 md:flex-row md:gap-6">
                <div className="flex flex-col">
                  <p>Author</p>
                  <p className="text-gray-300 font-light">
                    {manga?.author}
                  </p>
                </div>
                <Divider className="hidden md:block" orientation="vertical"/>
                <div className="flex flex-col">
                  <p>Released on</p>
                  <p className="text-gray-300 font-light">
                    {manga?.releaseYear}
                  </p>
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <p>Genres</p>
                <div className="flex flex-wrap gap-2">
                  {manga?.genres.map(genre =>
                      <Button
                          key={genre}
                          variant="flat"
                          as={Link}
                          href={`/manga/?genre=${genre}`}
                          size="sm"
                          className="font-light text-sm"
                      >
                        {genre}
                      </Button>
                  )}
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <p>Languages</p>
                <div className="flex flex-wrap gap-2">
                  {manga?.languages.map(language =>
                      <div key={language} className="text-gray-300 font-light">
                        <Button
                            key={language}
                            variant="flat"
                            as={Link}
                            href={`/manga/?language=${language}`}
                            size="sm"
                            className="font-light text-sm"
                        >
                          {language}
                        </Button>
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
          <h3 className="text-center text-lg font-bold md:text-left">Chapters list</h3>
            <ChapterList chapters={JSON.parse(JSON.stringify(manga?.chapters))} mangaTitle={manga?.title}/>
        </div>
      </CardBody>
    </Card>
    <IncrementViews mangaId={getMangaIdFromURL(id)}/>
  </div>
 );
};