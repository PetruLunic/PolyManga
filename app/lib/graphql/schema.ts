import {Field, Float, ID, InputType, Int, ObjectType, registerEnumType} from "type-graphql";
import {ComicsGenre, ComicsStatus, ComicsType} from "@/app/types";
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
export class Chapter {
  @Field(() => ID)
  id: string;

  @Field(() => Int)
  number: number;

  @Field()
  title: string;

  @Field(() => [ChapterImage])
  images: ChapterImage[];

  @Field(() => ID)
  mangaId: string
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
}

/********************  INPUTS  ********************/

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
export class AddChapterInput implements Partial<Chapter> {
  @Field()
  title: string;

  @Field(() => Int)
  number: number;

  @Field(() => [ImageInput])
  images: ImageInput[];

  @Field(() => ID)
  mangaId: string;
}