import { useMemo } from "react";

import { useTasks } from "../../hooks/useTasks";
import StatCard from "../../components/dashboard/StatCard";

export default function Dashboard() {
  const { data: tasks = [], isLoading, isError, error } = useTasks();

  const stats = useMemo(() => {
    const total = tasks.length;

    const backlog = tasks.filter((task) => task.status === "backlog").length;

    const inProgress = tasks.filter(
      (task) => task.status === "in-progress",
    ).length;

    const review = tasks.filter((task) => task.status === "review").length;

    const done = tasks.filter((task) => task.status === "done").length;

    const highPriority = tasks.filter(
      (task) => task.priority === "high",
    ).length;

    const overdue = tasks.filter((task) => {
      if (!task.dueDate) return false;
      if (task.status === "done") return false;

      return new Date(task.dueDate) < new Date();
    }).length;

    return {
      total,
      backlog,
      inProgress,
      review,
      done,
      highPriority,
      overdue,
    };
  }, [tasks]);

  if (isLoading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <p className="text-slate-500">Loading dashboard...</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="rounded-xl bg-red-50 p-6 text-red-600">
        {error instanceof Error ? error.message : "Failed to load dashboard"}
      </div>
    );
  }

  const getPercentage = (value: number) => {
    if (stats.total === 0) return 0;

    return (value / stats.total) * 100;
  };

  return (
    <div className="space-y-8">
      {/* Header */}

      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
          Dashboard
        </h1>

        <p className="mt-1 text-sm text-slate-500">
          Overview of your SprintDesk tasks.
        </p>
      </div>

      {/* Main Stats */}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Tasks"
          value={stats.total}
          description="All tasks"
        />

        <StatCard
          title="Backlog"
          value={stats.backlog}
          description="Tasks waiting to start"
        />

        <StatCard
          title="In Progress"
          value={stats.inProgress}
          description="Currently being worked on"
        />

        <StatCard
          title="Done"
          value={stats.done}
          description="Completed tasks"
        />
      </div>

      {/* Secondary Stats */}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <StatCard
          title="Review"
          value={stats.review}
          description="Tasks waiting for review"
        />

        <StatCard
          title="High Priority"
          value={stats.highPriority}
          description="High priority tasks"
        />

        <StatCard
          title="Overdue"
          value={stats.overdue}
          description="Tasks past their due date"
        />
      </div>

      {/* Task Summary */}

      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
          Task Summary
        </h2>

        <div className="mt-5 space-y-4">
          {/* Backlog */}

          <div>
            <div className="mb-1 flex justify-between text-sm">
              <span className="text-slate-600 dark:text-slate-300">
                Backlog
              </span>

              <span className="font-medium">{stats.backlog}</span>
            </div>

            <div className="h-2 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-700">
              <div
                className="h-full rounded-full bg-slate-500"
                style={{
                  width: `${getPercentage(stats.backlog)}%`,
                }}
              />
            </div>
          </div>

          {/* In Progress */}

          <div>
            <div className="mb-1 flex justify-between text-sm">
              <span className="text-slate-600 dark:text-slate-300">
                In Progress
              </span>

              <span className="font-medium">{stats.inProgress}</span>
            </div>

            <div className="h-2 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-700">
              <div
                className="h-full rounded-full bg-blue-500"
                style={{
                  width: `${getPercentage(stats.inProgress)}%`,
                }}
              />
            </div>
          </div>

          {/* Review */}

          <div>
            <div className="mb-1 flex justify-between text-sm">
              <span className="text-slate-600 dark:text-slate-300">Review</span>

              <span className="font-medium">{stats.review}</span>
            </div>

            <div className="h-2 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-700">
              <div
                className="h-full rounded-full bg-yellow-500"
                style={{
                  width: `${getPercentage(stats.review)}%`,
                }}
              />
            </div>
          </div>

          {/* Done */}

          <div>
            <div className="mb-1 flex justify-between text-sm">
              <span className="text-slate-600 dark:text-slate-300">Done</span>

              <span className="font-medium">{stats.done}</span>
            </div>

            <div className="h-2 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-700">
              <div
                className="h-full rounded-full bg-green-500"
                style={{
                  width: `${getPercentage(stats.done)}%`,
                }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Recent Tasks */}

      <div className="rounded-xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div className="border-b border-slate-200 px-6 py-4 dark:border-slate-800">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
            Recent Tasks
          </h2>

          <p className="mt-1 text-sm text-slate-500">Recently updated tasks</p>
        </div>

        <div className="divide-y divide-slate-200 dark:divide-slate-800">
          {tasks
            .slice()
            .sort(
              (a, b) =>
                new Date(b.updatedAt).getTime() -
                new Date(a.updatedAt).getTime(),
            )
            .slice(0, 5)
            .map((task) => (
              <div
                key={task.id}
                className="flex items-center justify-between gap-4 px-6 py-4"
              >
                <div className="min-w-0">
                  <p className="truncate font-medium text-slate-900 dark:text-white">
                    {task.title}
                  </p>

                  <p className="mt-1 text-xs text-slate-500">Task #{task.id}</p>
                </div>

                <div className="flex shrink-0 items-center gap-3">
                  {/* Priority */}

                  <span
                    className={`rounded-full px-2.5 py-1 text-xs font-medium ${
                      task.priority === "high"
                        ? "bg-red-100 text-red-700"
                        : task.priority === "medium"
                          ? "bg-yellow-100 text-yellow-700"
                          : "bg-green-100 text-green-700"
                    }`}
                  >
                    {task.priority}
                  </span>

                  {/* Status */}

                  <span className="hidden rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600 sm:inline-block dark:bg-slate-800 dark:text-slate-300">
                    {task.status}
                  </span>
                </div>
              </div>
            ))}

          {tasks.length === 0 && (
            <div className="px-6 py-8 text-center text-sm text-slate-500">
              No tasks available.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
