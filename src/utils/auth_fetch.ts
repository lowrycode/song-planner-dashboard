async function refreshAccessToken() {
  const refreshToken = localStorage.getItem("refresh_token");

  if (!refreshToken) {
    throw new Error("No refresh token");
  }

  const res = await fetch("http://127.0.0.1:8000/auth/refresh", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ refresh_token: refreshToken }),
  });

  if (!res.ok) {
    throw new Error("Refresh token expired");
  }

  const data = await res.json();

  localStorage.setItem("access_token", data.access_token);
  localStorage.setItem("refresh_token", data.refresh_token);

  return data.access_token;
}


export async function authFetch(
  url: string,
  options: RequestInit = {}
) {
  let access_token = localStorage.getItem("access_token");

  if (!access_token) {
    throw new Error("Not authenticated");
  }

  let res = await fetch(url, {
    ...options,
    headers: {
      ...(options.headers || {}),
      Authorization: `Bearer ${access_token}`,
    },
  });

  // Access token expired → try refresh
  if (res.status === 401) {
    try {
      access_token = await refreshAccessToken();
    } catch {
      // Session expired
      localStorage.removeItem("access_token");
      localStorage.removeItem("refresh_token");
      window.location.href = "/login";
      return Promise.reject();
    }

    // Retry original request
    res = await fetch(url, {
      ...options,
      headers: {
        ...(options.headers || {}),
        Authorization: `Bearer ${access_token}`,
      },
    });
  }

  return res;
}
