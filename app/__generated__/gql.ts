/* eslint-disable */
import * as types from './graphql';
import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';

/**
 * Map of all GraphQL operations in the project.
 *
 * This map has several performance disadvantages:
 * 1. It is not tree-shakeable, so it will include all operations in the project.
 * 2. It is not minifiable, so the string of a GraphQL query will be multiple times inside the bundle.
 * 3. It does not support dead code elimination, so it will add unused operations.
 *
 * Therefore it is highly recommended to use the babel or swc plugin for production.
 */
const documents = {
    "\n  mutation AddChapter($chapter: AddChapterInput!) {\n    addChapter(chapter: $chapter) {\n      id,\n      mangaId,\n      number,\n      versions {\n        images {\n          src\n        },\n        language\n      }\n      createdAt\n    }\n  }\n": types.AddChapterDocument,
    "\n  mutation SignUp($user: UserSignUp!) {\n    signUp(user: $user) {\n      id,\n      role,\n      image\n    }\n  }\n": types.SignUpDocument,
    "\n  mutation AddBookmark($input: AddBookmarkInput!) {\n    addBookmark(input: $input) {\n      id\n    }\n  }\n": types.AddBookmarkDocument,
    "\n  mutation DeleteBookmark($slug: String!) {\n    deleteBookmark(slug: $slug)\n  }\n": types.DeleteBookmarkDocument,
    "\n  mutation like($slug: ID!) {\n    like(slug: $slug)\n  }\n": types.LikeDocument,
    "\n  mutation unlike($slug: ID!) {\n    unlike(slug: $slug)\n  }\n": types.UnlikeDocument,
    "\n  mutation addRating($input: RatingInput!) {\n    addRating(input: $input)\n  }\n": types.AddRatingDocument,
    "\n  mutation deleteRating($slug: String!) {\n    deleteRating(slug: $slug)\n  }\n": types.DeleteRatingDocument,
    "\n  mutation incrementViews($id: String!) {\n    incrementViews(id: $id)\n  }\n": types.IncrementViewsDocument,
    "\n  mutation addManga($manga: AddMangaInput!) {\n    addManga(manga: $manga) {\n      id\n    }\n  }\n": types.AddMangaDocument,
    "\n  mutation editManga($manga: EditMangaInput!) {\n    editManga(manga: $manga) {\n      id\n    }\n  }\n": types.EditMangaDocument,
    "\n  mutation deleteManga($id: String!) {\n    deleteManga(id: $id)\n  }\n": types.DeleteMangaDocument,
    "\n  mutation deleteChapters($slug: String!, $ids: [ID!]!) {\n    deleteChapters(slug: $slug, ids: $ids)\n  }\n": types.DeleteChaptersDocument,
    "\n  mutation addChapterBookmark($slug: String!, $number: Float!) {\n    addChapterBookmark(slug: $slug, number: $number) {\n      id\n    }\n  }\n": types.AddChapterBookmarkDocument,
    "\n  mutation deleteChapterBookmark($chapterId: String!) {\n    deleteChapterBookmark(chapterId: $chapterId) {\n      id\n    }\n  }\n": types.DeleteChapterBookmarkDocument,
    "\n  mutation toggleChapterAIProcessed($id: String!) {\n    toggleIsAIProcessed(id: $id)\n  }\n": types.ToggleChapterAiProcessedDocument,
    "\n  fragment MangaCard on Manga {\n    id,\n    title(locale: $locale),\n    slug,\n    image,\n    type,\n    status,\n    languages,\n    stats {\n      rating {\n        value\n      }\n    },\n    latestChapter {\n      id\n      number,\n      title(locale: $locale)\n    }\n  }\n": types.MangaCardFragmentDoc,
    "\n  fragment ChaptersList on Chapter {\n    id,\n    mangaId,\n    createdAt,\n    languages,\n    title(locale: $locale),\n    isAIProcessedAt,\n    number\n  }\n": types.ChaptersListFragmentDoc,
    "\n  query manga($id: String!, $limit: Int, $offset: Int, $locale: String) {\n  manga(id: $id) {\n    id,\n    title(locale: $locale),\n    description(locale: $locale),\n    author,\n    image,\n    chapters(limit: $limit, offset: $offset) {\n      ...ChaptersList\n    },\n    status,\n    type,\n    genres,\n    releaseYear,\n    languages,\n    firstChapter {\n      id,\n      number,\n      title(locale: $locale),\n    },\n    latestChapter {\n      id,\n      number,\n      title(locale: $locale)\n    },\n    stats {\n      bookmarks,\n      likes,\n      rating {\n        nrVotes,\n        value\n      },\n      views,\n    }\n  }\n}\n": types.MangaDocument,
    "\n  query chapters($id: String!, $limit: Int, $offset: Int, $locale: String, $isDescending: Boolean) {\n    manga(id: $id) {\n      id,\n      chapters(limit: $limit, offset: $offset, isDescending: $isDescending) {\n      ...ChaptersList\n      }\n    }\n  }\n": types.ChaptersDocument,
    "\n  query staticMangas {\n    mangas {\n      id,\n      slug\n    }\n  }\n": types.StaticMangasDocument,
    "\n  query mangaMetadata($id: String!, $locale: String!) {\n    manga(id: $id) {\n      id,\n      title(locale: $locale),\n      description(locale: $locale),\n      image,\n      type,\n      genres\n    }\n  }\n": types.MangaMetadataDocument,
    "\n  query chapter($slug: String!, $number: Float!, $locale: String!) {\n    manga(id: $slug) {\n      title(locale: $locale),\n      languages\n    },\n    chapter(slug: $slug, number: $number) {\n      id,\n      number,\n      title(locale: $locale),\n      images {\n        images {\n          src,\n            width,\n            height\n        },\n        language\n      },\n      mangaId,\n      languages,\n      isAIProcessedAt,\n      nextChapter {\n        number\n      },\n      prevChapter {\n        number\n      },\n      metadata {\n        content {\n          style {\n            backgroundColor,\n            backgroundImage,\n            borderRadius,\n            textAlign,\n            fontWeight,\n            fontStyle,\n            color\n          },\n          translatedTexts {\n            language,\n            text,\n            fontSize\n          },\n          coords {\n            coord {\n              x1,\n              x2,\n              y1,\n              y2\n            },\n            language\n          }\n        }\n      }\n    }\n  }\n": types.ChapterDocument,
    "\n  query chaptersStatic {\n    mangas {\n      id,\n      slug,\n      chapters {\n        number,\n        languages\n      }\n    }\n  }\n": types.ChaptersStaticDocument,
    "\n  query chapterMetadata($slug: String!, $number: Float!, $locale: String!) {\n    chapter(slug: $slug, number: $number) {\n      id,\n      number,\n      title(locale: $locale),\n      manga {\n        title(locale: $locale),\n        image\n      },\n      languages\n    }\n  }\n": types.ChapterMetadataDocument,
    "\n  query chapterEdit($slug: String!, $number: Float!) {\n    chapter(slug: $slug, number: $number) {\n      id,\n      languages,\n      images {\n        images {\n          src,\n          width,\n          height\n        },\n        language\n      },\n      titles {\n        language,\n        value\n      },\n      number,\n      mangaId\n    }\n  }\n": types.ChapterEditDocument,
    "\n  query pollChapterMetadata($chapterId: ID!) {\n    metadata(chapterId: $chapterId) {\n      id,\n      version\n    }\n  }\n": types.PollChapterMetadataDocument,
    "\n  query mangas($search: String, $genres: [ComicsGenre!], $statuses: [ComicsStatus!], $types: [ComicsType!], $sortBy: String, $sort: String, $languages: [ChapterLanguage!], $limit: Int, $offset: Int, $locale: String!) {\n    mangas(search: $search, genres: $genres, statuses: $statuses, types: $types, sortBy: $sortBy, sort: $sort, languages: $languages, limit: $limit, offset: $offset) {\n      ...MangaCard\n    }\n  }\n": types.MangasDocument,
    "\n  query manga_chapter($slug: String!, $number: Float!, $locale: String!) {\n    manga(id: $slug) {\n      title(locale: $locale)\n    },\n    chapter(slug: $slug, number: $number) {\n      number,\n      languages,\n      title(locale: $locale),\n      prevChapter {\n        number\n      },\n      nextChapter {\n        number\n      }\n    }\n  }\n": types.Manga_ChapterDocument,
    "\n  query manga_chapter_upload($id: String!) {\n    manga(id: $id) {\n      latestChapter {\n        number\n      }\n    }\n  }\n": types.Manga_Chapter_UploadDocument,
    "\n  query chaptersEdit($slug: String!, $locale: String!, $limit: Int!) {\n    manga(id: $slug) {\n      id,\n      title(locale: $locale),\n     chapters(limit: $limit) {\n      id,\n      isAIProcessedAt,\n      titles {\n        language,\n        value\n      },\n      mangaId,\n      createdAt,\n      number,\n      metadata {\n        id\n       }\n      }\n    }\n  }\n": types.ChaptersEditDocument,
    "\n  query SignIn($user: UserSignIn!) {\n    signIn(user: $user) {\n      id,\n      name,\n      email,\n      role,\n      image,\n      emailVerified,\n      preferences {\n        targetLanguage,\n        sourceLanguage\n      }\n    }\n  }\n": types.SignInDocument,
    "\n  query bookmarks($locale: String!) {\n    user {\n      bookmarks {\n        inPlans {\n          ...MangaCard\n        },\n        reading {\n          ...MangaCard\n        },\n        finished {\n          ...MangaCard\n        },\n        dropped {\n          ...MangaCard\n        },\n        favourite {\n          ...MangaCard\n        }\n      }\n    }\n  }\n": types.BookmarksDocument,
    "\n  query isBookmarked($slug: ID!) {\n    isBookmarked(slug: $slug)\n  }\n": types.IsBookmarkedDocument,
    "\n  query isLiked($slug: ID!) {\n    isLiked(slug: $slug)\n  }\n": types.IsLikedDocument,
    "\n  query isRated($slug: ID!) {\n    isRated(slug: $slug)\n  }\n": types.IsRatedDocument,
    "\n  query mangaEdit($id: String!) {\n    manga(id: $id) {\n      id,\n      titles {\n        value,\n        language\n      },\n      author,\n      status,\n      type,\n      genres,\n      descriptions {\n        value,\n        language\n      },\n      scrapSources {\n        asurascans\n      } \n      releaseYear,\n      image,\n      languages\n    }\n  }\n": types.MangaEditDocument,
    "\n  query mangaScrap($id: String!) {\n    manga(id: $id) {\n      chapters(limit: 9999) {\n        number\n      },\n      scrapSources {\n        asurascans\n      } \n    }\n  }\n": types.MangaScrapDocument,
    "\n    query userPreferences {\n      user {\n        preferences {\n          targetLanguage,\n          sourceLanguage\n        }\n      }\n    }\n": types.UserPreferencesDocument,
    "\n  query getBookmarkedChapter($slug: String!, $locale: String!) {\n    getBookmarkedChapter(slug: $slug) {\n      chapterId,\n      chapter {\n        title(locale: $locale),\n        number\n      }\n    }\n  }\n": types.GetBookmarkedChapterDocument,
    "\n  query getMangaWithBookmarkedChapters($locale: String!) {\n    user {\n      chapterBookmarks {\n        manga {\n          ...MangaCard\n        },\n        chapter {\n          title(locale: $locale),\n        },\n        createdAt\n      }\n    }\n  }\n": types.GetMangaWithBookmarkedChaptersDocument,
    "\n  query getLatestUploadedChapters($limit: Int!, $offset: Int, $locale: String!) {\n    latestChapters(limit: $limit, offset: $offset) {\n      id,\n      createdAt,\n      number,\n      title(locale: $locale),\n      languages,\n      isAIProcessedAt,\n      manga {\n        id,\n        title(locale: $locale),\n        slug,\n        image\n      }\n    }\n  }\n": types.GetLatestUploadedChaptersDocument,
};

/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 *
 *
 * @example
 * ```ts
 * const query = gql(`query GetUser($id: ID!) { user(id: $id) { name } }`);
 * ```
 *
 * The query argument is unknown!
 * Please regenerate the types.
 */
export function gql(source: string): unknown;

/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  mutation AddChapter($chapter: AddChapterInput!) {\n    addChapter(chapter: $chapter) {\n      id,\n      mangaId,\n      number,\n      versions {\n        images {\n          src\n        },\n        language\n      }\n      createdAt\n    }\n  }\n"): (typeof documents)["\n  mutation AddChapter($chapter: AddChapterInput!) {\n    addChapter(chapter: $chapter) {\n      id,\n      mangaId,\n      number,\n      versions {\n        images {\n          src\n        },\n        language\n      }\n      createdAt\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  mutation SignUp($user: UserSignUp!) {\n    signUp(user: $user) {\n      id,\n      role,\n      image\n    }\n  }\n"): (typeof documents)["\n  mutation SignUp($user: UserSignUp!) {\n    signUp(user: $user) {\n      id,\n      role,\n      image\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  mutation AddBookmark($input: AddBookmarkInput!) {\n    addBookmark(input: $input) {\n      id\n    }\n  }\n"): (typeof documents)["\n  mutation AddBookmark($input: AddBookmarkInput!) {\n    addBookmark(input: $input) {\n      id\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  mutation DeleteBookmark($slug: String!) {\n    deleteBookmark(slug: $slug)\n  }\n"): (typeof documents)["\n  mutation DeleteBookmark($slug: String!) {\n    deleteBookmark(slug: $slug)\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  mutation like($slug: ID!) {\n    like(slug: $slug)\n  }\n"): (typeof documents)["\n  mutation like($slug: ID!) {\n    like(slug: $slug)\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  mutation unlike($slug: ID!) {\n    unlike(slug: $slug)\n  }\n"): (typeof documents)["\n  mutation unlike($slug: ID!) {\n    unlike(slug: $slug)\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  mutation addRating($input: RatingInput!) {\n    addRating(input: $input)\n  }\n"): (typeof documents)["\n  mutation addRating($input: RatingInput!) {\n    addRating(input: $input)\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  mutation deleteRating($slug: String!) {\n    deleteRating(slug: $slug)\n  }\n"): (typeof documents)["\n  mutation deleteRating($slug: String!) {\n    deleteRating(slug: $slug)\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  mutation incrementViews($id: String!) {\n    incrementViews(id: $id)\n  }\n"): (typeof documents)["\n  mutation incrementViews($id: String!) {\n    incrementViews(id: $id)\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  mutation addManga($manga: AddMangaInput!) {\n    addManga(manga: $manga) {\n      id\n    }\n  }\n"): (typeof documents)["\n  mutation addManga($manga: AddMangaInput!) {\n    addManga(manga: $manga) {\n      id\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  mutation editManga($manga: EditMangaInput!) {\n    editManga(manga: $manga) {\n      id\n    }\n  }\n"): (typeof documents)["\n  mutation editManga($manga: EditMangaInput!) {\n    editManga(manga: $manga) {\n      id\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  mutation deleteManga($id: String!) {\n    deleteManga(id: $id)\n  }\n"): (typeof documents)["\n  mutation deleteManga($id: String!) {\n    deleteManga(id: $id)\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  mutation deleteChapters($slug: String!, $ids: [ID!]!) {\n    deleteChapters(slug: $slug, ids: $ids)\n  }\n"): (typeof documents)["\n  mutation deleteChapters($slug: String!, $ids: [ID!]!) {\n    deleteChapters(slug: $slug, ids: $ids)\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  mutation addChapterBookmark($slug: String!, $number: Float!) {\n    addChapterBookmark(slug: $slug, number: $number) {\n      id\n    }\n  }\n"): (typeof documents)["\n  mutation addChapterBookmark($slug: String!, $number: Float!) {\n    addChapterBookmark(slug: $slug, number: $number) {\n      id\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  mutation deleteChapterBookmark($chapterId: String!) {\n    deleteChapterBookmark(chapterId: $chapterId) {\n      id\n    }\n  }\n"): (typeof documents)["\n  mutation deleteChapterBookmark($chapterId: String!) {\n    deleteChapterBookmark(chapterId: $chapterId) {\n      id\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  mutation toggleChapterAIProcessed($id: String!) {\n    toggleIsAIProcessed(id: $id)\n  }\n"): (typeof documents)["\n  mutation toggleChapterAIProcessed($id: String!) {\n    toggleIsAIProcessed(id: $id)\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  fragment MangaCard on Manga {\n    id,\n    title(locale: $locale),\n    slug,\n    image,\n    type,\n    status,\n    languages,\n    stats {\n      rating {\n        value\n      }\n    },\n    latestChapter {\n      id\n      number,\n      title(locale: $locale)\n    }\n  }\n"): (typeof documents)["\n  fragment MangaCard on Manga {\n    id,\n    title(locale: $locale),\n    slug,\n    image,\n    type,\n    status,\n    languages,\n    stats {\n      rating {\n        value\n      }\n    },\n    latestChapter {\n      id\n      number,\n      title(locale: $locale)\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  fragment ChaptersList on Chapter {\n    id,\n    mangaId,\n    createdAt,\n    languages,\n    title(locale: $locale),\n    isAIProcessedAt,\n    number\n  }\n"): (typeof documents)["\n  fragment ChaptersList on Chapter {\n    id,\n    mangaId,\n    createdAt,\n    languages,\n    title(locale: $locale),\n    isAIProcessedAt,\n    number\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  query manga($id: String!, $limit: Int, $offset: Int, $locale: String) {\n  manga(id: $id) {\n    id,\n    title(locale: $locale),\n    description(locale: $locale),\n    author,\n    image,\n    chapters(limit: $limit, offset: $offset) {\n      ...ChaptersList\n    },\n    status,\n    type,\n    genres,\n    releaseYear,\n    languages,\n    firstChapter {\n      id,\n      number,\n      title(locale: $locale),\n    },\n    latestChapter {\n      id,\n      number,\n      title(locale: $locale)\n    },\n    stats {\n      bookmarks,\n      likes,\n      rating {\n        nrVotes,\n        value\n      },\n      views,\n    }\n  }\n}\n"): (typeof documents)["\n  query manga($id: String!, $limit: Int, $offset: Int, $locale: String) {\n  manga(id: $id) {\n    id,\n    title(locale: $locale),\n    description(locale: $locale),\n    author,\n    image,\n    chapters(limit: $limit, offset: $offset) {\n      ...ChaptersList\n    },\n    status,\n    type,\n    genres,\n    releaseYear,\n    languages,\n    firstChapter {\n      id,\n      number,\n      title(locale: $locale),\n    },\n    latestChapter {\n      id,\n      number,\n      title(locale: $locale)\n    },\n    stats {\n      bookmarks,\n      likes,\n      rating {\n        nrVotes,\n        value\n      },\n      views,\n    }\n  }\n}\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  query chapters($id: String!, $limit: Int, $offset: Int, $locale: String, $isDescending: Boolean) {\n    manga(id: $id) {\n      id,\n      chapters(limit: $limit, offset: $offset, isDescending: $isDescending) {\n      ...ChaptersList\n      }\n    }\n  }\n"): (typeof documents)["\n  query chapters($id: String!, $limit: Int, $offset: Int, $locale: String, $isDescending: Boolean) {\n    manga(id: $id) {\n      id,\n      chapters(limit: $limit, offset: $offset, isDescending: $isDescending) {\n      ...ChaptersList\n      }\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  query staticMangas {\n    mangas {\n      id,\n      slug\n    }\n  }\n"): (typeof documents)["\n  query staticMangas {\n    mangas {\n      id,\n      slug\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  query mangaMetadata($id: String!, $locale: String!) {\n    manga(id: $id) {\n      id,\n      title(locale: $locale),\n      description(locale: $locale),\n      image,\n      type,\n      genres\n    }\n  }\n"): (typeof documents)["\n  query mangaMetadata($id: String!, $locale: String!) {\n    manga(id: $id) {\n      id,\n      title(locale: $locale),\n      description(locale: $locale),\n      image,\n      type,\n      genres\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  query chapter($slug: String!, $number: Float!, $locale: String!) {\n    manga(id: $slug) {\n      title(locale: $locale),\n      languages\n    },\n    chapter(slug: $slug, number: $number) {\n      id,\n      number,\n      title(locale: $locale),\n      images {\n        images {\n          src,\n            width,\n            height\n        },\n        language\n      },\n      mangaId,\n      languages,\n      isAIProcessedAt,\n      nextChapter {\n        number\n      },\n      prevChapter {\n        number\n      },\n      metadata {\n        content {\n          style {\n            backgroundColor,\n            backgroundImage,\n            borderRadius,\n            textAlign,\n            fontWeight,\n            fontStyle,\n            color\n          },\n          translatedTexts {\n            language,\n            text,\n            fontSize\n          },\n          coords {\n            coord {\n              x1,\n              x2,\n              y1,\n              y2\n            },\n            language\n          }\n        }\n      }\n    }\n  }\n"): (typeof documents)["\n  query chapter($slug: String!, $number: Float!, $locale: String!) {\n    manga(id: $slug) {\n      title(locale: $locale),\n      languages\n    },\n    chapter(slug: $slug, number: $number) {\n      id,\n      number,\n      title(locale: $locale),\n      images {\n        images {\n          src,\n            width,\n            height\n        },\n        language\n      },\n      mangaId,\n      languages,\n      isAIProcessedAt,\n      nextChapter {\n        number\n      },\n      prevChapter {\n        number\n      },\n      metadata {\n        content {\n          style {\n            backgroundColor,\n            backgroundImage,\n            borderRadius,\n            textAlign,\n            fontWeight,\n            fontStyle,\n            color\n          },\n          translatedTexts {\n            language,\n            text,\n            fontSize\n          },\n          coords {\n            coord {\n              x1,\n              x2,\n              y1,\n              y2\n            },\n            language\n          }\n        }\n      }\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  query chaptersStatic {\n    mangas {\n      id,\n      slug,\n      chapters {\n        number,\n        languages\n      }\n    }\n  }\n"): (typeof documents)["\n  query chaptersStatic {\n    mangas {\n      id,\n      slug,\n      chapters {\n        number,\n        languages\n      }\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  query chapterMetadata($slug: String!, $number: Float!, $locale: String!) {\n    chapter(slug: $slug, number: $number) {\n      id,\n      number,\n      title(locale: $locale),\n      manga {\n        title(locale: $locale),\n        image\n      },\n      languages\n    }\n  }\n"): (typeof documents)["\n  query chapterMetadata($slug: String!, $number: Float!, $locale: String!) {\n    chapter(slug: $slug, number: $number) {\n      id,\n      number,\n      title(locale: $locale),\n      manga {\n        title(locale: $locale),\n        image\n      },\n      languages\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  query chapterEdit($slug: String!, $number: Float!) {\n    chapter(slug: $slug, number: $number) {\n      id,\n      languages,\n      images {\n        images {\n          src,\n          width,\n          height\n        },\n        language\n      },\n      titles {\n        language,\n        value\n      },\n      number,\n      mangaId\n    }\n  }\n"): (typeof documents)["\n  query chapterEdit($slug: String!, $number: Float!) {\n    chapter(slug: $slug, number: $number) {\n      id,\n      languages,\n      images {\n        images {\n          src,\n          width,\n          height\n        },\n        language\n      },\n      titles {\n        language,\n        value\n      },\n      number,\n      mangaId\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  query pollChapterMetadata($chapterId: ID!) {\n    metadata(chapterId: $chapterId) {\n      id,\n      version\n    }\n  }\n"): (typeof documents)["\n  query pollChapterMetadata($chapterId: ID!) {\n    metadata(chapterId: $chapterId) {\n      id,\n      version\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  query mangas($search: String, $genres: [ComicsGenre!], $statuses: [ComicsStatus!], $types: [ComicsType!], $sortBy: String, $sort: String, $languages: [ChapterLanguage!], $limit: Int, $offset: Int, $locale: String!) {\n    mangas(search: $search, genres: $genres, statuses: $statuses, types: $types, sortBy: $sortBy, sort: $sort, languages: $languages, limit: $limit, offset: $offset) {\n      ...MangaCard\n    }\n  }\n"): (typeof documents)["\n  query mangas($search: String, $genres: [ComicsGenre!], $statuses: [ComicsStatus!], $types: [ComicsType!], $sortBy: String, $sort: String, $languages: [ChapterLanguage!], $limit: Int, $offset: Int, $locale: String!) {\n    mangas(search: $search, genres: $genres, statuses: $statuses, types: $types, sortBy: $sortBy, sort: $sort, languages: $languages, limit: $limit, offset: $offset) {\n      ...MangaCard\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  query manga_chapter($slug: String!, $number: Float!, $locale: String!) {\n    manga(id: $slug) {\n      title(locale: $locale)\n    },\n    chapter(slug: $slug, number: $number) {\n      number,\n      languages,\n      title(locale: $locale),\n      prevChapter {\n        number\n      },\n      nextChapter {\n        number\n      }\n    }\n  }\n"): (typeof documents)["\n  query manga_chapter($slug: String!, $number: Float!, $locale: String!) {\n    manga(id: $slug) {\n      title(locale: $locale)\n    },\n    chapter(slug: $slug, number: $number) {\n      number,\n      languages,\n      title(locale: $locale),\n      prevChapter {\n        number\n      },\n      nextChapter {\n        number\n      }\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  query manga_chapter_upload($id: String!) {\n    manga(id: $id) {\n      latestChapter {\n        number\n      }\n    }\n  }\n"): (typeof documents)["\n  query manga_chapter_upload($id: String!) {\n    manga(id: $id) {\n      latestChapter {\n        number\n      }\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  query chaptersEdit($slug: String!, $locale: String!, $limit: Int!) {\n    manga(id: $slug) {\n      id,\n      title(locale: $locale),\n     chapters(limit: $limit) {\n      id,\n      isAIProcessedAt,\n      titles {\n        language,\n        value\n      },\n      mangaId,\n      createdAt,\n      number,\n      metadata {\n        id\n       }\n      }\n    }\n  }\n"): (typeof documents)["\n  query chaptersEdit($slug: String!, $locale: String!, $limit: Int!) {\n    manga(id: $slug) {\n      id,\n      title(locale: $locale),\n     chapters(limit: $limit) {\n      id,\n      isAIProcessedAt,\n      titles {\n        language,\n        value\n      },\n      mangaId,\n      createdAt,\n      number,\n      metadata {\n        id\n       }\n      }\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  query SignIn($user: UserSignIn!) {\n    signIn(user: $user) {\n      id,\n      name,\n      email,\n      role,\n      image,\n      emailVerified,\n      preferences {\n        targetLanguage,\n        sourceLanguage\n      }\n    }\n  }\n"): (typeof documents)["\n  query SignIn($user: UserSignIn!) {\n    signIn(user: $user) {\n      id,\n      name,\n      email,\n      role,\n      image,\n      emailVerified,\n      preferences {\n        targetLanguage,\n        sourceLanguage\n      }\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  query bookmarks($locale: String!) {\n    user {\n      bookmarks {\n        inPlans {\n          ...MangaCard\n        },\n        reading {\n          ...MangaCard\n        },\n        finished {\n          ...MangaCard\n        },\n        dropped {\n          ...MangaCard\n        },\n        favourite {\n          ...MangaCard\n        }\n      }\n    }\n  }\n"): (typeof documents)["\n  query bookmarks($locale: String!) {\n    user {\n      bookmarks {\n        inPlans {\n          ...MangaCard\n        },\n        reading {\n          ...MangaCard\n        },\n        finished {\n          ...MangaCard\n        },\n        dropped {\n          ...MangaCard\n        },\n        favourite {\n          ...MangaCard\n        }\n      }\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  query isBookmarked($slug: ID!) {\n    isBookmarked(slug: $slug)\n  }\n"): (typeof documents)["\n  query isBookmarked($slug: ID!) {\n    isBookmarked(slug: $slug)\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  query isLiked($slug: ID!) {\n    isLiked(slug: $slug)\n  }\n"): (typeof documents)["\n  query isLiked($slug: ID!) {\n    isLiked(slug: $slug)\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  query isRated($slug: ID!) {\n    isRated(slug: $slug)\n  }\n"): (typeof documents)["\n  query isRated($slug: ID!) {\n    isRated(slug: $slug)\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  query mangaEdit($id: String!) {\n    manga(id: $id) {\n      id,\n      titles {\n        value,\n        language\n      },\n      author,\n      status,\n      type,\n      genres,\n      descriptions {\n        value,\n        language\n      },\n      scrapSources {\n        asurascans\n      } \n      releaseYear,\n      image,\n      languages\n    }\n  }\n"): (typeof documents)["\n  query mangaEdit($id: String!) {\n    manga(id: $id) {\n      id,\n      titles {\n        value,\n        language\n      },\n      author,\n      status,\n      type,\n      genres,\n      descriptions {\n        value,\n        language\n      },\n      scrapSources {\n        asurascans\n      } \n      releaseYear,\n      image,\n      languages\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  query mangaScrap($id: String!) {\n    manga(id: $id) {\n      chapters(limit: 9999) {\n        number\n      },\n      scrapSources {\n        asurascans\n      } \n    }\n  }\n"): (typeof documents)["\n  query mangaScrap($id: String!) {\n    manga(id: $id) {\n      chapters(limit: 9999) {\n        number\n      },\n      scrapSources {\n        asurascans\n      } \n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n    query userPreferences {\n      user {\n        preferences {\n          targetLanguage,\n          sourceLanguage\n        }\n      }\n    }\n"): (typeof documents)["\n    query userPreferences {\n      user {\n        preferences {\n          targetLanguage,\n          sourceLanguage\n        }\n      }\n    }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  query getBookmarkedChapter($slug: String!, $locale: String!) {\n    getBookmarkedChapter(slug: $slug) {\n      chapterId,\n      chapter {\n        title(locale: $locale),\n        number\n      }\n    }\n  }\n"): (typeof documents)["\n  query getBookmarkedChapter($slug: String!, $locale: String!) {\n    getBookmarkedChapter(slug: $slug) {\n      chapterId,\n      chapter {\n        title(locale: $locale),\n        number\n      }\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  query getMangaWithBookmarkedChapters($locale: String!) {\n    user {\n      chapterBookmarks {\n        manga {\n          ...MangaCard\n        },\n        chapter {\n          title(locale: $locale),\n        },\n        createdAt\n      }\n    }\n  }\n"): (typeof documents)["\n  query getMangaWithBookmarkedChapters($locale: String!) {\n    user {\n      chapterBookmarks {\n        manga {\n          ...MangaCard\n        },\n        chapter {\n          title(locale: $locale),\n        },\n        createdAt\n      }\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  query getLatestUploadedChapters($limit: Int!, $offset: Int, $locale: String!) {\n    latestChapters(limit: $limit, offset: $offset) {\n      id,\n      createdAt,\n      number,\n      title(locale: $locale),\n      languages,\n      isAIProcessedAt,\n      manga {\n        id,\n        title(locale: $locale),\n        slug,\n        image\n      }\n    }\n  }\n"): (typeof documents)["\n  query getLatestUploadedChapters($limit: Int!, $offset: Int, $locale: String!) {\n    latestChapters(limit: $limit, offset: $offset) {\n      id,\n      createdAt,\n      number,\n      title(locale: $locale),\n      languages,\n      isAIProcessedAt,\n      manga {\n        id,\n        title(locale: $locale),\n        slug,\n        image\n      }\n    }\n  }\n"];

export function gql(source: string) {
  return (documents as any)[source] ?? {};
}

export type DocumentType<TDocumentNode extends DocumentNode<any, any>> = TDocumentNode extends DocumentNode<  infer TType,  any>  ? TType  : never;