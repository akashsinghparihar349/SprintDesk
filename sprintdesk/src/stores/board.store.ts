import { create } from "zustand";
import type {
  Task,
  TaskStatus,
} from "../types/task.types";

interface BoardState {
  tasks: Task[];

  setTasks: (tasks: Task[]) => void;

  addTask: (task: Task) => void;

  updateTask: (
    id: string,
    updates: Partial<Task>
  ) => void;

  moveTask: (
    taskId: string,
    status: TaskStatus
  ) => void;

  reorderTasks: (
    status: TaskStatus,
    taskIds: string[]
  ) => void;

  deleteTask: (id: string) => void;
}

export const useBoardStore = create<BoardState>(
  (set) => ({
    tasks: [],

    setTasks: (tasks) => {
      set({ tasks });
    },

    addTask: (task) => {
      set((state) => ({
        tasks: [...state.tasks, task],
      }));
    },

    updateTask: (id, updates) => {
      set((state) => ({
        tasks: state.tasks.map((task) =>
          task.id === id
            ? {
              ...task,
              ...updates,
            }
            : task
        ),
      }));
    },

    moveTask: (taskId, status) => {
      set((state) => ({
        tasks: state.tasks.map((task) =>
          task.id === taskId
            ? {
              ...task,
              status,
            }
            : task
        ),
      }));
    },

    reorderTasks: (status, taskIds) => {
      set((state) => {
        const orderMap = new Map(
          taskIds.map((id, index) => [
            id,
            index + 1,
          ])
        );

        return {
          tasks: state.tasks.map((task) =>
            task.status === status &&
              orderMap.has(task.id)
              ? {
                ...task,
                order: orderMap.get(task.id)!,
              }
              : task
          ),
        };
      });
    },

    deleteTask: (id) => {
      set((state) => ({
        tasks: state.tasks.filter(
          (task) => task.id !== id
        ),
      }));
    },
  })
);