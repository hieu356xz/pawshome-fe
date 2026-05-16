import { apiClient } from "@/lib/api-client";
import { ApiResponse } from "@/types/common";
import { BlogPost, Comment, Tag } from "@/types/post";

export const blogService = {
  getPosts: async (params?: any): Promise<ApiResponse<BlogPost[]>> => {
    return apiClient.get("/blog", { params });
  },

  getPostById: async (idOrSlug: string): Promise<ApiResponse<BlogPost>> => {
    return apiClient.get(`/blog/${idOrSlug}`);
  },

  // Tag Management
  getTags: async (): Promise<ApiResponse<Tag[]>> => {
    return apiClient.get("/blog-tags");
  },

  createTag: async (data: { name: string }): Promise<ApiResponse<Tag>> => {
    return apiClient.post("/blog-tags", data);
  },

  updateTag: async (
    id: number,
    data: { name: string },
  ): Promise<ApiResponse<Tag>> => {
    return apiClient.put(`/blog-tags/${id}`, data);
  },

  deleteTag: async (id: number): Promise<ApiResponse<void>> => {
    return apiClient.delete(`/blog-tags/${id}`);
  },

  // Management (Staff/Admin)
  createPost: async (data: any): Promise<ApiResponse<BlogPost>> => {
    return apiClient.post("/blog", data);
  },

  updatePost: async (id: string, data: any): Promise<ApiResponse<BlogPost>> => {
    return apiClient.put(`/blog/${id}`, data);
  },

  deletePost: async (id: string): Promise<ApiResponse<void>> => {
    return apiClient.delete(`/blog/${id}`);
  },

  uploadFeaturedImage: async (
    postId: string,
    file: File,
  ): Promise<ApiResponse<any>> => {
    const formData = new FormData();
    formData.append("image", file);
    return apiClient.post(`/blog/${postId}/featured-image`, formData);
  },

  removeFeaturedImage: async (postId: string): Promise<ApiResponse<void>> => {
    return apiClient.delete(`/blog/${postId}/featured-image`);
  },

  updateTags: async (
    postId: string,
    tagIds: number[],
  ): Promise<ApiResponse<void>> => {
    return apiClient.put(`/blog/${postId}/tags`, { tagIds });
  },

  // Comments
  getComments: async (postId: string): Promise<ApiResponse<Comment[]>> => {
    return apiClient.get(`/blog/${postId}/comments`);
  },

  addComment: async (
    postId: string,
    content: string,
    parentId?: string,
  ): Promise<ApiResponse<Comment>> => {
    return apiClient.post(`/blog/${postId}/comments`, { content, parentId });
  },

  updateComment: async (
    postId: string,
    commentId: string,
    content: string,
  ): Promise<ApiResponse<Comment>> => {
    return apiClient.put(`/blog/${postId}/comments/${commentId}`, { content });
  },

  deleteComment: async (
    postId: string,
    commentId: string,
  ): Promise<ApiResponse<void>> => {
    return apiClient.delete(`/blog/${postId}/comments/${commentId}`);
  },
};
