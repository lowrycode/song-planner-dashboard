import retryFetch from "./retry-fetch";
import { ServerError, ClientError, NetworkError } from "../types/errors";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

export async function unauthFetch(
  url: string,
  options: RequestInit = {},
  retries = 3,
): Promise<Response> {
  const fullUrl = url.startsWith("/")
    ? `${API_BASE_URL}${url}`
    : `${API_BASE_URL}/${url}`;

  return retryFetch(
    async () => {
      try {
        const res = await fetch(fullUrl, options);
        if (!res.ok) {
          if (res.status >= 500) throw new ServerError(res.status, res);
          if (res.status >= 400) throw new ClientError(res.status, res);
        }
        return res;
      } catch (err: any) {
        if (err instanceof ServerError || err instanceof ClientError) {
          throw err;
        }

        throw new NetworkError(err?.message || "Network failure");
      }
    },
    retries,
    500, // base delay
    5000, // max delay
  );
}
