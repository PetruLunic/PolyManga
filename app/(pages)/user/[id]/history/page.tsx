import {auth} from "@/auth";
import {redirect} from "next/navigation";
import createApolloClient from "@/app/lib/utils/apollo-client";
import {GET_MANGAS_WITH_BOOKMARKED_CHAPTERS, MANGA_CARD} from "@/app/lib/graphql/queries";
import {cookies} from "next/headers";
import MangaList from "@/app/_components/MangaList";
import {getFragmentData} from "@/app/__generated__";
import MangaCard from "@/app/_components/MangaCard";

interface Props{
  params: Promise<{id: string}>
}

export const revalidate = 60;

export default async function Page({params}: Props) {
  const {id} = await params;
  const session = await auth();

  // Forbidden is auth id is not the same as id in the url's path
  if (!session || id !== session.user.id) {
    redirect("/forbidden");
  }

  const apolloClient = createApolloClient();
  const {data, error} = await apolloClient.query({
    query: GET_MANGAS_WITH_BOOKMARKED_CHAPTERS,
    context: {headers: {cookie: cookies()}}
  })

  if (error) console.log(error);

 return (
  <div className="flex flex-col gap-3">
    <h2 className="text-2xl mx-2">History</h2>
    <MangaList>
      {data.user?.chapterBookmarks
        .toSorted((a, b) => parseInt(b.createdAt) - parseInt(a.createdAt))
        .map(({manga, chapter, createdAt}) => {
        if (!manga) return;

        return <MangaCard
            type="history"
                manga={getFragmentData(MANGA_CARD, manga)}
                key={getFragmentData(MANGA_CARD, manga)?.id}
                bookmarkedChapter={chapter?.title}
                chapterBookmarkCreationDate={new Date(parseInt(createdAt))}
            />
      }
      )}
    </MangaList>
  </div>
 );
};