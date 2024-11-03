import createApolloClient from "@/app/lib/utils/apollo-client";
import {GET_BOOKMARKS} from "@/app/lib/graphql/queries";
import {auth} from "@/auth";
import BookmarksPage from "@/app/(pages)/user/[id]/bookmarks/_components/BookmarksPage";
import {cookies} from "next/headers";

export default async function Page() {
  const session = await auth();

  if (!session) return <div>Unauthorized</div>

  const client = createApolloClient();
  const {data} = await client.query({
    query: GET_BOOKMARKS,
    context: {headers: {cookie: cookies().toString()}}
  })

  return (
  <div className="flex flex-col gap-4 px-2">
   <h2 className="text-2xl">Bookmarks</h2>
    <BookmarksPage data={data}/>
  </div>
 );
};