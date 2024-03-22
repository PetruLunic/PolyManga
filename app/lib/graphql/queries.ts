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
      number
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

