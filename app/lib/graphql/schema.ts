import {ArgsType, Field, Float, ID, InputType, Int, ObjectType, registerEnumType} from "type-graphql";
import {
  type BookmarkType,
  type LikeableObject,
  ChapterLanguage,
  ComicsGenre,
  ComicsStatus,
  ComicsType,
  UserProvider,
  UserRole
} from "@/app/types";
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

registerEnumType(UserRole, {
  name: "UserRole"
})

registerEnumType(UserProvider, {
  name: "UserProvider"
})

@ObjectType()
export class ComicsRating {
  @Field(() => Float)
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
  views: number;
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
  isFirst: boolean;

  @Field()
  isLast: boolean;

  @Field(() => Chapter, {nullable: true})
  nextChapter?: Chapter;

  @Field(() => Chapter, {nullable: true})
  prevChapter?: Chapter;

  @Field()
  createdAt: string;

  @Field()
  updatedAt: string;
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

  @Field(() => ComicsStats)
  stats: ComicsStats;

  @Field(() => Chapter, {nullable: true})
  latestChapter?: Chapter;

  @Field(() => Chapter, {nullable: true})
  firstChapter?: Chapter;

  @Field(() => [ChapterLanguage])
  languages: ChapterLanguage[];

  @Field()
  createdAt: string;

  @Field()
  updatedAt: string;

  @Field()
  uploadedBy: string;

  @Field()
  isDeleted: boolean;

  @Field()
  isBanned: boolean;
}

@ObjectType()
export class User {
  @Field(() => ID)
  id: string;

  @Field()
  name: string;

  @Field()
  email: string;

  @Field(() => String, {nullable: true})
  password: string;

  @Field()
  image: string;

  @Field(() => ID)
  bookmarkId: string;

  @Field(() => UserProvider)
  provider: UserProvider;

  @Field(() => UserRole)
  role: UserRole;

  @Field()
  emailVerified: boolean;

  @Field(() => String, {nullable: true})
  emailToken: string;

  @Field(() => String, {nullable: true})
  emailTokenExpiry: string;

  @Field()
  createdAt: string;

  @Field()
  updatedAt: string;
}

@ObjectType()
export class Bookmark {
  @Field(() => ID)
  id: string;

  @Field(() => ID)
  userId: string;

  @Field(() => [Manga])
  reading: string[];

  @Field(() => [Manga])
  finished: string[];

  @Field(() => [Manga])
  inPlans: string[];

  @Field(() => [Manga])
  dropped: string[];

  @Field(() => [Manga])
  favourite: string[];

  @Field()
  createdAt: string;

  @Field()
  updatedAt: string;
}

@ObjectType()
export class Like {
  @Field(() => ID)
  id: string;

  @Field(() => ID)
  userId: string;

  @Field(() => ID)
  objectId: string;

  @Field(() => String)
  objectType: LikeableObject;
}

@ObjectType()
export class Rating {
  @Field(() => ID)
  id: string;

  @Field(() => ID)
  userId: string;

  @Field(() => ID)
  mangaId: string;

  @Field(() => Int)
  value: number;
}

/********************  INPUTS  ********************/

@InputType()
export class UserSignUp implements Partial<User> {
  @Field()
  name: string;

  @Field()
  email: string;

  @Field()
  password: string;
}

@InputType()
export class UserSignIn implements Partial<User> {
  @Field()
  email: string;

  @Field()
  password: string;
}


@InputType()
export class AddMangaInput implements Partial<Manga> {
  @Field()
  id: string;

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

  @Field(() => [ChapterLanguage])
  languages: ChapterLanguage[];

  @Field(() => Int)
  releaseYear: number;

  @Field()
  uploadedBy: string;
}

@InputType()
export class EditMangaInput implements Partial<Manga> {
  @Field()
  id: string;

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

  @Field(() => [ChapterLanguage])
  languages: ChapterLanguage[];

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
  @Field(() => ID)
  id: string;

  @Field()
  title: string;

  @Field(() => Int)
  number: number;

  @Field(() => [ChapterVersionInput])
  versions: ChapterVersionInput[];

  @Field(() => ID)
  mangaId: string;
}

@InputType()
export class AddBookmarkInput {
  @Field(() => ID)
  mangaId: string;

  @Field(() => String)
  type: BookmarkType;
}

@InputType()
export class LikeInput implements Partial<Like>{
  @Field(() => ID)
  objectId: string;

  @Field(() => String)
  objectType: LikeableObject
}

@InputType()
export class RatingInput implements Partial<Rating> {
  @Field(() => ID)
  mangaId: string;

  @Field(() => Int)
  value: number;
}

/********************  QUERY ARGUMENTS  ********************/

@ArgsType()
export class GetMangasArgs {
  @Field({nullable: true})
  search: string;

  @Field(() => [ComicsGenre], {nullable: true})
  genres: ComicsGenre[];

  @Field(() => [ComicsStatus], {nullable: true})
  statuses: ComicsStatus;

  @Field(() => [ComicsType], {nullable: true})
  types: ComicsType;

  @Field({nullable: true})
  sortBy: string;

  @Field({nullable: true})
  sort: string;

  @Field(() => [ChapterLanguage],{nullable: true})
  languages: ChapterLanguage[];
}