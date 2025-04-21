import {GET_LATEST_UPLOADED_CHAPTERS, GET_MANGA_CARDS, MANGA_CARD} from "@/app/lib/graphql/queries";
import {getFragmentData} from "@/app/__generated__";
import PopularMangaList from "@/app/_components/PopularMangaList";
import LatestChaptersList from "@/app/_components/LatestChaptersList";
import {queryGraphql} from "@/app/lib/utils/graphqlUtils";
import {LocaleType} from "@/app/types";
import {setRequestLocale} from "next-intl/server";

// 1 hours revalidation
export const revalidate = 20;

interface Props {
  params: Promise<{
    locale: string
  }>
}

export default async function Page({params}: Props) {
  const {locale} = await params;
  setRequestLocale(locale);

  const [{data: dailyMangaData},
    {data: weeklyMangaData},
    {data: monthlyMangaData},
    {data: latestChapters}] = await Promise.all([
    queryGraphql(GET_MANGA_CARDS, {
        limit: 10,
        sortBy: "dailyViews"
      }),
    queryGraphql(GET_MANGA_CARDS, {
      limit: 10,
      sortBy: "weeklyViews"
    }),
    queryGraphql(GET_MANGA_CARDS, {
      limit: 10,
      sortBy: "monthlyViews"
    }),
    queryGraphql(GET_LATEST_UPLOADED_CHAPTERS, {
      limit: 16
    })
  ]);

  return (
      <div className="flex flex-col gap-3 mx-3">
        <PopularMangaList
            locale={locale as LocaleType}
            daily={JSON.parse(JSON.stringify(getFragmentData(MANGA_CARD, dailyMangaData?.mangas) ?? []))}
            weekly={JSON.parse(JSON.stringify(getFragmentData(MANGA_CARD, weeklyMangaData?.mangas) ?? []))}
            monthly={JSON.parse(JSON.stringify(getFragmentData(MANGA_CARD, monthlyMangaData?.mangas) ?? []))}
        />
        <LatestChaptersList initialChapters={JSON.parse(JSON.stringify(latestChapters?.latestChapters ?? []))}/>
      </div>

  );
};