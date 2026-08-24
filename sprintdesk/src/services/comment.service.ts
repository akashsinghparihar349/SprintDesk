import type {
  Comment,
  CreateCommentInput,
} from "../types/comment.types";

const COMMENTS_API_URL =
  "http://localhost:8000/comments";

export async function getCommentsByTaskId(
  taskId: string
): Promise<Comment[]> {
  const response = await fetch(
    `${COMMENTS_API_URL}?taskId=${taskId}`
  );

  if (!response.ok) {
    throw new Error(
      "Failed to fetch comments"
    );
  }

  return response.json();
}

export async function createComment(
  comment: CreateCommentInput
): Promise<Comment> {
  const response = await fetch(
    COMMENTS_API_URL,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(comment),
    }
  );

  if (!response.ok) {
    throw new Error(
      "Failed to create comment"
    );
  }

  return response.json();
}

export async function deleteComment(
  id: string
): Promise<void> {
  const response = await fetch(
    `${COMMENTS_API_URL}/${id}`,
    {
      method: "DELETE",
    }
  );

  if (!response.ok) {
    throw new Error(
      "Failed to delete comment"
    );
  }
}