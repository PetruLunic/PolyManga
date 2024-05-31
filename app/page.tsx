import MangaCard from "@/app/_components/MangaCard";
import createApolloClient from "@/app/lib/utils/apollo-client";
import {GET_MANGA_CARDS} from "@/app/lib/graphql/queries";
import SignUpForm from "@/app/_components/signForms/SignUpForm";
import {nanoid} from "nanoid";

export const revalidate = 10;

export default async function Page() {
  const client = createApolloClient();
  const {data} = await client.query({query: GET_MANGA_CARDS})

  const {mangas} = data;

  return (
      <div className="flex justify-center gap-3 flex-wrap md:justify-start">
        {mangas.map((manga, index) =>
            <MangaCard key={index} manga={manga}/>
        )}
      </div>
  );
};