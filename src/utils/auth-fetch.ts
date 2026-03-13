import { refreshAccessToken } from "./refresh-token";
import { SessionExpiredError } from "../types/errors";
import retryFetch from "./retry-fetch";
import { ServerError, ClientError, NetworkError } from "../types/errors";

let isRefreshing = false;
let refreshQueue: (() => void)[] = [];

export async function authFetch(
  url: string,
  options: RequestInit = {},
  retries = 3,
): Promise<Response> {
  const API_BASE_URL =
    import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";
  const fullUrl = url.startsWith("/")
    ? `${API_BASE_URL}${url}`
    : `${API_BASE_URL}/${url}`;

  return retryFetch(
    async () => {
      try {
        const res = await fetch(fullUrl, {
          ...options,
          credentials: "include",
        });

        if (res.status === 401) {
          if (isRefreshing) {
            await new Promise<void>((resolve) => refreshQueue.push(resolve));
            return authFetch(url, options, retries);
          }

          isRefreshing = true;
          const refreshed = await refreshAccessToken();
          isRefreshing = false;
          refreshQueue.forEach((cb) => cb());
          refreshQueue = [];

          if (!refreshed) throw new SessionExpiredError();

          return authFetch(url, options, retries);
        }

        if (!res.ok) {
          const errorData = await res.json().catch(() => ({}));

          // Handle FastAPI 422 validation
          let message = "Unknown error";
          if (Array.isArray(errorData.detail)) {
            // Remove duplicates
            const uniqueMessages = Array.from(
              new Set(errorData.detail.map((d: any) => d.msg)),
            );
            message = uniqueMessages.join(", ");
          } else if (typeof errorData.detail === "string") {
            message = errorData.detail;
          }

          if (res.status >= 500)
            throw new ServerError(res.status, res, message);
          if (res.status >= 400)
            throw new ClientError(res.status, res, message);
        }

        return res;
      } catch (err: unknown) {
        if (
          err instanceof ClientError ||
          err instanceof ServerError ||
          err instanceof SessionExpiredError
        ) {
          throw err;
        }

        throw new NetworkError(err instanceof Error ? err.message : undefined);
      }
    },
    retries,
    500, // base delay
    5000, // max delay
  );
}
