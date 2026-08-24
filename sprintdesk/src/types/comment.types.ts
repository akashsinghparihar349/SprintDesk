export interface Comment {
  id: string;
  taskId: string;
  userId: number;
  text: string;
  createdAt: string;
}

export interface CreateCommentInput {
  taskId: string;
  userId: number;
  text: string;
  createdAt: string;
}