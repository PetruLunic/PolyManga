import MangaCard from "@/app/components/MangaCard";
import createApolloClient from "@/app/lib/apollo-client";
import {GET_MANGA_CARDS} from "@/app/lib/graphql/queries";

export default async function Page() {
  const client = createApolloClient();
  const {data} = await client.query({query: GET_MANGA_CARDS})

  const {mangas} = data;

  return (
      <div>
        {mangas.map((manga, index) =>
            <MangaCard key={index} manga={manga}/>
        )}
      </div>
  );
};