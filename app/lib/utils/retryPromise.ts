export interface RetryResult<T> {
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
 * @param isFalsePositive Optional function to check if the resolved data is a false positive.
 *                        If it returns true, the promise is considered failed and retried.
 * @returns A promise that resolves to an object containing the data (if successful),
 *          the error (if all attempts failed), and the number of repetitions made.
 */
export default async function retryPromise<T>(
  promiseFn: () => Promise<T>,
  maxRepeats: number = 3,
  delayMs: number = 0,
  isFalsePositive?: (data: T) => boolean
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
      if (isFalsePositive && isFalsePositive(data)) {
        throw new Error("False positive detected");
      }
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

  return {
    data: null,
    error: lastError,
    repetitions: currentRepetition,
  };
}
