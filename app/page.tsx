import MangaCard from "@/app/_components/MangaCard";
import createApolloClient from "@/app/lib/apollo-client";
import {GET_MANGA_CARDS} from "@/app/lib/graphql/queries";
import mongoose from "mongoose";

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