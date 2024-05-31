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