import {
  DndContext,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";

import type { DragEndEvent, DragOverEvent } from "@dnd-kit/core";

import { useEffect, useMemo, useState } from "react";

import { useTasks } from "../../hooks/useTasks";

import { updateTask as updateTaskApi } from "../../services/task.service";

import { useBoardStore } from "../../stores/board.store";

import KanbanColumn from "../../components/board/KanbanColumn";

import { boardColumns } from "../../components/board/board.columns";

import type { Task, TaskStatus } from "../../types/task.types";

import TaskDrawer from "../../components/tasks/TaskDrawer";
import CreateTaskModal from "../../components/tasks/CreateTaskModal";

export default function Board() {
  // =========================
  // TASK DATA
  // =========================

  const { data, isLoading, isError, error } = useTasks();

  // =========================
  // ZUSTAND
  // =========================

  const tasks = useBoardStore((state) => state.tasks);

  const setTasks = useBoardStore((state) => state.setTasks);

  const moveTask = useBoardStore((state) => state.moveTask);

  const reorderTasks = useBoardStore((state) => state.reorderTasks);

  // =========================
  // LOCAL STATE
  // =========================

  const [showCreateTask, setShowCreateTask] = useState(false);

  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  const [search, setSearch] = useState("");

  const [priorityFilter, setPriorityFilter] = useState<
    "all" | "low" | "medium" | "high"
  >("all");

  // =========================
  // DND SENSORS
  // =========================

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
  );

  // =========================
  // LOAD TASKS
  // =========================

  useEffect(() => {
    if (data) {
      setTasks(data);
    }
  }, [data, setTasks]);

  // =========================
  // SEARCH + PRIORITY FILTER
  // =========================

  const filteredTasks = useMemo(() => {
    const searchText = search.trim().toLowerCase();

    return tasks.filter((task) => {
      const matchesSearch =
        !searchText ||
        task.title.toLowerCase().includes(searchText) ||
        task.description.toLowerCase().includes(searchText);

      const matchesPriority =
        priorityFilter === "all" || task.priority === priorityFilter;

      return matchesSearch && matchesPriority;
    });
  }, [tasks, search, priorityFilter]);

  // =========================
  // LOADING
  // =========================

  if (isLoading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <p className="text-slate-500">Loading tasks...</p>
      </div>
    );
  }

  // =========================
  // ERROR
  // =========================

  if (isError) {
    return (
      <div className="rounded-xl bg-red-50 p-6 text-red-600">
        {error instanceof Error ? error.message : "Failed to load tasks"}
      </div>
    );
  }

  // =========================
  // FIND TASK
  // =========================

  function findTask(id: string) {
    return tasks.find((task) => task.id === id);
  }

  // =========================
  // FIND COLUMN
  // =========================

  function findColumn(id: string): TaskStatus | null {
    // First check if ID belongs to a task
    const task = findTask(id);

    if (task) {
      return task.status;
    }

    // Otherwise check if ID belongs to a board column
    const column = boardColumns.find((column) => column.id === id);

    return column?.id ?? null;
  }

  // =========================
  // DRAG OVER
  // =========================

  function handleDragOver(event: DragOverEvent) {
    const { active, over } = event;

    if (!over) return;

    const activeId = String(active.id);

    const overId = String(over.id);

    const activeTask = findTask(activeId);

    if (!activeTask) return;

    // Find the column where task is being dragged
    const overColumn = findColumn(overId);

    if (!overColumn) return;

    // Already in same column
    if (activeTask.status === overColumn) {
      return;
    }

    // Update Zustand immediately
    moveTask(activeId, overColumn);
  }

  // =========================
  // DRAG END
  // =========================

  async function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;

    if (!over) return;

    const activeId = String(active.id);

    const overId = String(over.id);

    const activeTask = findTask(activeId);

    if (!activeTask) return;

    // =========================
    // FIND TARGET COLUMN
    // =========================

    const targetColumn = findColumn(overId);

    if (!targetColumn) return;

    // =========================
    // GET TASKS IN TARGET COLUMN
    // =========================

    const columnTasks = filteredTasks
      .filter((task) => task.status === targetColumn)
      .sort((a, b) => a.order - b.order);

    // =========================
    // REMOVE ACTIVE TASK
    // =========================

    const reorderedTasks = columnTasks.filter((task) => task.id !== activeId);

    // =========================
    // FIND NEW POSITION
    // =========================

    let newIndex = reorderedTasks.findIndex((task) => task.id === overId);

    // If dropped directly on column
    if (newIndex === -1) {
      newIndex = reorderedTasks.length;
    }

    // =========================
    // INSERT ACTIVE TASK
    // =========================

    reorderedTasks.splice(newIndex, 0, {
      ...activeTask,
      status: targetColumn,
    });

    // =========================
    // GET IDS
    // =========================

    const taskIds = reorderedTasks.map((task) => task.id);

    // =========================
    // UPDATE ZUSTAND
    // =========================

    reorderTasks(targetColumn, taskIds);

    // =========================
    // SAVE TO BACKEND
    // =========================

    try {
      await Promise.all(
        reorderedTasks.map((task, index) =>
          updateTaskApi(task.id, {
            status: targetColumn,
            order: index + 1,
          }),
        ),
      );

      console.log("Task order saved successfully");
    } catch (error) {
      console.error("Failed to save task order:", error);
    }
  }

  // =========================
  // TASK CLICK
  // =========================

  function handleTaskClick(task: Task) {
    setSelectedTask(task);
  }

  // =========================
  // UI
  // =========================

  return (
    <div className="space-y-6">
      {/* HEADER */}

      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
          Sprint Board
        </h1>

        <p className="mt-1 text-sm text-slate-500">
          Drag and drop tasks between columns.
        </p>
      </div>

      {/* ADD TASK */}

      <button
        type="button"
        onClick={() => setShowCreateTask(true)}
        className="rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-blue-700"
      >
        + Add Task
      </button>

      {/* SEARCH + FILTER */}

      <div className="flex flex-col gap-3 sm:flex-row">
        <input
          type="text"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Search tasks..."
          className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm outline-none focus:border-blue-500 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
        />

        <select
          value={priorityFilter}
          onChange={(event) =>
            setPriorityFilter(
              event.target.value as "all" | "low" | "medium" | "high",
            )
          }
          className="rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
        >
          <option value="all">All Priorities</option>

          <option value="low">Low</option>

          <option value="medium">Medium</option>

          <option value="high">High</option>
        </select>
      </div>

      {/* KANBAN BOARD */}

      <DndContext
        sensors={sensors}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
      >
        <div className="flex gap-4 overflow-x-auto pb-4">
          {boardColumns.map((column) => {
            const columnTasks = filteredTasks
              .filter((task) => task.status === column.id)
              .sort((a, b) => a.order - b.order);

            return (
              <KanbanColumn
                key={column.id}
                id={column.id}
                title={column.title}
                tasks={columnTasks}
                onTaskClick={handleTaskClick}
              />
            );
          })}
        </div>
      </DndContext>

      {/* TASK DRAWER */}

      <TaskDrawer task={selectedTask} onClose={() => setSelectedTask(null)} />

      {/* CREATE TASK MODAL */}

      {showCreateTask && (
        <CreateTaskModal onClose={() => setShowCreateTask(false)} />
      )}
    </div>
  );
}
