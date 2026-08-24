import { useEffect, useState } from "react";

import type {
  Task,
  TaskPriority,
  TaskStatus,
} from "../../types/task.types";

import {
  updateTask as updateTaskApi,
  deleteTask as deleteTaskApi,
} from "../../services/task.service";

import { useBoardStore } from "../../stores/board.store";

interface TaskDrawerProps {
  task: Task | null;
  onClose: () => void;
}

const statuses: TaskStatus[] = [
  "backlog",
  "in-progress",
  "review",
  "done",
];

const priorities: TaskPriority[] = [
  "low",
  "medium",
  "high",
];

export default function TaskDrawer({
  task,
  onClose,
}: TaskDrawerProps) {
  const updateTaskStore = useBoardStore(
    (state) => state.updateTask
  );

  const deleteTaskStore = useBoardStore(
    (state) => state.deleteTask
  );

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const [status, setStatus] =
    useState<TaskStatus>("backlog");

  const [priority, setPriority] =
    useState<TaskPriority>("medium");

  const [dueDate, setDueDate] = useState("");

  const [saving, setSaving] = useState(false);

  const [deleting, setDeleting] = useState(false);

  const [error, setError] = useState("");

  useEffect(() => {
    if (!task) return;

    setTitle(task.title);
    setDescription(task.description);
    setStatus(task.status);
    setPriority(task.priority);
    setDueDate(task.dueDate || "");
    setError("");
  }, [task]);

  if (!task) {
    return null;
  }

  // ========================================
  // SAVE TASK
  // ========================================

  async function handleSave() {
    if (!title.trim()) {
      setError("Task title is required.");
      return;
    }

    try {
      setSaving(true);
      setError("");

      const updates = {
        title: title.trim(),
        description: description.trim(),
        status,
        priority,
        dueDate,
        updatedAt: new Date().toISOString(),
      };

      const updatedTask =
        await updateTaskApi(
          task.id,
          updates
        );

      updateTaskStore(
        task.id,
        updatedTask
      );

      onClose();
    } catch (error) {
      console.error(
        "Failed to update task:",
        error
      );

      setError(
        "Failed to update task."
      );
    } finally {
      setSaving(false);
    }
  }

  // ========================================
  // DELETE TASK
  // ========================================

  async function handleDelete() {
    const confirmed = window.confirm(
      "Are you sure you want to delete this task?"
    );

    if (!confirmed) {
      return;
    }

    try {
      setDeleting(true);
      setError("");

      // Delete from backend
      await deleteTaskApi(task.id);

      // Delete from Zustand
      deleteTaskStore(task.id);

      // Close drawer
      onClose();
    } catch (error) {
      console.error(
        "Failed to delete task:",
        error
      );

      setError(
        "Failed to delete task."
      );
    } finally {
      setDeleting(false);
    }
  }

  return (
    <>
      {/* Overlay */}

      <div
        onClick={onClose}
        className="fixed inset-0 z-40 bg-black/30"
      />

      {/* Drawer */}

      <aside className="fixed right-0 top-0 z-50 flex h-3/4 w-full max-w-xl flex-col bg-white shadow-2xl dark:bg-slate-900">

        {/* Header */}

        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4 dark:border-slate-800">

          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
              Task Details
            </h2>

            <p className="text-xs text-slate-400">
              Task #{task.id}
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-lg px-3 py-2 text-xl text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            ×
          </button>

        </div>

        {/* Content */}

        <div className="flex-1 overflow-y-auto p-6">

          <div className="space-y-5">

            {/* Error */}

            {error && (
              <div className="rounded-lg bg-red-50 p-3 text-sm text-red-600">
                {error}
              </div>
            )}

            {/* Title */}

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
                Title
              </label>

              <input
                value={title}
                onChange={(event) =>
                  setTitle(
                    event.target.value
                  )
                }
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-blue-500 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              />
            </div>

            {/* Description */}

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
                Description
              </label>

              <textarea
                rows={5}
                value={description}
                onChange={(event) =>
                  setDescription(
                    event.target.value
                  )
                }
                className="w-full resize-none rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-blue-500 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              />
            </div>

            {/* Status */}

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
                Status
              </label>

              <select
                value={status}
                onChange={(event) =>
                  setStatus(
                    event.target
                      .value as TaskStatus
                  )
                }
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              >
                {statuses.map(
                  (item) => (
                    <option
                      key={item}
                      value={item}
                    >
                      {item}
                    </option>
                  )
                )}
              </select>
            </div>

            {/* Priority */}

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
                Priority
              </label>

              <select
                value={priority}
                onChange={(event) =>
                  setPriority(
                    event.target
                      .value as TaskPriority
                  )
                }
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              >
                {priorities.map(
                  (item) => (
                    <option
                      key={item}
                      value={item}
                    >
                      {item}
                    </option>
                  )
                )}
              </select>
            </div>

            {/* Due Date */}

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
                Due Date
              </label>

              <input
                type="date"
                value={dueDate}
                onChange={(event) =>
                  setDueDate(
                    event.target.value
                  )
                }
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              />
            </div>

            {/* Assignee */}

            <div className="rounded-lg bg-slate-50 p-4 dark:bg-slate-800">

              <p className="text-xs text-slate-400">
                Assignee
              </p>

              <p className="mt-1 font-medium text-slate-800 dark:text-white">
                User #{task.assigneeId}
              </p>

            </div>

            {/* Sprint */}

            <div className="rounded-lg bg-slate-50 p-4 dark:bg-slate-800">

              <p className="text-xs text-slate-400">
                Sprint
              </p>

              <p className="mt-1 font-medium text-slate-800 dark:text-white">
                Sprint #{task.sprintId}
              </p>

            </div>

          </div>

        </div>

        {/* Footer */}

        <div className="flex gap-3 border-t border-slate-200 p-4 dark:border-slate-800">

          {/* DELETE */}

          <button
            type="button"
            onClick={handleDelete}
            disabled={
              saving || deleting
            }
            className="mr-auto rounded-lg bg-red-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {deleting
              ? "Deleting..."
              : "Delete Task"}
          </button>

          {/* CANCEL */}

          <button
            type="button"
            onClick={onClose}
            disabled={
              saving || deleting
            }
            className="rounded-lg border border-slate-300 px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-100 disabled:opacity-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
          >
            Cancel
          </button>

          {/* SAVE */}

          <button
            type="button"
            onClick={handleSave}
            disabled={
              saving || deleting
            }
            className="rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {saving
              ? "Saving..."
              : "Save Changes"}
          </button>

        </div>

      </aside>
    </>
  );
}