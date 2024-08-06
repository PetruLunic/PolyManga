import {gql} from "@/app/__generated__";

export const MANGA_CARD = gql(`
  fragment MangaCard on Manga {
    id,
    title,
    image,
    type,
    status,
    stats {
      rating {
        value
      }
    },
    latestChapter {
      id
      number
    }
  }
`)

export const GET_MANGA = gql(`
  query manga($id: ID!) {
  manga(id: $id) {
    id,
    title,
    description,
    author,
    image,
    chapters {
      id,
      mangaId,
      createdAt,
      number
    },
    status,
    type,
    genres,
    releaseYear,
    languages,
    firstChapter {
      id,
      number
    },
    latestChapter {
      id,
      number
    },
    stats {
      bookmarks,
      likes,
      rating {
        nrVotes,
        value
      },
      views
    }
  }
}
`)

export const GET_CHAPTER = gql(`
  query chapter($id: ID!) {
    chapter(id: $id) {
      id,
      title,
      number,
      versions {
        language,
        images {
          src,
          width,
          height
        },
      }
      mangaId,
      isFirst,
      isLast,
      languages,
      nextChapter {
        id
      },
      prevChapter {
        id
      }
    }
  }
`)

export const GET_MANGA_CARDS = gql(`
  query mangas($search: String, $genres: [ComicsGenre!], $statuses: [ComicsStatus!], $types: [ComicsType!], $sortBy: String, $sort: String, $languages: [ChapterLanguage!]) {
    mangas(search: $search, genres: $genres, statuses: $statuses, types: $types, sortBy: $sortBy, sort: $sort, languages: $languages) {
      ...MangaCard
    }
  }
`)

export const GET_NAVBAR_CHAPTER = gql(`
  query manga_chapter($mangaId: ID!, $chapterId: ID!) {
    manga(id: $mangaId) {
      title,
      chapters {
        id,
        mangaId,
        createdAt,
        number
      } 
    },
    chapter(id: $chapterId) {
      number,
      languages,
      isLast,
      isFirst,
      prevChapter {
        id
      },
      nextChapter {
        id
      }
    }
  }
`)

export const GET_MANGA_CHAPTER_UPLOAD = gql(`
  query manga_chapter_upload($id: ID!) {
    manga(id: $id) {
      latestChapter {
        number
      }
    }
  }
`)

export const GET_CHAPTERS = gql(`
  query chapters($id: ID!) {
    manga(id: $id) {
     chapters {
      id,
      mangaId,
      createdAt,
      number
      }
    }
  }
`)

export const SIGN_IN = gql(`
  query SignIn($user: UserSignIn!) {
    signIn(user: $user) {
      id,
      name,
      email,
      role,
      image,
      emailVerified
    }
  }
`)

export const GET_BOOKMARKS = gql(`
  query bookmarks {
    user {
      bookmarks {
        inPlans {
          ...MangaCard
        },
        reading {
          ...MangaCard
        },
        finished {
          ...MangaCard
        },
        dropped {
          ...MangaCard
        },
        favourite {
          ...MangaCard
        }
      }
    }
  }
`)

export const IS_BOOKMARKED = gql(`
  query isBookmarked($mangaId: String!) {
    isBookmarked(mangaId: $mangaId)
  }
`)

export const IS_LIKED = gql(`
  query isLiked($objectId: String!) {
    isLiked(objectId: $objectId)
  }
`)

export const IS_RATED = gql(`
  query isRated($mangaId: String!) {
    isRated(mangaId: $mangaId)
  }
`)

export const GET_MANGA_EDIT = gql(`
  query mangaEdit($id: ID!) {
    manga(id: $id) {
      id,
      title,
      author,
      status,
      type,
      genres,
      description,
      releaseYear,
      image,
      languages
    }
  }
`)