import createApolloClient from "@/app/lib/utils/apollo-client";
import {GET_MANGAS_WITH_BOOKMARKED_CHAPTERS, MANGA_CARD} from "@/app/lib/graphql/queries";
import {cookies} from "next/headers";
import MangaList from "@/app/_components/MangaList";
import {getFragmentData} from "@/app/__generated__";
import MangaCard from "@/app/_components/MangaCard";
import {getLocale, getTranslations} from "next-intl/server";
import {LocaleType} from "@/app/types";

export default async function Page() {
  const locale = await getLocale();
  const t = await getTranslations("pages.user.history");
  const apolloClient = createApolloClient();
  const {data} = await apolloClient.query({
    query: GET_MANGAS_WITH_BOOKMARKED_CHAPTERS,
    variables: {locale},
    context: {headers: {cookie: await cookies()}}
  })

 return (
  <div className="flex flex-col gap-3 mx-2">
    <h1 className="text-2xl mx-2">{t("history")}</h1>
    <MangaList>
      {data.user?.chapterBookmarks
        .toSorted((a, b) => parseInt(b.createdAt) - parseInt(a.createdAt))
        .map(({manga, chapter, createdAt}) => {
        if (!manga) return;

        return <MangaCard
            type="history"
            manga={JSON.parse(JSON.stringify(getFragmentData(MANGA_CARD, manga)))}
            key={getFragmentData(MANGA_CARD, manga)?.id}
            bookmarkedChapter={chapter?.title}
            chapterBookmarkCreationDate={new Date(parseInt(createdAt))}
            locale={locale as LocaleType}
            isExtendable
            />
      }
      )}
    </MangaList>
  </div>
 );
};