import {getServerSession} from "next-auth";
import {PutObjectCommand} from "@aws-sdk/client-s3";
import {nanoid} from "nanoid";
import {getSignedUrl} from "@aws-sdk/s3-request-presigner";
import s3 from "@/app/lib/utils/S3Client";
import {ChapterLanguage} from "@/app/types";

export async function getSignedURLs(mangaId: string, chapterId: string, chapterLanguage: ChapterLanguage, ids: string[]): Promise<{failure: string} | {success: string[]}> {
  const session = await getServerSession();

  if (!session) {
    return {failure: "Not authenticated"}
  }

  const urls: string[] = [];

  for (let i = 0; i < ids.length; i++) {
    const putObjectCommand = new PutObjectCommand({
      Bucket: process.env.AWS_BUCKET_NAME!,
      Key: `manga/${mangaId}/chapters/${chapterId}/${chapterLanguage}/image-${i}-${ids[i]}`
    })

    const signedURL = await getSignedUrl(s3, putObjectCommand, {
      expiresIn: 300
    })

    urls.push(signedURL)
  }

  return {success: urls}
}