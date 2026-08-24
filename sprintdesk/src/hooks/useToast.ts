import { useCallback, useState } from "react";

export type ToastType = "success" | "error" | "info";

interface Toast {
  id: number;
  message: string;
  type: ToastType;
}

export function useToast() {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = useCallback(
    (message: string, type: ToastType = "info") => {
      const id = Date.now();

      setToasts((current) => [
        ...current,
        {
          id,
          message,
          type,
        },
      ]);

      setTimeout(() => {
        setToasts((current) =>
          current.filter((toast) => toast.id !== id),
        );
      }, 3000);
    },
    [],
  );

  const removeToast = useCallback((id: number) => {
    setToasts((current) =>
      current.filter((toast) => toast.id !== id),
    );
  }, []);

  return {
    toasts,
    showToast,
    removeToast,
  };
}