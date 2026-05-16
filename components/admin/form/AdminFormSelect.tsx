"use client";

import React from "react";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { ChevronDown } from "lucide-react";

interface AdminFormSelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  icon?: React.ReactNode;
  error?: string;
  options: { label: string; value: string | number }[];
  containerClassName?: string;
}

export function AdminFormSelect({ 
  label, 
  icon, 
  error, 
  id, 
  className, 
  options,
  containerClassName,
  ...props 
}: AdminFormSelectProps) {
  return (
    <div className={cn("space-y-2", containerClassName)}>
      <Label htmlFor={id} className="text-sm font-bold text-gray-700">
        {label}
      </Label>
      <div className="relative group">
        {icon && (
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none transition-colors group-focus-within:text-orange-500">
            {icon}
          </div>
        )}
        <select 
          id={id} 
          className={cn(
            "w-full h-12 rounded-2xl bg-gray-50 border-none focus-visible:ring-2 focus-visible:ring-orange-200 transition-all appearance-none cursor-pointer text-sm",
            icon ? "pl-12" : "pl-4",
            "pr-10",
            error && "ring-2 ring-red-100 bg-red-50/30",
            className
          )}
          {...props}
        >
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        <div className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none transition-colors group-focus-within:text-orange-500">
          <ChevronDown size={18} />
        </div>
      </div>
      {error && <p className="text-xs text-red-500 font-medium ml-1 animate-in fade-in slide-in-from-top-1">{error}</p>}
    </div>
  );
}
