import {PutObjectCommand} from "@aws-sdk/client-s3";
import {getSignedUrl} from "@aws-sdk/s3-request-presigner";
import s3 from "@/app/lib/utils/S3Client";
import {auth} from "@/auth";

export async function getSignedURLs(urls: string[]): Promise<{failure: string} | {success: string[]}> {
  const session = await auth();

  if (!session) {
    return {failure: "Not authenticated"}
  }

  const signedUrls: string[] = [];

  for (let url of urls) {
    const putObjectCommand = new PutObjectCommand({
      Bucket: process.env.AWS_BUCKET_NAME!,
      Key: url
    })

    const signedURL = await getSignedUrl(s3, putObjectCommand, {
      expiresIn: 300
    })

    signedUrls.push(signedURL)
  }

  return {success: signedUrls}
}