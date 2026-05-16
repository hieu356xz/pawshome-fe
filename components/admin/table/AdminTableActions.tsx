"use client";

import React from "react";
import { MoreHorizontal, Eye, Edit2, Trash2 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Link } from "@/lib/navigation";
import { cn } from "@/lib/utils";

export interface ActionItem {
  label: string;
  icon?: React.ReactNode;
  onClick?: () => void;
  href?: string;
  variant?: "default" | "danger";
  disabled?: boolean;
}

interface AdminTableActionsProps {
  actions: ActionItem[];
  className?: string;
}

export function AdminTableActions({
  actions,
  className,
}: AdminTableActionsProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        className={cn(
          "p-2 hover:bg-gray-100 rounded-xl transition-all text-gray-400 hover:text-gray-900 outline-none border-none cursor-pointer flex items-center justify-center",
          className,
        )}>
        <MoreHorizontal size={20} />
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="w-48 rounded-2xl p-2 shadow-xl border-gray-100 bg-white z-50">
        {actions.map((action, index) => {
          const content = (
            <>
              {action.icon}
              {action.label}
            </>
          );

          if (action.href) {
            return (
              <DropdownMenuItem
                key={index}
                disabled={action.disabled}
                className="p-0 cursor-pointer">
                <Link
                  href={action.href}
                  className={cn(
                    "rounded-xl cursor-pointer flex items-center gap-2 py-2.5 px-3 focus:bg-orange-50 focus:text-orange-600 transition-colors w-full",
                    action.variant === "danger" &&
                      "text-red-500 focus:bg-red-50 focus:text-red-600",
                    action.disabled && "opacity-50 cursor-not-allowed pointer-events-none",
                  )}>
                  {content}
                </Link>
              </DropdownMenuItem>
            );
          }

          return (
            <DropdownMenuItem
              key={index}
              onClick={action.onClick}
              disabled={action.disabled}
              className={cn(
                "rounded-xl cursor-pointer flex items-center gap-2 py-2.5 px-3 focus:bg-orange-50 focus:text-orange-600 transition-colors",
                action.variant === "danger" &&
                  "text-red-500 focus:bg-red-50 focus:text-red-600",
                action.disabled && "opacity-50 cursor-not-allowed pointer-events-none",
              )}>
              {content}
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

/**
 * Standard Action Icons for convenience
 */
export const TableActionIcons = {
  View: <Eye size={16} />,
  Edit: <Edit2 size={16} />,
  Delete: <Trash2 size={16} />,
};
