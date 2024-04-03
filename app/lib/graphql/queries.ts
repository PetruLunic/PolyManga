import {gql} from "@/app/__generated__";

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
      postedOn,
      number
    },
    status,
    type,
    genres,
    releaseYear,
    postedOn,
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
      visitors
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
  query mangas {
    mangas {
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
  }
`)

export const GET_NAVBAR_CHAPTER = gql(`
  query manga_chapter($mangaId: ID!, $chapterId: ID!) {
    manga(id: $mangaId) {
      title,
      chapters {
        id,
        mangaId,
        postedOn,
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