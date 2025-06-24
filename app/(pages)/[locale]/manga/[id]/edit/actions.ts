"use server"

import {auth} from "@/auth";
import {MangaSchema} from "@/app/lib/utils/zodSchemas";
import createApolloClient from "@/app/lib/utils/apollo-client";
import {nanoid} from "nanoid";
import {EDIT_MANGA} from "@/app/lib/graphql/mutations";
import {EditMangaInput} from "@/app/__generated__/graphql";
import {cookies} from "next/headers";
import {deleteImage, uploadImage} from "@/app/lib/utils/awsUtils";

import {revalidateTag} from "next/cache";

export const editManga = async (manga: EditMangaInput, formData?: FormData) => {
  const session = await auth();

  // This action can use only moderators and admins
  if (!session || (session.user.role !== "MODERATOR" && session.user.role !== "ADMIN")) {
    throw new Error("Forbidden action");
  }

  // Validating manga input
  const isValid = MangaSchema.safeParse({
    ...manga,
    genres: manga.genres.join(","),
    languages: manga.languages.join(","),
    scrapSources: manga.scrapSources?.asurascans
  });

  if (!isValid.success) {
    throw new Error("Validation error: " + isValid.error.message);
  }

  let imageUrl: string | undefined;

  // If image was provided, then delete old and fetch the new one
  if (formData) {
    const image = formData.get("image") as File;

    if (!image) {
      throw new Error("Wrong Form Data provided. Image file is missing.");
    }

    // Uploading new image to the aws s3 bucket
    imageUrl = `/manga/${manga.id}/cover/${nanoid()}`;
    await Promise.all([
      uploadImage(image, imageUrl),
      deleteImage(manga.image)
    ])
  }

  const client = createApolloClient();

  // Fetching edited manga
  await client.mutate({
    mutation: EDIT_MANGA,
    variables: {
      manga: {
        ...manga,
        image: imageUrl ?? manga.image
      }
    },
    context: {headers: {cookie: await cookies()}}
  });

  // Revalidate manga page
  revalidateTag(`manga-${manga.slug}`);
}