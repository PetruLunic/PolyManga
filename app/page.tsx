import createApolloClient from "@/app/lib/utils/apollo-client";
import {GET_LATEST_UPLOADED_CHAPTERS, GET_MANGA_CARDS, MANGA_CARD} from "@/app/lib/graphql/queries";
import {getFragmentData} from "@/app/__generated__";
import PopularMangaList from "@/app/_components/PopularMangaList";
import LatestChaptersList from "@/app/_components/LatestChaptersList";

export const revalidate = 300;

export const dynamic = 'force-dynamic'

export default async function Page() {
  const client = createApolloClient();
  const [{data: dailyMangaData},
    {data: weeklyMangaData},
    {data: monthlyMangaData},
    {data: latestChapters}] = await Promise.all([
    client.query({
      query: GET_MANGA_CARDS,
      variables: {
        limit: 10,
        sortBy: "dailyViews"
      }
    }),
    client.query({
      query: GET_MANGA_CARDS,
      variables: {
        limit: 10,
        sortBy: "weeklyViews"
      }
    }),
    client.query({
      query: GET_MANGA_CARDS,
      variables: {
        limit: 10,
        sortBy: "monthlyViews"
      }
    }),
    client.query({
      query: GET_LATEST_UPLOADED_CHAPTERS,
      variables: {
        limit: 10
      }
    })
  ]);

  return (
      <div className="flex flex-col gap-3 mx-3">
        <PopularMangaList
            daily={getFragmentData(MANGA_CARD, dailyMangaData.mangas)}
            weekly={getFragmentData(MANGA_CARD, weeklyMangaData.mangas)}
            monthly={getFragmentData(MANGA_CARD, monthlyMangaData.mangas)}
        />
        <LatestChaptersList initialChapters={latestChapters.latestChapters}/>
      </div>

  );
};