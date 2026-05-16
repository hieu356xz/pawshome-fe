import { apiClient } from '@/lib/api-client';
import { ApiResponse } from '@/types/common';
import { User } from '@/types/auth';

export interface UpdateUserDto {
  fullName?: string;
  bio?: string;
  phoneNumber?: string;
  address?: string;
  avatarUrl?: string;
}

export const userService = {
  updateProfile: async (id: number, data: UpdateUserDto): Promise<ApiResponse<User>> => {
    return apiClient.patch(`/user/${id}`, data);
  },

  assignRoles: async (id: number, roleIds: number[]): Promise<ApiResponse<User>> => {
    return apiClient.post(`/user/${id}/roles`, { roleIds });
  },

  getUsers: async (params?: any): Promise<ApiResponse<User[]>> => {
    return apiClient.get('/user', { params });
  },

  getUserById: async (id: number): Promise<ApiResponse<User>> => {
    return apiClient.get(`/user/${id}`);
  },
};
