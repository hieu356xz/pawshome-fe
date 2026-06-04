import { apiClient } from '@/lib/api-client';
import { ApiResponse } from '@/types/common';
import {
  Donation,
  DonationStats,
  CreateDonationPayload,
  CreateDonationResponse,
} from '@/types/donation';

export const donationService = {
  create: async (data: CreateDonationPayload): Promise<ApiResponse<CreateDonationResponse>> => {
    return apiClient.post('/donations', data);
  },

  getStats: async (): Promise<ApiResponse<DonationStats>> => {
    return apiClient.get('/donations/stats');
  },

  getAll: async (params?: any): Promise<ApiResponse<Donation[]>> => {
    return apiClient.get('/donations', { params });
  },

  getById: async (orderCode: number): Promise<ApiResponse<Donation>> => {
    return apiClient.get(`/donations/${orderCode}`);
  },

  cancel: async (orderCode: number, reason?: string): Promise<ApiResponse<{ success: boolean; status: string }>> => {
    return apiClient.post(`/donations/${orderCode}/cancel`, { reason });
  },
};
