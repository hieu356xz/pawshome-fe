"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 
    | "default" 
    | "secondary" 
    | "destructive" 
    | "outline" 
    | "success" 
    | "warning" 
    | "info"
    | "orange";
}

function Badge({ className, variant = "default", ...props }: BadgeProps) {
  const variants = {
    default: "bg-gray-900 text-white border-transparent shadow-sm",
    secondary: "bg-gray-100 text-gray-900 border-transparent",
    destructive: "bg-red-50 text-red-600 border-red-100",
    outline: "bg-transparent text-gray-900 border-gray-200",
    success: "bg-emerald-50 text-emerald-600 border-emerald-100",
    warning: "bg-amber-50 text-amber-600 border-amber-100",
    info: "bg-blue-50 text-blue-600 border-blue-100",
    orange: "bg-orange-50 text-orange-600 border-orange-100",
  };

  return (
    <div
      className={cn(
        "inline-flex items-center rounded-lg border px-2.5 py-0.5 text-xs font-bold tracking-tight transition-colors focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2",
        variants[variant],
        className
      )}
      {...props}
    />
  );
}

export { Badge };
