interface RetryResult<T> {
  data: T | null;
  error: any | null;
  repetitions: number;
}

/**
 * Repeats a failing promise up to a maximum number of times.
 *
 * @param promiseFn A function that returns the promise to be executed.
 *                  This function will be called for each attempt.
 * @param maxRepeats The maximum number of times to attempt the promise (including the initial try).
 *                   Must be at least 1.
 * @param delayMs Optional delay in milliseconds between retries.
 * @returns A promise that resolves to an object containing the data (if successful),
 *          the error (if all attempts failed), and the number of repetitions made.
 */
export default async function retryPromise<T>(
  promiseFn: () => Promise<T>,
  maxRepeats: number = 3,
  delayMs: number = 0 // Optional delay between retries
): Promise<RetryResult<T>> {
  if (maxRepeats < 1) {
    return {
      data: null,
      error: new Error("maxRepeats must be at least 1."),
      repetitions: 0,
    };
  }

  let lastError: any = null;
  let currentRepetition = 0;

  for (let i = 0; i < maxRepeats; i++) {
    currentRepetition = i + 1;
    try {
      const data = await promiseFn();
      return {
        data,
        error: null,
        repetitions: currentRepetition,
      };
    } catch (error) {
      lastError = error;
      console.log(`Attempt ${currentRepetition} failed. Error: ${error}`);
      if (currentRepetition < maxRepeats && delayMs > 0) {
        console.log(`Waiting ${delayMs}ms before next retry...`);
        await new Promise(resolve => setTimeout(resolve, delayMs));
      }
    }
  }

  // If the loop finishes, all attempts have failed
  return {
    data: null,
    error: lastError,
    repetitions: currentRepetition,
  };
}