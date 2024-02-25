import {Chapter, Manga, MangaDB} from "@/app/types";

const baseUrl = process.env.SITE_URL + "/api/manga/";

export function getManga(id: string): Promise<MangaDB> {
  return fetch(baseUrl + id).then(res => res.json());
}

export function getMangas(): Promise<MangaDB[]> {
  return fetch(baseUrl).then(res => res.json());
}

export function newManga(manga: Manga): Promise<MangaDB> {
  return fetch(baseUrl, {
    method: "POST",
    body: JSON.stringify(manga)
  }).then(res => res.json());
}

export function getChapter(mangaId: string, chapterNr: number): Promise<Chapter> {
  return fetch(`${baseUrl}${mangaId}/${chapterNr}`).then(res => res.json());
}

export function newChapter(mangaId: string, chapter: Chapter): Promise<Chapter> {
  return fetch(baseUrl + mangaId, {
    method: "POST",
    body: JSON.stringify(chapter)
  }).then(res => res.json());
}