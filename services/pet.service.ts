import { apiClient } from '@/lib/api-client';
import { ApiResponse } from '@/types/common';
import { Pet, PetQuery, PetSearch, PetImage } from '@/types/pet';

export const petService = {
  getPets: async (params?: PetQuery): Promise<ApiResponse<Pet[]>> => {
    return apiClient.get('/pets', { params });
  },

  getPetById: async (id: string): Promise<ApiResponse<Pet>> => {
    return apiClient.get(`/pets/${id}`);
  },

  searchPets: async (data: PetSearch, file?: File): Promise<ApiResponse<Pet[]>> => {
    if (file) {
      const formData = new FormData();
      formData.append('image', file);
      Object.entries(data).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          formData.append(key, String(value));
        }
      });
      return apiClient.post('/pets/search', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
    }
    return apiClient.post('/pets/search', data);
  },

  // Management
  createPet: async (data: any): Promise<ApiResponse<Pet>> => {
    return apiClient.post('/pets', data);
  },

  updatePet: async (id: string, data: any): Promise<ApiResponse<Pet>> => {
    return apiClient.patch(`/pets/${id}`, data);
  },

  deletePet: async (id: string): Promise<ApiResponse<void>> => {
    return apiClient.delete(`/pets/${id}`);
  },

  // Medical Records
  getMedicalRecords: async (petId: string): Promise<ApiResponse<any[]>> => {
    return apiClient.get(`/pets/${petId}/medical-records`);
  },

  getUpcomingMedicalRecords: async (petId?: string): Promise<ApiResponse<any[]>> => {
    return apiClient.get('/medical-records/upcoming', { params: { petId } });
  },

  addMedicalRecord: async (petId: string, data: any): Promise<ApiResponse<any>> => {
    return apiClient.post(`/pets/${petId}/medical-records`, data);
  },

  updateMedicalRecord: async (petId: string, recordId: string, data: any): Promise<ApiResponse<any>> => {
    return apiClient.put(`/pets/${petId}/medical-records/${recordId}`, data);
  },

  deleteMedicalRecord: async (petId: string, recordId: string): Promise<ApiResponse<void>> => {
    return apiClient.delete(`/pets/${petId}/medical-records/${recordId}`);
  },

  // Images
  getPetImages: async (petId: string): Promise<ApiResponse<PetImage[]>> => {
    return apiClient.get(`/pets/${petId}/images`);
  },

  uploadPetImage: async (petId: string, file: File): Promise<ApiResponse<PetImage>> => {
    const formData = new FormData();
    formData.append('image', file);
    return apiClient.post(`/pets/${petId}/images/upload`, formData);
  },

  setPrimaryImage: async (id: string): Promise<ApiResponse<PetImage>> => {
    return apiClient.post(`/pets/images/${id}/primary`);
  },

  deletePetImage: async (petId: string, id: string): Promise<ApiResponse<void>> => {
    return apiClient.delete(`/pets/${petId}/images/${id}`);
  },

  // Advanced Image Search
  searchImagesByText: async (text: string, limit?: number): Promise<ApiResponse<any[]>> => {
    return apiClient.get('/images/search/text', { params: { text, limit } });
  },

  searchImagesByImageAndText: async (file: File, text?: string): Promise<ApiResponse<any[]>> => {
    const formData = new FormData();
    formData.append('image', file);
    if (text) formData.append('text', text);
    return apiClient.post('/images/search', formData);
  },

  searchSimilarImages: async (file: File): Promise<ApiResponse<any[]>> => {
    const formData = new FormData();
    formData.append('image', file);
    return apiClient.post('/images/search/similar', formData);
  },
};
