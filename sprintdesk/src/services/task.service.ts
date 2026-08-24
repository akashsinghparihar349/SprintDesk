import type {
  CreateTaskInput,
  Task,
} from "../types/task.types";

const TASK_API_URL = "https://sprintdesk-raaa.onrender.com/tasks";

export async function getTasks(): Promise<Task[]> {
  const response = await fetch(TASK_API_URL);

  if (!response.ok) {
    throw new Error("Failed to fetch tasks");
  }

  return response.json();
}

export async function getTaskById(
  id: string
): Promise<Task> {
  const response = await fetch(`${TASK_API_URL}/${id}`);

  if (!response.ok) {
    throw new Error("Failed to fetch task");
  }

  return response.json();
}

export async function createTask(
  task: CreateTaskInput
): Promise<Task> {
  const response = await fetch(TASK_API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(task),
  });

  if (!response.ok) {
    throw new Error("Failed to create task");
  }

  return response.json();
}

export async function updateTask(
  id: string,
  updates: Partial<Task>
): Promise<Task> {
  const response = await fetch(`${TASK_API_URL}/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(updates),
  });

  if (!response.ok) {
    throw new Error("Failed to update task");
  }

  return response.json();
}

export async function deleteTask(
  id: string
): Promise<void> {
  const response = await fetch(`${TASK_API_URL}/${id}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    throw new Error("Failed to delete task");
  }
}