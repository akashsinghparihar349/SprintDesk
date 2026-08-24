export type TaskStatus =
  | "backlog"
  | "in-progress"
  | "review"
  | "done";

export type TaskPriority =
  | "low"
  | "medium"
  | "high";

export interface Task {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;

  assigneeId: number;
  dueDate: string;

  sprintId: number;
  order: number;

  createdAt: string;
  completedAt: string | null;
  updatedAt: string;
}

export interface CreateTaskInput {
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  assigneeId: number;
  dueDate: string;
  sprintId: number;
  order: number;
}

export interface Assignee {
  id: number;
  firstName: string;
  lastName: string;
  username: string;
  image?: string;
}