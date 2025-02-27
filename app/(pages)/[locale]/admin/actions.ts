"use server"

import s3 from "@/app/lib/utils/S3Client";
import {DeleteObjectsCommand, ListObjectsV2Command} from "@aws-sdk/client-s3";
import Manga from "@/app/lib/models/Manga";

// Function that cleans up the objects that are not used
export async function cleanAwsBucket() {
  const bucketName = process.env.AWS_BUCKET_NAME;

  if (!bucketName) throw new Error("AWS_BUCKET_NAME environment variable not provided.");

  const command = {
    Bucket: process.env.AWS_BUCKET_NAME,
    Prefix: 'manga/',
    Delimiter: '/'
  };

  try {
    const data = await s3.send(new ListObjectsV2Command(command));
    const folders = data.CommonPrefixes?.map(prefix => prefix?.Prefix?.split('/')[1]);

    if (folders) {
      for (const folder of folders) {
        const mangaExists = await Manga.exists({ id: folder });

        if (!mangaExists && folder) {
          console.log(`Manga folder not found in database: ${folder}`);
          // Optionally, you can delete the folder from S3
          await deleteFolderFromS3(folder);
        }
      }
    }

    console.log('Script finished running.');
  } catch (error) {
    console.error('Error listing objects in S3 bucket:', error);
  }
}

async function deleteFolderFromS3(folder: string) {
  const listParams = {
    Bucket: process.env.AWS_BUCKET_NAME,
    Prefix: `manga/${folder}/`
  };

  try {
    const data = await s3.send(new ListObjectsV2Command(listParams));
    const objectsToDelete = data.Contents?.map(item => ({ Key: item.Key }));

    if (objectsToDelete && objectsToDelete.length > 0) {
      const deleteParams = {
        Bucket: process.env.AWS_BUCKET_NAME,
        Delete: {
          Objects: objectsToDelete
        }
      };

      await s3.send(new DeleteObjectsCommand(deleteParams));
      console.log(`Deleted folder: ${folder}`);
    }
  } catch (error) {
    console.error('Error deleting folder from S3:', error);
  }
}