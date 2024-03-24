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
      title,
      number,
      postedOn
    },
    status,
    type,
    genres
    releaseYear
    postedOn
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
      images {
        src,
        width,
        height
      },
      mangaId,
      isFirst,
      isLast,
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