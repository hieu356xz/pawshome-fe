"use client";

import React from "react";
import { ArrowLeft, Save, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "@/lib/navigation";
import { cn } from "@/lib/utils";

interface AdminFormHeaderProps {
  title: string;
  backUrl: string;
  backLabel: string;
  submitLabel: string;
  isLoading?: boolean;
  onBack?: () => void;
  className?: string;
}

export function AdminFormHeader({ 
  title, 
  backUrl, 
  backLabel, 
  submitLabel, 
  isLoading,
  className 
}: AdminFormHeaderProps) {
  return (
    <div className={cn("flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8", className)}>
      <div>
        <Link href={backUrl} className="flex items-center gap-2 text-sm font-bold text-gray-400 hover:text-gray-900 transition-colors uppercase tracking-widest mb-2">
          <ArrowLeft size={16} />
          {backLabel}
        </Link>
        <h1 className="text-3xl font-playfair font-bold text-gray-900">{title}</h1>
      </div>
      <Button 
        type="submit" 
        disabled={isLoading}
        className="rounded-xl bg-orange-500 hover:bg-orange-600 text-white gap-2 px-8 h-12 shadow-lg shadow-orange-200 transition-all font-bold uppercase tracking-widest text-xs"
      >
        {isLoading ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
        {submitLabel}
      </Button>
    </div>
  );
}
