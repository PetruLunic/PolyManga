"use server"

import {FormType as InfoFormType} from "@/app/(pages)/user/[id]/settings/_components/InfoSection";
import {FormType as SecurityFormType} from "@/app/(pages)/user/[id]/settings/_components/SecuritySection";
import {nanoid} from "nanoid";
import {auth} from "@/auth";
import dbConnect from "@/app/lib/utils/dbConnect";
import UserModel from "@/app/lib/models/User";
import {ChangePasswordSchema, UserInfoSchema} from "@/app/lib/utils/zodSchemas";
import {USER_IMAGE_MAX_SIZE, USER_NO_IMAGE_SRC} from "@/app/lib/utils/constants";
import {deleteImage, getAbsoluteAwsUrl, getSignedURLs, uploadImage} from "@/app/lib/utils/awsUtils";
import {DeleteObjectCommandOutput} from "@aws-sdk/client-s3/dist-types/commands";
import bcrypt from "bcryptjs";
import {HydratedDocument} from "mongoose";
import {User} from "@/app/lib/graphql/schema";

export async function modifyUserInfo(input: InfoFormType, formData?: FormData): Promise<{success: boolean, imageUrl?: string}> {
  const session = await auth();

  if (!session) {
    throw new Error("Forbidden action");
  }

  const isValid = UserInfoSchema.safeParse(input);

  if (!isValid.success) {
    throw new Error("Validation error: " + isValid.error.message);
  }

  await dbConnect();
  const user = await UserModel.findOne({id: session.user.id});

  if (!user) {
    throw new Error(`There is no user with ${session.user.id} id`);
  }

  let imageUrl: string | undefined;
  let imageFetchPromise: Promise<Response> | undefined;
  let deleteImageFetchPromise: Promise<DeleteObjectCommandOutput> | undefined;

  // If user provided an image
  if (formData) {
    const image = formData.get("image") as File;

    if (!image) {
      throw new Error("No image provided");
    }

    if (image.size > USER_IMAGE_MAX_SIZE) {
      throw new Error("Too large image size. It should be less than 1 MB");
    }

    // Generating an image URL
    imageUrl = `user/${session.user.id}/image/${nanoid()}`;
    imageFetchPromise = uploadImage(image, imageUrl);
    imageUrl = getAbsoluteAwsUrl(imageUrl);

    const prevImage = user.image;

    // If the previous image is the default one then don't delete it
    if (prevImage !== USER_NO_IMAGE_SRC) {
      deleteImageFetchPromise = deleteImage(prevImage);
    }
  }

  await dbConnect();

  // If were provided new image to change
  if (imageUrl) {
    user.image = imageUrl;

    // Fetching image to the aws s3 bucket
    imageFetchPromise && await imageFetchPromise;
    deleteImageFetchPromise && await deleteImageFetchPromise;
  }

  // If the new name is the same as prev name, then don't change it
  if (input.name !== user.name ) {
    const userWithTheSameName = await UserModel.findOne({name: input.name}).lean();

    // If there is the user with the same name
    if (userWithTheSameName) {
      throw new Error("User with this name already exists");
    }

    user.name = input.name;
  }

  // Saving the user
  await user.save();

  return {success: true, imageUrl};
}

export async function changePassword({oldPassword, newPassword}: SecurityFormType) {
  const session = await auth();

  if (!session) {
    throw new Error("Forbidden action");
  }

  const isValid = ChangePasswordSchema.safeParse({oldPassword, newPassword});

  if (!isValid.success) {
    throw new Error("Validation error: " + isValid.error.message);
  }

  await dbConnect();
  const user: HydratedDocument<User> | null = await UserModel.findOne({id: session.user.id});

  if (!user) {
    throw new Error(`There is no user with ${session.user.id} id`);
  }

  // If user is signed up through Oauth
  if (user.provider !== "CREDENTIALS") {
    throw new Error(`You cannot change the password of ${user.provider.toLowerCase()} account`)
  }

  // If password are not matching
  if (!bcrypt.compareSync(oldPassword, user.password)) {
    throw new Error ("Incorrect password");
  }

  // Hashing and saving new password
  user.password = bcrypt.hashSync(newPassword, 7);

  await user.save()
}