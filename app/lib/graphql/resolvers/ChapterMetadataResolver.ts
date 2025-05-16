import {Arg, FieldResolver, ID, Int, Query, Resolver, Root} from "type-graphql";
import {ChapterMetadataRaw} from "@/app/lib/graphql/schema";
import ChapterMetadata from "@/app/lib/models/ChapterMetadata";
import {type HydratedDocument} from "mongoose";


@Resolver(ChapterMetadataRaw)
export class ChapterMetadataResolver {
  @Query(() => ChapterMetadataRaw, {nullable: true})
  async metadata(@Arg("chapterId", () => ID) chapterId: string): Promise<ChapterMetadataRaw | null> {
    return ChapterMetadata.findOne({chapterId}).lean();
  }

  @FieldResolver(() => Int)
  version(@Root() metadata: HydratedDocument<ChapterMetadataRaw>): number {
    return metadata.__v;
  }
}