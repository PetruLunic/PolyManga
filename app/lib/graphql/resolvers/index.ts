import {buildSchemaSync} from "type-graphql";
import {MangaResolver} from "@/app/lib/graphql/resolvers/MangaResolver";
import {ChapterResolver} from "@/app/lib/graphql/resolvers/ChapterResolver";
import {UserResolver} from "@/app/lib/graphql/resolvers/UserResolver";

export const schema = buildSchemaSync({
  resolvers: [
      MangaResolver,
      ChapterResolver,
      UserResolver
  ]
})