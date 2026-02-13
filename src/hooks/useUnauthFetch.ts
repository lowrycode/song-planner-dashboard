import { unauthFetch } from "../utils/unauth-fetch";
import { ClientError } from "../types/errors";

export function useUnauthFetch() {
  return async function unauthFetchWithErrors(
    url: string,
    options?: RequestInit
  ) {
    try {
      return await unauthFetch(url, options);
    } catch (err) {
      if (err instanceof ClientError && err.response) {
        let data: any;

        try {
          data = await err.response.json();
        } catch {
          throw err; // JSON failed → fallback to original error
        }

        if (Array.isArray(data?.detail)) {
          throw new Error(data.detail.map((e: any) => e.msg).join(", "));
        }

        if (typeof data?.detail === "string") {
          throw new Error(data.detail);
        }
      }

      throw err;
    }
  };
}
