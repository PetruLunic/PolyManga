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
    "\n  mutation AddChapter($chapter: AddChapterInput!) {\n    addChapter(chapter: $chapter) {\n      id,\n      mangaId,\n      number,\n      versions {\n        images {\n          src\n        },\n        language\n      }\n      title,\n      createdAt\n    }\n  }\n": types.AddChapterDocument,
    "\n  mutation SignUp($user: UserSignUp!) {\n    signUp(user: $user) {\n      id,\n      role,\n      image\n    }\n  }\n": types.SignUpDocument,
    "\n  mutation AddBookmark($input: AddBookmarkInput!) {\n    addBookmark(input: $input) {\n      id\n    }\n  }\n": types.AddBookmarkDocument,
    "\n  mutation DeleteBookmark($mangaId: String!) {\n    deleteBookmark(mangaId: $mangaId)\n  }\n": types.DeleteBookmarkDocument,
    "\n  mutation like($input: LikeInput!) {\n    like(input: $input)\n  }\n": types.LikeDocument,
    "\n  mutation unlike($objectId: String!) {\n    unlike(objectId: $objectId)\n  }\n": types.UnlikeDocument,
    "\n  mutation addRating($input: RatingInput!) {\n    addRating(input: $input)\n  }\n": types.AddRatingDocument,
    "\n  mutation deleteRating($mangaId: String!) {\n    deleteRating(mangaId: $mangaId)\n  }\n": types.DeleteRatingDocument,
    "\n  mutation incrementViews($id: String!) {\n    incrementViews(id: $id)\n  }\n": types.IncrementViewsDocument,
    "\n  mutation addManga($manga: AddMangaInput!) {\n    addManga(manga: $manga) {\n      id\n    }\n  }\n": types.AddMangaDocument,
    "\n  mutation editManga($manga: EditMangaInput!) {\n    editManga(manga: $manga) {\n      id\n    }\n  }\n": types.EditMangaDocument,
    "\n  mutation deleteManga($id: String!) {\n    deleteManga(id: $id)\n  }\n": types.DeleteMangaDocument,
    "\n  mutation deleteChapters($mangaId: ID!, $ids: [ID!]!) {\n    deleteChapters(mangaId: $mangaId, ids: $ids)\n  }\n": types.DeleteChaptersDocument,
    "\n  fragment MangaCard on Manga {\n    id,\n    title,\n    image,\n    type,\n    status,\n    stats {\n      rating {\n        value\n      }\n    },\n    latestChapter {\n      id\n      number\n    }\n  }\n": types.MangaCardFragmentDoc,
    "\n  query manga($id: ID!) {\n  manga(id: $id) {\n    id,\n    title,\n    description,\n    author,\n    image,\n    chapters {\n      id,\n      mangaId,\n      createdAt,\n      number\n    },\n    status,\n    type,\n    genres,\n    releaseYear,\n    languages,\n    firstChapter {\n      id,\n      number\n    },\n    latestChapter {\n      id,\n      number\n    },\n    stats {\n      bookmarks,\n      likes,\n      rating {\n        nrVotes,\n        value\n      },\n      views\n    }\n  }\n}\n": types.MangaDocument,
    "\n  query chapter($id: ID!) {\n    chapter(id: $id) {\n      id,\n      title,\n      number,\n      versions {\n        language,\n        images {\n          src,\n          width,\n          height\n        },\n      }\n      mangaId,\n      isFirst,\n      isLast,\n      languages,\n      nextChapter {\n        id\n      },\n      prevChapter {\n        id\n      }\n    }\n  }\n": types.ChapterDocument,
    "\n  query mangas($search: String, $genres: [ComicsGenre!], $statuses: [ComicsStatus!], $types: [ComicsType!], $sortBy: String, $sort: String, $languages: [ChapterLanguage!]) {\n    mangas(search: $search, genres: $genres, statuses: $statuses, types: $types, sortBy: $sortBy, sort: $sort, languages: $languages) {\n      ...MangaCard\n    }\n  }\n": types.MangasDocument,
    "\n  query manga_chapter($mangaId: ID!, $chapterId: ID!) {\n    manga(id: $mangaId) {\n      title,\n      chapters {\n        id,\n        mangaId,\n        createdAt,\n        number\n      } \n    },\n    chapter(id: $chapterId) {\n      number,\n      languages,\n      isLast,\n      isFirst,\n      prevChapter {\n        id\n      },\n      nextChapter {\n        id\n      }\n    }\n  }\n": types.Manga_ChapterDocument,
    "\n  query manga_chapter_upload($id: ID!) {\n    manga(id: $id) {\n      latestChapter {\n        number\n      }\n    }\n  }\n": types.Manga_Chapter_UploadDocument,
    "\n  query chapters($id: ID!) {\n    manga(id: $id) {\n     chapters {\n      id,\n      mangaId,\n      createdAt,\n      number\n      }\n    }\n  }\n": types.ChaptersDocument,
    "\n  query SignIn($user: UserSignIn!) {\n    signIn(user: $user) {\n      id,\n      name,\n      email,\n      role,\n      image,\n      emailVerified\n    }\n  }\n": types.SignInDocument,
    "\n  query bookmarks {\n    user {\n      bookmarks {\n        inPlans {\n          ...MangaCard\n        },\n        reading {\n          ...MangaCard\n        },\n        finished {\n          ...MangaCard\n        },\n        dropped {\n          ...MangaCard\n        },\n        favourite {\n          ...MangaCard\n        }\n      }\n    }\n  }\n": types.BookmarksDocument,
    "\n  query isBookmarked($mangaId: String!) {\n    isBookmarked(mangaId: $mangaId)\n  }\n": types.IsBookmarkedDocument,
    "\n  query isLiked($objectId: String!) {\n    isLiked(objectId: $objectId)\n  }\n": types.IsLikedDocument,
    "\n  query isRated($mangaId: String!) {\n    isRated(mangaId: $mangaId)\n  }\n": types.IsRatedDocument,
    "\n  query mangaEdit($id: ID!) {\n    manga(id: $id) {\n      id,\n      title,\n      author,\n      status,\n      type,\n      genres,\n      description,\n      releaseYear,\n      image,\n      languages\n    }\n  }\n": types.MangaEditDocument,
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
export function gql(source: "\n  mutation AddChapter($chapter: AddChapterInput!) {\n    addChapter(chapter: $chapter) {\n      id,\n      mangaId,\n      number,\n      versions {\n        images {\n          src\n        },\n        language\n      }\n      title,\n      createdAt\n    }\n  }\n"): (typeof documents)["\n  mutation AddChapter($chapter: AddChapterInput!) {\n    addChapter(chapter: $chapter) {\n      id,\n      mangaId,\n      number,\n      versions {\n        images {\n          src\n        },\n        language\n      }\n      title,\n      createdAt\n    }\n  }\n"];
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
export function gql(source: "\n  mutation DeleteBookmark($mangaId: String!) {\n    deleteBookmark(mangaId: $mangaId)\n  }\n"): (typeof documents)["\n  mutation DeleteBookmark($mangaId: String!) {\n    deleteBookmark(mangaId: $mangaId)\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  mutation like($input: LikeInput!) {\n    like(input: $input)\n  }\n"): (typeof documents)["\n  mutation like($input: LikeInput!) {\n    like(input: $input)\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  mutation unlike($objectId: String!) {\n    unlike(objectId: $objectId)\n  }\n"): (typeof documents)["\n  mutation unlike($objectId: String!) {\n    unlike(objectId: $objectId)\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  mutation addRating($input: RatingInput!) {\n    addRating(input: $input)\n  }\n"): (typeof documents)["\n  mutation addRating($input: RatingInput!) {\n    addRating(input: $input)\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  mutation deleteRating($mangaId: String!) {\n    deleteRating(mangaId: $mangaId)\n  }\n"): (typeof documents)["\n  mutation deleteRating($mangaId: String!) {\n    deleteRating(mangaId: $mangaId)\n  }\n"];
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
export function gql(source: "\n  mutation deleteChapters($mangaId: ID!, $ids: [ID!]!) {\n    deleteChapters(mangaId: $mangaId, ids: $ids)\n  }\n"): (typeof documents)["\n  mutation deleteChapters($mangaId: ID!, $ids: [ID!]!) {\n    deleteChapters(mangaId: $mangaId, ids: $ids)\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  fragment MangaCard on Manga {\n    id,\n    title,\n    image,\n    type,\n    status,\n    stats {\n      rating {\n        value\n      }\n    },\n    latestChapter {\n      id\n      number\n    }\n  }\n"): (typeof documents)["\n  fragment MangaCard on Manga {\n    id,\n    title,\n    image,\n    type,\n    status,\n    stats {\n      rating {\n        value\n      }\n    },\n    latestChapter {\n      id\n      number\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  query manga($id: ID!) {\n  manga(id: $id) {\n    id,\n    title,\n    description,\n    author,\n    image,\n    chapters {\n      id,\n      mangaId,\n      createdAt,\n      number\n    },\n    status,\n    type,\n    genres,\n    releaseYear,\n    languages,\n    firstChapter {\n      id,\n      number\n    },\n    latestChapter {\n      id,\n      number\n    },\n    stats {\n      bookmarks,\n      likes,\n      rating {\n        nrVotes,\n        value\n      },\n      views\n    }\n  }\n}\n"): (typeof documents)["\n  query manga($id: ID!) {\n  manga(id: $id) {\n    id,\n    title,\n    description,\n    author,\n    image,\n    chapters {\n      id,\n      mangaId,\n      createdAt,\n      number\n    },\n    status,\n    type,\n    genres,\n    releaseYear,\n    languages,\n    firstChapter {\n      id,\n      number\n    },\n    latestChapter {\n      id,\n      number\n    },\n    stats {\n      bookmarks,\n      likes,\n      rating {\n        nrVotes,\n        value\n      },\n      views\n    }\n  }\n}\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  query chapter($id: ID!) {\n    chapter(id: $id) {\n      id,\n      title,\n      number,\n      versions {\n        language,\n        images {\n          src,\n          width,\n          height\n        },\n      }\n      mangaId,\n      isFirst,\n      isLast,\n      languages,\n      nextChapter {\n        id\n      },\n      prevChapter {\n        id\n      }\n    }\n  }\n"): (typeof documents)["\n  query chapter($id: ID!) {\n    chapter(id: $id) {\n      id,\n      title,\n      number,\n      versions {\n        language,\n        images {\n          src,\n          width,\n          height\n        },\n      }\n      mangaId,\n      isFirst,\n      isLast,\n      languages,\n      nextChapter {\n        id\n      },\n      prevChapter {\n        id\n      }\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  query mangas($search: String, $genres: [ComicsGenre!], $statuses: [ComicsStatus!], $types: [ComicsType!], $sortBy: String, $sort: String, $languages: [ChapterLanguage!]) {\n    mangas(search: $search, genres: $genres, statuses: $statuses, types: $types, sortBy: $sortBy, sort: $sort, languages: $languages) {\n      ...MangaCard\n    }\n  }\n"): (typeof documents)["\n  query mangas($search: String, $genres: [ComicsGenre!], $statuses: [ComicsStatus!], $types: [ComicsType!], $sortBy: String, $sort: String, $languages: [ChapterLanguage!]) {\n    mangas(search: $search, genres: $genres, statuses: $statuses, types: $types, sortBy: $sortBy, sort: $sort, languages: $languages) {\n      ...MangaCard\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  query manga_chapter($mangaId: ID!, $chapterId: ID!) {\n    manga(id: $mangaId) {\n      title,\n      chapters {\n        id,\n        mangaId,\n        createdAt,\n        number\n      } \n    },\n    chapter(id: $chapterId) {\n      number,\n      languages,\n      isLast,\n      isFirst,\n      prevChapter {\n        id\n      },\n      nextChapter {\n        id\n      }\n    }\n  }\n"): (typeof documents)["\n  query manga_chapter($mangaId: ID!, $chapterId: ID!) {\n    manga(id: $mangaId) {\n      title,\n      chapters {\n        id,\n        mangaId,\n        createdAt,\n        number\n      } \n    },\n    chapter(id: $chapterId) {\n      number,\n      languages,\n      isLast,\n      isFirst,\n      prevChapter {\n        id\n      },\n      nextChapter {\n        id\n      }\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  query manga_chapter_upload($id: ID!) {\n    manga(id: $id) {\n      latestChapter {\n        number\n      }\n    }\n  }\n"): (typeof documents)["\n  query manga_chapter_upload($id: ID!) {\n    manga(id: $id) {\n      latestChapter {\n        number\n      }\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  query chapters($id: ID!) {\n    manga(id: $id) {\n     chapters {\n      id,\n      mangaId,\n      createdAt,\n      number\n      }\n    }\n  }\n"): (typeof documents)["\n  query chapters($id: ID!) {\n    manga(id: $id) {\n     chapters {\n      id,\n      mangaId,\n      createdAt,\n      number\n      }\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  query SignIn($user: UserSignIn!) {\n    signIn(user: $user) {\n      id,\n      name,\n      email,\n      role,\n      image,\n      emailVerified\n    }\n  }\n"): (typeof documents)["\n  query SignIn($user: UserSignIn!) {\n    signIn(user: $user) {\n      id,\n      name,\n      email,\n      role,\n      image,\n      emailVerified\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  query bookmarks {\n    user {\n      bookmarks {\n        inPlans {\n          ...MangaCard\n        },\n        reading {\n          ...MangaCard\n        },\n        finished {\n          ...MangaCard\n        },\n        dropped {\n          ...MangaCard\n        },\n        favourite {\n          ...MangaCard\n        }\n      }\n    }\n  }\n"): (typeof documents)["\n  query bookmarks {\n    user {\n      bookmarks {\n        inPlans {\n          ...MangaCard\n        },\n        reading {\n          ...MangaCard\n        },\n        finished {\n          ...MangaCard\n        },\n        dropped {\n          ...MangaCard\n        },\n        favourite {\n          ...MangaCard\n        }\n      }\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  query isBookmarked($mangaId: String!) {\n    isBookmarked(mangaId: $mangaId)\n  }\n"): (typeof documents)["\n  query isBookmarked($mangaId: String!) {\n    isBookmarked(mangaId: $mangaId)\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  query isLiked($objectId: String!) {\n    isLiked(objectId: $objectId)\n  }\n"): (typeof documents)["\n  query isLiked($objectId: String!) {\n    isLiked(objectId: $objectId)\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  query isRated($mangaId: String!) {\n    isRated(mangaId: $mangaId)\n  }\n"): (typeof documents)["\n  query isRated($mangaId: String!) {\n    isRated(mangaId: $mangaId)\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  query mangaEdit($id: ID!) {\n    manga(id: $id) {\n      id,\n      title,\n      author,\n      status,\n      type,\n      genres,\n      description,\n      releaseYear,\n      image,\n      languages\n    }\n  }\n"): (typeof documents)["\n  query mangaEdit($id: ID!) {\n    manga(id: $id) {\n      id,\n      title,\n      author,\n      status,\n      type,\n      genres,\n      description,\n      releaseYear,\n      image,\n      languages\n    }\n  }\n"];

export function gql(source: string) {
  return (documents as any)[source] ?? {};
}

export type DocumentType<TDocumentNode extends DocumentNode<any, any>> = TDocumentNode extends DocumentNode<  infer TType,  any>  ? TType  : never;