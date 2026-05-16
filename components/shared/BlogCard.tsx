"use client";

import { Calendar, User, Eye, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { useTranslations, useLocale } from "next-intl";
import { Link } from "@/lib/navigation";
import { BlogPost } from "@/types/post";
import { format } from "date-fns";
import { vi, enUS } from "date-fns/locale";

interface BlogCardProps {
  post: BlogPost;
}

export function BlogCard({ post }: BlogCardProps) {
  const t = useTranslations("Blog");
  const locale = useLocale();

  const formattedDate = format(new Date(post.createdAt), "dd MMM, yyyy", {
    locale: locale === "vi" ? vi : enUS,
  });

  return (
    <Link
      href={`/blog/${post.slug || post.id}`}
      className="bg-white rounded-[2rem] border border-border/30 overflow-hidden shadow-sm hover:shadow-xl transition-all group flex flex-col h-full">
      <div className="aspect-[16/10] bg-muted relative overflow-hidden">
        {post.featuredImageUrl ? (
          <img
            src={post.featuredImageUrl}
            alt={post.title}
            className="object-cover w-full h-full transition-transform duration-700 group-hover:scale-110"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-primary/5">
            <span className="text-4xl font-serif text-primary/10">PawsHome</span>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        
        {post.tags && post.tags.length > 0 && (
          <div className="absolute top-4 left-4 flex gap-2">
            <span className="bg-white/90 backdrop-blur-md text-primary text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full shadow-sm">
              {post.tags[0].name}
            </span>
          </div>
        )}
      </div>

      <div className="p-8 flex-1 flex flex-col space-y-4">
        <div className="flex items-center gap-4 text-[11px] text-muted-foreground font-bold uppercase tracking-widest">
          <div className="flex items-center gap-1">
            <Calendar className="h-3 w-3 text-primary/60" />
            {formattedDate}
          </div>
          <div className="flex items-center gap-1">
            <Eye className="h-3 w-3 text-primary/60" />
            {post.viewCount} {t("views")}
          </div>
        </div>

        <h3 className="text-2xl font-serif font-bold line-clamp-2 group-hover:text-primary transition-colors leading-tight text-foreground">
          {post.title}
        </h3>

        <p className="text-sm text-muted-foreground line-clamp-3 leading-relaxed flex-1">
          {post.excerpt || post.content.replace(/<[^>]*>/g, "").slice(0, 150) + "..."}
        </p>

        <div className="pt-6 border-t border-border/50 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary text-[10px] font-bold">
              {post.user?.fullName?.charAt(0) || "A"}
            </div>
            <span className="text-xs font-bold text-foreground">
              {post.user?.fullName || "Admin"}
            </span>
          </div>
          
          <div className="text-primary font-bold text-sm flex items-center gap-2 group/btn">
            {t("readMore")}
            <ArrowRight className="h-4 w-4 transition-transform group-hover/btn:translate-x-1" />
          </div>
        </div>
      </div>
    </Link>
  );
}
