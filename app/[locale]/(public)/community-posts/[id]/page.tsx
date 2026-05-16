"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { useTranslations } from "next-intl";
import {
  MapPin,
  Calendar,
  Phone,
  User,
  Share2,
  ChevronLeft,
  Loader2,
  AlertCircle,
} from "lucide-react";
import { Link } from "@/lib/navigation";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { petPostService } from "@/services/pet-post.service";
import { PetPost } from "@/types/post";
import { formatDistanceToNow } from "date-fns";
import { vi, enUS } from "date-fns/locale";
import { PostCommentSection } from "@/components/shared/PostCommentSection";

export default function PostDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const t = useTranslations("CommunityBoard");
  const commonT = useTranslations("Common");
  const plT = useTranslations("PetList");
  const locale = params.locale as string;

  const [post, setPost] = useState<PetPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState<string>("");

  useEffect(() => {
    fetchPost();
  }, [id]);

  const fetchPost = async () => {
    setLoading(true);
    try {
      const response = await petPostService.getPostById(id);
      if (response.success) {
        setPost(response.data);
        if (response.data.images && response.data.images.length > 0) {
          setActiveImage(response.data.images[0].imageUrl);
        }
      }
    } catch (error) {
      console.error("Failed to fetch post details:", error);
    } finally {
      setLoading(false);
    }
  };

  const getTimeAgo = (date: string) => {
    try {
      return formatDistanceToNow(new Date(date), {
        addSuffix: true,
        locale: locale === "vi" ? vi : enUS,
      });
    } catch (e) {
      return date;
    }
  };

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
        <h2 className="text-3xl font-serif font-bold mb-4">
          {t("noPostsFound")}
        </h2>
        <Link href="/community-posts">
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
      {/* Navigation & Header */}
      <div className="container mx-auto px-4 md:px-8 pt-8 mb-8">
        <Link
          href="/community-posts"
          className="inline-flex items-center text-sm font-bold text-muted-foreground hover:text-primary transition-colors group mb-6">
          <ChevronLeft className="mr-1 h-4 w-4 transition-transform group-hover:-translate-x-1" />
          {plT("back")}
        </Link>

        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-4">
            <div
              suppressHydrationWarning
              className={cn(
                "inline-block px-4 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest text-white shadow-lg",
                post.postType === "lost"
                  ? "bg-red-500 shadow-red-500/20"
                  : "bg-green-500 shadow-green-500/20",
              )}>
              {t(`PostTypes.${post.postType}`)}
            </div>
            <h1 className="text-4xl md:text-5xl font-serif font-bold text-foreground">
              {post.title}
            </h1>
            <div className="flex flex-wrap items-center gap-6 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-primary" />
                {post.location}
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-primary" />
                {getTimeAgo(post.createdAt)}
              </div>
            </div>
          </div>
          <Button
            variant="outline"
            className="rounded-xl h-12 px-6 border-primary/20 hover:bg-primary/5">
            <Share2 className="mr-2 h-4 w-4" />
            {t("share")}
          </Button>
        </div>
      </div>

      <div className="container mx-auto px-4 md:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Main Content: Images & Description */}
          <div className="lg:col-span-8 space-y-12">
            {/* Image Gallery */}
            <div className="space-y-4">
              <div className="aspect-[16/9] bg-white rounded-[2.5rem] overflow-hidden border border-border/30 shadow-xl">
                {activeImage ? (
                  <img
                    src={activeImage}
                    alt={post.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-muted/30">
                    <AlertCircle className="h-12 w-12 text-muted-foreground/20" />
                  </div>
                )}
              </div>
              {post.images && post.images.length > 1 && (
                <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
                  {post.images.map((img) => (
                    <button
                      key={img.id}
                      onClick={() => setActiveImage(img.imageUrl)}
                      className={cn(
                        "w-24 h-24 rounded-2xl overflow-hidden border-2 transition-all flex-shrink-0",
                        activeImage === img.imageUrl
                          ? "border-primary shadow-lg"
                          : "border-transparent opacity-60 hover:opacity-100",
                      )}>
                      <img
                        src={img.imageUrl}
                        alt={post.title}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Description */}
            <div className="bg-white rounded-[2.5rem] border border-border/30 shadow-sm p-10 space-y-8">
              <div className="space-y-6">
                <h2 className="text-2xl font-serif font-bold flex items-center gap-3">
                  <span className="h-8 w-1 bg-primary rounded-full" />
                  {t("description")}
                </h2>
                <div className="text-muted-foreground leading-relaxed whitespace-pre-line text-lg">
                  {post.description}
                </div>
              </div>
            </div>

            {/* Comments Section */}
            <PostCommentSection postId={id} />
          </div>

          {/* Sidebar: Author & Contact */}
          <div className="lg:col-span-4 space-y-8">
            <div className="bg-white rounded-[2rem] border border-border/30 shadow-xl p-8 space-y-8 sticky top-32">
              <h3 className="text-xl font-serif font-bold mb-4">
                {t("contactInfo")}
              </h3>

              <div className="flex items-center gap-4 p-4 bg-muted/20 rounded-2xl border border-transparent hover:border-primary/20 transition-all">
                <div className="h-14 w-14 bg-primary/10 rounded-2xl flex items-center justify-center text-primary">
                  <User className="h-7 w-7" />
                </div>
                <div>
                  <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground/60 mb-1">
                    {t("author")}
                  </p>
                  <p className="font-serif font-bold text-lg">
                    {post.user?.fullName || "Anonymous"}
                  </p>
                </div>
              </div>

              <div className="space-y-4 pt-4 border-t border-border/50">
                <div className="flex items-center gap-4">
                  <div className="h-10 w-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary">
                    <Phone className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-[10px] uppercase font-bold text-muted-foreground/60 leading-none mb-1">
                      {t("contact")}
                    </p>
                    <p className="font-bold text-base">
                      {post.contact || "N/A"}
                    </p>
                  </div>
                </div>
              </div>

              <div className="pt-6">
                <Button className="w-full h-14 rounded-2xl bg-primary hover:bg-primary/90 text-lg font-bold shadow-xl shadow-primary/20 flex items-center justify-center gap-2">
                  <Phone className="h-5 w-5" />
                  {commonT("contactUs")}
                </Button>
                <p className="text-[11px] text-center text-muted-foreground mt-4 italic">
                  * Vui lòng thận trọng khi liên hệ và giao dịch trực tiếp.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
