export async function fetchInBatches<T>(fetches: Promise<T>[], batchSize: number = 30): Promise<T[]> {
  const response: T[] = [];

  for (let i = 0; i < fetches.length; i += batchSize) {
    const batch = fetches.slice(i, i + batchSize);
    const result = await Promise.all(batch);
    response.push(...result);
  }

  return response;
}