"use client";

import React from "react";
import { AlertTriangle, X } from "lucide-react";
import { Button } from "./button";
import { cn } from "@/lib/utils";

interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  variant?: "danger" | "warning" | "info";
  isLoading?: boolean;
}

export function ConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = "Confirm",
  cancelText = "Cancel",
  variant = "danger",
  isLoading = false,
}: ConfirmModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="bg-white rounded-[2rem] shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200 border border-gray-100"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-8">
          <div className="flex items-center justify-between mb-6">
            <div className={cn(
              "w-14 h-14 rounded-2xl flex items-center justify-center shadow-sm",
              variant === "danger" ? "bg-red-50 text-red-500" : 
              variant === "warning" ? "bg-amber-50 text-amber-500" : 
              "bg-blue-50 text-blue-500"
            )}>
              <AlertTriangle size={28} />
            </div>
            <button 
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors p-2 hover:bg-gray-50 rounded-full"
            >
              <X size={20} />
            </button>
          </div>
          
          <h3 className="text-2xl font-bold text-gray-900 mb-3 tracking-tight">{title}</h3>
          <p className="text-gray-500 leading-relaxed text-balance">{message}</p>
        </div>
        
        <div className="p-6 bg-gray-50/50 flex items-center gap-3 border-t border-gray-50">
          <Button
            variant="ghost"
            onClick={onClose}
            className="flex-1 rounded-2xl h-12 font-bold text-gray-600 hover:bg-white hover:shadow-sm transition-all"
            disabled={isLoading}
          >
            {cancelText}
          </Button>
          <Button
            onClick={onConfirm}
            className={cn(
              "flex-1 rounded-2xl h-12 font-bold text-white shadow-lg transition-all",
              variant === "danger" ? "bg-red-500 hover:bg-red-600 shadow-red-100" : 
              variant === "warning" ? "bg-amber-500 hover:bg-amber-600 shadow-amber-100" : 
              "bg-blue-500 hover:bg-blue-600 shadow-blue-100"
            )}
            disabled={isLoading}
          >
            {isLoading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : confirmText}
          </Button>
        </div>
      </div>
    </div>
  );
}
