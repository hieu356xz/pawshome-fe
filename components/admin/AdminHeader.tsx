"use client";

import { useTranslations, useLocale } from "next-intl";
import { Bell, Search, Languages } from "lucide-react";
import { usePathname, useRouter } from "@/lib/navigation";
import { AdminUserMenu } from "./AdminUserMenu";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

export function AdminHeader() {
  const t = useTranslations("AdminHeader");
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();

  const toggleLocale = (newLocale: "en" | "vi") => {
    router.replace(pathname, { locale: newLocale });
  };

  return (
    <header className="h-20 bg-white border-b border-gray-100 flex items-center justify-between px-8 sticky top-0 z-10">
      <div className="flex items-center gap-4 bg-gray-50 px-4 py-2 rounded-2xl w-96 group focus-within:ring-2 focus-within:ring-orange-200 transition-all">
        {/* <Search
          size={18}
          className="text-gray-400 group-focus-within:text-orange-500"
        />
        <input
          type="text"
          placeholder="Search something..."
          className="bg-transparent border-none outline-none w-full text-sm text-gray-600 placeholder:text-gray-400"
        /> */}
      </div>

      <div className="flex items-center gap-6">
        <DropdownMenu>
          <DropdownMenuTrigger className="flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-gray-50 transition-all text-gray-500 hover:text-orange-600 outline-none border-none cursor-pointer">
            <Languages size={20} />
            <span className="font-bold text-xs uppercase tracking-widest">
              {locale}
            </span>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            className="bg-white border-gray-100 rounded-2xl shadow-xl p-2 z-50">
            <DropdownMenuItem
              onClick={() => toggleLocale("en")}
              className={cn(
                "rounded-xl focus:bg-orange-50 focus:text-orange-600 cursor-pointer py-2 px-3 flex items-center gap-2 outline-none mb-1",
                locale === "en" && "bg-orange-50 text-orange-600 font-bold",
              )}>
              English
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => toggleLocale("vi")}
              className={cn(
                "rounded-xl focus:bg-orange-50 focus:text-orange-600 cursor-pointer py-2 px-3 flex items-center gap-2 outline-none",
                locale === "vi" && "bg-orange-50 text-orange-600 font-bold",
              )}>
              Tiếng Việt
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <div className="h-10 w-[1px] bg-gray-100 mx-2"></div>

        <AdminUserMenu />
      </div>
    </header>
  );
}
