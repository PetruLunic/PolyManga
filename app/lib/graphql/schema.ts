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

@ObjectType("ComicsRating")
export class ComicsRating {
  @Field(() => Float)
  value: number;

  @Field(() => Int)
  nrVotes: number;
}

@ObjectType("ComicsStats")
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

@ObjectType("ChapterImage")
export class ChapterImage {
  @Field()
  src: string;

  @Field(() => Float)
  width: number;

  @Field(() => Float)
  height: number;
}

@ObjectType("ChapterVersion")
export class ChapterVersion {
  @Field(() => [ChapterImage])
  images: ChapterImage[]

  @Field()
  title: string

  @Field(() => ChapterLanguage)
  language: ChapterLanguage
}

@ObjectType("Chapter")
export class Chapter {
  @Field(() => ID)
  id: string;

  @Field(() => Float)
  number: number;

  @Field(() => [ChapterVersion])
  versions: ChapterVersion[]

  @Field(() => [ChapterLanguage])
  languages: ChapterLanguage[]

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

@ObjectType("MangaTitle")
export class MangaTitle {
  @Field(() => ChapterLanguage)
  language: string;

  @Field()
  value: string
}

@ObjectType("MangaDescription")
export class MangaDescription {
  @Field(() => ChapterLanguage)
  language: string;

  @Field()
  value: string
}

@ObjectType("Manga")
export class Manga {
  @Field(() => ID)
  id: string;

  @Field(() => [MangaTitle])
  title: MangaTitle[];

  @Field()
  slug: string;

  @Field(() => [MangaDescription])
  description: MangaDescription[];

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

@ObjectType("UserPreferences")
export class UserPreferences {
  @Field(() => ChapterLanguage, {nullable: true})
  language: ChapterLanguage | null;
}

@ObjectType("User")
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

  @Field(() => UserPreferences)
  preferences: UserPreferences;

  @Field()
  createdAt: string;

  @Field()
  updatedAt: string;
}

@ObjectType("Bookmark")
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

@ObjectType("Like")
export class Like {
  @Field(() => ID)
  id: string;

  @Field(() => ID)
  userId: string;

  @Field(() => ID)
  mangaId: string;
}

@ObjectType("Rating")
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

@ObjectType("ChapterBookmark")
export class ChapterBookmark {
  @Field(() => ID)
  id: string;

  @Field(() => ID)
  userId: string;

  @Field(() => ID)
  mangaId: string;

  @Field(() => ID)
  chapterId: string;

  @Field()
  createdAt: string;

  @Field()
  updatedAt: string;
}

/********************  INPUTS  ********************/

@InputType("UserSignUp")
export class UserSignUp implements Partial<User> {
  @Field()
  name: string;

  @Field()
  email: string;

  @Field()
  password: string;
}

@InputType("UserSignIn")
export class UserSignIn implements Partial<User> {
  @Field()
  email: string;

  @Field()
  password: string;
}

@InputType("MangaTitleInput")
export class MangaTitleInput implements MangaTitle {
  @Field(() => ChapterLanguage)
  language: string;

  @Field()
  value: string
}

@InputType("MangaDescriptionInput")
export class MangaDescriptionInput implements MangaDescription {
  @Field(() => ChapterLanguage)
  language: string;

  @Field()
  value: string
}

@InputType("AddMangaInput")
export class AddMangaInput implements Partial<Manga> {
  @Field()
  id: string;

  @Field(() => [MangaTitleInput])
  title: MangaTitleInput[];

  @Field()
  slug: string;

  @Field(() => [MangaDescriptionInput])
  description: MangaDescriptionInput[];

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

@InputType("EditMangaInput")
export class EditMangaInput implements Partial<Manga> {
  @Field()
  id: string;

  @Field(() => [MangaTitleInput])
  title: MangaTitleInput[];

  @Field(() => [MangaDescriptionInput])
  description: MangaDescriptionInput[];

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

@InputType("ImageInput")
export class ImageInput implements ChapterImage {
  @Field()
  src: string

  @Field(() => Float)
  width: number

  @Field(() => Float)
  height: number
}

@InputType("ChapterVersionInput")
export class ChapterVersionInput implements ChapterVersion {
  @Field(() => [ImageInput])
  images: ImageInput[]

  @Field()
  title: string

  @Field(() => ChapterLanguage)
  language: ChapterLanguage
}

@InputType("AddChapterInput")
export class AddChapterInput implements Partial<Chapter> {
  @Field(() => ID)
  id: string;

  @Field(() => Float)
  number: number;

  @Field(() => [ChapterVersionInput])
  versions: ChapterVersionInput[];

  @Field(() => ID)
  mangaId: string;
}

@InputType("AddBookmarkInput")
export class AddBookmarkInput {
  @Field(() => ID)
  slug: string;

  @Field(() => String)
  type: BookmarkType;
}

@InputType("RatingInput")
export class RatingInput implements Partial<Rating> {
  @Field(() => ID)
  slug: string;

  @Field(() => Int)
  value: number;
}

/********************  QUERY ARGUMENTS  ********************/

@ArgsType()
export class GetMangasArgs {
  @Field({nullable: true})
  search: string;

  @Field(() => [ComicsGenre], {nullable: true})
  genres?: ComicsGenre[];

  @Field(() => [ComicsStatus], {nullable: true})
  statuses?: ComicsStatus;

  @Field(() => [ComicsType], {nullable: true})
  types?: ComicsType;

  @Field({nullable: true})
  sortBy: string;

  @Field({nullable: true})
  sort: string;

  @Field(() => [ChapterLanguage],{nullable: true})
  languages?: ChapterLanguage[];

  @Field(() => Int, {nullable: true})
  limit?: number;

  @Field(() => Int, {nullable: true})
  offset?: number;
}

@ArgsType()
export class GetChaptersArgs {
  @Field(() => Int, {nullable: true})
  limit?: number;

  @Field({nullable: true})
  sortBy?: string;

  @Field(() => Int, {nullable: true})
  offset?: number;
}