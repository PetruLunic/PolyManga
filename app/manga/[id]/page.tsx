import {Button, Card, CardBody, Image} from "@nextui-org/react";
import {FaStar} from "react-icons/fa";
import {IoBookmarks, IoBookmarksOutline, IoEyeOutline} from "react-icons/io5";
import {GET_MANGA} from "@/app/lib/graphql/queries";
import createApolloClient from "@/app/lib/apollo-client";
import {IoMdHeartEmpty} from "react-icons/io";
import {Divider} from "@nextui-org/divider";
import Link from "next/link";


interface Props{
  params: {id: string}
}

export default async function Page({params: {id}}: Props) {
  const client = createApolloClient();
  const {loading, data, error} = await client.query({query: GET_MANGA, variables: {id}});

  if (error) throw new Error("Unexpected error");

  const {manga} = data;

  return (
  <div className="md:px-4">
    <Card isBlurred>
      <CardBody className="p-2 md:p-4">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Left column of the card*/}
          <div className="flex flex-col gap-3 w-full items-center md:w-1/4">
            <Image src={"/manga/" + manga?.image} width={250} height={300} alt={manga?.title} isBlurred/>
            <Button color="primary" className="w-full" startContent={<IoBookmarks />}>
              Bookmark
            </Button>
            <div className="flex gap-4">
              <div className="flex gap-1 items-center">
                <FaStar color="orange" size={22}/>
                {manga?.stats?.rating?.value}
                <span>({manga?.stats?.rating?.nrVotes})</span>
              </div>
              <div className="flex gap-1 items-center">
                <IoEyeOutline size={22}/>
                {manga?.stats?.visitors}
              </div>
              <div className="flex gap-1 items-center">
                <IoMdHeartEmpty size={22}/>
                {manga?.stats?.likes}
              </div>
              <div className="flex gap-1 items-center">
                <IoBookmarksOutline size={22}/>
                {manga?.stats?.bookmarks}
              </div>
            </div>
            <div className="flex gap-3">
              <div className="flex gap-1">
                Status:
                <span className="text-gray-300 font-light">
                  {manga?.status}
                </span>
              </div>
              <div className="flex gap-1">
                Type:
                <span className="text-gray-300 font-light">
                  {manga?.type}
                </span>
              </div>
            </div>
          </div>

          {/*Right column of the card*/}
          <div className="grow-0 gap-3 flex flex-col">
            <h2 className="text-xl font-bold text-center md:text-left">
              {manga?.title}
            </h2>
            <Divider/>
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
                <Divider className="hidden md:block" orientation="vertical"/>
                <div className="flex flex-col">
                  <p>Posted on</p>
                  <p className="text-gray-300 font-light">
                    {manga?.postedOn}
                  </p>
                </div>
              </div>

              <div className="flex flex-col">
                <p>Genres</p>
                <div className="flex flex-wrap gap-2">
                  {manga?.genres.map(genre =>
                      <div key={genre} className="text-gray-300 font-light">
                        {genre}
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
          <h3 className="text-center text-lg font-bold md:text-left">Chapter list</h3>
          <div className="flex gap-2">
            <Button color="primary" size="lg" className="w-1/2" as={Link} href={`${process.env.NEXT_PUBLIC_SITE_URL}/manga/${id}/${chapter.number}`}>
              Chapter {manga?.chapters.reduce((acc, chapter) => Math.min(acc, chapter.number), 9999)}
            </Button>
            <Button color="primary" size="lg" className="w-1/2">
              Chapter {manga?.chapters.reduce((acc, chapter) => Math.max(acc, chapter.number), 0)}
            </Button>
          </div>
          <div className="">
            {manga?.chapters.map((chapter, index) =>
                <Button
                    key={index}
                    variant="light"
                    className="w-full justify-start"
                    as={Link}
                    href={`${process.env.NEXT_PUBLIC_SITE_URL}/manga/${id}/${chapter.number}`}
                >
                  Chapter {chapter.number}
                </Button>
            )}
          </div>
        </div>
      </CardBody>
    </Card>
  </div>
 );
};