import {ChapterQuery} from "@/app/__generated__/graphql";
import {ChapterMetadata, ContentItem, LocaleType, TextItem} from "@/app/types";
import {CoordsItem} from "@/app/lib/graphql/schema";


export const transformMetadata = (
  metadata: ChapterQuery["chapter"]["metadata"] | null
): ChapterMetadata["content"] | null => {
  if (!metadata) return null;

  const content: ContentItem[] = [];

  for (const item of metadata.content) {
    if (item.coords.length === 0 || item.translatedTexts.length === 0) continue;

    content.push({
      coords: item.coords.reduce((acc, coords) => {
        acc[coords.language.toLowerCase() as LocaleType] = coords.coord;
        return acc;
      }, {} as Record<LocaleType, CoordsItem>),

      translatedTexts: item.translatedTexts.reduce((acc, text) => {
        acc[text.language.toLowerCase() as LocaleType] = {
          text: text.text,
          fontSize: text.fontSize ?? 16
        };
        return acc;
      }, {} as Record<LocaleType, TextItem>)
    })
  }

  return content;
};