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
    "\n  query manga($id: ID!) {\n  manga(id: $id) {\n    id,\n    title,\n    description,\n    author,\n    image,\n    chapters {\n      id,\n      mangaId,\n      postedOn,\n      number\n    },\n    status,\n    type,\n    genres,\n    releaseYear,\n    postedOn,\n    firstChapter {\n      id,\n      number\n    },\n    latestChapter {\n      id,\n      number\n    },\n    stats {\n      bookmarks,\n      likes,\n      rating {\n        nrVotes,\n        value\n      },\n      visitors\n    }\n  }\n}\n": types.MangaDocument,
    "\n  query chapter($id: ID!) {\n    chapter(id: $id) {\n      id,\n      title,\n      number,\n      versions {\n        language,\n        images {\n          src,\n          width,\n          height\n        },\n      }\n      mangaId,\n      isFirst,\n      isLast,\n      languages,\n      nextChapter {\n        id\n      },\n      prevChapter {\n        id\n      }\n    }\n  }\n": types.ChapterDocument,
    "\n  query mangas {\n    mangas {\n      id,\n      title,\n      image,\n      type,\n      status,\n      stats {\n        rating {\n          value\n        }\n      },\n      latestChapter {\n        id\n        number\n      }\n    }\n  }\n": types.MangasDocument,
    "\n  query manga_chapter($mangaId: ID!, $chapterId: ID!) {\n    manga(id: $mangaId) {\n      title,\n      chapters {\n        id,\n        mangaId,\n        postedOn,\n        number\n      } \n    },\n    chapter(id: $chapterId) {\n      number,\n      languages,\n      isLast,\n      isFirst,\n      prevChapter {\n        id\n      },\n      nextChapter {\n        id\n      }\n    }\n  }\n": types.Manga_ChapterDocument,
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
export function gql(source: "\n  query manga($id: ID!) {\n  manga(id: $id) {\n    id,\n    title,\n    description,\n    author,\n    image,\n    chapters {\n      id,\n      mangaId,\n      postedOn,\n      number\n    },\n    status,\n    type,\n    genres,\n    releaseYear,\n    postedOn,\n    firstChapter {\n      id,\n      number\n    },\n    latestChapter {\n      id,\n      number\n    },\n    stats {\n      bookmarks,\n      likes,\n      rating {\n        nrVotes,\n        value\n      },\n      visitors\n    }\n  }\n}\n"): (typeof documents)["\n  query manga($id: ID!) {\n  manga(id: $id) {\n    id,\n    title,\n    description,\n    author,\n    image,\n    chapters {\n      id,\n      mangaId,\n      postedOn,\n      number\n    },\n    status,\n    type,\n    genres,\n    releaseYear,\n    postedOn,\n    firstChapter {\n      id,\n      number\n    },\n    latestChapter {\n      id,\n      number\n    },\n    stats {\n      bookmarks,\n      likes,\n      rating {\n        nrVotes,\n        value\n      },\n      visitors\n    }\n  }\n}\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  query chapter($id: ID!) {\n    chapter(id: $id) {\n      id,\n      title,\n      number,\n      versions {\n        language,\n        images {\n          src,\n          width,\n          height\n        },\n      }\n      mangaId,\n      isFirst,\n      isLast,\n      languages,\n      nextChapter {\n        id\n      },\n      prevChapter {\n        id\n      }\n    }\n  }\n"): (typeof documents)["\n  query chapter($id: ID!) {\n    chapter(id: $id) {\n      id,\n      title,\n      number,\n      versions {\n        language,\n        images {\n          src,\n          width,\n          height\n        },\n      }\n      mangaId,\n      isFirst,\n      isLast,\n      languages,\n      nextChapter {\n        id\n      },\n      prevChapter {\n        id\n      }\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  query mangas {\n    mangas {\n      id,\n      title,\n      image,\n      type,\n      status,\n      stats {\n        rating {\n          value\n        }\n      },\n      latestChapter {\n        id\n        number\n      }\n    }\n  }\n"): (typeof documents)["\n  query mangas {\n    mangas {\n      id,\n      title,\n      image,\n      type,\n      status,\n      stats {\n        rating {\n          value\n        }\n      },\n      latestChapter {\n        id\n        number\n      }\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  query manga_chapter($mangaId: ID!, $chapterId: ID!) {\n    manga(id: $mangaId) {\n      title,\n      chapters {\n        id,\n        mangaId,\n        postedOn,\n        number\n      } \n    },\n    chapter(id: $chapterId) {\n      number,\n      languages,\n      isLast,\n      isFirst,\n      prevChapter {\n        id\n      },\n      nextChapter {\n        id\n      }\n    }\n  }\n"): (typeof documents)["\n  query manga_chapter($mangaId: ID!, $chapterId: ID!) {\n    manga(id: $mangaId) {\n      title,\n      chapters {\n        id,\n        mangaId,\n        postedOn,\n        number\n      } \n    },\n    chapter(id: $chapterId) {\n      number,\n      languages,\n      isLast,\n      isFirst,\n      prevChapter {\n        id\n      },\n      nextChapter {\n        id\n      }\n    }\n  }\n"];

export function gql(source: string) {
  return (documents as any)[source] ?? {};
}

export type DocumentType<TDocumentNode extends DocumentNode<any, any>> = TDocumentNode extends DocumentNode<  infer TType,  any>  ? TType  : never;