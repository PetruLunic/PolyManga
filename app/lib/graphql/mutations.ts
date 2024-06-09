import {gql} from "@/app/__generated__";


export const CREATE_CHAPTER = gql(`
  mutation AddChapter($chapter: AddChapterInput!) {
    addChapter(chapter: $chapter) {
      id,
      mangaId,
      number,
      versions {
        images {
          src
        },
        language
      }
      title,
      postedOn
    }
  }
`)

export const SIGN_UP = gql(`
  mutation SignUp($user: UserSignUp!) {
    signUp(user: $user) {
      id,
      role,
      image
    }
  }
`)

export const ADD_BOOKMARK = gql(`
  mutation AddBookmark($input: AddBookmarkInput!) {
    addBookmark(input: $input) {
      id
    }
  }
`)

export const DELETE_BOOKMARK = gql(`
  mutation DeleteBookmark($mangaId: String!) {
    deleteBookmark(mangaId: $mangaId)
  }
`)

export const LIKE = gql(`
  mutation like($input: LikeInput!) {
    like(input: $input)
  }
`)

export const UNLIKE = gql(`
  mutation unlike($objectId: String!) {
    unlike(objectId: $objectId)
  }
`)

export const ADD_RATING = gql(`
  mutation addRating($input: RatingInput!) {
    addRating(input: $input)
  }
`)

export const DELETE_RATING = gql(`
  mutation deleteRating($mangaId: String!) {
    deleteRating(mangaId: $mangaId)
  }
`)

export const INCREMENT_VIEWS = gql(`
  mutation incrementViews($id: String!) {
    incrementViews(id: $id)
  }
`)