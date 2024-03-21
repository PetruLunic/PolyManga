import {buildSchemaSync} from "type-graphql";
import {MangaResolver} from "@/app/lib/graphql/resolvers/MangaResolver";
import {ChapterResolver} from "@/app/lib/graphql/resolvers/ChapterResolver";

export const schema = buildSchemaSync({
  resolvers: [
      MangaResolver,
      ChapterResolver
  ]
})