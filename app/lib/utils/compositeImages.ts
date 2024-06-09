import sharp, {Sharp} from "sharp";

const combineImagesVertically = async (sharpObjects: Sharp[], minHeight: number): Promise<Sharp[]> => {
  const combinedImages: Sharp[] = [];
  let currentImage: Sharp | null = null;

  for (let i = 0; i < sharpObjects.length; i++) {
    const imageMetadata = await sharpObjects[i].metadata();
    const imageHeight = imageMetadata.height || 0;

    // If currentImage is null or the combined height is less than minHeight, start a new combined image
    if (!currentImage) {
      currentImage = sharpObjects[i];
    } else if ((await currentImage.metadata().then(res => res.height!)) < minHeight) {
      // Combine the current image with the next image
      currentImage = sharp(await currentImage
          .extend({ bottom: imageHeight })
          .composite([{
            input: await sharpObjects[i].toBuffer(),
            top: await currentImage.metadata().then(res => res.height!),
            left: 0,
            gravity: "northwest"
          }])
          .toBuffer());
    }

    // If the combined image height meets or exceeds minHeight, add it to the result and reset currentImage, or it's the last image
    if (await currentImage.metadata().then(res => res.height!) >= minHeight || i === sharpObjects.length - 1) {
      combinedImages.push(currentImage);
      currentImage = null;
    }
  }

  return combinedImages;
};

export async function combineAndCropImagesVertically(images: File[], width: number, maxHeight: number): Promise<Buffer[] | undefined> {
  try {
    // Create an array to store sharp objects for each image
    const sharpObjectsTemp: sharp.Sharp[] = [];

    // Iterate over each image in the FileList
    for (let i = 0; i < images.length; i++) {
      const image = images[i];

      // Read the image data as a Buffer
      const fileBuffer = await image.arrayBuffer();

      // Resize every image to width prop
      let sharpObjectBuffer = await sharp(fileBuffer).resize({width}).jpeg().toBuffer();

      // Create a sharp object for the image.
      let sharpObject = sharp(sharpObjectBuffer);

      // Store the sharp object in the array
      sharpObjectsTemp.push(sharpObject);
    }

    const sharpObjects = await combineImagesVertically(sharpObjectsTemp, maxHeight);

    const resultImagesBuffer: Buffer[] = [];

    let lastImage = false;
    let remainingHeight = 0; // Track remaining height from previous image
    for (let i = 0; i < sharpObjects.length; i++) {
      const imageHeight = await sharpObjects[i].metadata().then(res => res.height!);

      // If remaining height is not 0, then combine remaining height of prev image and a slice of the first current image
      if (remainingHeight !== 0) {
        try{
          let extractedHeightFromCurrentImage = maxHeight - remainingHeight;

          // If current image has not enough height to extract from
          if (imageHeight < extractedHeightFromCurrentImage) {
            extractedHeightFromCurrentImage = imageHeight;
            lastImage = true;
          }

          const firstCombinedImage = await sharp(await sharpObjects[i - 1].toBuffer())
              .extract({
                height: remainingHeight,
                width,
                top: await sharpObjects[i - 1].metadata().then(res => res.height! - remainingHeight),
                left: 0,
              })
              .extend({
                bottom: extractedHeightFromCurrentImage
              })
              .composite([{
                input: await sharp(await sharpObjects[i].toBuffer()).extract({
                  height: extractedHeightFromCurrentImage,
                  width,
                  left: 0,
                  top: 0
                }).toBuffer(),
                top: remainingHeight,
                left: 0,
                gravity: "northwest"
              }])
              .toBuffer()

          resultImagesBuffer.push(firstCombinedImage);
        } catch (e) {
          console.error("Error combining remaining height of image and new image: ", e);
          throw(e);
        }
      }

      // Iterating through the image and extract slices until there is enough height
      for (let j = 0; (imageHeight - (remainingHeight !== 0 ? maxHeight - remainingHeight : 0)) >= maxHeight * (j + 1); j++) {
        const croppedImage = sharp(await sharpObjects[i].toBuffer())
            .extract({
              height: maxHeight,
              width,
              top: (maxHeight * j) + (remainingHeight !== 0 ? maxHeight - remainingHeight : 0),
              left: 0
            });

        resultImagesBuffer.push(await croppedImage.toBuffer());
      }

      // Setting remaining height the rest of image
      remainingHeight = (imageHeight + remainingHeight) % maxHeight;
    }

    // On the last image extract the remaining height in one small image
    if (remainingHeight !== 0 && !lastImage) {
      const lastImage = sharpObjects[sharpObjects.length - 1];

      const lastImageSliceBuffer = await lastImage
          .extract({
            height: remainingHeight,
            width,
            top: await lastImage.metadata().then(res => res.height! - remainingHeight),
            left: 0
          })
          .toBuffer()

      resultImagesBuffer.push(lastImageSliceBuffer);
    }

    console.log('Images combined and cropped successfully');

    return resultImagesBuffer;
  } catch (error) {
    console.error('Error combining images:', error);
    throw(error);
  }
}