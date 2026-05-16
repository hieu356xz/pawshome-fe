"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";
import { useAuth } from "@/providers/AuthContext";
import { hasPermission } from "@/lib/permissions";
import { 
  LayoutDashboard, 
  Users, 
  ShieldCheck, 
  Key, 
  PawPrint, 
  Settings, 
  LogOut, 
  Home, 
  FileText, 
  MessageSquare,
  Tag,
  ClipboardList
} from "lucide-react";

interface SidebarItem {
  title: string;
  href: string;
  icon: React.ElementType;
  permission?: string;
}

export function AdminSidebar() {
  const t = useTranslations("AdminSidebar");
  const pathname = usePathname();
  const { user, logout } = useAuth();

  const sidebarItems: SidebarItem[] = [
    /* { 
      title: t("dashboard"), 
      href: "/admin", 
      icon: LayoutDashboard 
    }, */
    { 
      title: t("users"), 
      href: "/admin/users", 
      icon: Users,
      permission: "user:list"
    },
    { 
      title: t("roles"), 
      href: "/admin/roles", 
      icon: ShieldCheck,
      permission: "role:list"
    },
    { 
      title: t("permissions"), 
      href: "/admin/permissions", 
      icon: Key,
      permission: "permission:list"
    },
    { 
      title: t("pets"), 
      href: "/admin/pets", 
      icon: PawPrint,
      permission: "pet:list"
    },
    { 
      title: t("species"), 
      href: "/admin/species", 
      icon: ClipboardList,
      permission: "species:list"
    },
    { 
      title: t("breeds"), 
      href: "/admin/breeds", 
      icon: Tag,
      permission: "breed:list"
    },
    { 
      title: t("adoptionRequests"), 
      href: "/admin/adoption-requests", 
      icon: FileText,
      permission: "adoption-request:list"
    },
    { 
      title: t("blog"), 
      href: "/admin/blog", 
      icon: MessageSquare,
      permission: "blog:list"
    },
    { 
      title: t("community"), 
      href: "/admin/community", 
      icon: MessageSquare,
      permission: "pet-post:list"
    },
    { 
      title: t("settings"), 
      href: "/admin/settings", 
      icon: Settings 
    },
  ];

  const filteredItems = sidebarItems.filter(item => 
    !item.permission || hasPermission(user, item.permission as any)
  );

  const isActive = (href: string) => {
    // Handle locale prefix
    const pathWithoutLocale = pathname.replace(/^\/[a-z]{2}/, "") || "/";
    if (href === "/admin") return pathWithoutLocale === "/admin";
    return pathWithoutLocale.startsWith(href);
  };

  return (
    <aside className="w-64 bg-white border-r border-gray-200 flex flex-col h-screen sticky top-0 transition-all duration-300">
      <div className="p-6 flex items-center gap-3">
        <div className="w-10 h-10 bg-orange-500 rounded-xl flex items-center justify-center text-white shadow-lg shadow-orange-200">
          <PawPrint size={24} />
        </div>
        <span className="font-playfair font-bold text-xl text-gray-900 tracking-tight">PawsHome Admin</span>
      </div>

      <nav className="flex-1 px-4 py-4 space-y-1 overflow-y-auto custom-scrollbar">
        {filteredItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group",
              isActive(item.href)
                ? "bg-orange-50 text-orange-600 font-semibold shadow-sm"
                : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
            )}
          >
            <item.icon 
              size={20} 
              className={cn(
                "transition-transform duration-200 group-hover:scale-110",
                isActive(item.href) ? "text-orange-600" : "text-gray-400 group-hover:text-gray-900"
              )} 
            />
            <span>{item.title}</span>
          </Link>
        ))}
      </nav>

      <div className="p-4 border-t border-gray-100 space-y-1">
        <Link
          href="/"
          className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-500 hover:bg-gray-50 hover:text-gray-900 transition-all duration-200"
        >
          <Home size={20} />
          <span>{t("backToHome")}</span>
        </Link>
        <button
          onClick={() => logout()}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-500 hover:bg-red-50 transition-all duration-200"
        >
          <LogOut size={20} />
          <span>{t("logout")}</span>
        </button>
      </div>
    </aside>
  );
}
