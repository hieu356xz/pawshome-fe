"use client";

import { useState, useEffect, useCallback } from "react";
import { useTranslations } from "next-intl";
import {
  Search,
  Filter,
  Plus,
  Loader2,
  AlertCircle,
  X,
  ArrowUpDown,
  Calendar,
  MessageSquare,
} from "lucide-react";
import { Link } from "@/lib/navigation";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PostCard } from "@/components/shared/PostCard";
import { AppPagination } from "@/components/shared/AppPagination";
import { cn } from "@/lib/utils";
import { petPostService } from "@/services/pet-post.service";
import { PetPost, PostType } from "@/types/post";
import { SortOrder } from "@/types/common";
import { formatDistanceToNow } from "date-fns";
import { vi, enUS } from "date-fns/locale";
import { useParams } from "next/navigation";
import { PageHeader } from "@/components/shared/PageHeader";

export default function CommunityPostsPage() {
  const t = useTranslations("CommunityBoard");
  const commonT = useTranslations("Common");
  const plT = useTranslations("PetList");
  const navbarT = useTranslations("Navbar");
  const params = useParams();
  const locale = params.locale as string;

  const [posts, setPosts] = useState<PetPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalItems, setTotalItems] = useState(0);

  // Filters & Sorting & Pagination
  const [searchQuery, setSearchQuery] = useState("");
  const [activeType, setActiveType] = useState<PostType | "ALL">("ALL");
  const [sortBy, setSortBy] = useState("createdAt");
  const [sortOrder, setSortOrder] = useState<SortOrder>(SortOrder.DESC);
  const [page, setPage] = useState(1);
  const pageSize = 9;

  const [showFilters, setShowFilters] = useState(false);

  const fetchPosts = useCallback(async () => {
    setLoading(true);
    try {
      const response = await petPostService.getPosts({
        page,
        limit: pageSize,
        postType: activeType === "ALL" ? undefined : (activeType as PostType),
        sortBy,
        sortOrder,
      });
      if (response.success) {
        setPosts(response.data);
        setTotalItems(response.meta?.totalItems || response.data.length);
      }
    } catch (error) {
      console.error("Failed to fetch posts:", error);
    } finally {
      setLoading(false);
    }
  }, [page, activeType, sortBy, sortOrder]);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  const filteredPosts = posts.filter(
    (post) =>
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.location?.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const totalPages = Math.ceil(totalItems / pageSize);

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

  const handleReset = () => {
    setSearchQuery("");
    setActiveType("ALL");
    setSortBy("createdAt");
    setSortOrder(SortOrder.DESC);
    setPage(1);
  };

  return (
    <div className="min-h-screen bg-[#faf9f6] pb-24">
      {/* Hero Section */}
      <PageHeader
        title={t("title")}
        description={t("subtitle")}
        badgeIcon={MessageSquare}
        badgeText={navbarT("community")}
        variant="primary">
        <Link
          href="/community-posts/create"
          className="h-14 px-8 rounded-2xl bg-white text-primary hover:bg-white/95 text-sm font-bold flex items-center justify-center transition-all shadow-xl shadow-black/10 hover:shadow-black/20 hover:scale-[1.02] duration-200">
          <Plus className="mr-2 h-5 w-5 text-primary" />
          {t("createPost")}
        </Link>
      </PageHeader>

      <div className="container mx-auto px-4 md:px-8 mt-12">
        <div className="flex flex-col lg:flex-row gap-12">
          {/* Filters Sidebar */}
          <aside
            className={cn(
              "lg:w-80 space-y-8 lg:block",
              showFilters ? "block" : "hidden",
            )}>
            <div className="bg-white rounded-3xl border border-border/30 shadow-sm p-8 space-y-8 sticky top-24">
              <div className="flex items-center justify-between lg:hidden">
                <h3 className="font-bold text-lg">{plT("filters")}</h3>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setShowFilters(false)}>
                  <X className="h-5 w-5" />
                </Button>
              </div>

              {/* Search */}
              <div className="space-y-4">
                <h4 className="text-xs font-bold uppercase tracking-widest text-muted-foreground/60 px-1">
                  {plT("searchPlaceholder")}
                </h4>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="..."
                    className="pl-10 h-12 rounded-xl bg-muted/20 border-transparent focus:bg-white transition-all"
                    value={searchQuery}
                    onChange={(e) => {
                      setSearchQuery(e.target.value);
                      setPage(1);
                    }}
                  />
                </div>
              </div>

              {/* Type Filter */}
              <div className="space-y-4">
                <h4 className="text-xs font-bold uppercase tracking-widest text-muted-foreground/60 px-1">
                  {t("postType")}
                </h4>
                <div className="space-y-2">
                  {[
                    { id: "ALL", label: plT("all") },
                    { id: PostType.LOST, label: t("PostTypes.lost") },
                    { id: PostType.FOUND, label: t("PostTypes.found") },
                  ].map((type) => (
                    <button
                      key={type.id}
                      onClick={() => {
                        setActiveType(type.id as any);
                        setPage(1);
                      }}
                      className={cn(
                        "w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-bold transition-all",
                        activeType === type.id
                          ? "bg-primary text-white shadow-lg shadow-primary/20"
                          : "hover:bg-muted/50 text-muted-foreground",
                      )}>
                      {type.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Sorting */}
              <div className="space-y-4">
                <h4 className="text-xs font-bold uppercase tracking-widest text-muted-foreground/60 px-1">
                  {t("sortBy")}
                </h4>
                <div className="space-y-2">
                  {[
                    { id: "DESC", label: t("newest"), icon: Calendar },
                    { id: "ASC", label: t("oldest"), icon: ArrowUpDown },
                  ].map((order) => (
                    <button
                      key={order.id}
                      onClick={() => {
                        setSortOrder(order.id as SortOrder);
                        setPage(1);
                      }}
                      className={cn(
                        "w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all",
                        sortOrder === order.id
                          ? "bg-primary/10 text-primary"
                          : "hover:bg-muted/50 text-muted-foreground",
                      )}>
                      <order.icon className="h-4 w-4" />
                      {order.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-border/50">
                <Button
                  variant="ghost"
                  className="w-full h-12 rounded-xl text-xs font-bold uppercase tracking-widest hover:text-red-500 hover:bg-red-50"
                  onClick={handleReset}>
                  {plT("clearFilters")}
                </Button>
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <main className="flex-1 space-y-8 flex flex-col">
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">
                {plT("showing")}{" "}
                <span className="font-bold text-foreground">{totalItems}</span>{" "}
                {t("posts")}
              </p>
              <Button
                variant="outline"
                className="lg:hidden rounded-xl h-10 px-4"
                onClick={() => setShowFilters(true)}>
                <Filter className="mr-2 h-4 w-4" />
                {plT("filters")}
              </Button>
            </div>

            {loading ? (
              <div className="h-[500px] flex flex-col items-center justify-center space-y-4">
                <Loader2 className="h-12 w-12 animate-spin text-primary/30" />
                <p className="font-serif text-xl font-bold text-muted-foreground animate-pulse">
                  {plT("loading")}
                </p>
              </div>
            ) : filteredPosts.length > 0 ? (
              <div className="flex-1 flex flex-col justify-between">
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8 mb-12">
                  {filteredPosts.map((post, index) => (
                    <Link
                      key={post.id}
                      href={`/community-posts/${post.id}`}
                      className="animate-in fade-in slide-in-from-bottom-4 duration-500"
                      style={{ animationDelay: `${index * 50}ms` }}>
                      <PostCard
                        type={post.postType.toUpperCase() as any}
                        title={post.title}
                        description={
                          post.description || commonT("noDescription")
                        }
                        location={post.location || "N/A"}
                        time={getTimeAgo(post.createdAt)}
                        imageUrl={post.images?.[0]?.imageUrl}
                      />
                    </Link>
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="pt-8 border-t border-border/20">
                    <AppPagination
                      currentPage={page}
                      totalPages={totalPages}
                      onPageChange={(p) => {
                        setPage(p);
                        window.scrollTo({ top: 0, behavior: "smooth" });
                      }}
                    />
                  </div>
                )}
              </div>
            ) : (
              <div className="h-[500px] bg-white rounded-3xl border border-dashed border-border flex flex-col items-center justify-center text-center p-8 space-y-4">
                <div className="p-4 bg-muted rounded-full">
                  <AlertCircle className="h-8 w-8 text-muted-foreground" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-xl font-bold">{t("noPostsFound")}</h3>
                  <p className="text-muted-foreground max-w-sm">
                    {plT("noPetsFoundDesc")}
                  </p>
                </div>
                <Button
                  variant="outline"
                  className="rounded-xl"
                  onClick={handleReset}>
                  {plT("clearFilters")}
                </Button>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
