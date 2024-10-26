"use server"

import {FormType} from "@/app/(pages)/manga/create/page";
import {auth} from "@/auth";
import {MangaSchema} from "@/app/lib/utils/zodSchemas";
import {nanoid} from "nanoid";
import createApolloClient from "@/app/lib/utils/apollo-client";
import {CREATE_MANGA} from "@/app/lib/graphql/mutations";
import {AddMangaInput, ChapterLanguage, ComicsGenre, ComicsStatus, ComicsType} from "@/app/__generated__/graphql";
import {cookies} from "next/headers";
import {getSignedURLs} from "@/app/lib/utils/awsUtils";

export const createManga = async (formData: FormData, mangaInput: FormType) => {
  const session = await auth();

  // This action can use only moderators and admins
  if (!session || (session.user.role !== "MODERATOR" && session.user.role !== "ADMIN")) {
    throw new Error("Forbidden action");
  }

  const isValid = MangaSchema.safeParse(mangaInput);

  if (!isValid.success) {
    throw new Error("Validation error: " + isValid.error.message);
  }

  const image = formData.get("image") as File;

  if (!image) {
    throw new Error("No image provided");
  }

  const mangaId = nanoid();
  const imageUrl = `manga/${mangaId}/cover/${nanoid()}`
  const signedUrl = await getSignedURLs([imageUrl]);

  if ("failure" in signedUrl) {
    throw new Error("Unexpected error");
  }

  const awsUrl = process.env.AWS_BUCKET_URL;

  if (!awsUrl) {
    throw new Error("AWS bucket url not provided in .env file");
  }

  const manga: AddMangaInput = {
    ...mangaInput,
    id: mangaId,
    image: awsUrl + imageUrl,
    uploadedBy: session.user.id,
    genres: mangaInput.genres.split(",") as ComicsGenre[],
    languages: mangaInput.languages.split(",") as ChapterLanguage[],
    type: mangaInput.type as ComicsType,
    status: mangaInput.status as ComicsStatus,
  }

  // Creating new manga
  const client = createApolloClient();
  await client.mutate({
    mutation: CREATE_MANGA,
    variables: {manga},
    context: {headers: {cookie: cookies().toString()}}
  });

  // Fetching image to aws s3 bucket
  await fetch(signedUrl.success[0], {
    method: "PUT",
    body: image,
    headers: {
      "Content-type": image.type
    }
  })
}