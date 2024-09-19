import createApolloClient from "@/app/lib/utils/apollo-client";
import {GET_MANGA_CARDS, MANGA_CARD} from "@/app/lib/graphql/queries";
import {getFragmentData} from "@/app/__generated__";
import PopularMangaList from "@/app/_components/PopularMangaList";

export const revalidate = 10;

export default async function Page() {
  const client = createApolloClient();
  const [{data: dailyMangaData},
    {data: weeklyMangaData},
    {data: monthlyMangaData}] = await Promise.all([
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
    })
  ])

  return (
      <div className="flex flex-col gap-3 mx-3">
        <PopularMangaList
            daily={getFragmentData(MANGA_CARD, dailyMangaData.mangas)}
            weekly={getFragmentData(MANGA_CARD, weeklyMangaData.mangas)}
            monthly={getFragmentData(MANGA_CARD, monthlyMangaData.mangas)}/>
      </div>
      
  );
};