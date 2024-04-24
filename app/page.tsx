import MangaCard from "@/app/_components/MangaCard";
import createApolloClient from "@/app/lib/utils/apollo-client";
import {GET_MANGA_CARDS} from "@/app/lib/graphql/queries";
import mongoose from "mongoose";
import SignUpForm from "@/app/_components/SignUpForm";
import {Image} from "@nextui-org/react";

export default async function Page() {
  const client = createApolloClient();
  const {data} = await client.query({query: GET_MANGA_CARDS})

  const {mangas} = data;

  return (
      <div>
        {mangas.map((manga, index) =>
            <MangaCard key={index} manga={manga}/>
        )}
        <SignUpForm/>
      </div>
  );
};