import { useState } from "react";

import type {
  TaskPriority,
  TaskStatus,
  CreateTaskInput,
} from "../../types/task.types";

import { createTask } from "../../services/task.service";
import { useBoardStore } from "../../stores/board.store";
import { useUsers } from "../../hooks/useUsers";
import { useSprints } from "../../hooks/useSprints";

interface CreateTaskModalProps {
  onClose: () => void;
}

const statuses: TaskStatus[] = ["backlog", "in-progress", "review", "done"];

const priorities: TaskPriority[] = ["low", "medium", "high"];

export default function CreateTaskModal({ onClose }: CreateTaskModalProps) {
  const addTask = useBoardStore((state) => state.addTask);
  const tasks = useBoardStore((state) => state.tasks);

  const { data: users = [], isLoading: usersLoading } = useUsers();

  const {
    data: sprints = [],
    isLoading: sprintsLoading,
    isError: sprintsError,
  } = useSprints();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const [status, setStatus] = useState<TaskStatus>("backlog");

  const [priority, setPriority] = useState<TaskPriority>("medium");

  const [assigneeId, setAssigneeId] = useState<number>(1);

  const [dueDate, setDueDate] = useState("");

  const [sprintId, setSprintId] = useState<number>(1);

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  async function handleCreate() {
    if (!title.trim()) {
      setError("Task title is required.");
      return;
    }

    if (!assigneeId) {
      setError("Please select an assignee.");
      return;
    }

    if (!sprintId) {
      setError("Please select a sprint.");
      return;
    }

    try {
      setSaving(true);
      setError("");

      const statusTasks = tasks.filter((task) => task.status === status);

      const maxOrder =
        statusTasks.length > 0
          ? Math.max(...statusTasks.map((task) => task.order))
          : 0;

      const taskData: CreateTaskInput = {
        title: title.trim(),
        description: description.trim(),
        status,
        priority,
        assigneeId,
        dueDate,
        sprintId,
        order: maxOrder + 1,
      };

      console.log("Creating task:", taskData);

      const newTask = await createTask(taskData);

      console.log("Task created:", newTask);

      addTask(newTask);

      onClose();
    } catch (error) {
      console.error("Failed to create task:", error);

      setError("Failed to create task.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <>
      <div onClick={onClose} className="fixed inset-0 z-50 bg-black/40" />

      <div className="fixed left-1/2 top-1/2 z-50 w-[calc(100%-2rem)] max-w-lg -translate-x-1/2 -translate-y-1/2 rounded-2xl bg-white shadow-2xl dark:bg-slate-900">
        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4 dark:border-slate-800">
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
              Create Task
            </h2>

            <p className="text-xs text-slate-400">
              Add a new task to the board
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

        <div className="max-h-[75vh] space-y-5 overflow-y-auto p-6">
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
              type="text"
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              placeholder="Enter task title"
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-blue-500 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
            />
          </div>

          {/* Description */}

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
              Description
            </label>

            <textarea
              rows={4}
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              placeholder="Enter task description"
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
              onChange={(event) => setStatus(event.target.value as TaskStatus)}
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-blue-500 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
            >
              {statuses.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
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
                setPriority(event.target.value as TaskPriority)
              }
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-blue-500 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
            >
              {priorities.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </div>

          {/* Assignee */}

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
              Assignee
            </label>

            <select
              value={assigneeId}
              onChange={(event) => setAssigneeId(Number(event.target.value))}
              disabled={usersLoading || users.length === 0}
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-blue-500 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
            >
              {usersLoading ? (
                <option value={0}>Loading users...</option>
              ) : users.length === 0 ? (
                <option value={0}>No users found</option>
              ) : (
                users.map((user) => (
                  <option key={user.id} value={user.id}>
                    {user.firstName ||
                      user.username ||
                      user.email ||
                      `User #${user.id}`}
                    {user.lastName ? ` ${user.lastName}` : ""}
                  </option>
                ))
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
              onChange={(event) => setDueDate(event.target.value)}
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-blue-500 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
            />
          </div>

          {/* Sprint */}

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
              Sprint
            </label>

            <select
              value={sprintId}
              onChange={(event) => setSprintId(Number(event.target.value))}
              disabled={sprintsLoading || sprints.length === 0}
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-blue-500 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
            >
              {sprintsLoading && <option value={0}>Loading sprints...</option>}

              {!sprintsLoading && sprintsError && (
                <option value={0}>Failed to load sprints</option>
              )}

              {!sprintsLoading && !sprintsError && sprints.length === 0 && (
                <option value={0}>No sprints found</option>
              )}

              {!sprintsLoading &&
                !sprintsError &&
                sprints.map((sprint: any) => (
                  <option key={sprint.id} value={sprint.id}>
                    {sprint.name}
                  </option>
                ))}
            </select>
          </div>
        </div>

        {/* Footer */}

        <div className="flex justify-end gap-3 border-t border-slate-200 p-4 dark:border-slate-800">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-slate-300 px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={handleCreate}
            disabled={
              saving ||
              usersLoading ||
              sprintsLoading ||
              users.length === 0 ||
              sprints.length === 0
            }
            className="rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {saving ? "Creating..." : "Create Task"}
          </button>
        </div>
      </div>
    </>
  );
}
