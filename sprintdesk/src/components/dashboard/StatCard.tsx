interface StatCardProps {
  title: string;
  value: number;
  description?: string;
}

export default function StatCard({ title, value, description }: StatCardProps) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <p className="text-sm font-medium text-slate-500">{title}</p>

      <h2 className="mt-2 text-3xl font-bold text-slate-900 dark:text-white">
        {value}
      </h2>

      {description && (
        <p className="mt-1 text-xs text-slate-400">{description}</p>
      )}
    </div>
  );
}
