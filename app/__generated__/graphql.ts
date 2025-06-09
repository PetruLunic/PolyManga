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
  slug: Scalars['ID']['input'];
  type: Scalars['String']['input'];
};

export type AddChapterInput = {
  id: Scalars['ID']['input'];
  images: Array<ChapterImagesInput>;
  languages: Array<ChapterLanguage>;
  mangaId: Scalars['ID']['input'];
  number: Scalars['Float']['input'];
  titles: Array<MangaTitleInput>;
};

export type AddMangaInput = {
  author: Scalars['String']['input'];
  descriptions: Array<MangaDescriptionInput>;
  genres: Array<ComicsGenre>;
  id: Scalars['String']['input'];
  image: Scalars['String']['input'];
  languages: Array<ChapterLanguage>;
  releaseYear: Scalars['Int']['input'];
  scrapSources: ScrapSourcesInput;
  slug: Scalars['String']['input'];
  status?: InputMaybe<ComicsStatus>;
  titles: Array<MangaTitleInput>;
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
  images: Array<ChapterImages>;
  isAIProcessedAt?: Maybe<Scalars['String']['output']>;
  isFirst: Scalars['Boolean']['output'];
  isLast: Scalars['Boolean']['output'];
  languages: Array<ChapterLanguage>;
  manga: Manga;
  mangaId: Scalars['ID']['output'];
  metadata?: Maybe<ChapterMetadataRaw>;
  nextChapter?: Maybe<Chapter>;
  number: Scalars['Float']['output'];
  prevChapter?: Maybe<Chapter>;
  title: Scalars['String']['output'];
  titles: Array<MangaTitle>;
  updatedAt: Scalars['String']['output'];
  /** @deprecated Changed to images and titles */
  versions: Array<ChapterVersion>;
};


export type ChapterTitleArgs = {
  locale?: Scalars['String']['input'];
};

export type ChapterBookmark = {
  __typename?: 'ChapterBookmark';
  chapter?: Maybe<Chapter>;
  chapterId: Scalars['ID']['output'];
  createdAt: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  manga?: Maybe<Manga>;
  mangaId: Scalars['ID']['output'];
  updatedAt: Scalars['String']['output'];
  userId: Scalars['ID']['output'];
};

export type ChapterImage = {
  __typename?: 'ChapterImage';
  height: Scalars['Float']['output'];
  src: Scalars['String']['output'];
  width: Scalars['Float']['output'];
};

export type ChapterImages = {
  __typename?: 'ChapterImages';
  images: Array<ChapterImage>;
  language: ChapterLanguage;
};

export type ChapterImagesInput = {
  images: Array<ImageInput>;
  language: ChapterLanguage;
};

export enum ChapterLanguage {
  De = 'De',
  En = 'En',
  Es = 'Es',
  Fr = 'Fr',
  Id = 'Id',
  It = 'It',
  Pt = 'Pt',
  Ro = 'Ro',
  Ru = 'Ru',
  Th = 'Th',
  Tl = 'Tl',
  Vn = 'Vn'
}

export type ChapterMetadataRaw = {
  __typename?: 'ChapterMetadataRaw';
  chapterId: Scalars['String']['output'];
  content: Array<ContentItemRaw>;
  id: Scalars['String']['output'];
  version: Scalars['Int']['output'];
};

export type ChapterVersion = {
  __typename?: 'ChapterVersion';
  images: Array<ChapterImage>;
  language: ChapterLanguage;
  title: Scalars['String']['output'];
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
  GeniusMc = 'genius_mc',
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

export type ContentItemRaw = {
  __typename?: 'ContentItemRaw';
  coords: Array<Coords>;
  style?: Maybe<ContentItemStyle>;
  translatedTexts: Array<TranslatedText>;
};

export type ContentItemStyle = {
  __typename?: 'ContentItemStyle';
  backgroundColor?: Maybe<Scalars['String']['output']>;
  backgroundImage?: Maybe<Scalars['String']['output']>;
  borderRadius?: Maybe<Scalars['String']['output']>;
  color?: Maybe<Scalars['String']['output']>;
  fontStyle?: Maybe<Scalars['String']['output']>;
  fontWeight?: Maybe<Scalars['String']['output']>;
  textAlign?: Maybe<Scalars['String']['output']>;
};

export type Coord = {
  __typename?: 'Coord';
  x1: Scalars['Int']['output'];
  x2: Scalars['Int']['output'];
  y1: Scalars['Int']['output'];
  y2: Scalars['Int']['output'];
};

export type Coords = {
  __typename?: 'Coords';
  coord: Coord;
  language: LocaleEnum;
};

export type EditMangaInput = {
  author: Scalars['String']['input'];
  descriptions: Array<MangaDescriptionInput>;
  genres: Array<ComicsGenre>;
  id: Scalars['String']['input'];
  image: Scalars['String']['input'];
  languages: Array<ChapterLanguage>;
  releaseYear: Scalars['Int']['input'];
  scrapSources?: InputMaybe<ScrapSourcesInput>;
  status?: InputMaybe<ComicsStatus>;
  titles: Array<MangaTitleInput>;
  type: ComicsType;
};

export type ImageInput = {
  height: Scalars['Float']['input'];
  src: Scalars['String']['input'];
  width: Scalars['Float']['input'];
};

export enum LocaleEnum {
  De = 'DE',
  En = 'EN',
  Es = 'ES',
  Fr = 'FR',
  Id = 'ID',
  It = 'IT',
  Pt = 'PT',
  Ro = 'RO',
  Ru = 'RU',
  Th = 'TH',
  Tl = 'TL',
  Vn = 'VN'
}

export type Manga = {
  __typename?: 'Manga';
  author: Scalars['String']['output'];
  bookmarkedChapter?: Maybe<Chapter>;
  chapters: Array<Chapter>;
  createdAt: Scalars['String']['output'];
  description: Scalars['String']['output'];
  descriptions: Array<MangaDescription>;
  firstChapter?: Maybe<Chapter>;
  genres: Array<ComicsGenre>;
  id: Scalars['ID']['output'];
  image: Scalars['String']['output'];
  isBanned: Scalars['Boolean']['output'];
  isDeleted: Scalars['Boolean']['output'];
  languages: Array<ChapterLanguage>;
  latestChapter?: Maybe<Chapter>;
  releaseYear: Scalars['Int']['output'];
  scrapSources?: Maybe<ScrapSources>;
  slug: Scalars['String']['output'];
  stats: ComicsStats;
  status: ComicsStatus;
  title: Scalars['String']['output'];
  titles: Array<MangaTitle>;
  type: ComicsType;
  updatedAt: Scalars['String']['output'];
  uploadedBy: Scalars['String']['output'];
};


export type MangaChaptersArgs = {
  isDescending?: Scalars['Boolean']['input'];
  limit?: Scalars['Int']['input'];
  offset?: Scalars['Int']['input'];
};


export type MangaDescriptionArgs = {
  locale?: Scalars['String']['input'];
};


export type MangaTitleArgs = {
  locale?: Scalars['String']['input'];
};

export type MangaDescription = {
  __typename?: 'MangaDescription';
  language: ChapterLanguage;
  value: Scalars['String']['output'];
};

export type MangaDescriptionInput = {
  language: ChapterLanguage;
  value: Scalars['String']['input'];
};

export type MangaTitle = {
  __typename?: 'MangaTitle';
  language: ChapterLanguage;
  value: Scalars['String']['output'];
};

export type MangaTitleInput = {
  language: ChapterLanguage;
  value: Scalars['String']['input'];
};

export type Mutation = {
  __typename?: 'Mutation';
  addBookmark?: Maybe<Bookmark>;
  addChapter: Chapter;
  addChapterBookmark?: Maybe<ChapterBookmark>;
  addManga: Manga;
  addRating?: Maybe<Scalars['Float']['output']>;
  deleteBookmark?: Maybe<Scalars['String']['output']>;
  deleteChapterBookmark?: Maybe<ChapterBookmark>;
  deleteChapters: Scalars['String']['output'];
  deleteManga: Scalars['ID']['output'];
  deleteRating?: Maybe<Scalars['String']['output']>;
  editManga: Manga;
  incrementViews?: Maybe<Scalars['Int']['output']>;
  like?: Maybe<Scalars['String']['output']>;
  signUp?: Maybe<User>;
  toggleIsAIProcessed: Scalars['Boolean']['output'];
  unlike?: Maybe<Scalars['String']['output']>;
};


export type MutationAddBookmarkArgs = {
  input: AddBookmarkInput;
};


export type MutationAddChapterArgs = {
  chapter: AddChapterInput;
};


export type MutationAddChapterBookmarkArgs = {
  number: Scalars['Float']['input'];
  slug: Scalars['String']['input'];
};


export type MutationAddMangaArgs = {
  manga: AddMangaInput;
};


export type MutationAddRatingArgs = {
  input: RatingInput;
};


export type MutationDeleteBookmarkArgs = {
  slug: Scalars['String']['input'];
};


export type MutationDeleteChapterBookmarkArgs = {
  chapterId: Scalars['String']['input'];
};


export type MutationDeleteChaptersArgs = {
  ids: Array<Scalars['ID']['input']>;
  slug: Scalars['String']['input'];
};


export type MutationDeleteMangaArgs = {
  id: Scalars['String']['input'];
};


export type MutationDeleteRatingArgs = {
  slug: Scalars['String']['input'];
};


export type MutationEditMangaArgs = {
  manga: EditMangaInput;
};


export type MutationIncrementViewsArgs = {
  id: Scalars['String']['input'];
};


export type MutationLikeArgs = {
  slug: Scalars['ID']['input'];
};


export type MutationSignUpArgs = {
  user: UserSignUp;
};


export type MutationToggleIsAiProcessedArgs = {
  id: Scalars['String']['input'];
};


export type MutationUnlikeArgs = {
  slug: Scalars['ID']['input'];
};

export type Query = {
  __typename?: 'Query';
  chapter: Chapter;
  chapters: Array<Chapter>;
  getBookmarkedChapter?: Maybe<ChapterBookmark>;
  isBookmarked?: Maybe<Scalars['String']['output']>;
  isLiked?: Maybe<Scalars['Boolean']['output']>;
  isRated?: Maybe<Scalars['Int']['output']>;
  latestChapters: Array<Chapter>;
  manga?: Maybe<Manga>;
  mangas: Array<Manga>;
  metadata?: Maybe<ChapterMetadataRaw>;
  signIn?: Maybe<User>;
  user?: Maybe<User>;
};


export type QueryChapterArgs = {
  number: Scalars['Float']['input'];
  slug: Scalars['String']['input'];
};


export type QueryChaptersArgs = {
  limit: Scalars['Int']['input'];
  slug: Scalars['String']['input'];
};


export type QueryGetBookmarkedChapterArgs = {
  slug: Scalars['String']['input'];
};


export type QueryIsBookmarkedArgs = {
  slug: Scalars['ID']['input'];
};


export type QueryIsLikedArgs = {
  slug: Scalars['ID']['input'];
};


export type QueryIsRatedArgs = {
  slug: Scalars['ID']['input'];
};


export type QueryLatestChaptersArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  sortBy?: InputMaybe<Scalars['String']['input']>;
};


export type QueryMangaArgs = {
  id: Scalars['String']['input'];
};


export type QueryMangasArgs = {
  genres?: InputMaybe<Array<ComicsGenre>>;
  languages?: InputMaybe<Array<ChapterLanguage>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  search?: InputMaybe<Scalars['String']['input']>;
  sort?: InputMaybe<Scalars['String']['input']>;
  sortBy?: InputMaybe<Scalars['String']['input']>;
  statuses?: InputMaybe<Array<ComicsStatus>>;
  types?: InputMaybe<Array<ComicsType>>;
};


export type QueryMetadataArgs = {
  chapterId: Scalars['ID']['input'];
};


export type QuerySignInArgs = {
  user: UserSignIn;
};

export type RatingInput = {
  slug: Scalars['ID']['input'];
  value: Scalars['Int']['input'];
};

export type ScrapSources = {
  __typename?: 'ScrapSources';
  asurascans?: Maybe<Scalars['String']['output']>;
};

export type ScrapSourcesInput = {
  asurascans?: InputMaybe<Scalars['String']['input']>;
};

export type TranslatedText = {
  __typename?: 'TranslatedText';
  fontSize?: Maybe<Scalars['Float']['output']>;
  language: LocaleEnum;
  text: Scalars['String']['output'];
};

export type User = {
  __typename?: 'User';
  bookmarkId: Scalars['ID']['output'];
  bookmarks?: Maybe<Bookmark>;
  chapterBookmarks: Array<ChapterBookmark>;
  createdAt: Scalars['String']['output'];
  email: Scalars['String']['output'];
  emailVerified: Scalars['Boolean']['output'];
  id: Scalars['ID']['output'];
  image: Scalars['String']['output'];
  name: Scalars['String']['output'];
  password?: Maybe<Scalars['String']['output']>;
  preferences: UserPreferences;
  provider: UserProvider;
  role: UserRole;
  updatedAt: Scalars['String']['output'];
};

export type UserPreferences = {
  __typename?: 'UserPreferences';
  sourceLanguage?: Maybe<LocaleEnum>;
  targetLanguage?: Maybe<LocaleEnum>;
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


export type AddChapterMutation = { __typename?: 'Mutation', addChapter: { __typename?: 'Chapter', id: string, mangaId: string, number: number, createdAt: string, versions: Array<{ __typename?: 'ChapterVersion', language: ChapterLanguage, images: Array<{ __typename?: 'ChapterImage', src: string }> }> } };

export type SignUpMutationVariables = Exact<{
  user: UserSignUp;
}>;


export type SignUpMutation = { __typename?: 'Mutation', signUp?: { __typename?: 'User', id: string, role: UserRole, image: string } | null };

export type AddBookmarkMutationVariables = Exact<{
  input: AddBookmarkInput;
}>;


export type AddBookmarkMutation = { __typename?: 'Mutation', addBookmark?: { __typename?: 'Bookmark', id: string } | null };

export type DeleteBookmarkMutationVariables = Exact<{
  slug: Scalars['String']['input'];
}>;


export type DeleteBookmarkMutation = { __typename?: 'Mutation', deleteBookmark?: string | null };

export type LikeMutationVariables = Exact<{
  slug: Scalars['ID']['input'];
}>;


export type LikeMutation = { __typename?: 'Mutation', like?: string | null };

export type UnlikeMutationVariables = Exact<{
  slug: Scalars['ID']['input'];
}>;


export type UnlikeMutation = { __typename?: 'Mutation', unlike?: string | null };

export type AddRatingMutationVariables = Exact<{
  input: RatingInput;
}>;


export type AddRatingMutation = { __typename?: 'Mutation', addRating?: number | null };

export type DeleteRatingMutationVariables = Exact<{
  slug: Scalars['String']['input'];
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
  slug: Scalars['String']['input'];
  ids: Array<Scalars['ID']['input']> | Scalars['ID']['input'];
}>;


export type DeleteChaptersMutation = { __typename?: 'Mutation', deleteChapters: string };

export type AddChapterBookmarkMutationVariables = Exact<{
  slug: Scalars['String']['input'];
  number: Scalars['Float']['input'];
}>;


export type AddChapterBookmarkMutation = { __typename?: 'Mutation', addChapterBookmark?: { __typename?: 'ChapterBookmark', id: string } | null };

export type DeleteChapterBookmarkMutationVariables = Exact<{
  chapterId: Scalars['String']['input'];
}>;


export type DeleteChapterBookmarkMutation = { __typename?: 'Mutation', deleteChapterBookmark?: { __typename?: 'ChapterBookmark', id: string } | null };

export type ToggleChapterAiProcessedMutationVariables = Exact<{
  id: Scalars['String']['input'];
}>;


export type ToggleChapterAiProcessedMutation = { __typename?: 'Mutation', toggleIsAIProcessed: boolean };

export type MangaCardFragment = { __typename?: 'Manga', id: string, title: string, slug: string, image: string, type: ComicsType, status: ComicsStatus, languages: Array<ChapterLanguage>, stats: { __typename?: 'ComicsStats', rating: { __typename?: 'ComicsRating', value: number } }, latestChapter?: { __typename?: 'Chapter', id: string, number: number, title: string } | null } & { ' $fragmentName'?: 'MangaCardFragment' };

export type ChaptersListFragment = { __typename?: 'Chapter', id: string, mangaId: string, createdAt: string, languages: Array<ChapterLanguage>, title: string, isAIProcessedAt?: string | null, number: number } & { ' $fragmentName'?: 'ChaptersListFragment' };

export type MangaQueryVariables = Exact<{
  id: Scalars['String']['input'];
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  locale?: InputMaybe<Scalars['String']['input']>;
}>;


export type MangaQuery = { __typename?: 'Query', manga?: { __typename?: 'Manga', id: string, title: string, description: string, author: string, image: string, status: ComicsStatus, type: ComicsType, genres: Array<ComicsGenre>, releaseYear: number, languages: Array<ChapterLanguage>, chapters: Array<(
      { __typename?: 'Chapter' }
      & { ' $fragmentRefs'?: { 'ChaptersListFragment': ChaptersListFragment } }
    )>, firstChapter?: { __typename?: 'Chapter', id: string, number: number, title: string } | null, latestChapter?: { __typename?: 'Chapter', id: string, number: number, title: string } | null, stats: { __typename?: 'ComicsStats', bookmarks: number, likes: number, views: number, rating: { __typename?: 'ComicsRating', nrVotes: number, value: number } } } | null };

export type ChaptersQueryVariables = Exact<{
  id: Scalars['String']['input'];
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  locale?: InputMaybe<Scalars['String']['input']>;
  isDescending?: InputMaybe<Scalars['Boolean']['input']>;
}>;


export type ChaptersQuery = { __typename?: 'Query', manga?: { __typename?: 'Manga', id: string, chapters: Array<(
      { __typename?: 'Chapter' }
      & { ' $fragmentRefs'?: { 'ChaptersListFragment': ChaptersListFragment } }
    )> } | null };

export type StaticMangasQueryVariables = Exact<{ [key: string]: never; }>;


export type StaticMangasQuery = { __typename?: 'Query', mangas: Array<{ __typename?: 'Manga', id: string, slug: string }> };

export type MangaMetadataQueryVariables = Exact<{
  id: Scalars['String']['input'];
  locale: Scalars['String']['input'];
}>;


export type MangaMetadataQuery = { __typename?: 'Query', manga?: { __typename?: 'Manga', id: string, title: string, description: string, image: string, type: ComicsType, genres: Array<ComicsGenre> } | null };

export type ChapterQueryVariables = Exact<{
  slug: Scalars['String']['input'];
  number: Scalars['Float']['input'];
  locale: Scalars['String']['input'];
}>;


export type ChapterQuery = { __typename?: 'Query', manga?: { __typename?: 'Manga', title: string, languages: Array<ChapterLanguage> } | null, chapter: { __typename?: 'Chapter', id: string, number: number, title: string, mangaId: string, languages: Array<ChapterLanguage>, isAIProcessedAt?: string | null, images: Array<{ __typename?: 'ChapterImages', language: ChapterLanguage, images: Array<{ __typename?: 'ChapterImage', src: string, width: number, height: number }> }>, nextChapter?: { __typename?: 'Chapter', number: number } | null, prevChapter?: { __typename?: 'Chapter', number: number } | null, metadata?: { __typename?: 'ChapterMetadataRaw', content: Array<{ __typename?: 'ContentItemRaw', style?: { __typename?: 'ContentItemStyle', backgroundColor?: string | null, backgroundImage?: string | null, borderRadius?: string | null, textAlign?: string | null, fontWeight?: string | null, fontStyle?: string | null, color?: string | null } | null, translatedTexts: Array<{ __typename?: 'TranslatedText', language: LocaleEnum, text: string, fontSize?: number | null }>, coords: Array<{ __typename?: 'Coords', language: LocaleEnum, coord: { __typename?: 'Coord', x1: number, x2: number, y1: number, y2: number } }> }> } | null } };

export type ChaptersStaticQueryVariables = Exact<{ [key: string]: never; }>;


export type ChaptersStaticQuery = { __typename?: 'Query', mangas: Array<{ __typename?: 'Manga', id: string, slug: string, chapters: Array<{ __typename?: 'Chapter', number: number, languages: Array<ChapterLanguage> }> }> };

export type ChapterMetadataQueryVariables = Exact<{
  slug: Scalars['String']['input'];
  number: Scalars['Float']['input'];
  locale: Scalars['String']['input'];
}>;


export type ChapterMetadataQuery = { __typename?: 'Query', chapter: { __typename?: 'Chapter', id: string, number: number, title: string, languages: Array<ChapterLanguage>, manga: { __typename?: 'Manga', title: string, image: string } } };

export type ChapterEditQueryVariables = Exact<{
  slug: Scalars['String']['input'];
  number: Scalars['Float']['input'];
}>;


export type ChapterEditQuery = { __typename?: 'Query', chapter: { __typename?: 'Chapter', id: string, languages: Array<ChapterLanguage>, number: number, mangaId: string, images: Array<{ __typename?: 'ChapterImages', language: ChapterLanguage, images: Array<{ __typename?: 'ChapterImage', src: string, width: number, height: number }> }>, titles: Array<{ __typename?: 'MangaTitle', language: ChapterLanguage, value: string }> } };

export type PollChapterMetadataQueryVariables = Exact<{
  chapterId: Scalars['ID']['input'];
}>;


export type PollChapterMetadataQuery = { __typename?: 'Query', metadata?: { __typename?: 'ChapterMetadataRaw', id: string, version: number } | null };

export type MangasQueryVariables = Exact<{
  search?: InputMaybe<Scalars['String']['input']>;
  genres?: InputMaybe<Array<ComicsGenre> | ComicsGenre>;
  statuses?: InputMaybe<Array<ComicsStatus> | ComicsStatus>;
  types?: InputMaybe<Array<ComicsType> | ComicsType>;
  sortBy?: InputMaybe<Scalars['String']['input']>;
  sort?: InputMaybe<Scalars['String']['input']>;
  languages?: InputMaybe<Array<ChapterLanguage> | ChapterLanguage>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  locale: Scalars['String']['input'];
}>;


export type MangasQuery = { __typename?: 'Query', mangas: Array<(
    { __typename?: 'Manga' }
    & { ' $fragmentRefs'?: { 'MangaCardFragment': MangaCardFragment } }
  )> };

export type Manga_ChapterQueryVariables = Exact<{
  slug: Scalars['String']['input'];
  number: Scalars['Float']['input'];
  locale: Scalars['String']['input'];
}>;


export type Manga_ChapterQuery = { __typename?: 'Query', manga?: { __typename?: 'Manga', title: string } | null, chapter: { __typename?: 'Chapter', number: number, languages: Array<ChapterLanguage>, title: string, prevChapter?: { __typename?: 'Chapter', number: number } | null, nextChapter?: { __typename?: 'Chapter', number: number } | null } };

export type Manga_Chapter_UploadQueryVariables = Exact<{
  id: Scalars['String']['input'];
}>;


export type Manga_Chapter_UploadQuery = { __typename?: 'Query', manga?: { __typename?: 'Manga', latestChapter?: { __typename?: 'Chapter', number: number } | null } | null };

export type ChaptersEditQueryVariables = Exact<{
  slug: Scalars['String']['input'];
  locale: Scalars['String']['input'];
  limit: Scalars['Int']['input'];
}>;


export type ChaptersEditQuery = { __typename?: 'Query', manga?: { __typename?: 'Manga', id: string, title: string, chapters: Array<{ __typename?: 'Chapter', id: string, isAIProcessedAt?: string | null, mangaId: string, createdAt: string, number: number, titles: Array<{ __typename?: 'MangaTitle', language: ChapterLanguage, value: string }>, metadata?: { __typename?: 'ChapterMetadataRaw', id: string } | null }> } | null };

export type SignInQueryVariables = Exact<{
  user: UserSignIn;
}>;


export type SignInQuery = { __typename?: 'Query', signIn?: { __typename?: 'User', id: string, name: string, email: string, role: UserRole, image: string, emailVerified: boolean, preferences: { __typename?: 'UserPreferences', targetLanguage?: LocaleEnum | null, sourceLanguage?: LocaleEnum | null } } | null };

export type BookmarksQueryVariables = Exact<{
  locale: Scalars['String']['input'];
}>;


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
  slug: Scalars['ID']['input'];
}>;


export type IsBookmarkedQuery = { __typename?: 'Query', isBookmarked?: string | null };

export type IsLikedQueryVariables = Exact<{
  slug: Scalars['ID']['input'];
}>;


export type IsLikedQuery = { __typename?: 'Query', isLiked?: boolean | null };

export type IsRatedQueryVariables = Exact<{
  slug: Scalars['ID']['input'];
}>;


export type IsRatedQuery = { __typename?: 'Query', isRated?: number | null };

export type MangaEditQueryVariables = Exact<{
  id: Scalars['String']['input'];
}>;


export type MangaEditQuery = { __typename?: 'Query', manga?: { __typename?: 'Manga', id: string, author: string, status: ComicsStatus, type: ComicsType, genres: Array<ComicsGenre>, releaseYear: number, image: string, languages: Array<ChapterLanguage>, titles: Array<{ __typename?: 'MangaTitle', value: string, language: ChapterLanguage }>, descriptions: Array<{ __typename?: 'MangaDescription', value: string, language: ChapterLanguage }>, scrapSources?: { __typename?: 'ScrapSources', asurascans?: string | null } | null } | null };

export type MangaScrapQueryVariables = Exact<{
  id: Scalars['String']['input'];
}>;


export type MangaScrapQuery = { __typename?: 'Query', manga?: { __typename?: 'Manga', latestChapter?: { __typename?: 'Chapter', number: number } | null, scrapSources?: { __typename?: 'ScrapSources', asurascans?: string | null } | null } | null };

export type UserPreferencesQueryVariables = Exact<{ [key: string]: never; }>;


export type UserPreferencesQuery = { __typename?: 'Query', user?: { __typename?: 'User', preferences: { __typename?: 'UserPreferences', targetLanguage?: LocaleEnum | null, sourceLanguage?: LocaleEnum | null } } | null };

export type GetBookmarkedChapterQueryVariables = Exact<{
  slug: Scalars['String']['input'];
  locale: Scalars['String']['input'];
}>;


export type GetBookmarkedChapterQuery = { __typename?: 'Query', getBookmarkedChapter?: { __typename?: 'ChapterBookmark', chapterId: string, chapter?: { __typename?: 'Chapter', title: string, number: number } | null } | null };

export type GetMangaWithBookmarkedChaptersQueryVariables = Exact<{
  locale: Scalars['String']['input'];
}>;


export type GetMangaWithBookmarkedChaptersQuery = { __typename?: 'Query', user?: { __typename?: 'User', chapterBookmarks: Array<{ __typename?: 'ChapterBookmark', createdAt: string, manga?: (
        { __typename?: 'Manga' }
        & { ' $fragmentRefs'?: { 'MangaCardFragment': MangaCardFragment } }
      ) | null, chapter?: { __typename?: 'Chapter', title: string } | null }> } | null };

export type GetLatestUploadedChaptersQueryVariables = Exact<{
  limit: Scalars['Int']['input'];
  offset?: InputMaybe<Scalars['Int']['input']>;
  locale: Scalars['String']['input'];
}>;


export type GetLatestUploadedChaptersQuery = { __typename?: 'Query', latestChapters: Array<{ __typename?: 'Chapter', id: string, createdAt: string, number: number, title: string, languages: Array<ChapterLanguage>, isAIProcessedAt?: string | null, manga: { __typename?: 'Manga', id: string, title: string, slug: string, image: string } }> };

export const MangaCardFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"MangaCard"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Manga"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"locale"},"value":{"kind":"Variable","name":{"kind":"Name","value":"locale"}}}]},{"kind":"Field","name":{"kind":"Name","value":"slug"}},{"kind":"Field","name":{"kind":"Name","value":"image"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"languages"}},{"kind":"Field","name":{"kind":"Name","value":"stats"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"rating"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"value"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"latestChapter"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"number"}},{"kind":"Field","name":{"kind":"Name","value":"title"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"locale"},"value":{"kind":"Variable","name":{"kind":"Name","value":"locale"}}}]}]}}]}}]} as unknown as DocumentNode<MangaCardFragment, unknown>;
export const ChaptersListFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ChaptersList"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Chapter"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"mangaId"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"languages"}},{"kind":"Field","name":{"kind":"Name","value":"title"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"locale"},"value":{"kind":"Variable","name":{"kind":"Name","value":"locale"}}}]},{"kind":"Field","name":{"kind":"Name","value":"isAIProcessedAt"}},{"kind":"Field","name":{"kind":"Name","value":"number"}}]}}]} as unknown as DocumentNode<ChaptersListFragment, unknown>;
export const AddChapterDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"AddChapter"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"chapter"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"AddChapterInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"addChapter"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"chapter"},"value":{"kind":"Variable","name":{"kind":"Name","value":"chapter"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"mangaId"}},{"kind":"Field","name":{"kind":"Name","value":"number"}},{"kind":"Field","name":{"kind":"Name","value":"versions"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"images"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"src"}}]}},{"kind":"Field","name":{"kind":"Name","value":"language"}}]}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}}]}}]}}]} as unknown as DocumentNode<AddChapterMutation, AddChapterMutationVariables>;
export const SignUpDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"SignUp"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"user"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UserSignUp"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"signUp"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"user"},"value":{"kind":"Variable","name":{"kind":"Name","value":"user"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"role"}},{"kind":"Field","name":{"kind":"Name","value":"image"}}]}}]}}]} as unknown as DocumentNode<SignUpMutation, SignUpMutationVariables>;
export const AddBookmarkDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"AddBookmark"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"AddBookmarkInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"addBookmark"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]} as unknown as DocumentNode<AddBookmarkMutation, AddBookmarkMutationVariables>;
export const DeleteBookmarkDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"DeleteBookmark"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"slug"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"deleteBookmark"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"slug"},"value":{"kind":"Variable","name":{"kind":"Name","value":"slug"}}}]}]}}]} as unknown as DocumentNode<DeleteBookmarkMutation, DeleteBookmarkMutationVariables>;
export const LikeDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"like"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"slug"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"like"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"slug"},"value":{"kind":"Variable","name":{"kind":"Name","value":"slug"}}}]}]}}]} as unknown as DocumentNode<LikeMutation, LikeMutationVariables>;
export const UnlikeDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"unlike"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"slug"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"unlike"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"slug"},"value":{"kind":"Variable","name":{"kind":"Name","value":"slug"}}}]}]}}]} as unknown as DocumentNode<UnlikeMutation, UnlikeMutationVariables>;
export const AddRatingDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"addRating"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"RatingInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"addRating"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}]}]}}]} as unknown as DocumentNode<AddRatingMutation, AddRatingMutationVariables>;
export const DeleteRatingDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"deleteRating"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"slug"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"deleteRating"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"slug"},"value":{"kind":"Variable","name":{"kind":"Name","value":"slug"}}}]}]}}]} as unknown as DocumentNode<DeleteRatingMutation, DeleteRatingMutationVariables>;
export const IncrementViewsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"incrementViews"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"incrementViews"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}]}]}}]} as unknown as DocumentNode<IncrementViewsMutation, IncrementViewsMutationVariables>;
export const AddMangaDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"addManga"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"manga"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"AddMangaInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"addManga"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"manga"},"value":{"kind":"Variable","name":{"kind":"Name","value":"manga"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]} as unknown as DocumentNode<AddMangaMutation, AddMangaMutationVariables>;
export const EditMangaDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"editManga"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"manga"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"EditMangaInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"editManga"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"manga"},"value":{"kind":"Variable","name":{"kind":"Name","value":"manga"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]} as unknown as DocumentNode<EditMangaMutation, EditMangaMutationVariables>;
export const DeleteMangaDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"deleteManga"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"deleteManga"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}]}]}}]} as unknown as DocumentNode<DeleteMangaMutation, DeleteMangaMutationVariables>;
export const DeleteChaptersDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"deleteChapters"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"slug"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"ids"}},"type":{"kind":"NonNullType","type":{"kind":"ListType","type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"deleteChapters"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"slug"},"value":{"kind":"Variable","name":{"kind":"Name","value":"slug"}}},{"kind":"Argument","name":{"kind":"Name","value":"ids"},"value":{"kind":"Variable","name":{"kind":"Name","value":"ids"}}}]}]}}]} as unknown as DocumentNode<DeleteChaptersMutation, DeleteChaptersMutationVariables>;
export const AddChapterBookmarkDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"addChapterBookmark"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"slug"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"number"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Float"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"addChapterBookmark"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"slug"},"value":{"kind":"Variable","name":{"kind":"Name","value":"slug"}}},{"kind":"Argument","name":{"kind":"Name","value":"number"},"value":{"kind":"Variable","name":{"kind":"Name","value":"number"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]} as unknown as DocumentNode<AddChapterBookmarkMutation, AddChapterBookmarkMutationVariables>;
export const DeleteChapterBookmarkDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"deleteChapterBookmark"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"chapterId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"deleteChapterBookmark"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"chapterId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"chapterId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]} as unknown as DocumentNode<DeleteChapterBookmarkMutation, DeleteChapterBookmarkMutationVariables>;
export const ToggleChapterAiProcessedDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"toggleChapterAIProcessed"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"toggleIsAIProcessed"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}]}]}}]} as unknown as DocumentNode<ToggleChapterAiProcessedMutation, ToggleChapterAiProcessedMutationVariables>;
export const MangaDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"manga"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"limit"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"offset"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"locale"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"manga"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"locale"},"value":{"kind":"Variable","name":{"kind":"Name","value":"locale"}}}]},{"kind":"Field","name":{"kind":"Name","value":"description"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"locale"},"value":{"kind":"Variable","name":{"kind":"Name","value":"locale"}}}]},{"kind":"Field","name":{"kind":"Name","value":"author"}},{"kind":"Field","name":{"kind":"Name","value":"image"}},{"kind":"Field","name":{"kind":"Name","value":"chapters"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"limit"},"value":{"kind":"Variable","name":{"kind":"Name","value":"limit"}}},{"kind":"Argument","name":{"kind":"Name","value":"offset"},"value":{"kind":"Variable","name":{"kind":"Name","value":"offset"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ChaptersList"}}]}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"genres"}},{"kind":"Field","name":{"kind":"Name","value":"releaseYear"}},{"kind":"Field","name":{"kind":"Name","value":"languages"}},{"kind":"Field","name":{"kind":"Name","value":"firstChapter"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"number"}},{"kind":"Field","name":{"kind":"Name","value":"title"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"locale"},"value":{"kind":"Variable","name":{"kind":"Name","value":"locale"}}}]}]}},{"kind":"Field","name":{"kind":"Name","value":"latestChapter"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"number"}},{"kind":"Field","name":{"kind":"Name","value":"title"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"locale"},"value":{"kind":"Variable","name":{"kind":"Name","value":"locale"}}}]}]}},{"kind":"Field","name":{"kind":"Name","value":"stats"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"bookmarks"}},{"kind":"Field","name":{"kind":"Name","value":"likes"}},{"kind":"Field","name":{"kind":"Name","value":"rating"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"nrVotes"}},{"kind":"Field","name":{"kind":"Name","value":"value"}}]}},{"kind":"Field","name":{"kind":"Name","value":"views"}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ChaptersList"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Chapter"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"mangaId"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"languages"}},{"kind":"Field","name":{"kind":"Name","value":"title"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"locale"},"value":{"kind":"Variable","name":{"kind":"Name","value":"locale"}}}]},{"kind":"Field","name":{"kind":"Name","value":"isAIProcessedAt"}},{"kind":"Field","name":{"kind":"Name","value":"number"}}]}}]} as unknown as DocumentNode<MangaQuery, MangaQueryVariables>;
export const ChaptersDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"chapters"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"limit"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"offset"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"locale"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"isDescending"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Boolean"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"manga"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"chapters"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"limit"},"value":{"kind":"Variable","name":{"kind":"Name","value":"limit"}}},{"kind":"Argument","name":{"kind":"Name","value":"offset"},"value":{"kind":"Variable","name":{"kind":"Name","value":"offset"}}},{"kind":"Argument","name":{"kind":"Name","value":"isDescending"},"value":{"kind":"Variable","name":{"kind":"Name","value":"isDescending"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ChaptersList"}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ChaptersList"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Chapter"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"mangaId"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"languages"}},{"kind":"Field","name":{"kind":"Name","value":"title"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"locale"},"value":{"kind":"Variable","name":{"kind":"Name","value":"locale"}}}]},{"kind":"Field","name":{"kind":"Name","value":"isAIProcessedAt"}},{"kind":"Field","name":{"kind":"Name","value":"number"}}]}}]} as unknown as DocumentNode<ChaptersQuery, ChaptersQueryVariables>;
export const StaticMangasDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"staticMangas"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"mangas"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}}]}}]}}]} as unknown as DocumentNode<StaticMangasQuery, StaticMangasQueryVariables>;
export const MangaMetadataDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"mangaMetadata"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"locale"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"manga"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"locale"},"value":{"kind":"Variable","name":{"kind":"Name","value":"locale"}}}]},{"kind":"Field","name":{"kind":"Name","value":"description"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"locale"},"value":{"kind":"Variable","name":{"kind":"Name","value":"locale"}}}]},{"kind":"Field","name":{"kind":"Name","value":"image"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"genres"}}]}}]}}]} as unknown as DocumentNode<MangaMetadataQuery, MangaMetadataQueryVariables>;
export const ChapterDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"chapter"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"slug"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"number"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Float"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"locale"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"manga"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"slug"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"title"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"locale"},"value":{"kind":"Variable","name":{"kind":"Name","value":"locale"}}}]},{"kind":"Field","name":{"kind":"Name","value":"languages"}}]}},{"kind":"Field","name":{"kind":"Name","value":"chapter"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"slug"},"value":{"kind":"Variable","name":{"kind":"Name","value":"slug"}}},{"kind":"Argument","name":{"kind":"Name","value":"number"},"value":{"kind":"Variable","name":{"kind":"Name","value":"number"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"number"}},{"kind":"Field","name":{"kind":"Name","value":"title"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"locale"},"value":{"kind":"Variable","name":{"kind":"Name","value":"locale"}}}]},{"kind":"Field","name":{"kind":"Name","value":"images"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"images"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"src"}},{"kind":"Field","name":{"kind":"Name","value":"width"}},{"kind":"Field","name":{"kind":"Name","value":"height"}}]}},{"kind":"Field","name":{"kind":"Name","value":"language"}}]}},{"kind":"Field","name":{"kind":"Name","value":"mangaId"}},{"kind":"Field","name":{"kind":"Name","value":"languages"}},{"kind":"Field","name":{"kind":"Name","value":"isAIProcessedAt"}},{"kind":"Field","name":{"kind":"Name","value":"nextChapter"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"number"}}]}},{"kind":"Field","name":{"kind":"Name","value":"prevChapter"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"number"}}]}},{"kind":"Field","name":{"kind":"Name","value":"metadata"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"content"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"style"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"backgroundColor"}},{"kind":"Field","name":{"kind":"Name","value":"backgroundImage"}},{"kind":"Field","name":{"kind":"Name","value":"borderRadius"}},{"kind":"Field","name":{"kind":"Name","value":"textAlign"}},{"kind":"Field","name":{"kind":"Name","value":"fontWeight"}},{"kind":"Field","name":{"kind":"Name","value":"fontStyle"}},{"kind":"Field","name":{"kind":"Name","value":"color"}}]}},{"kind":"Field","name":{"kind":"Name","value":"translatedTexts"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"language"}},{"kind":"Field","name":{"kind":"Name","value":"text"}},{"kind":"Field","name":{"kind":"Name","value":"fontSize"}}]}},{"kind":"Field","name":{"kind":"Name","value":"coords"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"coord"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"x1"}},{"kind":"Field","name":{"kind":"Name","value":"x2"}},{"kind":"Field","name":{"kind":"Name","value":"y1"}},{"kind":"Field","name":{"kind":"Name","value":"y2"}}]}},{"kind":"Field","name":{"kind":"Name","value":"language"}}]}}]}}]}}]}}]}}]} as unknown as DocumentNode<ChapterQuery, ChapterQueryVariables>;
export const ChaptersStaticDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"chaptersStatic"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"mangas"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}},{"kind":"Field","name":{"kind":"Name","value":"chapters"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"number"}},{"kind":"Field","name":{"kind":"Name","value":"languages"}}]}}]}}]}}]} as unknown as DocumentNode<ChaptersStaticQuery, ChaptersStaticQueryVariables>;
export const ChapterMetadataDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"chapterMetadata"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"slug"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"number"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Float"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"locale"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"chapter"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"slug"},"value":{"kind":"Variable","name":{"kind":"Name","value":"slug"}}},{"kind":"Argument","name":{"kind":"Name","value":"number"},"value":{"kind":"Variable","name":{"kind":"Name","value":"number"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"number"}},{"kind":"Field","name":{"kind":"Name","value":"title"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"locale"},"value":{"kind":"Variable","name":{"kind":"Name","value":"locale"}}}]},{"kind":"Field","name":{"kind":"Name","value":"manga"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"title"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"locale"},"value":{"kind":"Variable","name":{"kind":"Name","value":"locale"}}}]},{"kind":"Field","name":{"kind":"Name","value":"image"}}]}},{"kind":"Field","name":{"kind":"Name","value":"languages"}}]}}]}}]} as unknown as DocumentNode<ChapterMetadataQuery, ChapterMetadataQueryVariables>;
export const ChapterEditDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"chapterEdit"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"slug"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"number"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Float"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"chapter"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"slug"},"value":{"kind":"Variable","name":{"kind":"Name","value":"slug"}}},{"kind":"Argument","name":{"kind":"Name","value":"number"},"value":{"kind":"Variable","name":{"kind":"Name","value":"number"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"languages"}},{"kind":"Field","name":{"kind":"Name","value":"images"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"images"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"src"}},{"kind":"Field","name":{"kind":"Name","value":"width"}},{"kind":"Field","name":{"kind":"Name","value":"height"}}]}},{"kind":"Field","name":{"kind":"Name","value":"language"}}]}},{"kind":"Field","name":{"kind":"Name","value":"titles"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"language"}},{"kind":"Field","name":{"kind":"Name","value":"value"}}]}},{"kind":"Field","name":{"kind":"Name","value":"number"}},{"kind":"Field","name":{"kind":"Name","value":"mangaId"}}]}}]}}]} as unknown as DocumentNode<ChapterEditQuery, ChapterEditQueryVariables>;
export const PollChapterMetadataDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"pollChapterMetadata"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"chapterId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"metadata"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"chapterId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"chapterId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"version"}}]}}]}}]} as unknown as DocumentNode<PollChapterMetadataQuery, PollChapterMetadataQueryVariables>;
export const MangasDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"mangas"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"search"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"genres"}},"type":{"kind":"ListType","type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ComicsGenre"}}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"statuses"}},"type":{"kind":"ListType","type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ComicsStatus"}}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"types"}},"type":{"kind":"ListType","type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ComicsType"}}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"sortBy"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"sort"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"languages"}},"type":{"kind":"ListType","type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ChapterLanguage"}}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"limit"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"offset"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"locale"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"mangas"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"search"},"value":{"kind":"Variable","name":{"kind":"Name","value":"search"}}},{"kind":"Argument","name":{"kind":"Name","value":"genres"},"value":{"kind":"Variable","name":{"kind":"Name","value":"genres"}}},{"kind":"Argument","name":{"kind":"Name","value":"statuses"},"value":{"kind":"Variable","name":{"kind":"Name","value":"statuses"}}},{"kind":"Argument","name":{"kind":"Name","value":"types"},"value":{"kind":"Variable","name":{"kind":"Name","value":"types"}}},{"kind":"Argument","name":{"kind":"Name","value":"sortBy"},"value":{"kind":"Variable","name":{"kind":"Name","value":"sortBy"}}},{"kind":"Argument","name":{"kind":"Name","value":"sort"},"value":{"kind":"Variable","name":{"kind":"Name","value":"sort"}}},{"kind":"Argument","name":{"kind":"Name","value":"languages"},"value":{"kind":"Variable","name":{"kind":"Name","value":"languages"}}},{"kind":"Argument","name":{"kind":"Name","value":"limit"},"value":{"kind":"Variable","name":{"kind":"Name","value":"limit"}}},{"kind":"Argument","name":{"kind":"Name","value":"offset"},"value":{"kind":"Variable","name":{"kind":"Name","value":"offset"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"MangaCard"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"MangaCard"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Manga"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"locale"},"value":{"kind":"Variable","name":{"kind":"Name","value":"locale"}}}]},{"kind":"Field","name":{"kind":"Name","value":"slug"}},{"kind":"Field","name":{"kind":"Name","value":"image"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"languages"}},{"kind":"Field","name":{"kind":"Name","value":"stats"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"rating"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"value"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"latestChapter"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"number"}},{"kind":"Field","name":{"kind":"Name","value":"title"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"locale"},"value":{"kind":"Variable","name":{"kind":"Name","value":"locale"}}}]}]}}]}}]} as unknown as DocumentNode<MangasQuery, MangasQueryVariables>;
export const Manga_ChapterDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"manga_chapter"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"slug"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"number"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Float"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"locale"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"manga"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"slug"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"title"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"locale"},"value":{"kind":"Variable","name":{"kind":"Name","value":"locale"}}}]}]}},{"kind":"Field","name":{"kind":"Name","value":"chapter"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"slug"},"value":{"kind":"Variable","name":{"kind":"Name","value":"slug"}}},{"kind":"Argument","name":{"kind":"Name","value":"number"},"value":{"kind":"Variable","name":{"kind":"Name","value":"number"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"number"}},{"kind":"Field","name":{"kind":"Name","value":"languages"}},{"kind":"Field","name":{"kind":"Name","value":"title"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"locale"},"value":{"kind":"Variable","name":{"kind":"Name","value":"locale"}}}]},{"kind":"Field","name":{"kind":"Name","value":"prevChapter"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"number"}}]}},{"kind":"Field","name":{"kind":"Name","value":"nextChapter"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"number"}}]}}]}}]}}]} as unknown as DocumentNode<Manga_ChapterQuery, Manga_ChapterQueryVariables>;
export const Manga_Chapter_UploadDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"manga_chapter_upload"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"manga"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"latestChapter"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"number"}}]}}]}}]}}]} as unknown as DocumentNode<Manga_Chapter_UploadQuery, Manga_Chapter_UploadQueryVariables>;
export const ChaptersEditDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"chaptersEdit"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"slug"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"locale"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"limit"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"manga"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"slug"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"locale"},"value":{"kind":"Variable","name":{"kind":"Name","value":"locale"}}}]},{"kind":"Field","name":{"kind":"Name","value":"chapters"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"limit"},"value":{"kind":"Variable","name":{"kind":"Name","value":"limit"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"isAIProcessedAt"}},{"kind":"Field","name":{"kind":"Name","value":"titles"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"language"}},{"kind":"Field","name":{"kind":"Name","value":"value"}}]}},{"kind":"Field","name":{"kind":"Name","value":"mangaId"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"number"}},{"kind":"Field","name":{"kind":"Name","value":"metadata"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]}}]}}]} as unknown as DocumentNode<ChaptersEditQuery, ChaptersEditQueryVariables>;
export const SignInDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"SignIn"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"user"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UserSignIn"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"signIn"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"user"},"value":{"kind":"Variable","name":{"kind":"Name","value":"user"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"role"}},{"kind":"Field","name":{"kind":"Name","value":"image"}},{"kind":"Field","name":{"kind":"Name","value":"emailVerified"}},{"kind":"Field","name":{"kind":"Name","value":"preferences"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"targetLanguage"}},{"kind":"Field","name":{"kind":"Name","value":"sourceLanguage"}}]}}]}}]}}]} as unknown as DocumentNode<SignInQuery, SignInQueryVariables>;
export const BookmarksDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"bookmarks"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"locale"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"bookmarks"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"inPlans"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"MangaCard"}}]}},{"kind":"Field","name":{"kind":"Name","value":"reading"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"MangaCard"}}]}},{"kind":"Field","name":{"kind":"Name","value":"finished"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"MangaCard"}}]}},{"kind":"Field","name":{"kind":"Name","value":"dropped"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"MangaCard"}}]}},{"kind":"Field","name":{"kind":"Name","value":"favourite"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"MangaCard"}}]}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"MangaCard"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Manga"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"locale"},"value":{"kind":"Variable","name":{"kind":"Name","value":"locale"}}}]},{"kind":"Field","name":{"kind":"Name","value":"slug"}},{"kind":"Field","name":{"kind":"Name","value":"image"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"languages"}},{"kind":"Field","name":{"kind":"Name","value":"stats"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"rating"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"value"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"latestChapter"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"number"}},{"kind":"Field","name":{"kind":"Name","value":"title"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"locale"},"value":{"kind":"Variable","name":{"kind":"Name","value":"locale"}}}]}]}}]}}]} as unknown as DocumentNode<BookmarksQuery, BookmarksQueryVariables>;
export const IsBookmarkedDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"isBookmarked"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"slug"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"isBookmarked"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"slug"},"value":{"kind":"Variable","name":{"kind":"Name","value":"slug"}}}]}]}}]} as unknown as DocumentNode<IsBookmarkedQuery, IsBookmarkedQueryVariables>;
export const IsLikedDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"isLiked"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"slug"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"isLiked"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"slug"},"value":{"kind":"Variable","name":{"kind":"Name","value":"slug"}}}]}]}}]} as unknown as DocumentNode<IsLikedQuery, IsLikedQueryVariables>;
export const IsRatedDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"isRated"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"slug"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"isRated"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"slug"},"value":{"kind":"Variable","name":{"kind":"Name","value":"slug"}}}]}]}}]} as unknown as DocumentNode<IsRatedQuery, IsRatedQueryVariables>;
export const MangaEditDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"mangaEdit"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"manga"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"titles"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"value"}},{"kind":"Field","name":{"kind":"Name","value":"language"}}]}},{"kind":"Field","name":{"kind":"Name","value":"author"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"genres"}},{"kind":"Field","name":{"kind":"Name","value":"descriptions"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"value"}},{"kind":"Field","name":{"kind":"Name","value":"language"}}]}},{"kind":"Field","name":{"kind":"Name","value":"scrapSources"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"asurascans"}}]}},{"kind":"Field","name":{"kind":"Name","value":"releaseYear"}},{"kind":"Field","name":{"kind":"Name","value":"image"}},{"kind":"Field","name":{"kind":"Name","value":"languages"}}]}}]}}]} as unknown as DocumentNode<MangaEditQuery, MangaEditQueryVariables>;
export const MangaScrapDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"mangaScrap"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"manga"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"latestChapter"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"number"}}]}},{"kind":"Field","name":{"kind":"Name","value":"scrapSources"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"asurascans"}}]}}]}}]}}]} as unknown as DocumentNode<MangaScrapQuery, MangaScrapQueryVariables>;
export const UserPreferencesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"userPreferences"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"preferences"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"targetLanguage"}},{"kind":"Field","name":{"kind":"Name","value":"sourceLanguage"}}]}}]}}]}}]} as unknown as DocumentNode<UserPreferencesQuery, UserPreferencesQueryVariables>;
export const GetBookmarkedChapterDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"getBookmarkedChapter"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"slug"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"locale"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"getBookmarkedChapter"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"slug"},"value":{"kind":"Variable","name":{"kind":"Name","value":"slug"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"chapterId"}},{"kind":"Field","name":{"kind":"Name","value":"chapter"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"title"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"locale"},"value":{"kind":"Variable","name":{"kind":"Name","value":"locale"}}}]},{"kind":"Field","name":{"kind":"Name","value":"number"}}]}}]}}]}}]} as unknown as DocumentNode<GetBookmarkedChapterQuery, GetBookmarkedChapterQueryVariables>;
export const GetMangaWithBookmarkedChaptersDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"getMangaWithBookmarkedChapters"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"locale"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"chapterBookmarks"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"manga"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"MangaCard"}}]}},{"kind":"Field","name":{"kind":"Name","value":"chapter"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"title"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"locale"},"value":{"kind":"Variable","name":{"kind":"Name","value":"locale"}}}]}]}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"MangaCard"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Manga"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"locale"},"value":{"kind":"Variable","name":{"kind":"Name","value":"locale"}}}]},{"kind":"Field","name":{"kind":"Name","value":"slug"}},{"kind":"Field","name":{"kind":"Name","value":"image"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"languages"}},{"kind":"Field","name":{"kind":"Name","value":"stats"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"rating"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"value"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"latestChapter"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"number"}},{"kind":"Field","name":{"kind":"Name","value":"title"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"locale"},"value":{"kind":"Variable","name":{"kind":"Name","value":"locale"}}}]}]}}]}}]} as unknown as DocumentNode<GetMangaWithBookmarkedChaptersQuery, GetMangaWithBookmarkedChaptersQueryVariables>;
export const GetLatestUploadedChaptersDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"getLatestUploadedChapters"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"limit"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"offset"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"locale"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"latestChapters"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"limit"},"value":{"kind":"Variable","name":{"kind":"Name","value":"limit"}}},{"kind":"Argument","name":{"kind":"Name","value":"offset"},"value":{"kind":"Variable","name":{"kind":"Name","value":"offset"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"number"}},{"kind":"Field","name":{"kind":"Name","value":"title"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"locale"},"value":{"kind":"Variable","name":{"kind":"Name","value":"locale"}}}]},{"kind":"Field","name":{"kind":"Name","value":"languages"}},{"kind":"Field","name":{"kind":"Name","value":"isAIProcessedAt"}},{"kind":"Field","name":{"kind":"Name","value":"manga"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"locale"},"value":{"kind":"Variable","name":{"kind":"Name","value":"locale"}}}]},{"kind":"Field","name":{"kind":"Name","value":"slug"}},{"kind":"Field","name":{"kind":"Name","value":"image"}}]}}]}}]}}]} as unknown as DocumentNode<GetLatestUploadedChaptersQuery, GetLatestUploadedChaptersQueryVariables>;