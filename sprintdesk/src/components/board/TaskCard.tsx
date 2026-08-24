import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

import type { Task } from "../../types/task.types";

interface TaskCardProps {
  task: Task;
  onClick: (task: Task) => void;
}

export default function TaskCard({ task, onClick }: TaskCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: task.id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      onClick={() => onClick(task)}
      className={`mb-3 cursor-grab rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition hover:shadow-md active:cursor-grabbing dark:border-slate-700 dark:bg-slate-900 ${
        isDragging ? "opacity-50" : ""
      }`}
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <h3 className="font-semibold text-slate-900 dark:text-white">
          {task.title}
        </h3>

        <span
          className={`shrink-0 rounded-full px-3 py-1 text-xs font-medium ${
            task.priority === "high"
              ? "bg-red-100 text-red-700"
              : task.priority === "medium"
                ? "bg-yellow-100 text-yellow-700"
                : "bg-green-100 text-green-700"
          }`}
        >
          {task.priority}
        </span>
      </div>

      {/* Description */}
      <p className="mt-3 line-clamp-3 text-sm text-slate-500 dark:text-slate-400">
        {task.description}
      </p>

      {/* Footer */}
      <div className="mt-4 flex items-center justify-between text-xs text-slate-400">
        <span>Assignee #{task.assigneeId}</span>

        <span>{task.dueDate || "No due date"}</span>
      </div>
    </div>
  );
}
