"use client";

import React from "react";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";

interface AdminFormSwitchProps {
  label: string;
  id: string;
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  description?: string;
  icon?: React.ReactNode;
  containerClassName?: string;
}

export function AdminFormSwitch({
  label,
  id,
  checked,
  onCheckedChange,
  description,
  icon,
  containerClassName,
}: AdminFormSwitchProps) {
  return (
    <div className={cn("flex items-center justify-between p-4 rounded-2xl bg-gray-50 border border-transparent transition-all hover:bg-gray-100/50", containerClassName)}>
      <div className="flex items-center gap-3">
        {icon && <div className="text-gray-400 group-focus-within:text-orange-500 transition-colors">{icon}</div>}
        <div className="space-y-0.5">
          <Label htmlFor={id} className="text-sm font-bold text-gray-700 cursor-pointer">
            {label}
          </Label>
          {description && (
            <p className="text-xs text-gray-500 font-medium">
              {description}
            </p>
          )}
        </div>
      </div>
      <Switch
        id={id}
        checked={checked}
        onCheckedChange={onCheckedChange}
        className="data-[state=checked]:bg-orange-500"
      />
    </div>
  );
}
