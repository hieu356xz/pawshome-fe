"use client";

import React, { useState } from "react";
import { useTranslations } from "next-intl";
import { PetPost, PostType, PostStatus } from "@/types/post";
import { petPostService } from "@/services/pet-post.service";
import {
  FileText,
  Type,
  MapPin,
  Phone,
  Image as ImageIcon,
  Save,
  Loader2,
  Plus,
  Trash2,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { AdminFormField } from "./form/AdminFormField";
import { AdminFormSection } from "./form/AdminFormSection";
import { AdminFormHeader } from "./form/AdminFormHeader";
import { AdminFormSelect } from "./form/AdminFormSelect";
import { AdminFormTextArea } from "./form/AdminFormTextArea";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface PetPostFormProps {
  initialData?: PetPost;
  isEdit?: boolean;
}

export function PetPostForm({ initialData, isEdit = false }: PetPostFormProps) {
  const t = useTranslations("CommunityManagement");
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const [formData, setFormData] = useState({
    title: initialData?.title || "",
    description: initialData?.description || "",
    postType: initialData?.postType || PostType.LOST,
    postStatus: initialData?.postStatus || PostStatus.ACTIVE,
    location: initialData?.location || "",
    contact: initialData?.contact || "",
  });

  const [images, setImages] = useState(initialData?.images || []);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !initialData?.id) return;

    setIsUploading(true);
    try {
      const response = await petPostService.uploadImage(initialData.id, file);
      setImages([...images, response.data]);
    } catch (error) {
      console.error("Upload failed:", error);
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemoveImage = async (imageId: string) => {
    if (!initialData?.id) return;
    try {
      await petPostService.deleteImage(initialData.id, imageId);
      setImages(images.filter((img) => img.id !== imageId));
    } catch (error) {
      console.error("Failed to remove image:", error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      if (isEdit && initialData?.id) {
        await petPostService.updatePost(initialData.id, formData);
      } else {
        // Strip postStatus as backend create DTO doesn't allow it
        const { postStatus, ...createData } = formData;
        const response = await petPostService.createPost(createData);
        router.push(`/admin/community/${response.data.id}/edit`);
        return;
      }
      router.push("/admin/community");
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
        backUrl="/admin/community"
        backLabel={t("title")}
        submitLabel={isEdit ? t("updatePost") : t("save")}
        isLoading={isLoading}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          {/* Main Info */}
          <AdminFormSection title={t("title")} icon={<FileText size={20} />}>
            <div className="space-y-6">
              <AdminFormField
                id="title"
                label={t("postTitle")}
                placeholder="Enter title..."
                icon={<Type size={18} />}
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                required
              />

              <div className={cn("grid gap-6", isEdit ? "grid-cols-1 md:grid-cols-2" : "grid-cols-1")}>
                <AdminFormSelect
                  id="postType"
                  label={t("postType")}
                  options={[
                    { label: t("PostTypes.lost"), value: PostType.LOST },
                    { label: t("PostTypes.found"), value: PostType.FOUND },
                  ]}
                  value={formData.postType}
                  onChange={(e) =>
                    setFormData({ ...formData, postType: e.target.value as any })
                  }
                  required
                />
                {isEdit && (
                  <AdminFormSelect
                    id="postStatus"
                    label={t("status")}
                    options={[
                      { label: t("PostStatuses.active"), value: PostStatus.ACTIVE },
                      { label: t("PostStatuses.closed"), value: PostStatus.CLOSED },
                    ]}
                    value={formData.postStatus}
                    onChange={(e) =>
                      setFormData({ ...formData, postStatus: e.target.value as any })
                    }
                    required
                  />
                )}
              </div>
            </div>
          </AdminFormSection>

          {/* Description */}
          <AdminFormSection title={t("description")} icon={<FileText size={20} />}>
            <AdminFormTextArea
              id="description"
              label={t("description")}
              placeholder="Detailed description..."
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              className="min-h-[200px]"
            />
          </AdminFormSection>

          {/* Contact & Location */}
          <AdminFormSection title={t("location")} icon={<MapPin size={20} />}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <AdminFormField
                id="location"
                label={t("location")}
                placeholder="Where was the pet seen?"
                icon={<MapPin size={18} />}
                value={formData.location}
                onChange={(e) =>
                  setFormData({ ...formData, location: e.target.value })
                }
              />
              <AdminFormField
                id="contact"
                label={t("contact")}
                placeholder="Phone number or social link..."
                icon={<Phone size={18} />}
                value={formData.contact}
                onChange={(e) =>
                  setFormData({ ...formData, contact: e.target.value })
                }
                required
              />
            </div>
          </AdminFormSection>
        </div>

        {/* Sidebar */}
        <div className="space-y-8">
          {/* Images */}
          <div className="bg-white rounded-3xl border border-gray-100 p-8 shadow-sm space-y-6">
            <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2 uppercase tracking-wider">
              <ImageIcon size={18} className="text-orange-500" />
              {t("images")}
            </h3>

            <div className="grid grid-cols-2 gap-4">
              {images.map((img) => (
                <div key={img.id} className="relative aspect-square rounded-xl overflow-hidden group">
                  <img src={img.imageUrl} alt="" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <button
                      type="button"
                      onClick={() => handleRemoveImage(img.id)}
                      className="p-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors">
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              ))}

              <label
                className={cn(
                  "aspect-square rounded-xl border-2 border-dashed border-gray-100 flex flex-col items-center justify-center transition-all",
                  isEdit ? "cursor-pointer hover:bg-orange-50/50 hover:border-orange-200" : "opacity-60 cursor-not-allowed"
                )}>
                <input
                  type="file"
                  className="hidden"
                  accept="image/*"
                  disabled={!isEdit || isUploading}
                  onChange={handleImageUpload}
                />
                {isUploading ? (
                  <Loader2 className="animate-spin text-orange-500" size={20} />
                ) : (
                  <>
                    <Plus className="text-gray-400 mb-1" size={20} />
                    <span className="text-[10px] font-bold text-gray-400 uppercase">
                      {isEdit ? "Add" : "Save first"}
                    </span>
                  </>
                )}
              </label>
            </div>
            {!isEdit && (
              <p className="text-[10px] text-gray-400 italic text-center">
                * Image upload is available after creation.
              </p>
            )}
          </div>
        </div>
      </div>
    </form>
  );
}
