const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

export async function unauthFetch(url: string, options: RequestInit = {}) {
  const fullUrl = url.startsWith('/') ? `${API_BASE_URL}${url}` : `${API_BASE_URL}/${url}`;
  const res = await fetch(fullUrl, {
    ...options,
  });

  return res;
}
