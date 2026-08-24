import { useAuthStore } from "../stores/auth.store";

const API_BASE_URL = "https://dummyjson.com";

type RequestOptions = RequestInit & {
  retry?: boolean;
};

export async function apiRequest<T>(
  endpoint: string,
  options: RequestOptions = {},
): Promise<T> {
  const { accessToken } = useAuthStore.getState();

  const headers = new Headers(options.headers);

  if (!headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  if (accessToken) {
    headers.set("Authorization", `Bearer ${accessToken}`);
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  // Token expired -> silent refresh -> retry once
  if (response.status === 401 && options.retry !== false) {
    const refreshed = await refreshAccessToken();

    if (refreshed) {
      return apiRequest<T>(endpoint, {
        ...options,
        retry: false,
      });
    }

    useAuthStore.getState().logout();

    throw new Error(
      "Session expired. Please login again.",
    );
  }

  if (!response.ok) {
    const errorData = await response.json().catch(() => null);

    throw new Error(
      errorData?.message || "API request failed",
    );
  }

  return response.json() as Promise<T>;
}

export async function refreshAccessToken(): Promise<boolean> {
  const { refreshToken } = useAuthStore.getState();

  if (!refreshToken) {
    return false;
  }

  try {
    const response = await fetch(
      `${API_BASE_URL}/auth/refresh`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          refreshToken,
          expiresInMins: 30,
        }),
      },
    );

    if (!response.ok) {
      return false;
    }

    const data = await response.json();

    if (!data.accessToken) {
      return false;
    }

    useAuthStore.setState({
      accessToken: data.accessToken,
      refreshToken:
        data.refreshToken || refreshToken,
    });

    // Keep latest refresh token persisted
    localStorage.setItem(
      "sprintdesk_refresh_token",
      data.refreshToken || refreshToken,
    );

    return true;
  } catch (error) {
    console.error(
      "Silent token refresh failed:",
      error,
    );

    return false;
  }
}