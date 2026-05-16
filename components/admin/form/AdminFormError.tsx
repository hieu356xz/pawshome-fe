"use client";

import React from "react";
import { AlertCircle, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface AdminFormErrorProps {
  message?: string | null;
  onClear?: () => void;
  className?: string;
}

export function AdminFormError({ message, onClear, className }: AdminFormErrorProps) {
  if (!message) return null;

  return (
    <div 
      className={cn(
        "flex items-center gap-3 p-4 mb-6 rounded-2xl bg-rose-50 border border-rose-100 text-rose-600 animate-in fade-in slide-in-from-top-2 duration-300",
        className
      )}
    >
      <AlertCircle size={20} className="shrink-0" />
      <div className="flex-1 text-sm font-medium">
        {typeof message === 'string' ? message : "An unexpected error occurred. Please try again."}
      </div>
      {onClear && (
        <button 
          onClick={onClear}
          className="p-1 hover:bg-rose-100 rounded-lg transition-colors"
          type="button"
        >
          <X size={16} />
        </button>
      )}
    </div>
  );
}
