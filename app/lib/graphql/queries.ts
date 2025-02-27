import {gql} from "@/app/__generated__";

export const MANGA_CARD = gql(`
  fragment MangaCard on Manga {
    id,
    title {
      value,
      language
    },
    slug,
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
      number,
      versions {
        title,
        language
      }
    }
  }
`)

export const GET_MANGA = gql(`
  query manga($id: String!) {
  manga(id: $id) {
    id,
    title {
      value,
      language
    },
    description {
        value,
        language
    },
    author,
    image,
    chapters {
      id,
      mangaId,
      createdAt,
      versions {
        title,
        language
      },
      number
    },
    status,
    type,
    genres,
    releaseYear,
    languages,
    firstChapter {
      id,
      number,
      versions {
        title,
        language
      },
    },
    latestChapter {
      id,
      number,
      versions {
        title,
        language
      },
    },
    stats {
      bookmarks,
      likes,
      rating {
        nrVotes,
        value
      },
      views,
    }
  }
}
`)

export const GET_STATIC_MANGAS = gql(`
  query staticMangas {
    mangas {
      id,
      slug
    }
  }
`)

export const GET_MANGA_METADATA = gql(`
  query mangaMetadata($id: String!) {
    manga(id: $id) {
      id,
      title {
        value,
        language
      },
      description {
        value,
        language
      },
      image,
      type,
      genres
    }
  }
`)

export const GET_CHAPTER = gql(`
  query chapter($slug: String!, $number: Float!) {
    chapter(slug: $slug, number: $number) {
      id,
      number,
      versions {
        title,
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

export const GET_STATIC_CHAPTERS = gql(`
  query chaptersStatic {
    mangas {
      id,
      slug,
      chapters {
        number,
        languages
      }
    }
  }
`)

export const GET_CHAPTER_METADATA = gql(`
  query chapterMetadata($slug: String!, $number: Float!) {
    chapter(slug: $slug, number: $number) {
      id,
      number,
      versions {
        title,
        language
      },
      manga {
        title {
          value,
          language
        },
        image
      },
      languages
    }
  }
`)

export const GET_CHAPTER_EDIT = gql(`
  query chapterEdit($slug: String!, $number: Float!) {
    chapter(slug: $slug, number: $number) {
      id,
      versions {
        title,
        language
      },
      number,
      mangaId
    }
  }
`)

export const GET_MANGA_CARDS = gql(`
  query mangas($search: String, $genres: [ComicsGenre!], $statuses: [ComicsStatus!], $types: [ComicsType!], $sortBy: String, $sort: String, $languages: [ChapterLanguage!], $limit: Int, $offset: Int) {
    mangas(search: $search, genres: $genres, statuses: $statuses, types: $types, sortBy: $sortBy, sort: $sort, languages: $languages, limit: $limit, offset: $offset) {
      ...MangaCard
    }
  }
`)

export const GET_NAVBAR_CHAPTER = gql(`
  query manga_chapter($slug: String!, $number: Float!) {
    manga(id: $slug) {
      title {
        value,
        language
      },
      languages,
      chapters {
        id,
        mangaId,
        createdAt,
        versions {
          title,
          language
        },
        number
      }
    },
    chapter(slug: $slug, number: $number) {
      number,
      languages,
      versions {
          title,
          language
      },
      isLast,
      isFirst,
      prevChapter {
        number
      },
      nextChapter {
        number
      }
    }
  }
`)

export const GET_MANGA_CHAPTER_UPLOAD = gql(`
  query manga_chapter_upload($id: String!) {
    manga(id: $id) {
      latestChapter {
        number
      }
    }
  }
`)

export const GET_CHAPTERS = gql(`
  query chapters($slug: String!) {
    manga(id: $slug) {
      id,
      title {
       value,
       language
      },
     chapters {
      id,
      versions {
        title,
        language
      },
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
  query isBookmarked($slug: ID!) {
    isBookmarked(slug: $slug)
  }
`)

export const IS_LIKED = gql(`
  query isLiked($slug: ID!) {
    isLiked(slug: $slug)
  }
`)

export const IS_RATED = gql(`
  query isRated($slug: ID!) {
    isRated(slug: $slug)
  }
`)

export const GET_MANGA_EDIT = gql(`
  query mangaEdit($id: String!) {
    manga(id: $id) {
      id,
      title {
        value,
        language
      },
      author,
      status,
      type,
      genres,
      description {
        value,
        language
      },
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
  query getBookmarkedChapter($slug: String!) {
    getBookmarkedChapter(slug: $slug) {
      chapterId,
      chapter {
        versions {
          title,
          language
        },
        number
      }
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
          versions {
            title,
            language
          },
        },
        createdAt
      }
    }
  }
`)

export const GET_LATEST_UPLOADED_CHAPTERS = gql(`
  query getLatestUploadedChapters($limit: Int!, $offset: Int) {
    latestChapters(limit: $limit, offset: $offset) {
      id,
      createdAt,
      number,
      versions {
        title,
        language
      },
      languages,
      manga {
        id,
        title {
          value,
          language
        },
        slug,
        image
      }
    }
  }
`)