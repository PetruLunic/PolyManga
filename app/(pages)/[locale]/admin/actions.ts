"use server"

import s3 from "@/app/lib/utils/S3Client";
import {DeleteObjectsCommand, ListObjectsV2Command} from "@aws-sdk/client-s3";
import Manga from "@/app/lib/models/Manga";
import dbConnect from "@/app/lib/utils/dbConnect";

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

// export async function migrate() {
//   try {
//
//     await dbConnect();
//
//     const nativeCollection = mongoose?.connection?.db?.collection("mangas");
//
//     console.log('Starting migration: Renaming manga field "title" to "titles"...');
//
//     // Define the filter: Find documents that have the 'title' field
//     // AND do NOT have the 'titles' field (to make the script idempotent)
//     const filter = {
//       description: { $exists: true },
//       descriptions: { $exists: false }
//     };
//
//     // Define the update operation using $rename
//     const updateOperation = {
//       $rename: {
//         description: 'descriptions' // Rename 'title' field to 'titles'
//       }
//     };
//
//     // Execute the updateMany operation using the NATIVE driver method
//     console.log('Executing native updateMany operation...');
//     const result = await nativeCollection?.updateMany(filter, updateOperation);
//
//     if (!result) return;
//     console.log('Native updateMany operation finished.');
//
//   console.log('-----------------------------------------');
//   console.log('Migration Operation Finished.');
//   console.log(`Documents matched by filter: ${result.matchedCount}`);
//   console.log(`Documents successfully updated: ${result.modifiedCount}`);
//   if (result.acknowledged) {
//     console.log('Operation acknowledged by the server.');
//   } else {
//     console.warn('Operation may not have been fully acknowledged by the server.');
//   }
//   if (result.matchedCount > 0 && result.modifiedCount === 0) {
//     console.warn('WARNING: Documents were matched but none were modified. This might indicate the schema was already updated or concurrent modifications occurred.');
//   } else if (result.matchedCount === 0) {
//     console.log('No documents found requiring the field rename (field "title" might already be renamed or doesn\'t exist).');
//   }
//
//
// } catch (error) {
//   console.error('Migration script failed:', error);
//   // Consider logging specific MongoDB errors if available (e.g., error.codeName)
// }
//
// }