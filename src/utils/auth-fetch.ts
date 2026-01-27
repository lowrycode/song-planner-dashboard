import { refreshAccessToken } from "./refresh-token";
import { SessionExpiredError } from "../types/errors";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

let isRefreshing: boolean = false;
let refreshQueue: (() => void)[] = [];


export async function authFetch(url: string, options: RequestInit = {}) {
  const fullUrl = url.startsWith("/")
    ? `${API_BASE_URL}${url}`
    : `${API_BASE_URL}/${url}`;
  const res = await fetch(fullUrl, {
    ...options,
    // header no longer used for sending access / refresh tokens
    credentials: "include", // send cookies automatically
  });

  if (res.status === 401) {
    // Prevent multiple refresh calls
    if (isRefreshing) {
      await new Promise<void>((resolve) => refreshQueue.push(resolve));
      return authFetch(url, options);
    }

    isRefreshing = true;

    const refreshed = await refreshAccessToken();

    isRefreshing = false;
    refreshQueue.forEach((cb) => cb());
    refreshQueue = [];

    if (!refreshed) {
      throw new SessionExpiredError();
    }

    // Retry original request
    return authFetch(url, options);
  }

  if (!res.ok) {
    let errorMessage = `Request failed with status ${res.status}`;

    try {
      const data = await res.json();
      if (Array.isArray(data.detail)) {
        errorMessage = data.detail.map((e: any) => e.msg).join(", ");
      } else if (typeof data.detail === "string") {
        errorMessage = data.detail;
      }
    } catch {
      // JSON parse failed — fallback to status message
    }

    throw new Error(errorMessage);
  }

  return res;
}
