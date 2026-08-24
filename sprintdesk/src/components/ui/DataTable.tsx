import type { ReactNode } from "react";

interface Column<T> {
  key: string;
  title: string;
  render?: (row: T) => ReactNode;
}

interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  emptyMessage?: string;
}

export default function DataTable<T extends { id: string | number }>({
  data,
  columns,
  emptyMessage = "No data available.",
}: DataTableProps<T>) {
  if (data.length === 0) {
    return (
      <div className="rounded-xl border border-slate-200 p-8 text-center text-sm text-slate-500 dark:border-slate-800">
        {emptyMessage}
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800">
      <table className="w-full text-left text-sm">
        <thead className="bg-slate-50 dark:bg-slate-800">
          <tr>
            {columns.map((column) => (
              <th
                key={column.key}
                className="px-4 py-3 font-semibold text-slate-700 dark:text-slate-300"
              >
                {column.title}
              </th>
            ))}
          </tr>
        </thead>

        <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
          {data.map((row) => (
            <tr
              key={row.id}
              className="hover:bg-slate-50 dark:hover:bg-slate-800/50"
            >
              {columns.map((column) => (
                <td
                  key={column.key}
                  className="px-4 py-3 text-slate-600 dark:text-slate-300"
                >
                  {column.render
                    ? column.render(row)
                    : String(
                        (row as Record<string, unknown>)[column.key] ?? "",
                      )}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
