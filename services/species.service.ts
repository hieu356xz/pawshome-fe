import { apiClient } from '@/lib/api-client';
import { ApiResponse } from '@/types/common';
import { Species } from '@/types/pet';

export const speciesService = {
  getAll: async (params?: any): Promise<ApiResponse<Species[]>> => {
    return apiClient.get('/species', { params });
  },

  getById: async (id: number): Promise<ApiResponse<Species>> => {
    return apiClient.get(`/species/${id}`);
  },

  // Admin
  create: async (data: Partial<Species>): Promise<ApiResponse<Species>> => {
    return apiClient.post('/species', data);
  },

  update: async (id: number, data: Partial<Species>): Promise<ApiResponse<Species>> => {
    return apiClient.patch(`/species/${id}`, data);
  },

  delete: async (id: number): Promise<ApiResponse<void>> => {
    return apiClient.delete(`/species/${id}`);
  },
};
