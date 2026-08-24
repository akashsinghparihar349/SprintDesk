import type { ToastType } from "../../hooks/useToast";

interface ToastItem {
  id: number;
  message: string;
  type: ToastType;
}

interface ToastProps {
  toasts: ToastItem[];
  onRemove: (id: number) => void;
}

export default function Toast({ toasts, onRemove }: ToastProps) {
  if (toasts.length === 0) return null;

  return (
    <div
      className="fixed right-4 top-4 z-[100] flex w-[calc(100%-2rem)] max-w-sm flex-col gap-3"
      aria-live="polite"
      aria-atomic="true"
    >
      {toasts.map((toast) => {
        const styles = {
          success: "border-green-200 bg-green-50 text-green-700",
          error: "border-red-200 bg-red-50 text-red-700",
          info: "border-blue-200 bg-blue-50 text-blue-700",
        };

        return (
          <div
            key={toast.id}
            className={`flex items-center justify-between gap-3 rounded-xl border px-4 py-3 text-sm shadow-lg ${styles[toast.type]}`}
          >
            <p>{toast.message}</p>

            <button
              type="button"
              onClick={() => onRemove(toast.id)}
              aria-label="Close notification"
              className="shrink-0 rounded px-2 py-1 font-bold hover:bg-black/5"
            >
              ×
            </button>
          </div>
        );
      })}
    </div>
  );
}
