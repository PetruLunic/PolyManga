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
	  title,
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
      views,
    },
	bookmarkedChapter {
	  id,
	  title
	 }
  },
  isBookmarked(mangaId: $id),
  isRated(mangaId: $id),
  isLiked(objectId: $id)
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

export const GET_CHAPTER_EDIT = gql(`
  query chapterEdit($id: ID!) {
    chapter(id: $id) {
      id,
      title,
      number,
      mangaId
    }
  }
`)

export const GET_MANGA_CARDS = gql(`
  query mangas($search: String, $genres: [ComicsGenre!], $statuses: [ComicsStatus!], $types: [ComicsType!], $sortBy: String, $sort: String, $languages: [ChapterLanguage!], $limit: Int) {
    mangas(search: $search, genres: $genres, statuses: $statuses, types: $types, sortBy: $sortBy, sort: $sort, languages: $languages, limit: $limit) {
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
        title,
        number
      },
	  bookmarkedChapter {
	    id,
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
      title,
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
      emailVerified,
      preferences {
        language
      }
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
  query isBookmarked($mangaId: ID!) {
    isBookmarked(mangaId: $mangaId)
  }
`)

export const IS_LIKED = gql(`
  query isLiked($objectId: ID!) {
    isLiked(objectId: $objectId)
  }
`)

export const IS_RATED = gql(`
  query isRated($mangaId: ID!) {
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

export const GET_USER_PREFERENCES = gql(`
    query userPreferences {
      user {
        preferences {
          language
        }
      }  
    }
`)

export const GET_BOOKMARKED_CHAPTER = gql(`
  query getBookmarkedChapter($mangaId: String!) {
    getBookmarkedChapter(mangaId: $mangaId) {
      chapterId
    }
  }
`)

export const GET_MANGAS_WITH_BOOKMARKED_CHAPTERS = gql(`
  query getMangaWithBookmarkedChapters {
    user {
      chapterBookmarks {
        manga {
          ...MangaCard
        },
        chapter {
          title
        },
        createdAt
      }
    }
  }
`)

export const GET_LATEST_UPLOADED_CHAPTERS = gql(`
  query getLatestUploadedChapters($limit: Int!) {
    latestChapters (limit: $limit) {
      id,
      manga {
        image,
        title,
        id
      },
      createdAt,
      title
    }
  }
`)