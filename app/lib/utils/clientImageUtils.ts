/**
 * Gets the dimensions (width and height) of an image File object client-side.
 * @param file The image File object.
 * @returns A promise that resolves with the image dimensions.
 */
export async function getClientImageDimensions(file: File): Promise<{ width: number; height: number }> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      URL.revokeObjectURL(img.src); // Clean up the object URL
      resolve({ width: img.width, height: img.height });
    };
    img.onerror = (error) => {
      URL.revokeObjectURL(img.src); // Clean up the object URL
      reject(new Error(`Failed to load image for dimensions: ${file.name} - ${error}`));
    };
    img.src = URL.createObjectURL(file);
  });
}