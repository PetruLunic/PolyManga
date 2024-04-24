import {Field, Float, ID, InputType, Int, ObjectType, registerEnumType} from "type-graphql";
import {ChapterLanguage, ComicsGenre, ComicsStatus, ComicsType} from "@/app/types";
import "reflect-metadata";

// Registering enums in types graphql
registerEnumType(ComicsType, {
  name: "ComicsType"
})

registerEnumType(ComicsGenre, {
  name: "ComicsGenre"
})

registerEnumType(ComicsStatus, {
  name: "ComicsStatus"
})

registerEnumType(ChapterLanguage, {
  name: "ChapterLanguage"
})

@ObjectType()
export class ComicsRating {
  @Field(() => Int)
  value: number;

  @Field(() => Int)
  nrVotes: number;
}

@ObjectType()
export class ComicsStats {
  @Field(() => ComicsRating)
  rating: ComicsRating;

  @Field(() => Int)
  likes: number;

  @Field(() => Int)
  bookmarks: number;

  @Field(() => Int)
  visitors: number;
}

@ObjectType()
export class ChapterImage {
  @Field()
  src: string;

  @Field(() => Float)
  width: number;

  @Field(() => Float)
  height: number;
}

@ObjectType()
export class ChapterVersion {
  @Field(() => [ChapterImage])
  images: ChapterImage[]

  @Field(() => ChapterLanguage)
  language: ChapterLanguage
}

@ObjectType()
export class Chapter {
  @Field(() => ID)
  id: string;

  @Field(() => Int)
  number: number;

  @Field(() => [ChapterVersion])
  versions: ChapterVersion[]

  @Field(() => [ChapterLanguage])
  languages: ChapterLanguage[]

  @Field()
  title: string;

  @Field(() => ID)
  mangaId: string;

  @Field()
  postedOn: string;

  @Field()
  isFirst: boolean;

  @Field()
  isLast: boolean;

  @Field(() => Chapter, {nullable: true})
  nextChapter?: Chapter;

  @Field(() => Chapter, {nullable: true})
  prevChapter?: Chapter;
}

@ObjectType()
export class Manga {
  @Field(() => ID)
  id: string;

  @Field()
  title: string;

  @Field()
  description: string;

  @Field()
  author: string;

  @Field(() => [Chapter])
  chapters: string[];

  @Field(() => ComicsStatus)
  status: ComicsStatus;

  @Field(() => ComicsType)
  type: ComicsType;

  @Field(() => [ComicsGenre])
  genres: ComicsGenre[];

  @Field(() => Int)
  releaseYear: number;

  @Field()
  image: string;

  @Field()
  postedOn: string;

  @Field(() => ComicsStats)
  stats: ComicsStats;

  @Field(() => Chapter, {nullable: true})
  latestChapter?: Chapter;

  @Field(() => Chapter, {nullable: true})
  firstChapter?: Chapter;
}

@ObjectType()
export class User {
  @Field()
  username: string;

  @Field()
  email: string;

  @Field()
  image: string;
}

/********************  INPUTS  ********************/

@InputType()
export class AddUserInput implements Partial<User> {
  @Field()
  username: string;

  @Field()
  email: string;

  @Field()
  password: string;
}

@InputType()
export class AddMangaInput implements Partial<Manga> {
  @Field()
  title: string;

  @Field()
  description: string;

  @Field()
  author: string;

  @Field()
  image: string;

  @Field(() => ComicsType)
  type: ComicsType

  @Field(() => ComicsStatus, {nullable: true})
  status: ComicsStatus

  @Field(() => [ComicsGenre])
  genres: ComicsGenre[];

  @Field(() => Int)
  releaseYear: number;
}

@InputType()
export class ImageInput implements ChapterImage {
  @Field()
  src: string

  @Field(() => Float)
  width: number

  @Field(() => Float)
  height: number
}

@InputType()
export class ChapterVersionInput implements ChapterVersion {
  @Field(() => [ImageInput])
  images: ImageInput[]

  @Field(() => ChapterLanguage)
  language: ChapterLanguage
}

@InputType()
export class AddChapterInput implements Partial<Chapter> {
  @Field()
  title: string;

  @Field(() => Int)
  number: number;

  @Field(() => [ChapterVersionInput])
  versions: ChapterVersionInput[];

  @Field(() => ID)
  mangaId: string;
}