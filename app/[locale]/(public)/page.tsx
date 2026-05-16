"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/lib/navigation";
import { Hero } from "@/components/home/Hero";
import { buttonVariants } from "@/components/ui/button";
import { PostCard } from "@/components/shared/PostCard";
import { PetCard } from "@/components/shared/PetCard";
import { ArrowRight, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { petService } from "@/services/pet.service";
import { petPostService } from "@/services/pet-post.service";
import { blogService } from "@/services/blog.service";
import { Pet } from "@/types/pet";
import { PetPost, BlogPost } from "@/types/post";

export default function Home() {
  const t = useTranslations("Home");
  const ptT = useTranslations("PetManagement");
  const plT = useTranslations("PetList");

  const [pets, setPets] = useState<Pet[]>([]);
  const [communityPosts, setCommunityPosts] = useState<PetPost[]>([]);
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [petsRes, communityRes, blogRes] = await Promise.all([
          petService.getPets({ limit: 4 }),
          petPostService.getPosts({ limit: 3 }),
          blogService.getPosts({ limit: 2, status: "published" }),
        ]);

        if (petsRes.success) setPets(petsRes.data);
        if (communityRes.success) setCommunityPosts(communityRes.data);
        if (blogRes.success) setBlogPosts(blogRes.data);
      } catch (error) {
        console.error("Failed to fetch home data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="flex flex-col min-h-full">
      <Hero />

      {/* Recent Pet Posts Section */}
      <section className="py-24 bg-muted/20">
        <div className="container mx-auto px-4 md:px-8">
          <div className="flex justify-between items-end mb-12">
            <div className="space-y-4">
              <h2 className="text-4xl font-serif font-bold">
                {t("noticeBoardTitle")}
              </h2>
              <p className="text-muted-foreground">{t("noticeBoardDesc")}</p>
            </div>
            <Link
              href="/community-posts"
              className={cn(
                buttonVariants({ variant: "link" }),
                "text-primary font-bold group flex items-center",
              )}>
              {t("viewAllPosts")}{" "}
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>

          {loading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary/30" />
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {communityPosts.map((post) => (
                <Link key={post.id} href={`/community-posts/${post.id}`}>
                  <PostCard
                    type={post.postType.toUpperCase() as any}
                    title={post.title}
                    description={post.description || ""}
                    location={post.location || "N/A"}
                    time={new Date(post.createdAt).toLocaleDateString()}
                    imageUrl={post.images?.[0]?.imageUrl}
                  />
                </Link>
              ))}
              {communityPosts.length === 0 && (
                <div className="col-span-3 text-center py-12 text-muted-foreground italic">
                  {t("noPostsFound") || "No recent posts found."}
                </div>
              )}
            </div>
          )}
        </div>
      </section>

      {/* Available Pets Section */}
      <section className="py-24">
        <div className="container mx-auto px-4 md:px-8">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-5xl font-serif font-bold">
              {t("meetResidentsTitle")}
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              {t("meetResidentsDesc")}
            </p>
          </div>

          {loading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary/30" />
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {pets.map((pet) => (
                <PetCard
                  key={pet.id}
                  id={pet.id}
                  name={pet.name}
                  ageGroup={ptT(`AgeGroups.${pet.ageGroup.toLowerCase()}`)}
                  breed={pet.breed?.name || plT("unknown")}
                  species={pet.species?.name || plT("unknown")}
                  gender={ptT(`Genders.${pet.gender.toLowerCase()}`)}
                  adoptionStatus={ptT(
                    `AdoptionStatuses.${pet.adoptionStatus.toLowerCase()}`,
                  )}
                  imageUrl={
                    pet.images?.find((img) => img.isPrimary)?.imageUrl ||
                    pet.images?.[0]?.imageUrl
                  }
                />
              ))}
              {pets.length === 0 && (
                <div className="col-span-4 text-center py-12 text-muted-foreground italic">
                  {plT("noPetsFound") || "No pets found."}
                </div>
              )}
            </div>
          )}

          <div className="mt-16 text-center">
            <Link
              href="/pets"
              className={cn(
                buttonVariants({ size: "lg" }),
                "bg-accent text-accent-foreground hover:bg-accent/90 shadow-md h-14 px-10 text-lg rounded-xl font-bold",
              )}>
              {t("findCompanion")}
            </Link>
          </div>
        </div>
      </section>

      {/* Blog Preview Section */}
      <section className="py-24 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 md:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-12">
            <div className="flex-1 space-y-6">
              <h2 className="text-5xl font-serif leading-tight">
                {t.rich("blogCornerTitle", {
                  italic: (chunks) => (
                    <span className="text-accent italic font-serif">
                      {chunks}
                    </span>
                  ),
                })}
              </h2>
              <p className="text-primary-foreground/80 text-lg">
                {t("blogCornerDesc")}
              </p>
              <Link
                href="/blog"
                className={cn(
                  buttonVariants({ variant: "outline" }),
                  "border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary rounded-xl px-8 h-12 font-bold",
                )}>
                {t("readBlog")}
              </Link>
            </div>
            <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-4">
              {loading ? (
                <div className="col-span-2 flex justify-center py-12">
                  <Loader2 className="h-8 w-8 animate-spin text-accent/30" />
                </div>
              ) : (
                blogPosts.map((post, idx) => (
                  <div
                    key={post.id}
                    className={cn(
                      "bg-white/10 backdrop-blur-md p-6 rounded-xl border border-white/20 flex flex-col justify-between",
                      idx === 1 && "mt-8 sm:mt-0",
                    )}>
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-widest text-accent mb-4">
                        {post.tags?.[0]?.name || t("articleBadge")}
                      </p>
                      <h4 className="text-xl font-serif font-bold mb-4 line-clamp-2 leading-snug">
                        {post.title}
                      </h4>
                    </div>
                    <Link
                      href={`/blog/${post.slug || post.id}`}
                      className="text-sm font-bold flex items-center hover:text-accent transition-colors">
                      {t("readMore")} <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </div>
                ))
              )}
              {!loading && blogPosts.length === 0 && (
                <div className="col-span-2 text-center py-12 text-primary-foreground/40 italic">
                  {t("noRecentArticles")}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
