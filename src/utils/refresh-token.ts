import { unauthFetch } from "./unauth-fetch";

export async function refreshAccessToken(): Promise<boolean> {
  try {
    const res = await unauthFetch("/auth/refresh", {
      method: "POST",
      credentials: "include",
    });

    return res.ok;
  } catch {
    return false;
  }
}