import { ServerError, NetworkError } from "../types/errors";

export default async function retryFetch<T>(
  fetchFn: () => Promise<T>,
  retries = 3,
  baseDelayMs = 500,
  maxDelayMs = 5000,
): Promise<T> {
  let lastError: any;

  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      return await fetchFn();
    } catch (err: any) {
      lastError = err;

      // Retry only on network or server errors
      if (!(err instanceof ServerError || err instanceof NetworkError)) break;

      if (attempt === retries) break;

      // Exponential backoff with cap + jitter
      const delay =
        Math.min(baseDelayMs * 2 ** attempt, maxDelayMs) + Math.random() * 100;
      await new Promise((r) => setTimeout(r, delay));
    }
  }

  throw lastError;
}
