import type {
  AuthResponse,
  LoginCredentials,
} from "../types/auth.types";

const AUTH_URL = "https://dummyjson.com/auth";

export async function loginUser(
  credentials: LoginCredentials
): Promise<AuthResponse> {
  const response = await fetch(`${AUTH_URL}/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      username: credentials.username,
      password: credentials.password,
      expiresInMins: 30,
    }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => null);

    throw new Error(
      errorData?.message || "Invalid username or password"
    );
  }

  return response.json();
}