"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { Label } from "@/components/ui/label";

interface StatusOption {
  value: string;
  label: string;
}

interface AdminStatusSelectionProps {
  label: string;
  options: StatusOption[];
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

export function AdminStatusSelection({ 
  label, 
  options, 
  value, 
  onChange,
  className 
}: AdminStatusSelectionProps) {
  return (
    <div className={cn("space-y-4", className)}>
      <Label className="text-sm font-bold text-gray-700 block mb-2">{label}</Label>
      <div className="space-y-3">
        {options.map((option) => (
          <div 
            key={option.value}
            onClick={() => onChange(option.value)}
            className={cn(
              "p-3 rounded-xl border-2 transition-all cursor-pointer flex items-center justify-between group",
              value === option.value
                ? "border-orange-500 bg-orange-50 text-orange-700"
                : "border-gray-50 bg-gray-50 text-gray-500 hover:border-gray-200"
            )}
          >
            <span className="text-sm font-bold capitalize">{option.label}</span>
            <div className={cn(
              "w-4 h-4 rounded-full border-2 transition-all duration-300",
              value === option.value 
                ? "bg-orange-500 border-orange-500 scale-110 shadow-lg shadow-orange-100" 
                : "bg-white border-gray-300 group-hover:border-orange-200"
            )} />
          </div>
        ))}
      </div>
    </div>
  );
}
