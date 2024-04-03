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

export type AddChapterInput = {
  mangaId: Scalars['ID']['input'];
  number: Scalars['Int']['input'];
  title: Scalars['String']['input'];
  versions: Array<ChapterVersionInput>;
};

export type AddMangaInput = {
  author: Scalars['String']['input'];
  description: Scalars['String']['input'];
  genres: Array<ComicsGenre>;
  image: Scalars['String']['input'];
  releaseYear: Scalars['Int']['input'];
  status?: InputMaybe<ComicsStatus>;
  title: Scalars['String']['input'];
  type: ComicsType;
};

export type Chapter = {
  __typename?: 'Chapter';
  id: Scalars['ID']['output'];
  isFirst: Scalars['Boolean']['output'];
  isLast: Scalars['Boolean']['output'];
  languages: Array<ChapterLanguage>;
  mangaId: Scalars['ID']['output'];
  nextChapter?: Maybe<Chapter>;
  number: Scalars['Int']['output'];
  postedOn: Scalars['String']['output'];
  prevChapter?: Maybe<Chapter>;
  title: Scalars['String']['output'];
  versions: Array<ChapterVersion>;
};

export type ChapterImage = {
  __typename?: 'ChapterImage';
  height: Scalars['Float']['output'];
  src: Scalars['String']['output'];
  width: Scalars['Float']['output'];
};

export enum ChapterLanguage {
  En = 'en',
  Ro = 'ro',
  Ru = 'ru'
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
  value: Scalars['Int']['output'];
};

export type ComicsStats = {
  __typename?: 'ComicsStats';
  bookmarks: Scalars['Int']['output'];
  likes: Scalars['Int']['output'];
  rating: ComicsRating;
  visitors: Scalars['Int']['output'];
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

export type ImageInput = {
  height: Scalars['Float']['input'];
  src: Scalars['String']['input'];
  width: Scalars['Float']['input'];
};

export type Manga = {
  __typename?: 'Manga';
  author: Scalars['String']['output'];
  chapters: Array<Chapter>;
  description: Scalars['String']['output'];
  firstChapter?: Maybe<Chapter>;
  genres: Array<ComicsGenre>;
  id: Scalars['ID']['output'];
  image: Scalars['String']['output'];
  latestChapter?: Maybe<Chapter>;
  postedOn: Scalars['String']['output'];
  releaseYear: Scalars['Int']['output'];
  stats: ComicsStats;
  status: ComicsStatus;
  title: Scalars['String']['output'];
  type: ComicsType;
};

export type Mutation = {
  __typename?: 'Mutation';
  addChapter: Chapter;
  addManga: Manga;
  deleteChapter: Scalars['String']['output'];
  deleteManga: Scalars['ID']['output'];
};


export type MutationAddChapterArgs = {
  chapter: AddChapterInput;
};


export type MutationAddMangaArgs = {
  manga: AddMangaInput;
};


export type MutationDeleteChapterArgs = {
  id: Scalars['ID']['input'];
};


export type MutationDeleteMangaArgs = {
  id: Scalars['String']['input'];
};

export type Query = {
  __typename?: 'Query';
  chapter: Chapter;
  manga?: Maybe<Manga>;
  mangas: Array<Manga>;
};


export type QueryChapterArgs = {
  id: Scalars['ID']['input'];
};


export type QueryMangaArgs = {
  id: Scalars['ID']['input'];
};

export type MangaQueryVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type MangaQuery = { __typename?: 'Query', manga?: { __typename?: 'Manga', id: string, title: string, description: string, author: string, image: string, status: ComicsStatus, type: ComicsType, genres: Array<ComicsGenre>, releaseYear: number, postedOn: string, chapters: Array<{ __typename?: 'Chapter', id: string, mangaId: string, postedOn: string, number: number }>, firstChapter?: { __typename?: 'Chapter', id: string, number: number } | null, latestChapter?: { __typename?: 'Chapter', id: string, number: number } | null, stats: { __typename?: 'ComicsStats', bookmarks: number, likes: number, visitors: number, rating: { __typename?: 'ComicsRating', nrVotes: number, value: number } } } | null };

export type ChapterQueryVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type ChapterQuery = { __typename?: 'Query', chapter: { __typename?: 'Chapter', id: string, title: string, number: number, mangaId: string, isFirst: boolean, isLast: boolean, languages: Array<ChapterLanguage>, versions: Array<{ __typename?: 'ChapterVersion', language: ChapterLanguage, images: Array<{ __typename?: 'ChapterImage', src: string, width: number, height: number }> }>, nextChapter?: { __typename?: 'Chapter', id: string } | null, prevChapter?: { __typename?: 'Chapter', id: string } | null } };

export type MangasQueryVariables = Exact<{ [key: string]: never; }>;


export type MangasQuery = { __typename?: 'Query', mangas: Array<{ __typename?: 'Manga', id: string, title: string, image: string, type: ComicsType, status: ComicsStatus, stats: { __typename?: 'ComicsStats', rating: { __typename?: 'ComicsRating', value: number } }, latestChapter?: { __typename?: 'Chapter', id: string, number: number } | null }> };

export type Manga_ChapterQueryVariables = Exact<{
  mangaId: Scalars['ID']['input'];
  chapterId: Scalars['ID']['input'];
}>;


export type Manga_ChapterQuery = { __typename?: 'Query', manga?: { __typename?: 'Manga', title: string, chapters: Array<{ __typename?: 'Chapter', id: string, mangaId: string, postedOn: string, number: number }> } | null, chapter: { __typename?: 'Chapter', number: number, languages: Array<ChapterLanguage>, isLast: boolean, isFirst: boolean, prevChapter?: { __typename?: 'Chapter', id: string } | null, nextChapter?: { __typename?: 'Chapter', id: string } | null } };


export const MangaDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"manga"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"manga"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"author"}},{"kind":"Field","name":{"kind":"Name","value":"image"}},{"kind":"Field","name":{"kind":"Name","value":"chapters"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"mangaId"}},{"kind":"Field","name":{"kind":"Name","value":"postedOn"}},{"kind":"Field","name":{"kind":"Name","value":"number"}}]}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"genres"}},{"kind":"Field","name":{"kind":"Name","value":"releaseYear"}},{"kind":"Field","name":{"kind":"Name","value":"postedOn"}},{"kind":"Field","name":{"kind":"Name","value":"firstChapter"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"number"}}]}},{"kind":"Field","name":{"kind":"Name","value":"latestChapter"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"number"}}]}},{"kind":"Field","name":{"kind":"Name","value":"stats"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"bookmarks"}},{"kind":"Field","name":{"kind":"Name","value":"likes"}},{"kind":"Field","name":{"kind":"Name","value":"rating"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"nrVotes"}},{"kind":"Field","name":{"kind":"Name","value":"value"}}]}},{"kind":"Field","name":{"kind":"Name","value":"visitors"}}]}}]}}]}}]} as unknown as DocumentNode<MangaQuery, MangaQueryVariables>;
export const ChapterDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"chapter"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"chapter"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"number"}},{"kind":"Field","name":{"kind":"Name","value":"versions"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"language"}},{"kind":"Field","name":{"kind":"Name","value":"images"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"src"}},{"kind":"Field","name":{"kind":"Name","value":"width"}},{"kind":"Field","name":{"kind":"Name","value":"height"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"mangaId"}},{"kind":"Field","name":{"kind":"Name","value":"isFirst"}},{"kind":"Field","name":{"kind":"Name","value":"isLast"}},{"kind":"Field","name":{"kind":"Name","value":"languages"}},{"kind":"Field","name":{"kind":"Name","value":"nextChapter"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}},{"kind":"Field","name":{"kind":"Name","value":"prevChapter"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]}}]} as unknown as DocumentNode<ChapterQuery, ChapterQueryVariables>;
export const MangasDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"mangas"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"mangas"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"image"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"stats"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"rating"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"value"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"latestChapter"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"number"}}]}}]}}]}}]} as unknown as DocumentNode<MangasQuery, MangasQueryVariables>;
export const Manga_ChapterDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"manga_chapter"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"mangaId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"chapterId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"manga"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"mangaId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"chapters"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"mangaId"}},{"kind":"Field","name":{"kind":"Name","value":"postedOn"}},{"kind":"Field","name":{"kind":"Name","value":"number"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"chapter"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"chapterId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"number"}},{"kind":"Field","name":{"kind":"Name","value":"languages"}},{"kind":"Field","name":{"kind":"Name","value":"isLast"}},{"kind":"Field","name":{"kind":"Name","value":"isFirst"}},{"kind":"Field","name":{"kind":"Name","value":"prevChapter"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}},{"kind":"Field","name":{"kind":"Name","value":"nextChapter"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]}}]} as unknown as DocumentNode<Manga_ChapterQuery, Manga_ChapterQueryVariables>;