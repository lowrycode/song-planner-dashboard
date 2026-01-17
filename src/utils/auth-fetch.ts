import { refreshAccessToken } from "./refresh-token";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

let isRefreshing: boolean = false;
let refreshQueue: (() => void)[] = [];

export async function authFetch(url: string, options: RequestInit = {}) {
  const fullUrl = url.startsWith('/') ? `${API_BASE_URL}${url}` : `${API_BASE_URL}/${url}`;
  const res = await fetch(fullUrl, {
    ...options,
    // header no longer used for sending access / refresh tokens
    credentials: "include", // send cookies automatically
  });

  if (res.status !== 401) {
    return res;
  }

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
    throw new Error("Session expired");
  }

  // Retry original request
  return authFetch(url, options);
}
