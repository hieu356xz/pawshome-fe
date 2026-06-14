"use client";

import React, { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { useAuth } from "@/providers/AuthContext";
import { Link, useRouter } from "@/lib/navigation";
import { userService } from "@/services/user.service";
import { petPostService } from "@/services/pet-post.service";
import { blogService } from "@/services/blog.service";
import { hasPermission } from "@/lib/permissions";
import { toast } from "@/components/ui/toast";
import {
  User as UserIcon,
  Mail,
  Calendar,
  Edit2,
  Camera,
  Loader2,
  BookOpen,
  MessageSquare,
  MapPin,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { PostCard } from "@/components/shared/PostCard";
import { BlogCard } from "@/components/shared/BlogCard";

export default function ProfilePage() {
  const t = useTranslations("Profile");
  const { user, isLoading: isAuthLoading, refreshUser } = useAuth();
  const router = useRouter();

  // Profile Edit State
  const [isEditing, setIsEditing] = useState(false);
  const [fullName, setFullName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [address, setAddress] = useState("");
  const [bio, setBio] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  // Tabs State
  const [activeTab, setActiveTab] = useState<"posts" | "blogs">("posts");
  
  // Lists State
  const [posts, setPosts] = useState<any[]>([]);
  const [blogs, setBlogs] = useState<any[]>([]);
  const [isPostsLoading, setIsPostsLoading] = useState(false);
  const [isBlogsLoading, setIsBlogsLoading] = useState(false);

  // Redirect if not logged in
  useEffect(() => {
    if (!isAuthLoading && !user) {
      router.push("/login");
    }
  }, [user, isAuthLoading, router]);

  // Set form fields when user loaded
  useEffect(() => {
    if (user) {
      setFullName(user.fullName || "");
      setPhoneNumber(user.phoneNumber || "");
      setAddress(user.address || "");
      setBio(user.bio || "");
    }
  }, [user]);

  // Fetch posts & blogs
  useEffect(() => {
    if (user) {
      fetchUserPosts();
      if (hasPermission(user, "blog:create")) {
        fetchUserBlogs();
      }
    }
  }, [user]);

  const fetchUserPosts = async () => {
    if (!user) return;
    setIsPostsLoading(true);
    try {
      const response = await petPostService.getPosts({ userId: user.id });
      setPosts(response.data || []);
    } catch (error) {
      console.error("Failed to fetch posts:", error);
    } finally {
      setIsPostsLoading(false);
    }
  };

  const fetchUserBlogs = async () => {
    if (!user) return;
    setIsBlogsLoading(true);
    try {
      const response = await blogService.getPosts({ userId: user.id });
      setBlogs(response.data || []);
    } catch (error) {
      console.error("Failed to fetch blogs:", error);
    } finally {
      setIsBlogsLoading(false);
    }
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setIsSubmitting(true);
    try {
      await userService.updateProfile({
        fullName,
        phoneNumber,
        address,
        bio,
      });
      await refreshUser();
      setIsEditing(false);
      toast.success(t("updateSuccess"));
    } catch (error: any) {
      console.error("Failed to update profile:", error);
      toast.error(error.message || t("updateError"));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      toast.error(t("onlyImagesAllowed"));
      return;
    }

    setIsUploading(true);
    try {
      await userService.uploadAvatar(file);
      await refreshUser();
      toast.success(t("avatarUpdateSuccess"));
    } catch (error: any) {
      console.error("Failed to upload avatar:", error);
      toast.error(error.message || t("avatarUploadError"));
    } finally {
      setIsUploading(false);
    }
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("vi-VN", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  if (isAuthLoading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-muted/10">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-10 w-10 animate-spin text-primary" />
          <p className="text-muted-foreground font-medium animate-pulse">{t("loading")}</p>
        </div>
      </div>
    );
  }

  const showBlogsTab = hasPermission(user, "blog:create");

  return (
    <div className="min-h-screen bg-muted/10 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Profile Card Header */}
        <div className="relative bg-white rounded-[2rem] border border-border/40 shadow-sm p-6 md:p-8 flex flex-col md:flex-row items-center md:items-start gap-6 md:gap-8 overflow-hidden">
          
          {/* Avatar Section */}
          <div className="relative group shrink-0">
            <div className="h-32 w-32 md:h-36 md:w-36 rounded-full overflow-hidden border border-border/80 bg-muted flex items-center justify-center shadow-inner">
              {user.avatarUrl ? (
                <img
                  src={user.avatarUrl}
                  alt={user.fullName || user.email}
                  className="h-full w-full object-cover"
                />
              ) : (
                <UserIcon className="h-16 w-16 text-muted-foreground/30" />
              )}
            </div>
            {isUploading && (
              <div className="absolute inset-0 rounded-full bg-black/40 flex items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-white" />
              </div>
            )}
            <label className="absolute bottom-1 right-1 h-9 w-9 rounded-full bg-primary hover:bg-primary/90 shadow flex items-center justify-center cursor-pointer text-primary-foreground transition-colors">
              <Camera size={16} />
              <input
                type="file"
                className="hidden"
                accept="image/*"
                onChange={handleAvatarChange}
                disabled={isUploading}
              />
            </label>
          </div>

          {/* User Meta Info */}
          <div className="flex-1 text-center md:text-left space-y-3">
            <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4 justify-center md:justify-start">
              <h1 className="text-3xl font-serif font-bold text-foreground">
                {user.fullName || user.email.split("@")[0]}
              </h1>
              <div className="flex justify-center md:justify-start gap-2">
                {user.roles?.map((role) => (
                  <Badge
                    key={role.id}
                    variant="secondary"
                    className="bg-primary/10 text-primary border border-primary/20 font-bold capitalize text-xs px-2.5 py-0.5 rounded-full"
                  >
                    {role.name}
                  </Badge>
                ))}
              </div>
            </div>
            
            <p className="text-muted-foreground text-sm max-w-xl italic leading-relaxed">
              {user.bio || t("bioPlaceholder")}
            </p>

            <div className="flex flex-wrap gap-y-2 gap-x-6 justify-center md:justify-start text-xs text-muted-foreground font-bold pt-3 border-t border-border/60">
              <div className="flex items-center gap-1.5">
                <Mail size={14} className="text-primary/60" />
                <span className="text-gray-700 font-medium">{user.email}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Calendar size={14} className="text-primary/60" />
                <span className="text-gray-700 font-medium">
                  {t("joined")} {formatDate(user.createdAt)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Lower Section Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          
          {/* Left Side: Profile Details form or summary */}
          <div className="lg:col-span-1 space-y-6">
            <Card className="rounded-[2rem] border border-border/30 shadow-sm bg-white overflow-hidden">
              <CardHeader className="bg-muted/10 border-b border-border/40">
                <CardTitle className="text-lg font-bold text-foreground font-serif">
                  {isEditing ? t("editProfile") : t("title")}
                </CardTitle>
                <CardDescription className="text-xs">
                  {t("description")}
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                {isEditing ? (
                  <form onSubmit={handleUpdateProfile} className="space-y-4">
                    <div className="space-y-1.5">
                      <Label htmlFor="fullName" className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                        {t("fullName")}
                      </Label>
                      <Input
                        id="fullName"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        placeholder={t("fullNamePlaceholder")}
                        className="rounded-xl border-border focus-visible:ring-primary"
                        required
                      />
                    </div>
                    
                    <div className="space-y-1.5">
                      <Label htmlFor="phoneNumber" className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                        {t("phoneNumber")}
                      </Label>
                      <Input
                        id="phoneNumber"
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                        placeholder={t("phoneNumberPlaceholder")}
                        className="rounded-xl border-border focus-visible:ring-primary"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <Label htmlFor="address" className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                        {t("address")}
                      </Label>
                      <Input
                        id="address"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        placeholder={t("addressPlaceholder")}
                        className="rounded-xl border-border focus-visible:ring-primary"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <Label htmlFor="bio" className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                        {t("bio")}
                      </Label>
                      <textarea
                        id="bio"
                        value={bio}
                        onChange={(e) => setBio(e.target.value)}
                        placeholder={t("bioPlaceholder")}
                        rows={3}
                        className="w-full text-sm rounded-xl p-3 border border-border bg-background focus:outline-none focus:ring-1 focus:ring-primary focus:border-transparent transition-all"
                      />
                    </div>

                    <div className="flex gap-2 pt-2">
                      <Button
                        type="submit"
                        disabled={isSubmitting}
                        className="flex-1 bg-primary hover:bg-primary/95 text-primary-foreground font-bold rounded-xl shadow"
                      >
                        {isSubmitting ? (
                          <>
                            <Loader2 className="h-4 w-4 animate-spin mr-2" />
                            {t("saveChanges")}...
                          </>
                        ) : (
                          t("saveChanges")
                        )}
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => {
                          setIsEditing(false);
                          if (user) {
                            setFullName(user.fullName || "");
                            setPhoneNumber(user.phoneNumber || "");
                            setAddress(user.address || "");
                            setBio(user.bio || "");
                          }
                        }}
                        className="border-border text-foreground hover:bg-muted rounded-xl"
                      >
                        {t("cancel")}
                      </Button>
                    </div>
                  </form>
                ) : (
                  <div className="space-y-4">
                    <div className="space-y-1">
                      <span className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest block">
                        {t("fullName")}
                      </span>
                      <p className="text-sm font-bold text-foreground">
                        {user.fullName || <span className="text-muted-foreground/60 italic">{t("notProvided")}</span>}
                      </p>
                    </div>
                    
                    <div className="space-y-1">
                      <span className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest block">
                        {t("phoneNumber")}
                      </span>
                      <p className="text-sm font-bold text-foreground">
                        {user.phoneNumber || <span className="text-muted-foreground/60 italic">{t("notProvided")}</span>}
                      </p>
                    </div>

                    <div className="space-y-1">
                      <span className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest block">
                        {t("address")}
                      </span>
                      <div className="flex items-start gap-1.5 text-sm font-bold text-foreground">
                        <MapPin size={16} className="text-primary/60 shrink-0 mt-0.5" />
                        <span>{user.address || <span className="text-muted-foreground/60 italic">{t("notProvided")}</span>}</span>
                      </div>
                    </div>

                    <div className="pt-2">
                      <Button
                        variant="outline"
                        onClick={() => setIsEditing(true)}
                        className="w-full border-border text-foreground hover:bg-muted font-bold rounded-xl gap-2 px-4 shadow-sm h-10"
                      >
                        <Edit2 size={16} />
                        {t("editProfile")}
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Right Side: Tabbed list of posts & blogs */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Tab Headers */}
            <div className="flex border-b border-border">
              <button
                onClick={() => setActiveTab("posts")}
                className={cn(
                  "flex items-center gap-2 px-6 py-3 border-b-2 font-bold text-sm transition-all focus:outline-none tracking-wide",
                  activeTab === "posts"
                    ? "border-primary text-primary"
                    : "border-transparent text-muted-foreground hover:text-foreground"
                )}
              >
                <MessageSquare size={16} />
                <span>{t("myPostsTab")}</span>
                <span className="bg-primary/5 text-primary font-bold text-[10px] px-2 py-0.5 rounded-full border border-primary/10">
                  {posts.length}
                </span>
              </button>

              {showBlogsTab && (
                <button
                  onClick={() => setActiveTab("blogs")}
                  className={cn(
                    "flex items-center gap-2 px-6 py-3 border-b-2 font-bold text-sm transition-all focus:outline-none tracking-wide",
                    activeTab === "blogs"
                      ? "border-primary text-primary"
                      : "border-transparent text-muted-foreground hover:text-foreground"
                  )}
                >
                  <BookOpen size={16} />
                  <span>{t("myBlogsTab")}</span>
                  <span className="bg-primary/5 text-primary font-bold text-[10px] px-2 py-0.5 rounded-full border border-primary/10">
                    {blogs.length}
                  </span>
                </button>
              )}
            </div>

            {/* Tab Contents */}
            <div className="space-y-4">
              
              {/* --- MY POSTS TAB CONTENT --- */}
              {activeTab === "posts" && (
                <>
                  {isPostsLoading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      {[1, 2].map((n) => (
                        <div key={n} className="bg-white rounded-xl border border-border overflow-hidden h-[340px] animate-pulse">
                          <div className="h-48 bg-muted w-full" />
                          <div className="p-6 space-y-3">
                            <div className="h-4 bg-muted rounded w-3/4" />
                            <div className="h-3 bg-muted rounded w-1/2" />
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : posts.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      {posts.map((post) => (
                        <Link key={post.id} href={`/community-posts/${post.id}`}>
                          <PostCard
                            type={post.postType.toUpperCase() as any}
                            title={post.title}
                            description={post.description || t("noDescription")}
                            location={post.location || "N/A"}
                            time={new Date(post.createdAt).toLocaleDateString()}
                            imageUrl={post.images?.[0]?.imageUrl}
                          />
                        </Link>
                      ))}
                    </div>
                  ) : (
                    <div className="bg-white border border-border/40 rounded-[2rem] p-12 text-center flex flex-col items-center justify-center gap-4 text-muted-foreground">
                      <MessageSquare size={48} className="text-primary/15 stroke-[1.5]" />
                      <p className="text-sm font-bold">{t("noPosts")}</p>
                    </div>
                  )}
                </>
              )}

              {/* --- MY BLOGS TAB CONTENT --- */}
              {activeTab === "blogs" && showBlogsTab && (
                <>
                  {isBlogsLoading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      {[1, 2].map((n) => (
                        <div key={n} className="bg-white rounded-[2rem] border border-border/30 overflow-hidden h-[400px] animate-pulse">
                          <div className="h-48 bg-muted w-full" />
                          <div className="p-6 space-y-3">
                            <div className="h-4 bg-muted rounded w-3/4" />
                            <div className="h-3 bg-muted rounded w-1/2" />
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : blogs.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      {blogs.map((blog) => (
                        <div key={blog.id}>
                          <BlogCard post={blog} />
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="bg-white border border-border/40 rounded-[2rem] p-12 text-center flex flex-col items-center justify-center gap-4 text-muted-foreground">
                      <BookOpen size={48} className="text-primary/15 stroke-[1.5]" />
                      <p className="text-sm font-bold">{t("noBlogs")}</p>
                    </div>
                  )}
                </>
              )}

            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
