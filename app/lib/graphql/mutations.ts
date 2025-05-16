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
      createdAt
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
  mutation DeleteBookmark($slug: String!) {
    deleteBookmark(slug: $slug)
  }
`)

export const LIKE = gql(`
  mutation like($slug: ID!) {
    like(slug: $slug)
  }
`)

export const UNLIKE = gql(`
  mutation unlike($slug: ID!) {
    unlike(slug: $slug)
  }
`)

export const ADD_RATING = gql(`
  mutation addRating($input: RatingInput!) {
    addRating(input: $input)
  }
`)

export const DELETE_RATING = gql(`
  mutation deleteRating($slug: String!) {
    deleteRating(slug: $slug)
  }
`)

export const INCREMENT_VIEWS = gql(`
  mutation incrementViews($id: String!) {
    incrementViews(id: $id)
  }
`)

export const CREATE_MANGA = gql(`
  mutation addManga($manga: AddMangaInput!) {
    addManga(manga: $manga) {
      id
    }
  }
`)

export const EDIT_MANGA = gql(`
  mutation editManga($manga: EditMangaInput!) {
    editManga(manga: $manga) {
      id
    }
  }
`)

export const DELETE_MANGA = gql(`
  mutation deleteManga($id: String!) {
    deleteManga(id: $id)
  }
`)

export const DELETE_CHAPTERS = gql(`
  mutation deleteChapters($slug: String!, $ids: [ID!]!) {
    deleteChapters(slug: $slug, ids: $ids)
  }
`)

export const ADD_CHAPTER_BOOKMARK = gql(`
  mutation addChapterBookmark($slug: String!, $number: Float!) {
    addChapterBookmark(slug: $slug, number: $number) {
      id
    }
  }
`)

export const DELETE_CHAPTER_BOOKMARK = gql(`
  mutation deleteChapterBookmark($chapterId: String!) {
    deleteChapterBookmark(chapterId: $chapterId) {
      id
    }
  }
`)

export const TOGGLE_CHAPTER_AI_PROCESSED = gql(`
  mutation toggleChapterAIProcessed($id: String!) {
    toggleIsAIProcessed(id: $id)
  }
`)