import {gql} from "@/app/__generated__";

export const MANGA_CARD = gql(`
  fragment MangaCard on Manga {
    id,
    title(locale: $locale),
    slug,
    image,
    type,
    status,
    languages,
    stats {
      rating {
        value
      }
    },
    latestChapter {
      id
      number,
      title(locale: $locale)
    }
  }
`)

export const CHAPTERS_LIST = gql(`
  fragment ChaptersList on Chapter {
    id,
    mangaId,
    createdAt,
    languages,
    title(locale: $locale),
    number
  }
`)

export const GET_MANGA = gql(`
  query manga($id: String!, $limit: Int, $offset: Int, $locale: String) {
  manga(id: $id) {
    id,
    title(locale: $locale),
    description(locale: $locale),
    author,
    image,
    chapters(limit: $limit, offset: $offset) {
      ...ChaptersList
    },
    status,
    type,
    genres,
    releaseYear,
    languages,
    firstChapter {
      id,
      number,
      title(locale: $locale),
    },
    latestChapter {
      id,
      number,
      title(locale: $locale)
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

export const GET_CHAPTERS = gql(`
  query chapters($id: String!, $limit: Int, $offset: Int, $locale: String, $isDescending: Boolean) {
    manga(id: $id) {
      id,
      chapters(limit: $limit, offset: $offset, isDescending: $isDescending) {
      ...ChaptersList
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
  query mangaMetadata($id: String!, $locale: String!) {
    manga(id: $id) {
      id,
      title(locale: $locale),
      description(locale: $locale),
      image,
      type,
      genres
    }
  }
`)

export const GET_CHAPTER = gql(`
  query chapter($slug: String!, $number: Float!, $locale: String!) {
    manga(id: $slug) {
      title(locale: $locale),
      languages
    },
    chapter(slug: $slug, number: $number) {
      id,
      number,
      title(locale: $locale),
      images {
        images {
          src,
            width,
            height
        },
        language
      },
      mangaId,
      languages,
      isAIProcessedAt,
      nextChapter {
        number
      },
      prevChapter {
        number
      },
      metadata {
        content {
          style {
            backgroundColor,
            borderRadius,
            textAlign
          },
          translatedTexts {
            language,
            text,
            fontSize
          },
          coords {
            coord {
              x1,
              x2,
              y1,
              y2
            },
            language
          }
        }
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
  query chapterMetadata($slug: String!, $number: Float!, $locale: String!) {
    chapter(slug: $slug, number: $number) {
      id,
      number,
      title(locale: $locale),
      manga {
        title(locale: $locale),
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
      languages,
      images {
        images {
          src,
          width,
          height
        },
        language
      },
      titles {
        language,
        value
      },
      number,
      mangaId
    }
  }
`)

export const POLL_CHAPTER_METADATA = gql(`
  query pollChapterMetadata($chapterId: ID!) {
    metadata(chapterId: $chapterId) {
      id,
      version
    }
  }
`)

export const GET_MANGA_CARDS = gql(`
  query mangas($search: String, $genres: [ComicsGenre!], $statuses: [ComicsStatus!], $types: [ComicsType!], $sortBy: String, $sort: String, $languages: [ChapterLanguage!], $limit: Int, $offset: Int, $locale: String!) {
    mangas(search: $search, genres: $genres, statuses: $statuses, types: $types, sortBy: $sortBy, sort: $sort, languages: $languages, limit: $limit, offset: $offset) {
      ...MangaCard
    }
  }
`)

export const GET_NAVBAR_CHAPTER = gql(`
  query manga_chapter($slug: String!, $number: Float!, $locale: String!) {
    manga(id: $slug) {
      title(locale: $locale)
    },
    chapter(slug: $slug, number: $number) {
      number,
      languages,
      title(locale: $locale),
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

export const GET_CHAPTERS_EDIT = gql(`
  query chaptersEdit($slug: String!, $locale: String!, $limit: Int!) {
    manga(id: $slug) {
      id,
      title(locale: $locale),
     chapters(limit: $limit) {
      id,
      isAIProcessedAt,
      titles {
        language,
        value
      },
      mangaId,
      createdAt,
      number,
      metadata {
        id
       }
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
        targetLanguage,
        sourceLanguage
      }
    }
  }
`)

export const GET_BOOKMARKS = gql(`
  query bookmarks($locale: String!) {
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
      titles {
        value,
        language
      },
      author,
      status,
      type,
      genres,
      descriptions {
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
          targetLanguage,
          sourceLanguage
        }
      }
    }
`)

export const GET_BOOKMARKED_CHAPTER = gql(`
  query getBookmarkedChapter($slug: String!, $locale: String!) {
    getBookmarkedChapter(slug: $slug) {
      chapterId,
      chapter {
        title(locale: $locale),
        number
      }
    }
  }
`)

export const GET_MANGAS_WITH_BOOKMARKED_CHAPTERS = gql(`
  query getMangaWithBookmarkedChapters($locale: String!) {
    user {
      chapterBookmarks {
        manga {
          ...MangaCard
        },
        chapter {
          title(locale: $locale),
        },
        createdAt
      }
    }
  }
`)

export const GET_LATEST_UPLOADED_CHAPTERS = gql(`
  query getLatestUploadedChapters($limit: Int!, $offset: Int, $locale: String!) {
    latestChapters(limit: $limit, offset: $offset) {
      id,
      createdAt,
      number,
      title(locale: $locale),
      languages,
      manga {
        id,
        title(locale: $locale),
        slug,
        image
      }
    }
  }
`)