"use server"

import {auth} from "@/auth";
import {MangaSchema} from "@/app/lib/utils/zodSchemas";
import createApolloClient from "@/app/lib/utils/apollo-client";
import {nanoid} from "nanoid";
import s3 from "@/app/lib/utils/S3Client";
import {DeleteObjectCommand} from "@aws-sdk/client-s3";
import {EDIT_MANGA} from "@/app/lib/graphql/mutations";
import {EditMangaInput} from "@/app/__generated__/graphql";
import {cookies} from "next/headers";
import {deleteImage, getAbsoluteAwsUrl, getSignedURLs, uploadImage} from "@/app/lib/utils/awsUtils";
import {DeleteObjectCommandOutput} from "@aws-sdk/client-s3/dist-types/commands";

export const editManga = async (manga: EditMangaInput, formData?: FormData) => {
  const session = await auth();

  // This action can use only moderators and admins
  if (!session || (session.user.role !== "MODERATOR" && session.user.role !== "ADMIN")) {
    throw new Error("Forbidden action");
  }

  // Validating manga input
  const isValid = MangaSchema.safeParse({
    ...manga,
    genres: manga.genres.join(",")
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
    imageUrl = `manga/${manga.id}/cover/${nanoid()}`;
    await uploadImage(image, imageUrl);
    imageUrl = getAbsoluteAwsUrl(imageUrl);

    // Deleting previous image
    await deleteImage(manga.image);
  }

  const client = createApolloClient();

  // Fetching edited manga
  await client.mutate({
    mutation: EDIT_MANGA,
    variables: {
      manga: {
        ...manga,
        image: imageUrl || manga.image
      }
    },
    context: {headers: {cookie: cookies()}}
  })
}