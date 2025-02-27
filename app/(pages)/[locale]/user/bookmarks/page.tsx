import createApolloClient from "@/app/lib/utils/apollo-client";
import {GET_BOOKMARKS} from "@/app/lib/graphql/queries";
import BookmarksPage from "@/app/(pages)/[locale]/user/bookmarks/_components/BookmarksPage";
import {cookies} from "next/headers";
import {getTranslations} from "next-intl/server";

export default async function Page() {
  const t = await getTranslations("pages.user.bookmarks");
  const client = createApolloClient();
  const {data} = await client.query({
    query: GET_BOOKMARKS,
    context: {headers: {cookie: (await cookies()).toString()}}
  })

  return (
  <div className="flex flex-col gap-4 px-2">
   <h2 className="text-2xl">{t("bookmarks")}</h2>
    <BookmarksPage data={data}/>
  </div>
 );
};