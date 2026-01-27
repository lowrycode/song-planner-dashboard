export function useUnauthFetch() {
  return async function unauthFetchWithErrors(
    url: string,
    options?: RequestInit
  ) {
    const API_BASE_URL =
      import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";
    const fullUrl = url.startsWith("/")
      ? `${API_BASE_URL}${url}`
      : `${API_BASE_URL}/${url}`;
    const res = await fetch(fullUrl, { ...options });

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
        // fallback if JSON parse fails
      }

      throw new Error(errorMessage);
    }

    return res;
  };
}
