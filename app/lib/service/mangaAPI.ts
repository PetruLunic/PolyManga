import {Chapter, Manga} from "@/app/types";

const baseUrl = process.env.SITE_URL + "/api/manga/";

export function getManga(id: string): Promise<Manga> {
  return fetch(baseUrl + id,{
    next: {
      revalidate: 60 * 10
    }
  }).then(res => res.json());
}

export function getMangas(): Promise<Manga[]> {
  return fetch(baseUrl, {
    next: {
      revalidate: 60 * 60
    }
  }).then(res => res.json());
}

export function newManga(manga: Manga): Promise<Manga> {
  return fetch(baseUrl, {
    method: "POST",
    body: JSON.stringify(manga)
  }).then(res => res.json());
}

export function getChapter(mangaId: string, chapterNr: number): Promise<Chapter> {
  return fetch(`${baseUrl}${mangaId}/${chapterNr}`,{
    next: {
      revalidate: 60 * 60 * 12
    }
  }).then(res => res.json());
}

export function newChapter(mangaId: string, chapter: Chapter): Promise<Chapter> {
  return fetch(baseUrl + mangaId, {
    method: "POST",
    body: JSON.stringify(chapter)
  }).then(res => res.json());
}