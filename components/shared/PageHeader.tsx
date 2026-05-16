"use client";

import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface PageHeaderProps {
  title: string;
  description: string;
  badgeIcon?: LucideIcon;
  badgeText?: string;
  children?: React.ReactNode;
  variant?: "default" | "primary" | "accent";
  className?: string;
}

export function PageHeader({
  title,
  description,
  badgeIcon: BadgeIcon,
  badgeText,
  children,
  variant = "default",
  className,
}: PageHeaderProps) {
  const variants = {
    default: "bg-white text-foreground border-b border-border/10",
    primary: "bg-primary text-primary-foreground",
    accent: "bg-accent text-accent-foreground",
  };

  const skewColors = {
    default: "bg-primary/5",
    primary: "bg-white/10",
    accent: "bg-black/5",
  };

  const badgeStyles = {
    default: "bg-primary/5 text-primary border-primary/10",
    primary: "bg-white/10 text-accent border-white/20",
    accent: "bg-black/10 text-white border-black/20",
  };

  const descStyles = {
    default: "text-muted-foreground",
    primary: "text-primary-foreground/80",
    accent: "text-accent-foreground/80",
  };

  return (
    <section
      className={cn(
        "relative pt-16 pb-16 overflow-hidden",
        variants[variant],
        className,
      )}>
      {/* Skew Shape */}
      <div
        className={cn(
          "absolute top-0 right-0 w-1/3 h-full -skew-x-12 translate-x-1/2",
          skewColors[variant],
        )}
      />

      <div className="container mx-auto px-4 md:px-8 relative z-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
          <div className="max-w-3xl space-y-6">
            {(BadgeIcon || badgeText) && (
              <div
                className={cn(
                  "inline-flex items-center gap-2 px-4 py-1.5 rounded-full backdrop-blur-md border text-xs font-bold uppercase tracking-widest",
                  badgeStyles[variant],
                )}>
                {BadgeIcon && <BadgeIcon className="h-4 w-4" />}
                {badgeText}
              </div>
            )}

            <h1
              className={cn(
                "text-4xl md:text-6xl font-serif font-bold leading-tight",
                variant === "default" ? "text-foreground" : "",
              )}>
              {title}
            </h1>

            <p
              className={cn(
                "text-lg leading-relaxed max-w-2xl",
                descStyles[variant],
              )}>
              {description}
            </p>
          </div>

          {children && <div className="flex-shrink-0">{children}</div>}
        </div>
      </div>
    </section>
  );
}
