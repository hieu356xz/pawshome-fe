"use client";

import React from "react";
import { useTranslations } from "next-intl";
import { useAuth } from "@/providers/AuthContext";
import { 
  ShieldCheck, 
  ArrowRight,
  Settings,
  Users,
  PawPrint
} from "lucide-react";
import Link from "next/link";

export default function AdminDashboardPage() {
  const t = useTranslations("Admin");
  const { user } = useAuth();

  const quickLinks = [
    { title: t("users"), href: "/admin/users", icon: Users, color: "bg-blue-500" },
    { title: t("pets"), href: "/admin/pets", icon: PawPrint, color: "bg-orange-500" },
    { title: t("settings"), href: "/admin/settings", icon: Settings, color: "bg-gray-500" },
  ];

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center text-center px-4">
      <div className="w-20 h-20 bg-orange-100 rounded-3xl flex items-center justify-center text-orange-600 mb-8 animate-bounce">
        <ShieldCheck size={40} />
      </div>
      
      <h1 className="text-4xl font-playfair font-bold text-gray-900 mb-4">
        {t("welcome", { name: user?.fullName || 'Admin' })}
      </h1>
      
      <p className="text-gray-500 max-w-lg mx-auto font-lato text-lg mb-12">
        Welcome to the PawsHome Management System. Please select a module from the sidebar or use the quick links below to get started.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-3xl">
        {quickLinks.map((link) => (
          <Link 
            key={link.href}
            href={link.href}
            className="group p-6 bg-white border border-gray-100 rounded-3xl shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 text-left"
          >
            <div className={`w-12 h-12 ${link.color} rounded-2xl flex items-center justify-center text-white mb-4 shadow-lg shadow-gray-200`}>
              <link.icon size={24} />
            </div>
            <h3 className="font-bold text-gray-900 group-hover:text-orange-600 transition-colors">{link.title}</h3>
            <p className="text-sm text-gray-400 mt-1 flex items-center gap-1">
              Manage now <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
}
