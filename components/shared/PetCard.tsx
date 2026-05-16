"use client";

import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";

interface PetCardProps {
  name: string;
  ageGroup: string;
  breed: string;
  species: string;
  gender: string;
  adoptionStatus: string;
  imageUrl?: string;
}

export function PetCard({ name, ageGroup, breed, species, gender, adoptionStatus, imageUrl }: PetCardProps) {
  const t = useTranslations("PetList");

  return (
    <div className="group relative flex flex-col h-full animate-in fade-in duration-500">
      <div className="relative aspect-[4/5] w-full rounded-[1rem] overflow-hidden border border-border/30 shadow-sm transition-all duration-500 hover:shadow-lg hover:-translate-y-1 bg-white">
        {imageUrl ? (
          <img 
            src={imageUrl} 
            alt={name} 
            className="object-cover w-full h-full transition-transform duration-700 group-hover:scale-105" 
          />
        ) : (
          <div className="w-full h-full bg-primary/5 flex items-center justify-center font-serif text-primary/10 text-5xl">
            {name[0]}
          </div>
        )}
        
        {/* Adoption Status Badge */}
        <div className="absolute top-2.5 right-2.5 bg-white/90 backdrop-blur-md text-primary text-[9px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full shadow-sm z-20 border border-primary/5 transition-opacity group-hover:opacity-0 duration-300">
          {adoptionStatus}
        </div>
        
        {/* Hover Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-primary/85 via-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500" />
        
        <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 delay-75 text-white">
          <div className="space-y-0.5 mb-3">
            <p className="font-serif text-xl font-bold leading-tight">{name}</p>
            <p className="text-[11px] opacity-90 font-medium tracking-wide italic truncate">{breed}</p>
          </div>
          <button className="w-full bg-accent text-accent-foreground py-2 rounded-lg text-xs font-bold shadow-lg transform active:scale-95 transition-all hover:bg-accent/90">
            {t("viewProfile")}
          </button>
        </div>
      </div>
      
      {/* Static Info Below Card */}
      <div className="mt-2.5 px-0.5">
        <div className="flex items-center justify-between gap-1.5">
          <h4 className="font-serif text-lg font-bold text-foreground group-hover:text-primary transition-colors duration-300 truncate leading-tight">{name}</h4>
          <span className="text-[9px] font-bold text-muted-foreground/40 uppercase tracking-widest whitespace-nowrap">{gender}</span>
        </div>
        <div className="flex items-center gap-1.5 mt-1">
          <span className="px-1.5 py-0.5 bg-primary/5 rounded text-[9px] font-bold text-primary uppercase tracking-tight">
            {species}
          </span>
          <span className="text-muted-foreground/20 text-[10px]">•</span>
          <p className="text-[11px] text-muted-foreground font-medium truncate max-w-[80px]">
            {breed}
          </p>
          <span className="text-muted-foreground/20 text-[10px]">•</span>
          <p className="text-[11px] text-muted-foreground font-medium italic whitespace-nowrap">
            {ageGroup}
          </p>
        </div>
      </div>
    </div>
  );
}
