"use client";

import React from "react";
import { Mail, Shield, Calendar } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Avatar & User Info Cell
 */
export interface UserInfoCellProps {
  name: string;
  email: string;
  avatarUrl?: string;
  className?: string;
}

export function UserInfoCell({ name, email, avatarUrl, className }: UserInfoCellProps) {
  return (
    <div className={cn("flex items-center gap-3", className)}>
      <div className="w-12 h-12 rounded-2xl overflow-hidden bg-orange-100 flex items-center justify-center text-orange-600 font-bold border-2 border-white shadow-sm group-hover:scale-105 transition-transform duration-300">
        {avatarUrl ? (
          <img src={avatarUrl} alt={name} className="w-full h-full object-cover" />
        ) : (
          name?.charAt(0) || "U"
        )}
      </div>
      <div>
        <p className="text-sm font-bold text-gray-900">{name || "Unnamed"}</p>
        <p className="text-xs text-gray-500 flex items-center gap-1 mt-0.5">
          <Mail size={12} />
          {email}
        </p>
      </div>
    </div>
  );
}

import { Badge } from "@/components/ui/badge";

/**
 * Status Badge Cell
 */
export interface StatusCellProps {
  status: string;
  variant?: "success" | "warning" | "error" | "info" | "default";
  className?: string;
}

export function StatusCell({ status, variant = "default", className }: StatusCellProps) {
  const badgeVariant = variant === "error" ? "destructive" : variant;

  return (
    <Badge variant={badgeVariant as any} className={cn("uppercase tracking-wider px-2", className)}>
      {status}
    </Badge>
  );
}

/**
 * Tags/Badges Group Cell
 */
export interface BadgeGroupCellProps {
  items: { id: string | number; label: string }[];
  icon?: React.ReactNode;
  variant?: "blue" | "orange" | "purple" | "gray" | "info";
  className?: string;
  maxVisible?: number;
}

export function BadgeGroupCell({ 
  items, 
  icon, 
  variant = "blue", 
  className,
  maxVisible = 5
}: BadgeGroupCellProps) {
  const getBadgeVariant = (): any => {
    switch (variant) {
      case "orange": return "orange";
      case "gray": return "secondary";
      case "blue": return "info";
      default: return "info";
    }
  };

  if (!items || items.length === 0) {
    return <span className="text-gray-400 text-xs italic">None</span>;
  }

  const visibleItems = items.slice(0, maxVisible);
  const remainingCount = items.length - maxVisible;

  return (
    <div className={cn("flex flex-wrap gap-1 items-center", className)}>
      {visibleItems.map((item) => (
        <Badge key={item.id} variant={getBadgeVariant()} className="gap-1 px-2 py-0.5 uppercase tracking-wider">
          {icon}
          {item.label}
        </Badge>
      ))}
      {remainingCount > 0 && (
        <Badge variant="outline" className="text-[10px] text-gray-400 border-gray-100 bg-gray-50 h-5 px-1.5 hover:bg-gray-100">
          +{remainingCount} more
        </Badge>
      )}
    </div>
  );
}

/**
 * Date Cell
 */
export interface DateCellProps {
  date: string | Date;
  className?: string;
}

export function DateCell({ date, className }: DateCellProps) {
  const formattedDate = typeof date === 'string' ? date : date.toLocaleDateString();
  return (
    <p className={cn("text-sm text-gray-600 flex items-center gap-1.5", className)}>
      <Calendar size={14} className="text-gray-400" />
      {formattedDate}
    </p>
  );
}
