import { apiClient } from "@/lib/api-client";
import { AuthResponse, LoginDto, RegisterDto, User } from "@/types/auth";
import { ApiResponse } from "@/types/common";

export const authService = {
  login: async (data: LoginDto): Promise<ApiResponse<AuthResponse>> => {
    const response = await apiClient.post<any, ApiResponse<AuthResponse>>("/auth/login", data, {
      skipToast: true,
    });
    if (response.data.tokens?.accessToken) {
      localStorage.setItem("access_token", response.data.tokens.accessToken);
    }
    return response;
  },

  register: async (data: RegisterDto): Promise<ApiResponse<User>> => {
    return apiClient.post("/auth/register", data);
  },

  logout: async (): Promise<ApiResponse<void>> => {
    const response = await apiClient.post<any, ApiResponse<void>>("/auth/logout");
    localStorage.removeItem("access_token");
    return response;
  },

  getMe: async (): Promise<ApiResponse<User>> => {
    return apiClient.get("/auth/me");
  },

  forgotPassword: async (email: string): Promise<ApiResponse<void>> => {
    return apiClient.post("/auth/forgot-password", { email });
  },

  resetPassword: async (
    token: string,
    password: string,
  ): Promise<ApiResponse<void>> => {
    return apiClient.post("/auth/reset-password", { token, password });
  },

  changePassword: async (data: any): Promise<ApiResponse<any>> => {
    return apiClient.post("/auth/change-password", data, { skipToast: true });
  },
};
