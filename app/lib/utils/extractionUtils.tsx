import {ChapterVersion, MangaTitle} from "@/app/__generated__/graphql";
import {LocaleType} from "@/app/types";

const DEFAULT_LANGUAGE = "en";

// export const extractChapterTitle = (titles: Partial<ChapterVersion>[] = [], locale: LocaleType): string | null => {
//   return versions.find(({language}) => locale === language?.toLowerCase())?.title
//   ?? versions.find(({language}) => DEFAULT_LANGUAGE === language?.toLowerCase())?.title
//   ?? versions[0]?.title
//   ?? null;
// }

export const extractMangaTitle = (titles: MangaTitle[] | undefined, locale: LocaleType): string | undefined => {
  if (!titles || titles.length <= 0) return;

  return titles.find(({language}) => locale === language.toLowerCase())?.value
    ?? titles.find(({language}) => DEFAULT_LANGUAGE === language.toLowerCase())?.value
    ?? titles[0].value;
}