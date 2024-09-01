import {Button, Card, CardBody, Image} from "@nextui-org/react";
import {IoBookmarksOutline, IoEyeOutline} from "react-icons/io5";
import {GET_MANGA} from "@/app/lib/graphql/queries";
import createApolloClient from "@/app/lib/utils/apollo-client";
import {Divider} from "@nextui-org/divider";
import Link from "next/link";
import ChapterList from "@/app/_components/ChapterList";
import BookmarkButton from "@/app/(pages)/manga/[id]/_components/BookmarkButton";
import LikeButton from "@/app/(pages)/manga/[id]/_components/LikeButton";
import RatingButton from "@/app/(pages)/manga/[id]/_components/RatingButton";
import IncrementViews from "@/app/(pages)/manga/[id]/_components/IncrementViews";
import MangaSettingsDropdown from "@/app/(pages)/manga/[id]/_components/MangaSettingsDropdown";
import {notFound} from "next/navigation";
import {cookies} from "next/headers";

interface Props{
  params: {id: string}
}

export const revalidate = 10;

export default async function Page({params: {id}}: Props) {
  const client = createApolloClient();
  const {data} = await client.query({
    query: GET_MANGA, variables: {id}, context: {headers: {cookie: cookies()}}
  }).catch(() => notFound());

  const {manga} = data;

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
                src={manga?.image}
                width={250}
                height={350}
                alt={manga?.title}
                isBlurred
            />
            <Button
                as={Link}
                href={`/manga/${id}/${manga?.firstChapter?.id}`}
                className="w-full"
                color="primary"
                isDisabled={!manga?.firstChapter}
            >
              {manga?.bookmarkedChapter?.title
                ? "Continue " + manga?.bookmarkedChapter?.title
                : "First Chapter"}
            </Button>
            <BookmarkButton mangaId={id}/>
            <div className="flex gap-3">
              <div className="flex gap-1">
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
              <div className="flex gap-1">
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
              <RatingButton mangaId={id} rating={manga?.stats.rating.value} nrVotes={manga?.stats.rating.nrVotes}/>
              <Button
                  size="sm"
                  variant="light"
                  className="px-1 text-sm gap-1"
              >
                <IoEyeOutline size={22}/>
                {manga?.stats?.views}
              </Button>
              <LikeButton mangaId={id} nrLikes={manga?.stats.likes}/>
              <Button
                  size="sm"
                  variant="light"
                  className="px-1 text-sm gap-1"
              >
                <IoBookmarksOutline size={22}/>
                {manga?.stats?.bookmarks}
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
          <ChapterList chapters={manga?.chapters} bookmarkedChapter={manga?.bookmarkedChapter?.id}/>
        </div>
      </CardBody>
    </Card>
    <IncrementViews mangaId={id}/>
  </div>
 );
};