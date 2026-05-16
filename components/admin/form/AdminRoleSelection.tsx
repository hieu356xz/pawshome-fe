"use client";

import React from "react";
import { Check, Loader2, Shield } from "lucide-react";
import { cn } from "@/lib/utils";

interface Role {
  id: string;
  name: string;
  description?: string;
}

interface AdminRoleSelectionProps {
  label: string;
  roles: Role[];
  selectedIds: string[];
  onToggle: (roleId: string) => void;
  isLoading?: boolean;
  loadingLabel?: string;
  className?: string;
  action?: React.ReactNode;
}

export function AdminRoleSelection({ 
  label, 
  roles, 
  selectedIds, 
  onToggle, 
  isLoading,
  loadingLabel = "Loading roles...",
  className,
  action
}: AdminRoleSelectionProps) {
  return (
    <div className={cn("space-y-6", className)}>
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
          <Shield size={20} className="text-orange-500" />
          {label}
        </h3>
        {action}
      </div>
      
      {isLoading ? (
        <div className="flex items-center gap-2 text-gray-400">
          <Loader2 size={16} className="animate-spin" />
          {loadingLabel}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-4">
          {roles.map(role => (
            <div 
              key={role.id} 
              onClick={() => onToggle(role.id)}
              className={cn(
                "p-4 rounded-2xl border-2 transition-all cursor-pointer flex items-center justify-between group",
                selectedIds.includes(role.id)
                  ? "border-orange-500 bg-orange-50/50 shadow-sm"
                  : "border-gray-50 bg-gray-50 hover:border-gray-200 hover:bg-white"
              )}
            >
              <div className="flex flex-col">
                <span className={cn(
                  "text-sm font-bold uppercase tracking-wider",
                  selectedIds.includes(role.id) ? "text-orange-700" : "text-gray-700"
                )}>
                  {role.name}
                </span>
                {role.description && (
                  <span className="text-[10px] text-gray-400 mt-0.5 line-clamp-1">{role.description}</span>
                )}
              </div>
              <div className={cn(
                "w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all duration-300",
                selectedIds.includes(role.id) 
                  ? "bg-orange-500 border-orange-500 scale-110 shadow-lg shadow-orange-200" 
                  : "bg-white border-gray-200 group-hover:border-orange-200"
              )}>
                {selectedIds.includes(role.id) && <Check size={14} className="text-white stroke-[3]" />}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
