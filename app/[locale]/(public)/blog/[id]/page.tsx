"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { useTranslations, useLocale } from "next-intl";
import {
  Calendar,
  User,
  Clock,
  Share2,
  ChevronLeft,
  Loader2,
  AlertCircle,
  Tag as TagIcon,
  Eye,
  MessageSquare,
} from "lucide-react";
import { Link } from "@/lib/navigation";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { blogService } from "@/services/blog.service";
import { BlogPost } from "@/types/post";
import { format } from "date-fns";
import { vi, enUS } from "date-fns/locale";
import { BlogCommentSection } from "@/components/shared/BlogCommentSection";

export default function BlogDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const t = useTranslations("Blog");
  const petT = useTranslations("PetDetail");
  const paginationT = useTranslations("Pagination");
  const plT = useTranslations("PetList");
  const locale = useLocale();

  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPost();
  }, [id]);

  const fetchPost = async () => {
    setLoading(true);
    try {
      const response = await blogService.getPostById(id);
      if (response.success) {
        setPost(response.data);
      }
    } catch (error) {
      console.error("Failed to fetch blog details:", error);
    } finally {
      setLoading(false);
    }
  };

  const formattedDate = post
    ? format(new Date(post.createdAt), "dd MMMM, yyyy", {
        locale: locale === "vi" ? vi : enUS,
      })
    : "";

  if (loading) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center space-y-4">
        <Loader2 className="h-12 w-12 animate-spin text-primary/30" />
        <p className="font-serif text-xl font-bold text-muted-foreground animate-pulse">
          {plT("loading")}
        </p>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="container mx-auto px-4 py-24 text-center">
        <AlertCircle className="h-16 w-16 text-destructive mx-auto mb-6" />
        <h2 className="text-3xl font-serif font-bold mb-4">{t("noPosts")}</h2>
        <Link href="/blog">
          <Button variant="outline" className="rounded-xl">
            <ChevronLeft className="mr-2 h-4 w-4" />
            {plT("back")}
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#faf9f6] pb-24">
      {/* Article Header / Hero */}
      <div className="relative w-full h-[60vh] min-h-[400px] overflow-hidden">
        {post.featuredImageUrl ? (
          <img
            src={post.featuredImageUrl}
            alt={post.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-primary/10 flex items-center justify-center">
            <span className="text-6xl font-serif text-primary/10 font-bold">
              PawsHome Blog
            </span>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-[#faf9f6] via-[#faf9f6]/40 to-black/20" />

        <div className="absolute bottom-0 left-0 w-full">
          <div className="container mx-auto px-4 md:px-8 pb-12">
            <div className="max-w-4xl space-y-6">
              <Link
                href="/blog"
                className="inline-flex items-center text-sm font-bold text-primary hover:bg-white/80 bg-white/50 backdrop-blur-md px-4 py-2 rounded-full transition-all group mb-4 shadow-sm">
                <ChevronLeft className="mr-1 h-4 w-4 transition-transform group-hover:-translate-x-1" />
                {plT("back")}
              </Link>

              <div className="flex flex-wrap gap-2">
                {post.tags?.map((tag) => (
                  <span
                    key={tag.id}
                    className="bg-accent text-accent-foreground text-[10px] font-bold uppercase tracking-widest px-4 py-1.5 rounded-full shadow-lg">
                    {tag.name}
                  </span>
                ))}
              </div>

              <h1 className="text-4xl md:text-6xl font-serif font-bold text-foreground leading-tight">
                {post.title}
              </h1>

              <div className="flex flex-wrap items-center gap-6 text-sm font-bold uppercase tracking-widest text-muted-foreground/80">
                <div className="flex items-center gap-2">
                  <div className="h-10 w-10 bg-primary/20 rounded-full flex items-center justify-center text-primary border-2 border-white shadow-sm">
                    {post.user?.fullName?.charAt(0) || "A"}
                  </div>
                  <span>{post.user?.fullName || "Admin"}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-primary" />
                  {formattedDate}
                </div>
                <div className="flex items-center gap-2">
                  <Eye className="h-4 w-4 text-primary" />
                  {post.viewCount} {t("views")}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 md:px-8 -mt-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Main Content */}
          <div className="lg:col-span-8 space-y-12">
            <div className="bg-white rounded-[2.5rem] border border-border/30 shadow-xl p-8 md:p-16">
              {/* HTML Content rendering */}
              <article
                className="blog-content max-w-none"
                dangerouslySetInnerHTML={{ __html: post.content }}
              />

              <div className="mt-16 pt-8 border-t border-border/50 flex flex-wrap items-center justify-between gap-6">
                <div className="flex items-center gap-4">
                  <p className="text-sm font-bold text-muted-foreground uppercase tracking-widest">
                    {t("share")}:
                  </p>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="icon"
                      className="rounded-full h-10 w-10 hover:bg-primary hover:text-white transition-colors">
                      <Share2 className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      className="rounded-full h-10 w-10 hover:bg-blue-600 hover:text-white transition-colors border-blue-100 text-blue-600">
                      <span className="font-bold text-xs">f</span>
                    </Button>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <TagIcon className="h-4 w-4 text-primary" />
                  <div className="flex gap-2">
                    {post.tags?.map((tag) => (
                      <Link
                        key={tag.id}
                        href={`/blog?tagSlug=${tag.slug}`}
                        className="text-xs font-bold text-primary hover:underline">
                        #{tag.name}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Comments Section */}
            <div
              id="comments"
              className="bg-white rounded-[2.5rem] border border-border/30 shadow-sm p-8 md:p-12">
              <BlogCommentSection postId={post.id} />
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-4 space-y-8">
            {/* Author Card */}
            <div className="bg-white rounded-[2rem] border border-border/30 shadow-xl p-8 space-y-6">
              <h3 className="text-xl font-serif font-bold flex items-center gap-3">
                <span className="h-6 w-1 bg-primary rounded-full" />
                {t("author")}
              </h3>
              <div className="flex items-center gap-4">
                <div className="h-16 w-16 bg-primary/10 rounded-2xl flex items-center justify-center text-primary text-xl font-bold">
                  {post.user?.fullName?.charAt(0) || "A"}
                </div>
                <div>
                  <h4 className="font-serif font-bold text-lg">
                    {post.user?.fullName || "Admin"}
                  </h4>
                  <p className="text-xs text-muted-foreground uppercase tracking-widest font-bold">
                    {t("pawsHomeTeam")}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Article Navigation */}
      <div className="container mx-auto px-4 md:px-8 mt-12">
        <div className="flex justify-between items-center bg-white p-6 rounded-[2rem] border border-border/30 shadow-sm">
          <Link href="/blog" className="flex items-center gap-3 group">
            <div className="h-10 w-10 rounded-full bg-muted/20 flex items-center justify-center group-hover:bg-primary/10 group-hover:text-primary transition-all">
              <ChevronLeft className="h-5 w-5" />
            </div>
            <div className="text-left">
              <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground leading-none mb-1">
                {paginationT("previous")}
              </p>
              <p className="text-sm font-bold group-hover:text-primary transition-colors">
                {petT("backToList")}
              </p>
            </div>
          </Link>

          <div className="hidden md:flex items-center gap-2 text-primary font-bold">
            <span className="h-2 w-2 bg-primary rounded-full animate-pulse" />
            <span className="text-xs uppercase tracking-[0.2em]">
              PawsHome Journal
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
