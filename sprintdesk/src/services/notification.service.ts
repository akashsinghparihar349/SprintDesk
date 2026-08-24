const NOTIFICATION_API_URL =
  "https://jsonplaceholder.typicode.com/posts";

export interface NotificationPost {
  id: number;
  title: string;
  body: string;
}

export async function getNotifications(
  page = 1,
  limit = 20,
): Promise<NotificationPost[]> {
  const response = await fetch(
    `${NOTIFICATION_API_URL}?_page=${page}&_limit=${limit}`,
  );

  if (!response.ok) {
    throw new Error("Failed to fetch notifications");
  }

  return response.json();
}

export async function markNotificationAsRead(
  id: number,
): Promise<void> {
  const response = await fetch(
    `${NOTIFICATION_API_URL}/${id}`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        read: true,
      }),
    },
  );

  if (!response.ok) {
    throw new Error(
      "Failed to mark notification as read",
    );
  }
}