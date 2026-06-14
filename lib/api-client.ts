import axios from "axios";
import { toast } from "@/components/ui/toast";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

// Extend AxiosRequestConfig to include custom properties
declare module "axios" {
  export interface AxiosRequestConfig {
    skipToast?: boolean;
  }
}

export const apiClient = axios.create({
  baseURL: BASE_URL,
  withCredentials: true, // Required for cookies (refresh tokens)
});

// Request interceptor for adding auth token
apiClient.interceptors.request.use(
  (config) => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("access_token");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

// Response interceptor for handling token refresh or errors
apiClient.interceptors.response.use(
  (response) => response.data, // Flatten NestJS ResponseInterceptor if needed
  async (error) => {
    const originalRequest = error.config;

    // Handle 401 Unauthorized (Token expired)
    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      originalRequest.url !== "/auth/login" &&
      originalRequest.url !== "/auth/register" &&
      originalRequest.url !== "/auth/change-password"
    ) {
      originalRequest._retry = true;

      try {
        // Attempt to refresh token
        const response = await axios.post(
          `${BASE_URL}/auth/refresh`,
          {},
          {
            withCredentials: true,
          },
        );

        // Handle both wrapped and unwrapped responses
        const data = response.data;
        const accessToken = data.tokens?.accessToken || data.accessToken;

        if (!accessToken) {
          throw new Error("No access token received");
        }

        if (typeof window !== "undefined") {
          localStorage.setItem("access_token", accessToken);
        }

        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        return apiClient(originalRequest);
      } catch (refreshError) {
        console.error("Refresh token failed:", refreshError);
        // Logout user if refresh fails
        if (typeof window !== "undefined") {
          localStorage.removeItem("access_token");
          // Optional: redirect to login
          // window.location.href = '/login';
        }
        return Promise.reject(refreshError);
      }
    }

    const errorMessage =
      error.response?.data?.message || error.response?.data || error.message;

    // Auto-toast for mutations (POST, PATCH, PUT, DELETE)
    const method = error.config?.method?.toUpperCase();
    const isMutation = ["POST", "PATCH", "PUT", "DELETE"].includes(
      method || "",
    );
    const skipToast = error.config?.skipToast;

    if (isMutation && !skipToast) {
      const pathname =
        typeof window !== "undefined" ? window.location.pathname : "";
      const isAdmin = pathname.includes("/admin");
      const isVi = pathname.startsWith("/vi");

      const title = isAdmin
        ? isVi
          ? "Lỗi hệ thống"
          : "System Error"
        : isVi
          ? "Thao tác thất bại"
          : "Action Failed";

      toast.error(errorMessage, title);
    }

    return Promise.reject(errorMessage);
  },
);
