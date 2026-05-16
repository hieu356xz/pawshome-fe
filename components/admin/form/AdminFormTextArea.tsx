"use client";

import React from "react";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

interface AdminFormTextAreaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
  icon?: React.ReactNode;
  error?: string;
  containerClassName?: string;
}

export function AdminFormTextArea({ 
  label, 
  icon, 
  error, 
  id, 
  className, 
  containerClassName,
  ...props 
}: AdminFormTextAreaProps) {
  return (
    <div className={cn("space-y-2", containerClassName)}>
      <Label htmlFor={id} className="text-sm font-bold text-gray-700">
        {label}
      </Label>
      <div className="relative group">
        {icon && (
          <div className="absolute left-4 top-4 text-gray-400 pointer-events-none transition-colors group-focus-within:text-orange-500">
            {icon}
          </div>
        )}
        <textarea 
          id={id} 
          className={cn(
            "w-full min-h-[120px] rounded-2xl bg-gray-50 border-none focus-visible:ring-2 focus-visible:ring-orange-200 transition-all p-4 resize-none text-sm",
            icon && "pl-12",
            error && "ring-2 ring-red-100 bg-red-50/30",
            className
          )}
          {...props}
        />
      </div>
      {error && <p className="text-xs text-red-500 font-medium ml-1 animate-in fade-in slide-in-from-top-1">{error}</p>}
    </div>
  );
}
