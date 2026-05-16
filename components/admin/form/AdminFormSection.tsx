"use client";

import React from "react";
import { cn } from "@/lib/utils";

interface AdminFormSectionProps {
  title: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  description?: string;
}

export function AdminFormSection({ 
  title, 
  icon, 
  children, 
  className,
  description 
}: AdminFormSectionProps) {
  return (
    <div className={cn("bg-white rounded-3xl border border-gray-100 p-8 shadow-sm space-y-6", className)}>
      <div className="flex flex-col gap-1">
        <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
          {icon && <span className="text-orange-500">{icon}</span>}
          {title}
        </h3>
        {description && <p className="text-sm text-gray-400">{description}</p>}
      </div>
      <div className="space-y-6">
        {children}
      </div>
    </div>
  );
}
