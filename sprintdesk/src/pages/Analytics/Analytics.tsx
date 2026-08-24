import { useMemo } from "react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  Legend,
} from "recharts";

import { useTasks } from "../../hooks/useTasks";

export default function Analytics() {
  const { data: tasks = [], isLoading, isError, error } = useTasks();

  const statusData = useMemo(() => {
    return [
      {
        name: "Backlog",
        value: tasks.filter((task) => task.status === "backlog").length,
      },
      {
        name: "In Progress",
        value: tasks.filter((task) => task.status === "in-progress").length,
      },
      {
        name: "Review",
        value: tasks.filter((task) => task.status === "review").length,
      },
      {
        name: "Done",
        value: tasks.filter((task) => task.status === "done").length,
      },
    ];
  }, [tasks]);

  const priorityData = useMemo(() => {
    return [
      {
        priority: "Low",
        backlog: tasks.filter(
          (task) => task.priority === "low" && task.status === "backlog",
        ).length,
        inProgress: tasks.filter(
          (task) => task.priority === "low" && task.status === "in-progress",
        ).length,
        review: tasks.filter(
          (task) => task.priority === "low" && task.status === "review",
        ).length,
        done: tasks.filter(
          (task) => task.priority === "low" && task.status === "done",
        ).length,
      },
      {
        priority: "Medium",
        backlog: tasks.filter(
          (task) => task.priority === "medium" && task.status === "backlog",
        ).length,
        inProgress: tasks.filter(
          (task) => task.priority === "medium" && task.status === "in-progress",
        ).length,
        review: tasks.filter(
          (task) => task.priority === "medium" && task.status === "review",
        ).length,
        done: tasks.filter(
          (task) => task.priority === "medium" && task.status === "done",
        ).length,
      },
      {
        priority: "High",
        backlog: tasks.filter(
          (task) => task.priority === "high" && task.status === "backlog",
        ).length,
        inProgress: tasks.filter(
          (task) => task.priority === "high" && task.status === "in-progress",
        ).length,
        review: tasks.filter(
          (task) => task.priority === "high" && task.status === "review",
        ).length,
        done: tasks.filter(
          (task) => task.priority === "high" && task.status === "done",
        ).length,
      },
    ];
  }, [tasks]);

  const completionData = useMemo(() => {
    const completedTasks = tasks
      .filter((task) => task.status === "done")
      .sort(
        (a, b) =>
          new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime(),
      );

    const grouped: Record<string, number> = {};

    completedTasks.forEach((task) => {
      const date = new Date(task.updatedAt).toISOString().split("T")[0];

      grouped[date] = (grouped[date] || 0) + 1;
    });

    let total = 0;

    return Object.entries(grouped).map(([date, count]) => {
      total += count;

      return {
        date,
        completed: total,
      };
    });
  }, [tasks]);

  const sprintVelocity = useMemo(() => {
    const grouped: Record<string, number> = {};

    tasks
      .filter((task) => task.status === "done")
      .forEach((task) => {
        const sprintName = task.sprintId
          ? `Sprint ${task.sprintId}`
          : "Unknown";

        grouped[sprintName] = (grouped[sprintName] || 0) + 1;
      });

    return Object.entries(grouped).map(([sprint, completed]) => ({
      sprint,
      completed,
    }));
  }, [tasks]);

  if (isLoading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <p className="text-slate-500">Loading analytics...</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="rounded-xl bg-red-50 p-6 text-red-600">
        {error instanceof Error ? error.message : "Failed to load analytics"}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}

      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
          Analytics
        </h1>

        <p className="mt-1 text-sm text-slate-500">
          Insights from your SprintDesk task data.
        </p>
      </div>

      {/* Sprint Velocity */}

      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <h2 className="mb-5 text-lg font-semibold text-slate-900 dark:text-white">
          Sprint Velocity
        </h2>

        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={sprintVelocity}>
              <CartesianGrid strokeDasharray="3 3" />

              <XAxis dataKey="sprint" />

              <YAxis allowDecimals={false} />

              <Tooltip />

              <Bar
                dataKey="completed"
                name="Completed Tasks"
                fill="#2563eb"
                animationDuration={800}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Status + Completion */}

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Task Status */}

        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <h2 className="mb-5 text-lg font-semibold text-slate-900 dark:text-white">
            Task Status
          </h2>

          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={statusData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  label
                  animationDuration={800}
                >
                  {statusData.map((entry, index) => (
                    <Cell
                      key={`${entry.name}-${index}`}
                      fill={["#64748b", "#2563eb", "#eab308", "#16a34a"][index]}
                    />
                  ))}
                </Pie>

                <Tooltip />

                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Completion Trend */}

        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <h2 className="mb-5 text-lg font-semibold text-slate-900 dark:text-white">
            Completion Trend
          </h2>

          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={completionData}>
                <CartesianGrid strokeDasharray="3 3" />

                <XAxis dataKey="date" />

                <YAxis allowDecimals={false} />

                <Tooltip />

                <Line
                  type="monotone"
                  dataKey="completed"
                  name="Completed Tasks"
                  stroke="#16a34a"
                  strokeWidth={2}
                  animationDuration={800}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Priority Breakdown */}

      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <h2 className="mb-5 text-lg font-semibold text-slate-900 dark:text-white">
          Priority Breakdown
        </h2>

        <div className="h-[350px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={priorityData}>
              <CartesianGrid strokeDasharray="3 3" />

              <XAxis dataKey="priority" />

              <YAxis allowDecimals={false} />

              <Tooltip />

              <Legend />

              <Bar
                dataKey="backlog"
                name="Backlog"
                fill="#64748b"
                animationDuration={800}
              />

              <Bar
                dataKey="inProgress"
                name="In Progress"
                fill="#2563eb"
                animationDuration={800}
              />

              <Bar
                dataKey="review"
                name="Review"
                fill="#eab308"
                animationDuration={800}
              />

              <Bar
                dataKey="done"
                name="Done"
                fill="#16a34a"
                animationDuration={800}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
