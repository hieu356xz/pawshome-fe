import { apiClient } from '@/lib/api-client';
import { ApiResponse } from '@/types/common';
import { Breed } from '@/types/pet';

export const breedService = {
  getAll: async (params?: any): Promise<ApiResponse<Breed[]>> => {
    return apiClient.get('/breeds', { params });
  },

  getById: async (id: number): Promise<ApiResponse<Breed>> => {
    return apiClient.get(`/breeds/${id}`);
  },

  // Admin
  create: async (data: Partial<Breed>): Promise<ApiResponse<Breed>> => {
    return apiClient.post('/breeds', data);
  },

  update: async (id: number, data: Partial<Breed>): Promise<ApiResponse<Breed>> => {
    return apiClient.patch(`/breeds/${id}`, data);
  },

  delete: async (id: number): Promise<ApiResponse<void>> => {
    return apiClient.delete(`/breeds/${id}`);
  },
};
