"use client";

import React, { useState, useEffect } from "react";
import { PetImage } from "@/types/pet";
import { petService } from "@/services/pet.service";
import { 
  Upload, 
  Trash2, 
  Star, 
  Image as ImageIcon,
  Loader2,
  Plus
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface AdminPetGalleryProps {
  petId: string;
}

export function AdminPetGallery({ petId }: AdminPetGalleryProps) {
  const [images, setImages] = useState<PetImage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    if (petId) {
      fetchImages();
    }
  }, [petId]);

  const fetchImages = async () => {
    setIsLoading(true);
    try {
      const response = await petService.getPetImages(petId);
      setImages(response.data);
    } catch (error) {
      console.error("Failed to fetch images:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      await petService.uploadPetImage(petId, file);
      await fetchImages();
    } catch (error) {
      console.error("Upload failed:", error);
    } finally {
      setIsUploading(false);
    }
  };

  const handleDelete = async (imageId: string) => {
    if (!confirm("Are you sure you want to delete this image?")) return;
    
    try {
      await petService.deletePetImage(petId, imageId);
      setImages(images.filter(img => img.id !== imageId));
    } catch (error) {
      console.error("Delete failed:", error);
    }
  };

  const handleSetPrimary = async (imageId: string) => {
    try {
      await petService.setPrimaryImage(imageId);
      // Refresh local state to reflect new primary
      setImages(images.map(img => ({
        ...img,
        isPrimary: img.id === imageId
      })));
    } catch (error) {
      console.error("Set primary failed:", error);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 text-orange-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {images.map((image) => (
          <div 
            key={image.id} 
            className={cn(
              "group relative aspect-square rounded-2xl overflow-hidden border-2 transition-all",
              image.isPrimary ? "border-orange-500 shadow-lg shadow-orange-100" : "border-gray-100"
            )}
          >
            <img 
              src={image.imageUrl} 
              alt="Pet" 
              className="w-full h-full object-cover"
            />
            
            {/* Overlay Actions */}
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
              <button
                type="button"
                onClick={() => handleSetPrimary(image.id)}
                className={cn(
                  "p-2 rounded-full transition-all",
                  image.isPrimary ? "bg-orange-500 text-white" : "bg-white/20 text-white hover:bg-white/40"
                )}
                title="Set as Primary"
              >
                <Star size={18} fill={image.isPrimary ? "currentColor" : "none"} />
              </button>
              <button
                type="button"
                onClick={() => handleDelete(image.id)}
                className="p-2 rounded-full bg-red-500/80 text-white hover:bg-red-500 transition-all"
                title="Delete Image"
              >
                <Trash2 size={18} />
              </button>
            </div>

            {image.isPrimary && (
              <div className="absolute top-2 left-2 px-2 py-1 bg-orange-500 text-white text-[10px] font-bold rounded-lg shadow-sm uppercase tracking-tighter">
                Primary
              </div>
            )}
          </div>
        ))}

        {/* Upload Button Card */}
        <label className={cn(
          "aspect-square rounded-2xl border-2 border-dashed border-gray-200 bg-gray-50 flex flex-col items-center justify-center cursor-pointer hover:border-orange-200 hover:bg-orange-50/30 transition-all group",
          isUploading && "pointer-events-none opacity-50"
        )}>
          <input 
            type="file" 
            className="hidden" 
            accept="image/*"
            onChange={handleUpload}
          />
          {isUploading ? (
            <Loader2 className="w-8 h-8 text-orange-500 animate-spin" />
          ) : (
            <>
              <div className="w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center text-gray-400 group-hover:text-orange-500 transition-colors">
                <Plus size={20} />
              </div>
              <span className="text-[10px] font-bold text-gray-400 mt-2 uppercase tracking-widest">Upload Photo</span>
            </>
          )}
        </label>
      </div>

      {images.length === 0 && !isUploading && (
        <div className="py-12 text-center bg-gray-50 rounded-3xl border-2 border-dashed border-gray-100">
          <div className="w-12 h-12 bg-white rounded-2xl shadow-sm flex items-center justify-center text-gray-300 mx-auto mb-4">
            <ImageIcon size={24} />
          </div>
          <p className="text-gray-400 text-sm">No photos uploaded yet.</p>
        </div>
      )}
    </div>
  );
}
