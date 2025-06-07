import s3 from "@/app/lib/utils/S3Client";
import {DeleteObjectCommand, PutObjectCommand} from "@aws-sdk/client-s3";
import {DeleteObjectCommandOutput} from "@aws-sdk/client-s3/dist-types/commands";
import {auth} from "@/auth";
import {getSignedUrl} from "@aws-sdk/s3-request-presigner";

export const deleteImage = (pathname: string): Promise<DeleteObjectCommandOutput> | undefined => {
  const bucketName = process.env.AWS_BUCKET_NAME;

  if (!bucketName) {
    throw new Error("Aws bucket name (AWS_BUCKET_NAME) not provided in .env file.");
  }

  // Wrapping in a try catch, to catch if manga image is not a valid url
  try {
    const Key = pathname.substring(1); // Delete / prefix from the pathname

    // Deleting previous image
    const command = new DeleteObjectCommand({
      Bucket: bucketName,
      Key
    })

    return s3.send(command);
  } catch(e) {
    console.error("Error at delete image: " + e);
    throw e;
  }
}

interface GetSignedURLsOptions {
  bypassAuth?: boolean
}

export async function getSignedURLs(pathnames: string[], options: GetSignedURLsOptions = {}): Promise<{ failure: string } | { success: string[] }> {
  if (!options.bypassAuth) {
    const session = await auth();

    if (!session) {
      return {failure: "Not authenticated"}
    }
  }

 const signedUrls: string[] = [];

  for (let path of pathnames) {
    const Key = path.substring(1); // Deleting leading /

    const putObjectCommand = new PutObjectCommand({
      Bucket: process.env.AWS_BUCKET_NAME!,
      Key
    })

    const signedURL = await getSignedUrl(s3, putObjectCommand, {
      expiresIn: 300
    })

    signedUrls.push(signedURL)
  }

  return {success: signedUrls}
}

export const uploadImage = async (image: File, pathname: string): Promise<Response> => {
  // Creating signed URL for aws POST fetch
  const signedUrl = await getSignedURLs([pathname]);

  if ("failure" in signedUrl) {
    throw new Error(`Something went wrong while creating signed url for ${pathname} image`);
  }

  // Fetching the image to the aws s3 bucket
  return fetch(signedUrl.success[0], {
    method: "PUT",
    body: image,
    headers: {
      "Content-type": image.type
    }
  })
}