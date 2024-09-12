import createApolloClient from "@/app/lib/utils/apollo-client";
import {GET_MANGA_CARDS, MANGA_CARD} from "@/app/lib/graphql/queries";
import MangaList from "@/app/_components/MangaList";
import {getFragmentData} from "@/app/__generated__";
import MangaCard from "@/app/_components/MangaCard";

export const revalidate = 10;

export default async function Page() {
  const client = createApolloClient();
  const {data} = await client.query({query: GET_MANGA_CARDS})

  const mangas = getFragmentData(MANGA_CARD, data?.mangas);

  return (
      <MangaList>
        {mangas.map(manga =>
          <MangaCard manga={manga} key={manga.id}/>
        )}
      </MangaList>
  );
};