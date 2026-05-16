"use client";

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { petPostService } from "@/services/pet-post.service";
import { PetPost } from "@/types/post";
import { PetPostForm } from "@/components/admin/PetPostForm";
import { Loader2 } from "lucide-react";

export default function EditCommunityPostPage() {
  const { id } = useParams();
  const [post, setPost] = useState<PetPost | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (id) {
      fetchPost(id as string);
    }
  }, [id]);

  const fetchPost = async (postId: string) => {
    try {
      const response = await petPostService.getPostById(postId);
      setPost(response.data);
    } catch (error) {
      console.error("Failed to fetch post:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <Loader2 className="w-10 h-10 text-orange-500 animate-spin" />
      </div>
    );
  }

  if (!post) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-bold text-gray-900">Post not found</h2>
      </div>
    );
  }

  return <PetPostForm initialData={post} isEdit />;
}
