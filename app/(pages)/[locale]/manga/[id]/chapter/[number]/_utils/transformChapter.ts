import {ChapterImage} from "@/app/lib/graphql/schema";
import {ChapterQuery, ChapterLanguage} from "@/app/__generated__/graphql";

export type MultiLanguageImage = Record<ChapterLanguage, ChapterImage>

export interface TransformedChapter extends Omit<ChapterQuery["chapter"], "versions"> {
  images: MultiLanguageImage[]
}

export const transformChapter = (chapter: ChapterQuery["chapter"]): TransformedChapter => {
  const images: MultiLanguageImage[] = [];

  let maxImages = Math.max(...chapter.versions.map(version => version.images.length));

  for (let i = 0; i < maxImages; i++) {
    images.push({} as MultiLanguageImage);
  }

  chapter.versions.forEach(version => {
    version.images.forEach((image, index) => {
      if (!images[index][version.language]) {
        images[index][version.language] = image;
      }
    });
  });

  return {
    ...chapter,
    images
  }
}