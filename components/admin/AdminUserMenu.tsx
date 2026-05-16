"use client";

import React from "react";
import { useAuth } from "@/providers/AuthContext";
import { useTranslations } from "next-intl";
import { LogOut, User, Settings, ChevronDown } from "lucide-react";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger,
  DropdownMenuSeparator
} from "@/components/ui/dropdown-menu";

export function AdminUserMenu() {
  const { user, logout } = useAuth();
  const t = useTranslations("Admin");

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="flex items-center gap-3 hover:bg-gray-50 p-1.5 rounded-2xl transition-all cursor-pointer outline-none border-none">
        <div className="w-10 h-10 rounded-xl overflow-hidden bg-orange-100 flex items-center justify-center text-orange-600 font-bold border-2 border-orange-50 shadow-sm">
          {user?.avatarUrl ? (
            <img src={user.avatarUrl} alt={user.fullName} className="w-full h-full object-cover" />
          ) : (
            user?.fullName?.charAt(0) || "A"
          )}
        </div>
        <div className="text-left hidden sm:block">
          <p className="text-sm font-semibold text-gray-900 leading-none">{user?.fullName}</p>
          <p className="text-xs text-gray-400 mt-1 uppercase tracking-wider font-medium">
            {user?.roles?.[0]?.name || "Staff"}
          </p>
        </div>
        <ChevronDown size={16} className="text-gray-400 ml-1" />
      </DropdownMenuTrigger>
      
      <DropdownMenuContent align="end" className="w-64 mt-2 rounded-2xl p-2 border-gray-100 shadow-2xl bg-white z-50">
        <div className="px-3 py-3 mb-1">
          <p className="text-xs text-gray-400 uppercase tracking-widest font-bold mb-1">{t("myAccount")}</p>
          <p className="text-sm font-bold text-gray-900">{user?.fullName}</p>
          <p className="text-xs text-gray-500 truncate mt-0.5">{user?.email}</p>
        </div>
        
        <DropdownMenuSeparator className="bg-gray-50 mx-1" />
        
        <DropdownMenuItem className="rounded-xl focus:bg-orange-50 focus:text-orange-600 cursor-pointer py-2.5 px-3 flex items-center gap-2 outline-none">
          <User size={18} />
          <span className="font-medium text-sm">{t("profile")}</span>
        </DropdownMenuItem>
        
        <DropdownMenuItem className="rounded-xl focus:bg-orange-50 focus:text-orange-600 cursor-pointer py-2.5 px-3 flex items-center gap-2 outline-none">
          <Settings size={18} />
          <span className="font-medium text-sm">{t("systemPreferences")}</span>
        </DropdownMenuItem>
        
        <DropdownMenuSeparator className="bg-gray-50 mx-1" />
        
        <DropdownMenuItem 
          onClick={() => logout()}
          className="rounded-xl focus:bg-red-50 focus:text-red-600 text-red-500 cursor-pointer py-2.5 px-3 flex items-center gap-2 outline-none"
        >
          <LogOut size={18} />
          <span className="font-medium text-sm">{t("logout")}</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
