import createApolloClient from "@/app/lib/utils/apollo-client";
import {GET_MANGA_CARDS, MANGA_CARD} from "@/app/lib/graphql/queries";
import MangaList from "@/app/_components/MangaList";
import {getFragmentData} from "@/app/__generated__";

export const revalidate = 10;

export default async function Page() {
  const client = createApolloClient();
  // const {data} = useQuery(GET_MANGA_CARDS);
  const {data} = await client.query({query: GET_MANGA_CARDS})

  const mangas = getFragmentData(MANGA_CARD, data?.mangas);

  return (
      <MangaList mangas={mangas}/>
  );
};