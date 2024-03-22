import {Arg, FieldResolver, ID, Mutation, Query, Resolver, Root} from "type-graphql";
import {AddMangaInput, Chapter, Manga} from "@/app/lib/graphql/schema";
import MangaModel, {toClient, toClientMany} from "@/app/lib/models/Manga";
import {GraphQLError} from "graphql/error";
import ChapterModel from "@/app/lib/models/Chapter";

@Resolver(() => Manga)
export class MangaResolver {
  @Query(() => Manga, {nullable: true})
  async manga(@Arg('id', () => ID) id: string): Promise<Manga | null> {
    const manga = await MangaModel.findOne({id}).lean();

    if (!manga) {
      throw new GraphQLError("Manga not found", {
        extensions: {
          code: "BAD_USER_INPUT"
        }
      })
    }

    return toClient(manga);
  }

  @Query(() => [Manga])
  async mangas(): Promise<Manga[] | []> {
    const mangas = await MangaModel.find().lean();

    return toClientMany(mangas);
  }

  @Mutation(() => Manga)
  async addManga(@Arg("manga") mangaInput: AddMangaInput) {
    // If exists manga with the same title
    if (await MangaModel.findOne({title: mangaInput.title})) {
      throw new GraphQLError("Title for manga must be unique", {
        extensions: {
          code: "BAD_USER_INPUT"
        }
      })
    }

    const manga = new MangaModel(mangaInput);
    await manga.save();

    return toClient(manga.toObject());
  }

  @Mutation(() => ID)
  async deleteManga(@Arg("id") id: string): Promise<string> {
    const manga = await MangaModel.findOne({id});

    if (!manga) {
      throw new GraphQLError("Manga not found", {
        extensions: {
          code: "BAD_USER_INPUT"
        }
      })
    }

    await manga.deleteOne()

    // Deleting the manga's chapters
    await ChapterModel.deleteMany({id: {$in: manga.chapters}});

    return id;
  }

  @FieldResolver(() => [Chapter])
  async chapters(@Root() manga: Manga): Promise<Chapter[]> {
    return ChapterModel.find({id: {$in: manga.chapters}});
  }
}