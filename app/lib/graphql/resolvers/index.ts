import {buildSchemaSync} from "type-graphql";
import {ComicsStatsResolver, MangaResolver} from "@/app/lib/graphql/resolvers/MangaResolver";
import {ChapterResolver} from "@/app/lib/graphql/resolvers/ChapterResolver";
import {UserResolver} from "@/app/lib/graphql/resolvers/UserResolver";
import {authChecker} from "@/app/lib/graphql/resolvers/authChecker";
import {BookmarkResolver} from "@/app/lib/graphql/resolvers/BookmarkResolver";
import {LikeResolver} from "@/app/lib/graphql/resolvers/LikeResolver";
import {RatingResolver} from "@/app/lib/graphql/resolvers/RatingResolver";
import {ChapterBookmarkResolver} from "@/app/lib/graphql/resolvers/ChapterBookmarkResolver";
import {ChapterMetadataResolver} from "@/app/lib/graphql/resolvers/ChapterMetadataResolver";

export const schema = buildSchemaSync({
  resolvers: [
      MangaResolver,
      ChapterResolver,
      UserResolver,
      ComicsStatsResolver,
      BookmarkResolver,
      LikeResolver,
      RatingResolver,
      ChapterBookmarkResolver,
      ChapterMetadataResolver
  ],
  authChecker
})