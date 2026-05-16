"use client";

import React from "react";
import { Check, Loader2, Key } from "lucide-react";
import { cn } from "@/lib/utils";
import { Permission } from "@/types/auth";

interface AdminPermissionSelectionProps {
  label: string;
  permissions: Permission[];
  selectedIds: string[];
  onToggle: (permissionId: string) => void;
  isLoading?: boolean;
  loadingLabel?: string;
  className?: string;
}

export function AdminPermissionSelection({ 
  label, 
  permissions, 
  selectedIds, 
  onToggle, 
  isLoading,
  loadingLabel = "Loading permissions...",
  className 
}: AdminPermissionSelectionProps) {
  // Group permissions by resource (prefix of the key)
  const groupedPermissions = permissions.reduce((acc, permission) => {
    const resource = permission.key.split(":")[0] || "Other";
    if (!acc[resource]) {
      acc[resource] = [];
    }
    acc[resource].push(permission);
    return acc;
  }, {} as Record<string, Permission[]>);

  return (
    <div className={cn("space-y-8", className)}>
      <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
        <Key size={20} className="text-orange-500" />
        {label}
      </h3>
      
      {isLoading ? (
        <div className="flex items-center gap-2 text-gray-400">
          <Loader2 size={16} className="animate-spin" />
          {loadingLabel}
        </div>
      ) : (
        <div className="space-y-10">
          {Object.keys(groupedPermissions).length > 0 ? (
            Object.entries(groupedPermissions).map(([resource, resourcePermissions]) => {
              const allSelected = resourcePermissions.every(p => selectedIds.includes(p.id));
              
              const handleToggleGroup = () => {
                if (allSelected) {
                  // Remove all in this group
                  const idsToRemove = resourcePermissions.map(p => p.id);
                  idsToRemove.forEach(id => {
                    if (selectedIds.includes(id)) onToggle(id);
                  });
                } else {
                  // Add all missing in this group
                  resourcePermissions.forEach(p => {
                    if (!selectedIds.includes(p.id)) onToggle(p.id);
                  });
                }
              };

              return (
                <div key={resource} className="space-y-4">
                  <div className="flex items-center justify-between border-l-2 border-orange-200 pl-4 py-1">
                    <h4 className="text-sm font-bold text-gray-400 uppercase tracking-widest">
                      {resource}
                    </h4>
                    <button 
                      type="button"
                      onClick={handleToggleGroup}
                      className={cn(
                        "text-[10px] font-bold uppercase tracking-tighter px-3 py-1 rounded-lg transition-all",
                        allSelected 
                          ? "bg-gray-100 text-gray-400 hover:bg-gray-200" 
                          : "bg-orange-50 text-orange-500 hover:bg-orange-100"
                      )}
                    >
                      {allSelected ? "Deselect Group" : "Select Group"}
                    </button>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
                    {resourcePermissions.map(permission => (
                      <div 
                        key={permission.id} 
                        onClick={() => onToggle(permission.id)}
                        className={cn(
                          "p-4 rounded-2xl border-2 transition-all cursor-pointer flex items-center justify-between group h-full",
                          selectedIds.includes(permission.id)
                            ? "border-orange-500 bg-orange-50/50 shadow-sm"
                            : "border-gray-50 bg-gray-50 hover:border-gray-200 hover:bg-white"
                        )}
                      >
                        <div className="flex flex-col flex-1 min-w-0 mr-2">
                          <span className={cn(
                            "text-sm font-bold tracking-tight truncate",
                            selectedIds.includes(permission.id) ? "text-orange-700" : "text-gray-700"
                          )}>
                            {permission.key}
                          </span>
                          {permission.description && (
                            <span className="text-[10px] text-gray-400 mt-0.5 line-clamp-2 leading-tight h-5">
                              {permission.description}
                            </span>
                          )}
                        </div>
                        <div className={cn(
                          "w-5 h-5 rounded-lg border-2 flex-shrink-0 flex items-center justify-center transition-all duration-300",
                          selectedIds.includes(permission.id) 
                            ? "bg-orange-500 border-orange-500 scale-110 shadow-lg shadow-orange-200" 
                            : "bg-white border-gray-200 group-hover:border-orange-200"
                        )}>
                          {selectedIds.includes(permission.id) && <Check size={12} className="text-white stroke-[3]" />}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })
          ) : (
            <div className="py-10 text-center bg-gray-50 rounded-3xl border-2 border-dashed border-gray-100">
              <p className="text-gray-400">No permissions found or available to assign.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
