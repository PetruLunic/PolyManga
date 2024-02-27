import {Chapter, Manga} from "@/app/types";

const baseUrl = process.env.SITE_URL + "/api/manga/";

export async function getManga(id: string): Promise<Manga> {
  const data = await fetch(baseUrl + id,{
    next: {
      revalidate: 1
    }
  })

  if (!data.ok) throw data.json();

  return data.json();
}

export async function getMangas(): Promise<Manga[]> {
  const data = await fetch(baseUrl, {
    next: {
      revalidate: 1
    }
  })

  if (!data.ok) throw data.json();

  return data.json();
}

export async function newManga(manga: Manga): Promise<Manga> {
  const data = await fetch(baseUrl, {
    method: "POST",
    body: JSON.stringify(manga)
  })

  if (!data.ok) throw data.json();

  return data.json();
}

export async function getChapter(mangaId: string, chapterNr: number): Promise<Chapter> {
  const data = await fetch(`${baseUrl}${mangaId}/${chapterNr}`,{
    next: {
      revalidate: 1
    }
  })

  if (!data.ok) throw data.json();

  return data.json();
}

export async function newChapter(mangaId: string, chapter: Chapter): Promise<Chapter> {
  const data = await fetch(baseUrl + mangaId, {
    method: "POST",
    body: JSON.stringify(chapter)
  })

  if (!data.ok) throw data.json();

  return data.json();
}