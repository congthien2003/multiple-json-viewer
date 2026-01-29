import { useState, useCallback } from "react";

interface Toast {
  id: string;
  description: string;
  duration?: number;
}

interface ToastOptions {
  description: string;
  duration?: number;
}

export function useToast() {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const toast = useCallback(
    ({ description, duration = 3000 }: ToastOptions) => {
      const id = Math.random().toString(36).substr(2, 9);
      const newToast: Toast = { id, description, duration };

      setToasts((prev) => [...prev, newToast]);

      // Auto dismiss after duration
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
      }, duration);

      return id;
    },
    [],
  );

  const dismiss = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return {
    toast,
    dismiss,
    toasts,
  };
}
