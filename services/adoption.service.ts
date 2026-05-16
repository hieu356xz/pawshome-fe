import { apiClient } from '@/lib/api-client';
import { ApiResponse } from '@/types/common';

export interface CreateAdoptionRequest {
  applicantName: string;
  email: string;
  phone?: string;
  address?: string;
  reason: string;
  experience?: string;
  hasOtherPets?: boolean;
  otherPetsDetail?: string;
  livingSituation?: string;
  hasYard?: boolean;
  commitment?: string;
}

export const adoptionService = {
  submitRequest: async (petId: number, data: CreateAdoptionRequest): Promise<ApiResponse<any>> => {
    return apiClient.post(`/pets/${petId}/adoption-requests`, data);
  },

  getMyRequests: async (): Promise<ApiResponse<any[]>> => {
    return apiClient.get('/adoption-requests/my-requests');
  },

  getAllRequests: async (params?: any): Promise<ApiResponse<any[]>> => {
    return apiClient.get('/adoption-requests', { params });
  },

  getRequestDetails: async (petId: number, id: number): Promise<ApiResponse<any>> => {
    return apiClient.get(`/pets/${petId}/adoption-requests/${id}`);
  },

  reviewRequest: async (petId: number, id: number, data: any): Promise<ApiResponse<any>> => {
    return apiClient.put(`/pets/${petId}/adoption-requests/${id}/review`, data);
  },
};
