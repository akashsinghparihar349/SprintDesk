import type { User } from "../types/user.types";

const USERS_API_URL = "http://localhost:8000/users";

export async function getUsers(): Promise<User[]> {
  const response = await fetch(USERS_API_URL);

  if (!response.ok) {
    throw new Error("Failed to fetch users");
  }

  return response.json();
}

export async function getUserById(
  id: number
): Promise<User> {
  const response = await fetch(
    `${USERS_API_URL}/${id}`
  );

  if (!response.ok) {
    throw new Error("Failed to fetch user");
  }

  return response.json();
}