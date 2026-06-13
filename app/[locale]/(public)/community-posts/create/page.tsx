"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import {
  ArrowLeft,
  Camera,
  X,
  MapPin,
  Phone,
  Type,
  Loader2,
  Image as ImageIcon,
  Plus,
} from "lucide-react";
import { Link } from "@/lib/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { petPostService } from "@/services/pet-post.service";
import { PostType } from "@/types/post";
import { useToast } from "@/components/ui/toast";

export default function CreatePostPage() {
  const t = useTranslations("CommunityBoard");
  const commonT = useTranslations("Common");
  const router = useRouter();
  const { toast } = useToast();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    location: "",
    contact: "",
    postType: PostType.LOST,
  });

  const [images, setImages] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      if (images.length + files.length > 5) {
        toast({
          type: "error",
          message: t("imageLimitError"),
        });
        return;
      }

      setImages((prev) => [...prev, ...files]);
      const newPreviews = files.map((file) => URL.createObjectURL(file));
      setPreviews((prev) => [...prev, ...newPreviews]);
    }
  };

  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
    setPreviews((prev) => {
      URL.revokeObjectURL(prev[index]);
      return prev.filter((_, i) => i !== index);
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // 1. Create Post
      const postResponse = await petPostService.createPost(formData);

      if (postResponse.success) {
        const postId = postResponse.data.id;

        // 2. Upload Images if any
        if (images.length > 0) {
          await Promise.all(
            images.map((image) => petPostService.uploadImage(postId, image)),
          );
        }

        toast({
          type: "success",
          message: t("successCreate"),
        });
        router.push("/community-posts");
      }
    } catch (error) {
      console.error("Failed to create post:", error);
      toast({
        type: "error",
        message: t("errorCreate"),
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#faf9f6] pb-24">
      {/* Header */}
      <section className="pt-20 pb-16 bg-white border-b border-border/10">
        <div className="container mx-auto px-4 md:px-8">
          <div className="max-w-4xl mx-auto flex flex-col items-center text-center space-y-6">
            <Link
              href="/community-posts"
              className="flex items-center gap-2 text-sm font-bold text-muted-foreground hover:text-primary transition-colors mb-4">
              <ArrowLeft className="h-4 w-4" /> {commonT("back")}
            </Link>
            <h1 className="text-4xl md:text-5xl font-serif font-bold text-foreground">
              {t("createTitle")}
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed max-w-2xl">
              {t("createSubtitle")}
            </p>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 md:px-8 mt-16">
        <form
          onSubmit={handleSubmit}
          className="max-w-4xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Main Form Fields */}
          <div className="lg:col-span-8 space-y-12">
            <div className="bg-white rounded-[2.5rem] border border-border/30 shadow-sm p-10 space-y-10">
              {/* Type Selection */}
              <div className="space-y-4">
                <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground/60">
                  {t("postType")}
                </Label>
                <div className="flex p-1.5 bg-muted/20 rounded-2xl">
                  <button
                    type="button"
                    onClick={() =>
                      setFormData({ ...formData, postType: PostType.LOST })
                    }
                    className={cn(
                      "flex-1 h-12 rounded-xl text-sm font-bold transition-all",
                      formData.postType === PostType.LOST
                        ? "bg-red-500 text-white shadow-lg shadow-red-500/20"
                        : "text-muted-foreground hover:bg-muted/30",
                    )}>
                    {t("PostTypes.lost")}
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      setFormData({ ...formData, postType: PostType.FOUND })
                    }
                    className={cn(
                      "flex-1 h-12 rounded-xl text-sm font-bold transition-all",
                      formData.postType === PostType.FOUND
                        ? "bg-green-500 text-white shadow-lg shadow-green-500/20"
                        : "text-muted-foreground hover:bg-muted/30",
                    )}>
                    {t("PostTypes.found")}
                  </button>
                </div>
              </div>

              {/* Title */}
              <div className="space-y-4">
                <Label
                  htmlFor="title"
                  className="text-xs font-bold uppercase tracking-widest text-muted-foreground/60">
                  {t("postTitle")}
                </Label>
                <div className="relative">
                  <Type className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground/40" />
                  <Input
                    id="title"
                    required
                    placeholder={t("postTitlePlaceholder")}
                    className="pl-12 h-14 rounded-2xl bg-muted/20 border-transparent focus:bg-white transition-all text-lg font-serif"
                    value={formData.title}
                    onChange={(e) =>
                      setFormData({ ...formData, title: e.target.value })
                    }
                  />
                </div>
              </div>

              {/* Description */}
              <div className="space-y-4">
                <Label
                  htmlFor="description"
                  className="text-xs font-bold uppercase tracking-widest text-muted-foreground/60">
                  {t("description")}
                </Label>
                <textarea
                  id="description"
                  required
                  placeholder={t("descriptionPlaceholder")}
                  className="w-full min-h-[200px] p-6 rounded-[2rem] bg-muted/20 border-transparent focus:bg-white transition-all text-lg leading-relaxed resize-none outline-none ring-primary/20 focus:ring-1"
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                />
              </div>

              {/* Location & Contact */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <Label
                    htmlFor="location"
                    className="text-xs font-bold uppercase tracking-widest text-muted-foreground/60">
                    {t("location")}
                  </Label>
                  <div className="relative">
                    <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground/40" />
                    <Input
                      id="location"
                      required
                      placeholder={t("locationPlaceholder")}
                      className="pl-12 h-14 rounded-2xl bg-muted/20 border-transparent focus:bg-white transition-all"
                      value={formData.location}
                      onChange={(e) =>
                        setFormData({ ...formData, location: e.target.value })
                      }
                    />
                  </div>
                </div>
                <div className="space-y-4">
                  <Label
                    htmlFor="contact"
                    className="text-xs font-bold uppercase tracking-widest text-muted-foreground/60">
                    {t("contact")}
                  </Label>
                  <div className="relative">
                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground/40" />
                    <Input
                      id="contact"
                      required
                      placeholder={t("contactPlaceholder")}
                      className="pl-12 h-14 rounded-2xl bg-muted/20 border-transparent focus:bg-white transition-all"
                      value={formData.contact}
                      onChange={(e) =>
                        setFormData({ ...formData, contact: e.target.value })
                      }
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar: Images & Submit */}
          <div className="lg:col-span-4 space-y-8">
            <div className="bg-white rounded-[2.5rem] border border-border/30 shadow-xl p-8 space-y-8">
              <div className="space-y-2">
                <h3 className="text-xl font-serif font-bold">
                  {t("uploadImages")}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {t("uploadImagesDesc")}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {previews.map((preview, index) => (
                  <div
                    key={index}
                    className="aspect-square relative rounded-2xl overflow-hidden group">
                    <img src={preview} className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="absolute top-2 right-2 h-8 w-8 bg-black/50 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all">
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ))}
                {previews.length < 5 && (
                  <label className="aspect-square rounded-2xl border-2 border-dashed border-border flex flex-col items-center justify-center cursor-pointer hover:bg-muted/50 transition-all space-y-2">
                    <Camera className="h-6 w-6 text-muted-foreground" />
                    <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                      {t("add")}
                    </span>
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      className="hidden"
                      onChange={handleImageChange}
                    />
                  </label>
                )}
              </div>

              <div className="pt-8 border-t border-border/50">
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full h-14 rounded-2xl bg-primary hover:bg-primary/90 text-lg font-bold shadow-xl shadow-primary/20">
                  {isSubmitting ? (
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  ) : (
                    <Plus className="mr-2 h-5 w-5" />
                  )}
                  {isSubmitting ? t("submitting") : t("createPost")}
                </Button>
                <p className="text-[11px] text-center text-muted-foreground mt-6 italic">
                  {t("createPostWarning")}
                </p>
              </div>
            </div>

            {/* Hint Box */}
            <div className="bg-primary/5 rounded-[2rem] border border-primary/10 p-8 space-y-4">
              <div className="flex items-center gap-3 text-primary">
                <ImageIcon className="h-5 w-5" />
                <h4 className="font-bold text-sm">{t("postingTipsTitle")}</h4>
              </div>
              <ul className="space-y-2 text-xs text-muted-foreground leading-relaxed list-disc pl-4">
                <li>{t("postingTip1")}</li>
                <li>{t("postingTip2")}</li>
                <li>{t("postingTip3")}</li>
                <li>{t("postingTip4")}</li>
              </ul>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
