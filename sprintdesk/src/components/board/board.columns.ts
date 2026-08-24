import type { TaskStatus } from "../../types/task.types";

export interface BoardColumn {
  id: TaskStatus;
  title: string;
}

export const boardColumns: BoardColumn[] = [
  {
    id: "backlog",
    title: "Backlog",
  },
  {
    id: "in-progress",
    title: "In Progress",
  },
  {
    id: "review",
    title: "Review",
  },
  {
    id: "done",
    title: "Done",
  },
];