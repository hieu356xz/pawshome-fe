"use client";

import React, { useEffect, useState } from "react";
import { Filter, X, ChevronDown, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useTranslations } from "next-intl";

export interface FilterOption {
  label: string;
  value: string;
}

export interface FilterGroup {
  id: string;
  label: string;
  options: FilterOption[];
  activeValue: string | null;
  onSelect: (value: string | null) => void;
  allLabel?: string;
}

interface AdminTableFiltersProps {
  groups: FilterGroup[];
  onClearAll?: () => void;
  className?: string;
}

export function AdminTableFilters({
  groups,
  onClearAll,
  className,
}: AdminTableFiltersProps) {
  const t = useTranslations("AdminCommon");
  const [isOpen, setIsOpen] = useState(false);
  // Store pending selections locally
  const [pendingFilters, setPendingFilters] = useState<
    Record<string, string | null>
  >(Object.fromEntries(groups.map((g) => [g.id, g.activeValue])));

  const hasActiveFilters = groups.some((group) => group.activeValue !== null);

  // Sync with prop changes if needed (e.g. when cleared from outside)
  useEffect(() => {
    setPendingFilters(
      Object.fromEntries(groups.map((g) => [g.id, g.activeValue])),
    );
  }, [groups]);

  const handleApply = () => {
    groups.forEach((group) => {
      group.onSelect(pendingFilters[group.id]);
    });
    setIsOpen(false);
  };

  const handleReset = () => {
    const cleared = Object.fromEntries(groups.map((g) => [g.id, null]));
    setPendingFilters(cleared);
    if (onClearAll) onClearAll();
  };

  return (
    <div className={cn("w-full space-y-4 relative", className)}>
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            onClick={() => setIsOpen(!isOpen)}
            className={cn(
              "rounded-xl border border-gray-200 text-gray-600 gap-2 h-12 px-6 flex items-center justify-center hover:bg-gray-50 transition-all cursor-pointer outline-none font-medium",
              isOpen && "bg-gray-100 border-gray-300",
              hasActiveFilters &&
                "border-orange-500 text-orange-600 bg-orange-50 shadow-sm shadow-orange-100",
            )}>
            <Filter size={18} />
            <span>{hasActiveFilters ? "Filters Active" : "Filters"}</span>
            <ChevronDown
              size={16}
              className={cn(
                "transition-transform duration-300",
                isOpen && "rotate-180",
              )}
            />
          </Button>

          {hasActiveFilters && (
            <div className="flex items-center gap-2 animate-in fade-in slide-in-from-left-2">
              {groups.map(
                (group) =>
                  group.activeValue && (
                    <div
                      key={group.id}
                      className="flex items-center gap-1.5 px-3 py-2 bg-orange-50 text-orange-600 rounded-xl border border-orange-100 text-xs font-bold">
                      <span className="opacity-60 font-medium">
                        {group.label}:
                      </span>
                      {group.options.find((o) => o.value === group.activeValue)
                        ?.label || group.activeValue}
                      <button
                        onClick={() => group.onSelect(null)}
                        className="hover:text-orange-800 transition-colors ml-1 p-0.5 hover:bg-orange-100 rounded-full">
                        <X size={12} />
                      </button>
                    </div>
                  ),
              )}

              <button
                onClick={handleReset}
                className="text-xs font-bold text-gray-400 hover:text-red-500 flex items-center gap-1 ml-2 transition-colors">
                <RotateCcw size={12} />
                {t("resetAll")}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Collapsible Filter Panel */}
      {isOpen && (
        <div className="absolute left-0 right-0 top-full mt-2 bg-white rounded-3xl border border-gray-100 p-8 animate-in slide-in-from-top-4 duration-300 shadow-2xl z-50">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-10">
            {groups.map((group) => (
              <div key={group.id} className="space-y-5">
                <h4 className="text-[10px] font-extrabold text-gray-400 uppercase tracking-[0.2em]">
                  {group.label}
                </h4>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() =>
                      setPendingFilters((prev) => ({
                        ...prev,
                        [group.id]: null,
                      }))
                    }
                    className={cn(
                      "px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-200 border text-center",
                      pendingFilters[group.id] === null
                        ? "bg-orange-500 border-orange-500 text-white shadow-md shadow-orange-100"
                        : "bg-gray-50 border-transparent text-gray-500 hover:bg-gray-100 hover:text-gray-900",
                    )}>
                    {group.allLabel || t("all")}
                  </button>
                  {group.options.map((option) => (
                    <button
                      key={option.value}
                      onClick={() =>
                        setPendingFilters((prev) => ({
                          ...prev,
                          [group.id]: option.value,
                        }))
                      }
                      className={cn(
                        "px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-200 border text-center",
                        pendingFilters[group.id] === option.value
                          ? "bg-orange-500 border-orange-500 text-white shadow-md shadow-orange-100"
                          : "bg-gray-50 border-transparent text-gray-500 hover:bg-gray-100 hover:text-gray-900",
                      )}>
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-10 pt-6 border-t border-gray-50 flex justify-end items-center gap-4">
            <button
              onClick={handleReset}
              className="text-xs font-bold text-gray-400 hover:text-red-500 flex items-center gap-2 px-4 py-2 transition-all">
              <RotateCcw size={14} />
              {t("resetAll")}
            </button>
            <Button
              onClick={handleApply}
              className="bg-gray-900 hover:bg-gray-800 text-white font-bold text-xs uppercase tracking-widest rounded-xl px-8 h-12 shadow-lg">
              {t("applyFilters")}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
