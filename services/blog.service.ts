import { apiClient } from '@/lib/api-client';
import { ApiResponse } from '@/types/common';
import { BlogPost, Comment } from '@/types/post';

export const blogService = {
  getPosts: async (params?: any): Promise<ApiResponse<BlogPost[]>> => {
    return apiClient.get('/blog', { params });
  },

  getPostById: async (idOrSlug: string | number): Promise<ApiResponse<BlogPost>> => {
    return apiClient.get(`/blog/${idOrSlug}`);
  },

  getTags: async (): Promise<ApiResponse<string[]>> => {
    return apiClient.get('/blog/tags');
  },

  // Management (Staff/Admin)
  createPost: async (data: any): Promise<ApiResponse<BlogPost>> => {
    return apiClient.post('/blog', data);
  },

  updatePost: async (id: number, data: any): Promise<ApiResponse<BlogPost>> => {
    return apiClient.put(`/blog/${id}`, data);
  },

  deletePost: async (id: number): Promise<ApiResponse<void>> => {
    return apiClient.delete(`/blog/${id}`);
  },

  uploadFeaturedImage: async (postId: number, file: File): Promise<ApiResponse<any>> => {
    const formData = new FormData();
    formData.append('image', file);
    return apiClient.post(`/blog/${postId}/featured-image`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },

  removeFeaturedImage: async (postId: number): Promise<ApiResponse<void>> => {
    return apiClient.delete(`/blog/${postId}/featured-image`);
  },

  updateTags: async (postId: number, tagIds: number[]): Promise<ApiResponse<void>> => {
    return apiClient.put(`/blog/${postId}/tags`, { tagIds });
  },

  // Comments
  getComments: async (postId: number | string): Promise<ApiResponse<Comment[]>> => {
    return apiClient.get(`/blog/${postId}/comments`);
  },

  addComment: async (postId: number | string, content: string, parentId?: number): Promise<ApiResponse<Comment>> => {
    return apiClient.post(`/blog/${postId}/comments`, { content, parentId });
  },

  updateComment: async (postId: number | string, commentId: number, content: string): Promise<ApiResponse<Comment>> => {
    return apiClient.put(`/blog/${postId}/comments/${commentId}`, { content });
  },

  deleteComment: async (postId: number | string, commentId: number): Promise<ApiResponse<void>> => {
    return apiClient.delete(`/blog/${postId}/comments/${commentId}`);
  },
};
