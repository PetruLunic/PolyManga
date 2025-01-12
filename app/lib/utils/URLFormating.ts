export function mangaTitleAndIdToURL(title: string, id: string): string {
  return title.toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
    .concat("-", id);
}

export function getMangaIdFromURL(url: string): string {
  const idLength = 21; // The length of the default nanoid id

  return url.substring(url.length - idLength);
}