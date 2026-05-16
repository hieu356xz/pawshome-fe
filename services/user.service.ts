import { apiClient } from '@/lib/api-client';
import { ApiResponse } from '@/types/common';
import { User } from '@/types/auth';

export interface CreateUserDto {
  email: string;
  password?: string;
  fullName?: string;
  bio?: string;
  phoneNumber?: string;
  address?: string;
  avatarUrl?: string;
}

export interface UpdateUserDto {
  fullName?: string;
  bio?: string;
  phoneNumber?: string;
  address?: string;
  avatarUrl?: string;
}

export const userService = {
  createUser: async (data: CreateUserDto): Promise<ApiResponse<User>> => {
    return apiClient.post('/user', data);
  },

  updateUser: async (id: string, data: UpdateUserDto): Promise<ApiResponse<User>> => {
    return apiClient.patch(`/user/${id}`, data);
  },

  assignRoles: async (id: string, roleIds: string[]): Promise<ApiResponse<User>> => {
    return apiClient.post(`/user/${id}/roles`, { roleIds });
  },

  getUsers: async (params?: any): Promise<ApiResponse<User[]>> => {
    return apiClient.get('/user', { params });
  },

  getUserById: async (id: string): Promise<ApiResponse<User>> => {
    return apiClient.get(`/user/${id}`);
  },
  
  deleteUser: async (id: string): Promise<ApiResponse<void>> => {
    return apiClient.delete(`/user/${id}`);
  },

  banUser: async (id: string, reason?: string): Promise<ApiResponse<void>> => {
    return apiClient.post(`/user/${id}/ban`, { reason });
  },

  unbanUser: async (id: string): Promise<ApiResponse<void>> => {
    return apiClient.post(`/user/${id}/unban`);
  },
};
