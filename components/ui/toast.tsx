"use client";

import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  ReactNode,
  useEffect,
} from "react";
import { AlertCircle, CheckCircle, Info, X, XCircle } from "lucide-react";
import { cn } from "@/lib/utils";

type ToastType = "success" | "error" | "info" | "warning";

interface Toast {
  id: string;
  title?: string;
  message: string;
  type: ToastType;
}

interface ToastContextType {
  toast: (props: { title?: string; message: string; type?: ToastType }) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

// Singleton for calling outside React
let toastNotify: (props: {
  title?: string;
  message: string;
  type?: ToastType;
}) => void = () => {
  console.warn("ToastProvider not initialized");
};

export const toast = {
  success: (message: string, title?: string) =>
    toastNotify({ type: "success", message, title }),
  error: (message: string, title?: string) =>
    toastNotify({ type: "error", message, title }),
  info: (message: string, title?: string) =>
    toastNotify({ type: "info", message, title }),
  warning: (message: string, title?: string) =>
    toastNotify({ type: "warning", message, title }),
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
};

export const ToastProvider = ({ children }: { children: ReactNode }) => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = useCallback(
    ({
      title,
      message,
      type = "info",
    }: {
      title?: string;
      message: string;
      type?: ToastType;
    }) => {
      const id = Math.random().toString(36).substring(2, 9);
      setToasts((prev) => [...prev, { id, title, message, type }]);

      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
      }, 5000);
    },
    [],
  );

  // Initialize singleton
  useEffect(() => {
    toastNotify = showToast;
  }, [showToast]);

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <ToastContext.Provider value={{ toast: showToast }}>
      {children}
      <div className="fixed bottom-4 right-4 z-[100] flex flex-col gap-3 pointer-events-none">
        {toasts.map((t) => (
          <ToastItem key={t.id} toast={t} onClose={() => removeToast(t.id)} />
        ))}
      </div>
    </ToastContext.Provider>
  );
};

const ToastItem = ({
  toast,
  onClose,
}: {
  toast: Toast;
  onClose: () => void;
}) => {
  const [isExiting, setIsExiting] = useState(false);

  const handleClose = useCallback(() => {
    setIsExiting(true);
    setTimeout(onClose, 300);
  }, [onClose]);

  useEffect(() => {
    const timer = setTimeout(() => {
      // Logic for auto close is handled in showToast,
      // but we could trigger exit animation here if needed.
    }, 4700);
    return () => clearTimeout(timer);
  }, []);

  const icons = {
    success: <CheckCircle className="text-emerald-500" size={20} />,
    error: <XCircle className="text-rose-500" size={20} />,
    info: <Info className="text-blue-500" size={20} />,
    warning: <AlertCircle className="text-amber-500" size={20} />,
  };

  const bgColors = {
    success: "bg-emerald-50 border-emerald-100",
    error: "bg-rose-50 border-rose-100",
    info: "bg-blue-50 border-blue-100",
    warning: "bg-amber-50 border-amber-100",
  };

  return (
    <div
      className={cn(
        "pointer-events-auto flex items-start gap-4 p-4 rounded-2xl border shadow-lg min-w-[320px] max-w-md transition-all duration-300",
        isExiting
          ? "animate-out fade-out slide-out-to-right-full"
          : "animate-in slide-in-from-right-full",
        bgColors[toast.type],
      )}>
      <div className="mt-0.5">{icons[toast.type]}</div>
      <div className="flex-1 space-y-1">
        {toast.title && (
          <h4 className="text-sm font-bold text-gray-900">{toast.title}</h4>
        )}
        <p className="text-sm text-gray-600 leading-relaxed">{toast.message}</p>
      </div>
      <button
        onClick={handleClose}
        className="text-gray-400 hover:text-gray-600 transition-colors">
        <X size={16} />
      </button>
    </div>
  );
};
