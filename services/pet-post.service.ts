import { apiClient } from '@/lib/api-client';
import { ApiResponse } from '@/types/common';
import { PetPost, PetPostQuery, Comment } from '@/types/post';

export const petPostService = {
  getPosts: async (params?: PetPostQuery): Promise<ApiResponse<PetPost[]>> => {
    return apiClient.get('/pet-posts', { params });
  },

  getPostById: async (id: string | number): Promise<ApiResponse<PetPost>> => {
    return apiClient.get(`/pet-posts/${id}`);
  },

  createPost: async (data: any): Promise<ApiResponse<PetPost>> => {
    return apiClient.post('/pet-posts', data);
  },

  updatePost: async (id: string | number, data: any): Promise<ApiResponse<PetPost>> => {
    return apiClient.put(`/pet-posts/${id}`, data);
  },

  updateStatus: async (id: string | number, status: string): Promise<ApiResponse<any>> => {
    return apiClient.put(`/pet-posts/${id}/status`, { status });
  },

  deletePost: async (id: string | number): Promise<ApiResponse<void>> => {
    return apiClient.delete(`/pet-posts/${id}`);
  },

  search: async (params: any, file?: File): Promise<ApiResponse<PetPost[]>> => {
    if (file) {
      const formData = new FormData();
      formData.append('image', file);
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          formData.append(key, String(value));
        }
      });
      return apiClient.post('/pet-posts/search', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
    }
    return apiClient.get('/pet-posts/search', { params });
  },

  // Images
  getImages: async (postId: string | number): Promise<ApiResponse<any[]>> => {
    return apiClient.get(`/pet-posts/${postId}/images`);
  },

  uploadImage: async (postId: string | number, file: File): Promise<ApiResponse<any>> => {
    const formData = new FormData();
    formData.append('image', file);
    return apiClient.post(`/pet-posts/${postId}/images`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },

  deleteImage: async (postId: string | number, imageId: string | number): Promise<ApiResponse<void>> => {
    return apiClient.delete(`/pet-posts/${postId}/images/${imageId}`);
  },

  // Comments
  getComments: async (postId: number | string): Promise<ApiResponse<Comment[]>> => {
    return apiClient.get(`/pet-posts/${postId}/comments`);
  },

  addComment: async (postId: number | string, content: string, parentId?: string | number): Promise<ApiResponse<Comment>> => {
    return apiClient.post(`/pet-posts/${postId}/comments`, { content, parentId });
  },

  updateComment: async (postId: number | string, commentId: string | number, content: string): Promise<ApiResponse<Comment>> => {
    return apiClient.put(`/pet-posts/${postId}/comments/${commentId}`, { content });
  },

  deleteComment: async (postId: number | string, commentId: string | number): Promise<ApiResponse<void>> => {
    return apiClient.delete(`/pet-posts/${postId}/comments/${commentId}`);
  },
};
