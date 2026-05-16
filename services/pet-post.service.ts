import { apiClient } from '@/lib/api-client';
import { ApiResponse } from '@/types/common';
import { PetPost, PetPostQuery, Comment } from '@/types/post';

export const petPostService = {
  getPosts: async (params?: PetPostQuery): Promise<ApiResponse<PetPost[]>> => {
    return apiClient.get('/pet-posts', { params });
  },

  getPostById: async (id: number): Promise<ApiResponse<PetPost>> => {
    return apiClient.get(`/pet-posts/${id}`);
  },

  createPost: async (data: any): Promise<ApiResponse<PetPost>> => {
    return apiClient.post('/pet-posts', data);
  },

  updatePost: async (id: number, data: any): Promise<ApiResponse<PetPost>> => {
    return apiClient.put(`/pet-posts/${id}`, data);
  },

  updateStatus: async (id: number, status: string): Promise<ApiResponse<any>> => {
    return apiClient.put(`/pet-posts/${id}/status`, { status });
  },

  deletePost: async (id: number): Promise<ApiResponse<void>> => {
    return apiClient.delete(`/pet-posts/${id}`);
  },

  searchByImage: async (file: File): Promise<ApiResponse<PetPost[]>> => {
    const formData = new FormData();
    formData.append('image', file);
    return apiClient.post('/pet-posts/search/image', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },

  // Images
  getImages: async (postId: number): Promise<ApiResponse<any[]>> => {
    return apiClient.get(`/pet-posts/${postId}/images`);
  },

  uploadImage: async (postId: number, file: File): Promise<ApiResponse<any>> => {
    const formData = new FormData();
    formData.append('image', file);
    return apiClient.post(`/pet-posts/${postId}/images`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },

  deleteImage: async (postId: number, imageId: number): Promise<ApiResponse<void>> => {
    return apiClient.delete(`/pet-posts/${postId}/images/${imageId}`);
  },

  // Comments
  getComments: async (postId: number | string): Promise<ApiResponse<Comment[]>> => {
    return apiClient.get(`/pet-posts/${postId}/comments`);
  },

  addComment: async (postId: number | string, content: string, parentId?: number): Promise<ApiResponse<Comment>> => {
    return apiClient.post(`/pet-posts/${postId}/comments`, { content, parentId });
  },

  updateComment: async (postId: number | string, commentId: number, content: string): Promise<ApiResponse<Comment>> => {
    return apiClient.put(`/pet-posts/${postId}/comments/${commentId}`, { content });
  },

  deleteComment: async (postId: number | string, commentId: number): Promise<ApiResponse<void>> => {
    return apiClient.delete(`/pet-posts/${postId}/comments/${commentId}`);
  },
};
