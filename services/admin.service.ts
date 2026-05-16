import { apiClient } from '@/lib/api-client';
import { ApiResponse } from '@/types/common';
import { Role, Permission } from '@/types/auth';

export const adminService = {
  // Role Management
  getRoles: async (params?: any): Promise<ApiResponse<Role[]>> => {
    return apiClient.get('/role', { params });
  },
  getRoleById: async (id: number): Promise<ApiResponse<Role>> => {
    return apiClient.get(`/role/${id}`);
  },
  createRole: async (data: Partial<Role>): Promise<ApiResponse<Role>> => {
    return apiClient.post('/role', data);
  },
  updateRole: async (id: number, data: Partial<Role>): Promise<ApiResponse<Role>> => {
    return apiClient.patch(`/role/${id}`, data);
  },
  deleteRole: async (id: number): Promise<ApiResponse<void>> => {
    return apiClient.delete(`/role/${id}`);
  },
  assignPermissionsToRole: async (roleId: number, permissionIds: number[]): Promise<ApiResponse<Role>> => {
    return apiClient.post(`/role/${roleId}/permissions`, { permissionIds });
  },

  // Permission Management
  getPermissions: async (params?: any): Promise<ApiResponse<Permission[]>> => {
    return apiClient.get('/permission', { params });
  },
  getPermissionById: async (id: number): Promise<ApiResponse<Permission>> => {
    return apiClient.get(`/permission/${id}`);
  },
  createPermission: async (data: Partial<Permission>): Promise<ApiResponse<Permission>> => {
    return apiClient.post('/permission', data);
  },
  updatePermission: async (id: number, data: Partial<Permission>): Promise<ApiResponse<Permission>> => {
    return apiClient.patch(`/permission/${id}`, data);
  },
  deletePermission: async (id: number): Promise<ApiResponse<void>> => {
    return apiClient.delete(`/permission/${id}`);
  },

  // Policy Management
  getPolicies: async (params?: any): Promise<ApiResponse<any[]>> => {
    return apiClient.get('/policy', { params });
  },
  createPolicy: async (data: any): Promise<ApiResponse<any>> => {
    return apiClient.post('/policy', data);
  },
  updatePolicy: async (roleId: number, permissionId: number, data: any): Promise<ApiResponse<any>> => {
    return apiClient.patch(`/policy/${roleId}/${permissionId}`, data);
  },
  deletePolicy: async (roleId: number, permissionId: number): Promise<ApiResponse<void>> => {
    return apiClient.delete(`/policy/${roleId}/${permissionId}`);
  },
};
