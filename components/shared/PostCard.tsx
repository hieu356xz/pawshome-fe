"use client";

import { MapPin, Calendar, Tag } from "lucide-react";
import { cn } from "@/lib/utils";
import { useTranslations } from "next-intl";

interface PostCardProps {
  type: "LOST" | "FOUND";
  title: string;
  description: string;
  location: string;
  time: string;
  imageUrl?: string;
}

export function PostCard({ type, title, description, location, time, imageUrl }: PostCardProps) {
  const t = useTranslations("PostTypes");
  const typeColors = {
    LOST: "bg-red-500",
    FOUND: "bg-green-500",
  };

  return (
    <div className="bg-background rounded-xl border border-border overflow-hidden shadow-sm hover:shadow-md transition-shadow group cursor-pointer">
      <div className="aspect-[16/10] bg-muted relative overflow-hidden">
        {imageUrl ? (
          <img 
            src={imageUrl} 
            alt={title} 
            className="object-cover w-full h-full transition-transform group-hover:scale-105" 
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-primary/5">
            <Tag className="h-8 w-8 text-primary/20" />
          </div>
        )}
        <div 
          suppressHydrationWarning
          className={cn(
            "absolute top-4 left-4 text-white text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full shadow-sm z-20",
            typeColors[type]
          )}
        >
          {t(type)}
        </div>
      </div>
      <div className="p-6 space-y-3">
        <h3 className="text-xl font-serif font-bold line-clamp-1">{title}</h3>
        <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
          {description}
        </p>
        <div className="flex items-center justify-between pt-4 border-t border-border text-[11px] text-muted-foreground font-medium uppercase tracking-wider">
          <div className="flex items-center">
            <MapPin className="h-3 w-3 mr-1 text-primary/60" />
            {location}
          </div>
          <div className="flex items-center">
            <Calendar className="h-3 w-3 mr-1 text-primary/60" />
            {time}
          </div>
        </div>
      </div>
    </div>
  );
}
