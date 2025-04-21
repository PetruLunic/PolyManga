import {ChapterLanguage} from "@/app/__generated__/graphql";

export function getImageURLs(mangaId: string, chapterId: string, chapterLanguage: ChapterLanguage, ids: string[]): string[] {
  return ids.map((id, i) => `/manga/${mangaId}/chapters/${chapterId}/${chapterLanguage}/image-${i}-${id}`);
}