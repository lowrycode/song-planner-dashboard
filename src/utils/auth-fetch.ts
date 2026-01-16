const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

export async function authFetch(url: string, options: RequestInit = {}) {
  const fullUrl = url.startsWith('/') ? `${API_BASE_URL}${url}` : `${API_BASE_URL}/${url}`;
  const res = await fetch(fullUrl, {
    ...options,
    // header no longer used for sending access / refresh tokens
    credentials: "include", // send cookies automatically
  });

  if (res.status === 401) {
    // Redirect to login if unauthorized
    window.location.href = "/login";
    return Promise.reject("Not authenticated");
  }

  return res;
}
