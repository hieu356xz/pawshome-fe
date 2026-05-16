"use client";

import React, { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { BlogPost, Tag } from "@/types/post";
import { blogService } from "@/services/blog.service";
import {
  FileText,
  Type,
  Link as LinkIcon,
  Eye,
  Image as ImageIcon,
  Tag as TagIcon,
  Save,
  Send,
  Loader2,
  Trash2,
  Plus,
  X,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { AdminFormField } from "./form/AdminFormField";
import { AdminFormSection } from "./form/AdminFormSection";
import { AdminFormHeader } from "./form/AdminFormHeader";
import { AdminFormSelect } from "./form/AdminFormSelect";
import { AdminFormTextArea } from "./form/AdminFormTextArea";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface BlogFormProps {
  initialData?: BlogPost;
  isEdit?: boolean;
}

export function BlogForm({ initialData, isEdit = false }: BlogFormProps) {
  const t = useTranslations("BlogManagement");
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [allTags, setAllTags] = useState<Tag[]>([]);
  const [newTagName, setNewTagName] = useState("");
  const [isCreatingTag, setIsCreatingTag] = useState(false);

  const [formData, setFormData] = useState({
    title: initialData?.title || "",
    content: initialData?.content || "",
    excerpt: initialData?.excerpt || "",
    status: initialData?.status || "draft",
    featuredImageUrl: initialData?.featuredImageUrl || "",
    tagIds: initialData?.tags?.map((t) => t.id) || [],
  });

  useEffect(() => {
    fetchTags();
  }, []);

  const fetchTags = async () => {
    try {
      const response = await blogService.getTags();
      setAllTags(response.data);
    } catch (error) {
      console.error("Failed to fetch tags:", error);
    }
  };

  const handleCreateTag = async () => {
    if (!newTagName.trim()) return;
    setIsCreatingTag(true);
    try {
      const response = await blogService.createTag({ name: newTagName });
      setAllTags([...allTags, response.data]);
      setNewTagName("");
      // Automatically select the new tag
      setFormData((prev) => ({
        ...prev,
        tagIds: [...prev.tagIds, response.data.id],
      }));
    } catch (error) {
      console.error("Failed to create tag:", error);
    } finally {
      setIsCreatingTag(false);
    }
  };

  const handleDeleteTag = async (e: React.MouseEvent, tagId: number) => {
    e.stopPropagation();
    if (!confirm("Are you sure you want to delete this tag?")) return;
    try {
      await blogService.deleteTag(tagId);
      setAllTags(allTags.filter((t) => t.id !== tagId));
      setFormData((prev) => ({
        ...prev,
        tagIds: prev.tagIds.filter((id) => id !== tagId),
      }));
    } catch (error) {
      console.error("Failed to delete tag:", error);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !initialData?.id) return;

    setIsUploading(true);
    try {
      const response = await blogService.uploadFeaturedImage(
        initialData.id,
        file,
      );
      setFormData((prev) => ({
        ...prev,
        featuredImageUrl: response.data.featuredImageUrl,
      }));
    } catch (error) {
      console.error("Upload failed:", error);
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemoveImage = async () => {
    if (!initialData?.id) {
      setFormData({ ...formData, featuredImageUrl: "" });
      return;
    }

    try {
      await blogService.removeFeaturedImage(initialData.id);
      setFormData({ ...formData, featuredImageUrl: "" });
    } catch (error) {
      console.error("Failed to remove image:", error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      // Strip featuredImageUrl as backend DTO doesn't allow it
      const { featuredImageUrl, ...submitData } = formData;

      if (isEdit && initialData?.id) {
        await blogService.updatePost(initialData.id, submitData);
        await blogService.updateTags(initialData.id, formData.tagIds);
      } else {
        const response = await blogService.createPost(submitData);
        // After create, redirect to edit to allow image upload
        router.push(`/admin/blog/${response.data.id}/edit`);
        return;
      }
      router.push("/admin/blog");
      router.refresh();
    } catch (error) {
      console.error("Submit error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-8 max-w-6xl animate-in fade-in slide-in-from-bottom-4 duration-700">
      <AdminFormHeader
        title={isEdit ? t("editPost") : t("createPost")}
        backUrl="/admin/blog"
        backLabel={t("title")}
        submitLabel={isEdit ? t("updatePost") : t("publish")}
        isLoading={isLoading}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          {/* Main Content */}
          <AdminFormSection title={t("content")} icon={<FileText size={20} />}>
            <div className="space-y-6">
              <AdminFormField
                id="title"
                label={t("postTitle")}
                placeholder="Enter a catchy title..."
                icon={<Type size={18} />}
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                required
              />

              <AdminFormTextArea
                id="content"
                label={t("content")}
                placeholder="Write your article here..."
                value={formData.content}
                onChange={(e) =>
                  setFormData({ ...formData, content: e.target.value })
                }
                className="min-h-[400px] font-sans text-base leading-relaxed"
                required
              />
            </div>
          </AdminFormSection>

          {/* Excerpt & Metadata */}
          <AdminFormSection title={t("excerpt")} icon={<Eye size={20} />}>
            <AdminFormTextArea
              id="excerpt"
              label={t("excerpt")}
              placeholder="Brief summary for search results and previews..."
              value={formData.excerpt}
              onChange={(e) =>
                setFormData({ ...formData, excerpt: e.target.value })
              }
              className="min-h-[100px]"
            />
          </AdminFormSection>
        </div>

        {/* Sidebar Settings */}
        <div className="space-y-8">
          {/* Status & Publishing */}
          <div className="bg-white rounded-3xl border border-gray-100 p-8 shadow-sm space-y-6">
            <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2 uppercase tracking-wider">
              <Send size={18} className="text-orange-500" />
              Publishing
            </h3>

            <AdminFormSelect
              id="status"
              label={t("status")}
              options={[
                { label: t("PostStatuses.draft"), value: "draft" },
                { label: t("PostStatuses.published"), value: "published" },
                { label: t("PostStatuses.archived"), value: "archived" },
              ]}
              value={formData.status}
              onChange={(e) =>
                setFormData({ ...formData, status: e.target.value as any })
              }
              required
            />

            <div className="pt-4 border-t border-gray-50 flex flex-col gap-3">
              <Button
                type="submit"
                className="w-full bg-orange-500 hover:bg-orange-600 text-white rounded-xl h-11 shadow-lg shadow-orange-100"
                disabled={isLoading}>
                {isLoading ? (
                  <Loader2 className="animate-spin mr-2" size={18} />
                ) : (
                  <Save className="mr-2" size={18} />
                )}
                {formData.status === "draft" 
                  ? t("saveDraft") 
                  : isEdit 
                    ? t("updatePost") 
                    : t("publish")}
              </Button>
            </div>
          </div>

          {/* Featured Image */}
          <div className="bg-white rounded-3xl border border-gray-100 p-8 shadow-sm space-y-6">
            <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2 uppercase tracking-wider">
              <ImageIcon size={18} className="text-orange-500" />
              {t("featuredImage")}
            </h3>

            <div
              className={cn(
                "relative aspect-video rounded-2xl bg-gray-50 border-2 border-dashed overflow-hidden group transition-all",
                formData.featuredImageUrl
                  ? "border-transparent"
                  : "border-gray-100",
                !isEdit && "opacity-60 grayscale cursor-not-allowed",
              )}>
              {formData.featuredImageUrl ? (
                <>
                  <img
                    src={formData.featuredImageUrl}
                    alt="Featured"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      className="rounded-xl"
                      onClick={handleRemoveImage}>
                      <Trash2 size={16} className="mr-2" />
                      Remove
                    </Button>
                  </div>
                </>
              ) : (
                <label
                  className={cn(
                    "absolute inset-0 flex flex-col items-center justify-center transition-colors",
                    isEdit
                      ? "cursor-pointer hover:bg-orange-50/50"
                      : "cursor-not-allowed",
                  )}>
                  <input
                    type="file"
                    className="hidden"
                    accept="image/*"
                    onChange={handleImageUpload}
                    disabled={!isEdit || isUploading}
                  />
                  {isUploading ? (
                    <Loader2
                      className="animate-spin text-orange-500"
                      size={24}
                    />
                  ) : (
                    <>
                      <Plus className="text-gray-400 mb-2" size={24} />
                      <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest text-center px-4">
                        {isEdit ? "Upload Photo" : "Save draft first"}
                      </span>
                    </>
                  )}
                </label>
              )}
            </div>
            {!isEdit && (
              <p className="text-[10px] text-gray-400 italic text-center">
                * Image upload is available after post creation.
              </p>
            )}
          </div>

          {/* Tags */}
          <div className="bg-white rounded-3xl border border-gray-100 p-8 shadow-sm space-y-6">
            <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2 uppercase tracking-wider">
              <TagIcon size={18} className="text-orange-500" />
              {t("tags")}
            </h3>

            {/* Inline Create Tag */}
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="New tag..."
                className="flex-1 bg-gray-50 border-none rounded-xl px-3 py-2 text-xs focus:ring-1 focus:ring-orange-200 outline-none"
                value={newTagName}
                onChange={(e) => setNewTagName(e.target.value)}
                onKeyDown={(e) =>
                  e.key === "Enter" && (e.preventDefault(), handleCreateTag())
                }
              />
              <button
                type="button"
                onClick={handleCreateTag}
                disabled={isCreatingTag || !newTagName.trim()}
                className="bg-gray-100 hover:bg-gray-200 text-gray-600 p-2 rounded-xl transition-colors disabled:opacity-50">
                {isCreatingTag ? (
                  <Loader2 size={16} className="animate-spin" />
                ) : (
                  <Plus size={16} />
                )}
              </button>
            </div>

            <div className="flex flex-wrap gap-2">
              {allTags.map((tag) => (
                <button
                  key={tag.id}
                  type="button"
                  onClick={() => {
                    const newTagIds = formData.tagIds.includes(tag.id)
                      ? formData.tagIds.filter((id) => id !== tag.id)
                      : [...formData.tagIds, tag.id];
                    setFormData({ ...formData, tagIds: newTagIds });
                  }}
                  className={cn(
                    "px-3 py-1.5 rounded-xl text-xs font-bold transition-all border flex items-center gap-2 group/tag",
                    formData.tagIds.includes(tag.id)
                      ? "bg-orange-500 border-orange-500 text-white shadow-sm"
                      : "bg-white border-gray-100 text-gray-500 hover:border-orange-200",
                  )}>
                  {tag.name}
                  <span
                    onClick={(e) => handleDeleteTag(e, tag.id)}
                    className={cn(
                      "opacity-0 group-hover/tag:opacity-100 hover:text-red-200 transition-all",
                      formData.tagIds.includes(tag.id)
                        ? "text-white/60"
                        : "text-gray-300",
                    )}>
                    <X size={12} />
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </form>
  );
}
