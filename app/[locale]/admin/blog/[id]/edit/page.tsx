"use client";

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { blogService } from "@/services/blog.service";
import { BlogPost } from "@/types/post";
import { BlogForm } from "@/components/admin/BlogForm";
import { Loader2 } from "lucide-react";

export default function EditBlogPostPage() {
  const { id } = useParams();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (id) {
      fetchPost(id as string);
    }
  }, [id]);

  const fetchPost = async (postId: string) => {
    try {
      const response = await blogService.getPostById(postId);
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

  return <BlogForm initialData={post} isEdit />;
}
