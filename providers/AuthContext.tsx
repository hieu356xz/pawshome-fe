"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { User } from "@/types/auth";
import { authService } from "@/services/auth.service";

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (user: User) => void;
  logout: () => void;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const refreshUser = async () => {
    const token = localStorage.getItem("access_token");
    if (!token) {
      setUser(null);
      setIsLoading(false);
      return;
    }

    try {
      const response = await authService.getMe();
      setUser(response.data);
    } catch (error: any) {
      console.error("Failed to fetch user:", error);
      // Chỉ xóa token nếu là lỗi xác thực (401/403)
      if (error.response?.status === 401 || error.response?.status === 403) {
        localStorage.removeItem("access_token");
        setUser(null);
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // Check for token in URL (Social Login callback)
    const urlParams = new URLSearchParams(window.location.search);
    const tokenFromUrl = urlParams.get("access_token");
    
    if (tokenFromUrl) {
      localStorage.setItem("access_token", tokenFromUrl);
      // Clean up URL
      window.history.replaceState({}, document.title, window.location.pathname);
    }
    
    refreshUser();
  }, [pathname]);

  const login = (userData: User) => {
    setUser(userData);
  };

  const logout = async () => {
    try {
      await authService.logout();
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      setUser(null);
      localStorage.removeItem("access_token");
    }
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, logout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
