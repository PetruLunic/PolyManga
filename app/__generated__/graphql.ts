/* eslint-disable */
import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
};

export type AddBookmarkInput = {
  mangaId: Scalars['ID']['input'];
  type: Scalars['String']['input'];
};

export type AddChapterInput = {
  id: Scalars['ID']['input'];
  mangaId: Scalars['ID']['input'];
  number: Scalars['Int']['input'];
  title: Scalars['String']['input'];
  versions: Array<ChapterVersionInput>;
};

export type AddMangaInput = {
  author: Scalars['String']['input'];
  description: Scalars['String']['input'];
  genres: Array<ComicsGenre>;
  id: Scalars['String']['input'];
  image: Scalars['String']['input'];
  languages: Array<ChapterLanguage>;
  releaseYear: Scalars['Int']['input'];
  status?: InputMaybe<ComicsStatus>;
  title: Scalars['String']['input'];
  type: ComicsType;
  uploadedBy: Scalars['String']['input'];
};

export type Bookmark = {
  __typename?: 'Bookmark';
  createdAt: Scalars['String']['output'];
  dropped: Array<Manga>;
  favourite: Array<Manga>;
  finished: Array<Manga>;
  id: Scalars['ID']['output'];
  inPlans: Array<Manga>;
  reading: Array<Manga>;
  updatedAt: Scalars['String']['output'];
  userId: Scalars['ID']['output'];
};

export type Chapter = {
  __typename?: 'Chapter';
  createdAt: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  isFirst: Scalars['Boolean']['output'];
  isLast: Scalars['Boolean']['output'];
  languages: Array<ChapterLanguage>;
  mangaId: Scalars['ID']['output'];
  nextChapter?: Maybe<Chapter>;
  number: Scalars['Int']['output'];
  prevChapter?: Maybe<Chapter>;
  title: Scalars['String']['output'];
  updatedAt: Scalars['String']['output'];
  versions: Array<ChapterVersion>;
};

export type ChapterImage = {
  __typename?: 'ChapterImage';
  height: Scalars['Float']['output'];
  src: Scalars['String']['output'];
  width: Scalars['Float']['output'];
};

export enum ChapterLanguage {
  En = 'En',
  Fr = 'Fr',
  Ro = 'Ro',
  Ru = 'Ru'
}

export type ChapterVersion = {
  __typename?: 'ChapterVersion';
  images: Array<ChapterImage>;
  language: ChapterLanguage;
};

export type ChapterVersionInput = {
  images: Array<ImageInput>;
  language: ChapterLanguage;
};

export enum ComicsGenre {
  Action = 'action',
  Adventure = 'adventure',
  Apocalypse = 'apocalypse',
  Comedy = 'comedy',
  Cultivation = 'cultivation',
  Drama = 'drama',
  Fantasy = 'fantasy',
  Game = 'game',
  GeniusMc = 'genius_MC',
  Harem = 'harem',
  Hero = 'hero',
  Historical = 'historical',
  Isekai = 'isekai',
  Loli = 'loli',
  Magic = 'magic',
  MartialArts = 'martial_arts',
  Mature = 'mature',
  Mecha = 'mecha',
  Murim = 'murim',
  Necromancer = 'necromancer',
  Noble = 'noble',
  PostApocalyptic = 'post_apocalyptic',
  Rebirth = 'rebirth',
  Regression = 'regression',
  Reincarnation = 'reincarnation',
  Revenge = 'revenge',
  Romance = 'romance',
  SchoolLife = 'school_life',
  SciFi = 'sci_fi',
  Sport = 'sport',
  System = 'system',
  Thriller = 'thriller',
  TimeTravel = 'time_travel',
  Tower = 'tower',
  Tragedy = 'tragedy',
  Villain = 'villain',
  VirtualReality = 'virtual_reality'
}

export type ComicsRating = {
  __typename?: 'ComicsRating';
  nrVotes: Scalars['Int']['output'];
  value: Scalars['Float']['output'];
};

export type ComicsStats = {
  __typename?: 'ComicsStats';
  bookmarks: Scalars['Int']['output'];
  likes: Scalars['Int']['output'];
  rating: ComicsRating;
  views: Scalars['Int']['output'];
};

export enum ComicsStatus {
  Dropped = 'DROPPED',
  Finished = 'FINISHED',
  Ongoing = 'ONGOING',
  Paused = 'PAUSED'
}

export enum ComicsType {
  Manga = 'manga',
  Manhua = 'manhua',
  Manhwa = 'manhwa'
}

export type EditMangaInput = {
  author: Scalars['String']['input'];
  description: Scalars['String']['input'];
  genres: Array<ComicsGenre>;
  id: Scalars['String']['input'];
  image: Scalars['String']['input'];
  languages: Array<ChapterLanguage>;
  releaseYear: Scalars['Int']['input'];
  status?: InputMaybe<ComicsStatus>;
  title: Scalars['String']['input'];
  type: ComicsType;
};

export type ImageInput = {
  height: Scalars['Float']['input'];
  src: Scalars['String']['input'];
  width: Scalars['Float']['input'];
};

export type LikeInput = {
  objectId: Scalars['ID']['input'];
  objectType: Scalars['String']['input'];
};

export type Manga = {
  __typename?: 'Manga';
  author: Scalars['String']['output'];
  chapters: Array<Chapter>;
  createdAt: Scalars['String']['output'];
  description: Scalars['String']['output'];
  firstChapter?: Maybe<Chapter>;
  genres: Array<ComicsGenre>;
  id: Scalars['ID']['output'];
  image: Scalars['String']['output'];
  isBanned: Scalars['Boolean']['output'];
  isDeleted: Scalars['Boolean']['output'];
  languages: Array<ChapterLanguage>;
  latestChapter?: Maybe<Chapter>;
  releaseYear: Scalars['Int']['output'];
  stats: ComicsStats;
  status: ComicsStatus;
  title: Scalars['String']['output'];
  type: ComicsType;
  updatedAt: Scalars['String']['output'];
  uploadedBy: Scalars['String']['output'];
};

export type Mutation = {
  __typename?: 'Mutation';
  addBookmark?: Maybe<Bookmark>;
  addChapter: Chapter;
  addManga: Manga;
  addRating?: Maybe<Scalars['Float']['output']>;
  deleteBookmark?: Maybe<Scalars['String']['output']>;
  deleteChapters: Scalars['String']['output'];
  deleteManga: Scalars['ID']['output'];
  deleteRating?: Maybe<Scalars['String']['output']>;
  editManga: Manga;
  incrementViews?: Maybe<Scalars['Int']['output']>;
  like?: Maybe<Scalars['String']['output']>;
  signUp?: Maybe<User>;
  unlike?: Maybe<Scalars['String']['output']>;
};


export type MutationAddBookmarkArgs = {
  input: AddBookmarkInput;
};


export type MutationAddChapterArgs = {
  chapter: AddChapterInput;
};


export type MutationAddMangaArgs = {
  manga: AddMangaInput;
};


export type MutationAddRatingArgs = {
  input: RatingInput;
};


export type MutationDeleteBookmarkArgs = {
  mangaId: Scalars['String']['input'];
};


export type MutationDeleteChaptersArgs = {
  ids: Array<Scalars['ID']['input']>;
  mangaId: Scalars['ID']['input'];
};


export type MutationDeleteMangaArgs = {
  id: Scalars['String']['input'];
};


export type MutationDeleteRatingArgs = {
  mangaId: Scalars['String']['input'];
};


export type MutationEditMangaArgs = {
  manga: EditMangaInput;
};


export type MutationIncrementViewsArgs = {
  id: Scalars['String']['input'];
};


export type MutationLikeArgs = {
  input: LikeInput;
};


export type MutationSignUpArgs = {
  user: UserSignUp;
};


export type MutationUnlikeArgs = {
  objectId: Scalars['String']['input'];
};

export type Query = {
  __typename?: 'Query';
  chapter: Chapter;
  isBookmarked?: Maybe<Scalars['String']['output']>;
  isLiked: Scalars['Boolean']['output'];
  isRated?: Maybe<Scalars['Int']['output']>;
  manga?: Maybe<Manga>;
  mangas: Array<Manga>;
  signIn?: Maybe<User>;
  user?: Maybe<User>;
};


export type QueryChapterArgs = {
  id: Scalars['ID']['input'];
};


export type QueryIsBookmarkedArgs = {
  mangaId: Scalars['String']['input'];
};


export type QueryIsLikedArgs = {
  objectId: Scalars['String']['input'];
};


export type QueryIsRatedArgs = {
  mangaId: Scalars['String']['input'];
};


export type QueryMangaArgs = {
  id: Scalars['ID']['input'];
};


export type QueryMangasArgs = {
  genres?: InputMaybe<Array<ComicsGenre>>;
  languages?: InputMaybe<Array<ChapterLanguage>>;
  search?: InputMaybe<Scalars['String']['input']>;
  sort?: InputMaybe<Scalars['String']['input']>;
  sortBy?: InputMaybe<Scalars['String']['input']>;
  statuses?: InputMaybe<Array<ComicsStatus>>;
  types?: InputMaybe<Array<ComicsType>>;
};


export type QuerySignInArgs = {
  user: UserSignIn;
};

export type RatingInput = {
  mangaId: Scalars['ID']['input'];
  value: Scalars['Int']['input'];
};

export type User = {
  __typename?: 'User';
  bookmarkId: Scalars['ID']['output'];
  bookmarks?: Maybe<Bookmark>;
  createdAt: Scalars['String']['output'];
  email: Scalars['String']['output'];
  emailToken?: Maybe<Scalars['String']['output']>;
  emailTokenExpiry?: Maybe<Scalars['String']['output']>;
  emailVerified: Scalars['Boolean']['output'];
  id: Scalars['ID']['output'];
  image: Scalars['String']['output'];
  name: Scalars['String']['output'];
  password?: Maybe<Scalars['String']['output']>;
  provider: UserProvider;
  role: UserRole;
  updatedAt: Scalars['String']['output'];
};

export enum UserProvider {
  Credentials = 'CREDENTIALS',
  Facebook = 'FACEBOOK',
  Google = 'GOOGLE'
}

export enum UserRole {
  Admin = 'ADMIN',
  Moderator = 'MODERATOR',
  User = 'USER'
}

export type UserSignIn = {
  email: Scalars['String']['input'];
  password: Scalars['String']['input'];
};

export type UserSignUp = {
  email: Scalars['String']['input'];
  name: Scalars['String']['input'];
  password: Scalars['String']['input'];
};

export type AddChapterMutationVariables = Exact<{
  chapter: AddChapterInput;
}>;


export type AddChapterMutation = { __typename?: 'Mutation', addChapter: { __typename?: 'Chapter', id: string, mangaId: string, number: number, title: string, createdAt: string, versions: Array<{ __typename?: 'ChapterVersion', language: ChapterLanguage, images: Array<{ __typename?: 'ChapterImage', src: string }> }> } };

export type SignUpMutationVariables = Exact<{
  user: UserSignUp;
}>;


export type SignUpMutation = { __typename?: 'Mutation', signUp?: { __typename?: 'User', id: string, role: UserRole, image: string } | null };

export type AddBookmarkMutationVariables = Exact<{
  input: AddBookmarkInput;
}>;


export type AddBookmarkMutation = { __typename?: 'Mutation', addBookmark?: { __typename?: 'Bookmark', id: string } | null };

export type DeleteBookmarkMutationVariables = Exact<{
  mangaId: Scalars['String']['input'];
}>;


export type DeleteBookmarkMutation = { __typename?: 'Mutation', deleteBookmark?: string | null };

export type LikeMutationVariables = Exact<{
  input: LikeInput;
}>;


export type LikeMutation = { __typename?: 'Mutation', like?: string | null };

export type UnlikeMutationVariables = Exact<{
  objectId: Scalars['String']['input'];
}>;


export type UnlikeMutation = { __typename?: 'Mutation', unlike?: string | null };

export type AddRatingMutationVariables = Exact<{
  input: RatingInput;
}>;


export type AddRatingMutation = { __typename?: 'Mutation', addRating?: number | null };

export type DeleteRatingMutationVariables = Exact<{
  mangaId: Scalars['String']['input'];
}>;


export type DeleteRatingMutation = { __typename?: 'Mutation', deleteRating?: string | null };

export type IncrementViewsMutationVariables = Exact<{
  id: Scalars['String']['input'];
}>;


export type IncrementViewsMutation = { __typename?: 'Mutation', incrementViews?: number | null };

export type AddMangaMutationVariables = Exact<{
  manga: AddMangaInput;
}>;


export type AddMangaMutation = { __typename?: 'Mutation', addManga: { __typename?: 'Manga', id: string } };

export type EditMangaMutationVariables = Exact<{
  manga: EditMangaInput;
}>;


export type EditMangaMutation = { __typename?: 'Mutation', editManga: { __typename?: 'Manga', id: string } };

export type DeleteMangaMutationVariables = Exact<{
  id: Scalars['String']['input'];
}>;


export type DeleteMangaMutation = { __typename?: 'Mutation', deleteManga: string };

export type DeleteChaptersMutationVariables = Exact<{
  mangaId: Scalars['ID']['input'];
  ids: Array<Scalars['ID']['input']> | Scalars['ID']['input'];
}>;


export type DeleteChaptersMutation = { __typename?: 'Mutation', deleteChapters: string };

export type MangaCardFragment = { __typename?: 'Manga', id: string, title: string, image: string, type: ComicsType, status: ComicsStatus, stats: { __typename?: 'ComicsStats', rating: { __typename?: 'ComicsRating', value: number } }, latestChapter?: { __typename?: 'Chapter', id: string, number: number } | null } & { ' $fragmentName'?: 'MangaCardFragment' };

export type MangaQueryVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type MangaQuery = { __typename?: 'Query', manga?: { __typename?: 'Manga', id: string, title: string, description: string, author: string, image: string, status: ComicsStatus, type: ComicsType, genres: Array<ComicsGenre>, releaseYear: number, languages: Array<ChapterLanguage>, chapters: Array<{ __typename?: 'Chapter', id: string, mangaId: string, createdAt: string, number: number }>, firstChapter?: { __typename?: 'Chapter', id: string, number: number } | null, latestChapter?: { __typename?: 'Chapter', id: string, number: number } | null, stats: { __typename?: 'ComicsStats', bookmarks: number, likes: number, views: number, rating: { __typename?: 'ComicsRating', nrVotes: number, value: number } } } | null };

export type ChapterQueryVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type ChapterQuery = { __typename?: 'Query', chapter: { __typename?: 'Chapter', id: string, title: string, number: number, mangaId: string, isFirst: boolean, isLast: boolean, languages: Array<ChapterLanguage>, versions: Array<{ __typename?: 'ChapterVersion', language: ChapterLanguage, images: Array<{ __typename?: 'ChapterImage', src: string, width: number, height: number }> }>, nextChapter?: { __typename?: 'Chapter', id: string } | null, prevChapter?: { __typename?: 'Chapter', id: string } | null } };

export type MangasQueryVariables = Exact<{
  search?: InputMaybe<Scalars['String']['input']>;
  genres?: InputMaybe<Array<ComicsGenre> | ComicsGenre>;
  statuses?: InputMaybe<Array<ComicsStatus> | ComicsStatus>;
  types?: InputMaybe<Array<ComicsType> | ComicsType>;
  sortBy?: InputMaybe<Scalars['String']['input']>;
  sort?: InputMaybe<Scalars['String']['input']>;
  languages?: InputMaybe<Array<ChapterLanguage> | ChapterLanguage>;
}>;


export type MangasQuery = { __typename?: 'Query', mangas: Array<(
    { __typename?: 'Manga' }
    & { ' $fragmentRefs'?: { 'MangaCardFragment': MangaCardFragment } }
  )> };

export type Manga_ChapterQueryVariables = Exact<{
  mangaId: Scalars['ID']['input'];
  chapterId: Scalars['ID']['input'];
}>;


export type Manga_ChapterQuery = { __typename?: 'Query', manga?: { __typename?: 'Manga', title: string, chapters: Array<{ __typename?: 'Chapter', id: string, mangaId: string, createdAt: string, number: number }> } | null, chapter: { __typename?: 'Chapter', number: number, languages: Array<ChapterLanguage>, isLast: boolean, isFirst: boolean, prevChapter?: { __typename?: 'Chapter', id: string } | null, nextChapter?: { __typename?: 'Chapter', id: string } | null } };

export type Manga_Chapter_UploadQueryVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type Manga_Chapter_UploadQuery = { __typename?: 'Query', manga?: { __typename?: 'Manga', latestChapter?: { __typename?: 'Chapter', number: number } | null } | null };

export type ChaptersQueryVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type ChaptersQuery = { __typename?: 'Query', manga?: { __typename?: 'Manga', chapters: Array<{ __typename?: 'Chapter', id: string, mangaId: string, createdAt: string, number: number }> } | null };

export type SignInQueryVariables = Exact<{
  user: UserSignIn;
}>;


export type SignInQuery = { __typename?: 'Query', signIn?: { __typename?: 'User', id: string, name: string, email: string, role: UserRole, image: string, emailVerified: boolean } | null };

export type BookmarksQueryVariables = Exact<{ [key: string]: never; }>;


export type BookmarksQuery = { __typename?: 'Query', user?: { __typename?: 'User', bookmarks?: { __typename?: 'Bookmark', inPlans: Array<(
        { __typename?: 'Manga' }
        & { ' $fragmentRefs'?: { 'MangaCardFragment': MangaCardFragment } }
      )>, reading: Array<(
        { __typename?: 'Manga' }
        & { ' $fragmentRefs'?: { 'MangaCardFragment': MangaCardFragment } }
      )>, finished: Array<(
        { __typename?: 'Manga' }
        & { ' $fragmentRefs'?: { 'MangaCardFragment': MangaCardFragment } }
      )>, dropped: Array<(
        { __typename?: 'Manga' }
        & { ' $fragmentRefs'?: { 'MangaCardFragment': MangaCardFragment } }
      )>, favourite: Array<(
        { __typename?: 'Manga' }
        & { ' $fragmentRefs'?: { 'MangaCardFragment': MangaCardFragment } }
      )> } | null } | null };

export type IsBookmarkedQueryVariables = Exact<{
  mangaId: Scalars['String']['input'];
}>;


export type IsBookmarkedQuery = { __typename?: 'Query', isBookmarked?: string | null };

export type IsLikedQueryVariables = Exact<{
  objectId: Scalars['String']['input'];
}>;


export type IsLikedQuery = { __typename?: 'Query', isLiked: boolean };

export type IsRatedQueryVariables = Exact<{
  mangaId: Scalars['String']['input'];
}>;


export type IsRatedQuery = { __typename?: 'Query', isRated?: number | null };

export type MangaEditQueryVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type MangaEditQuery = { __typename?: 'Query', manga?: { __typename?: 'Manga', id: string, title: string, author: string, status: ComicsStatus, type: ComicsType, genres: Array<ComicsGenre>, description: string, releaseYear: number, image: string, languages: Array<ChapterLanguage> } | null };

export const MangaCardFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"MangaCard"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Manga"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"image"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"stats"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"rating"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"value"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"latestChapter"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"number"}}]}}]}}]} as unknown as DocumentNode<MangaCardFragment, unknown>;
export const AddChapterDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"AddChapter"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"chapter"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"AddChapterInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"addChapter"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"chapter"},"value":{"kind":"Variable","name":{"kind":"Name","value":"chapter"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"mangaId"}},{"kind":"Field","name":{"kind":"Name","value":"number"}},{"kind":"Field","name":{"kind":"Name","value":"versions"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"images"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"src"}}]}},{"kind":"Field","name":{"kind":"Name","value":"language"}}]}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}}]}}]}}]} as unknown as DocumentNode<AddChapterMutation, AddChapterMutationVariables>;
export const SignUpDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"SignUp"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"user"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UserSignUp"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"signUp"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"user"},"value":{"kind":"Variable","name":{"kind":"Name","value":"user"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"role"}},{"kind":"Field","name":{"kind":"Name","value":"image"}}]}}]}}]} as unknown as DocumentNode<SignUpMutation, SignUpMutationVariables>;
export const AddBookmarkDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"AddBookmark"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"AddBookmarkInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"addBookmark"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]} as unknown as DocumentNode<AddBookmarkMutation, AddBookmarkMutationVariables>;
export const DeleteBookmarkDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"DeleteBookmark"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"mangaId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"deleteBookmark"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"mangaId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"mangaId"}}}]}]}}]} as unknown as DocumentNode<DeleteBookmarkMutation, DeleteBookmarkMutationVariables>;
export const LikeDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"like"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"LikeInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"like"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}]}]}}]} as unknown as DocumentNode<LikeMutation, LikeMutationVariables>;
export const UnlikeDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"unlike"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"objectId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"unlike"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"objectId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"objectId"}}}]}]}}]} as unknown as DocumentNode<UnlikeMutation, UnlikeMutationVariables>;
export const AddRatingDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"addRating"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"RatingInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"addRating"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}]}]}}]} as unknown as DocumentNode<AddRatingMutation, AddRatingMutationVariables>;
export const DeleteRatingDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"deleteRating"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"mangaId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"deleteRating"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"mangaId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"mangaId"}}}]}]}}]} as unknown as DocumentNode<DeleteRatingMutation, DeleteRatingMutationVariables>;
export const IncrementViewsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"incrementViews"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"incrementViews"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}]}]}}]} as unknown as DocumentNode<IncrementViewsMutation, IncrementViewsMutationVariables>;
export const AddMangaDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"addManga"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"manga"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"AddMangaInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"addManga"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"manga"},"value":{"kind":"Variable","name":{"kind":"Name","value":"manga"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]} as unknown as DocumentNode<AddMangaMutation, AddMangaMutationVariables>;
export const EditMangaDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"editManga"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"manga"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"EditMangaInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"editManga"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"manga"},"value":{"kind":"Variable","name":{"kind":"Name","value":"manga"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]} as unknown as DocumentNode<EditMangaMutation, EditMangaMutationVariables>;
export const DeleteMangaDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"deleteManga"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"deleteManga"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}]}]}}]} as unknown as DocumentNode<DeleteMangaMutation, DeleteMangaMutationVariables>;
export const DeleteChaptersDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"deleteChapters"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"mangaId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"ids"}},"type":{"kind":"NonNullType","type":{"kind":"ListType","type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"deleteChapters"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"mangaId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"mangaId"}}},{"kind":"Argument","name":{"kind":"Name","value":"ids"},"value":{"kind":"Variable","name":{"kind":"Name","value":"ids"}}}]}]}}]} as unknown as DocumentNode<DeleteChaptersMutation, DeleteChaptersMutationVariables>;
export const MangaDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"manga"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"manga"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"author"}},{"kind":"Field","name":{"kind":"Name","value":"image"}},{"kind":"Field","name":{"kind":"Name","value":"chapters"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"mangaId"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"number"}}]}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"genres"}},{"kind":"Field","name":{"kind":"Name","value":"releaseYear"}},{"kind":"Field","name":{"kind":"Name","value":"languages"}},{"kind":"Field","name":{"kind":"Name","value":"firstChapter"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"number"}}]}},{"kind":"Field","name":{"kind":"Name","value":"latestChapter"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"number"}}]}},{"kind":"Field","name":{"kind":"Name","value":"stats"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"bookmarks"}},{"kind":"Field","name":{"kind":"Name","value":"likes"}},{"kind":"Field","name":{"kind":"Name","value":"rating"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"nrVotes"}},{"kind":"Field","name":{"kind":"Name","value":"value"}}]}},{"kind":"Field","name":{"kind":"Name","value":"views"}}]}}]}}]}}]} as unknown as DocumentNode<MangaQuery, MangaQueryVariables>;
export const ChapterDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"chapter"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"chapter"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"number"}},{"kind":"Field","name":{"kind":"Name","value":"versions"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"language"}},{"kind":"Field","name":{"kind":"Name","value":"images"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"src"}},{"kind":"Field","name":{"kind":"Name","value":"width"}},{"kind":"Field","name":{"kind":"Name","value":"height"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"mangaId"}},{"kind":"Field","name":{"kind":"Name","value":"isFirst"}},{"kind":"Field","name":{"kind":"Name","value":"isLast"}},{"kind":"Field","name":{"kind":"Name","value":"languages"}},{"kind":"Field","name":{"kind":"Name","value":"nextChapter"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}},{"kind":"Field","name":{"kind":"Name","value":"prevChapter"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]}}]} as unknown as DocumentNode<ChapterQuery, ChapterQueryVariables>;
export const MangasDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"mangas"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"search"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"genres"}},"type":{"kind":"ListType","type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ComicsGenre"}}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"statuses"}},"type":{"kind":"ListType","type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ComicsStatus"}}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"types"}},"type":{"kind":"ListType","type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ComicsType"}}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"sortBy"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"sort"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"languages"}},"type":{"kind":"ListType","type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ChapterLanguage"}}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"mangas"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"search"},"value":{"kind":"Variable","name":{"kind":"Name","value":"search"}}},{"kind":"Argument","name":{"kind":"Name","value":"genres"},"value":{"kind":"Variable","name":{"kind":"Name","value":"genres"}}},{"kind":"Argument","name":{"kind":"Name","value":"statuses"},"value":{"kind":"Variable","name":{"kind":"Name","value":"statuses"}}},{"kind":"Argument","name":{"kind":"Name","value":"types"},"value":{"kind":"Variable","name":{"kind":"Name","value":"types"}}},{"kind":"Argument","name":{"kind":"Name","value":"sortBy"},"value":{"kind":"Variable","name":{"kind":"Name","value":"sortBy"}}},{"kind":"Argument","name":{"kind":"Name","value":"sort"},"value":{"kind":"Variable","name":{"kind":"Name","value":"sort"}}},{"kind":"Argument","name":{"kind":"Name","value":"languages"},"value":{"kind":"Variable","name":{"kind":"Name","value":"languages"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"MangaCard"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"MangaCard"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Manga"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"image"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"stats"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"rating"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"value"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"latestChapter"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"number"}}]}}]}}]} as unknown as DocumentNode<MangasQuery, MangasQueryVariables>;
export const Manga_ChapterDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"manga_chapter"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"mangaId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"chapterId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"manga"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"mangaId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"chapters"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"mangaId"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"number"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"chapter"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"chapterId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"number"}},{"kind":"Field","name":{"kind":"Name","value":"languages"}},{"kind":"Field","name":{"kind":"Name","value":"isLast"}},{"kind":"Field","name":{"kind":"Name","value":"isFirst"}},{"kind":"Field","name":{"kind":"Name","value":"prevChapter"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}},{"kind":"Field","name":{"kind":"Name","value":"nextChapter"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]}}]} as unknown as DocumentNode<Manga_ChapterQuery, Manga_ChapterQueryVariables>;
export const Manga_Chapter_UploadDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"manga_chapter_upload"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"manga"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"latestChapter"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"number"}}]}}]}}]}}]} as unknown as DocumentNode<Manga_Chapter_UploadQuery, Manga_Chapter_UploadQueryVariables>;
export const ChaptersDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"chapters"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"manga"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"chapters"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"mangaId"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"number"}}]}}]}}]}}]} as unknown as DocumentNode<ChaptersQuery, ChaptersQueryVariables>;
export const SignInDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"SignIn"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"user"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UserSignIn"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"signIn"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"user"},"value":{"kind":"Variable","name":{"kind":"Name","value":"user"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"role"}},{"kind":"Field","name":{"kind":"Name","value":"image"}},{"kind":"Field","name":{"kind":"Name","value":"emailVerified"}}]}}]}}]} as unknown as DocumentNode<SignInQuery, SignInQueryVariables>;
export const BookmarksDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"bookmarks"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"bookmarks"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"inPlans"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"MangaCard"}}]}},{"kind":"Field","name":{"kind":"Name","value":"reading"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"MangaCard"}}]}},{"kind":"Field","name":{"kind":"Name","value":"finished"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"MangaCard"}}]}},{"kind":"Field","name":{"kind":"Name","value":"dropped"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"MangaCard"}}]}},{"kind":"Field","name":{"kind":"Name","value":"favourite"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"MangaCard"}}]}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"MangaCard"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Manga"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"image"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"stats"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"rating"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"value"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"latestChapter"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"number"}}]}}]}}]} as unknown as DocumentNode<BookmarksQuery, BookmarksQueryVariables>;
export const IsBookmarkedDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"isBookmarked"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"mangaId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"isBookmarked"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"mangaId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"mangaId"}}}]}]}}]} as unknown as DocumentNode<IsBookmarkedQuery, IsBookmarkedQueryVariables>;
export const IsLikedDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"isLiked"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"objectId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"isLiked"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"objectId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"objectId"}}}]}]}}]} as unknown as DocumentNode<IsLikedQuery, IsLikedQueryVariables>;
export const IsRatedDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"isRated"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"mangaId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"isRated"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"mangaId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"mangaId"}}}]}]}}]} as unknown as DocumentNode<IsRatedQuery, IsRatedQueryVariables>;
export const MangaEditDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"mangaEdit"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"manga"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"author"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"genres"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"releaseYear"}},{"kind":"Field","name":{"kind":"Name","value":"image"}},{"kind":"Field","name":{"kind":"Name","value":"languages"}}]}}]}}]} as unknown as DocumentNode<MangaEditQuery, MangaEditQueryVariables>;