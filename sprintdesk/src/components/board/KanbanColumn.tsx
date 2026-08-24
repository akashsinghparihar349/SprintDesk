import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";

import type {
  Task,
  TaskStatus,
} from "../../types/task.types";

import TaskCard from "./TaskCard";

interface KanbanColumnProps {
  id: TaskStatus;
  title: string;
  tasks: Task[];
  onTaskClick: (task: Task) => void;
}

export default function KanbanColumn({
  id,
  title,
  tasks,
  onTaskClick,
}: KanbanColumnProps) {
  return (
    <div className="w-[365px] shrink-0 rounded-xl bg-slate-100 p-4 dark:bg-slate-800">
      
      {/* Column Header */}
      <div className="mb-4 flex items-center justify-between">
        <h2 className="font-semibold text-slate-900 dark:text-white">
          {title}
        </h2>

        <span className="rounded-full bg-slate-200 px-3 py-1 text-xs font-medium text-slate-600 dark:bg-slate-700 dark:text-slate-300">
          {tasks.length}
        </span>
      </div>

      {/* Sortable Tasks */}
      <SortableContext
        items={tasks.map((task) => task.id)}
        strategy={verticalListSortingStrategy}
      >
        <div
          id={id}
          className="min-h-[500px]"
        >
          {tasks.length === 0 ? (
            <div className="flex min-h-[110px] items-center justify-center rounded-xl border-2 border-dashed border-slate-300 text-sm text-slate-400 dark:border-slate-600">
              Drop task here
            </div>
          ) : (
            tasks.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                onClick={onTaskClick}
              />
            ))
          )}
        </div>
      </SortableContext>
    </div>
  );
}