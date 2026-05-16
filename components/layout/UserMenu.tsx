"use client";

import { useTranslations } from "next-intl";
import { Link, useRouter } from "@/lib/navigation";
import { User as UserIcon, LogOut, Settings, UserCircle } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { useAuth } from "@/providers/AuthContext";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";

export default function UserMenu() {
  const t = useTranslations("Navbar");
  const router = useRouter();
  const { user, logout, isLoading } = useAuth();

  const handleLogout = async () => {
    await logout();
    router.push("/login");
  };

  if (isLoading) {
    return (
      <div className="flex items-center border-l pl-4 border-border">
        <div className="h-8 w-8 animate-pulse rounded-full bg-muted" />
      </div>
    );
  }

  if (user) {
    return (
      <div className="flex items-center gap-2 border-l pl-4 border-border">
        <DropdownMenu>
          <DropdownMenuTrigger
            className={cn(
              buttonVariants({ variant: "ghost" }),
              "relative h-10 gap-2 px-3 rounded-full hover:bg-muted/80 transition-all",
            )}>
            <div className="flex items-center gap-2">
              {user.avatarUrl ? (
                <div className="h-7 w-7 rounded-full overflow-hidden border border-border shadow-sm">
                  <img
                    src={user.avatarUrl}
                    alt={user.fullName || user.email}
                    className="h-full w-full object-cover"
                  />
                </div>
              ) : (
                <UserCircle className="h-7 w-7 text-primary" />
              )}
              <span className="max-w-[100px] truncate font-semibold text-sm hidden lg:inline-block">
                {user.fullName || user.email.split("@")[0]}
              </span>
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            className="w-56 p-2 bg-background border-border">
            <div className="px-2 py-1.5 text-xs text-muted-foreground font-medium uppercase tracking-wider">
              {user.email}
            </div>
            <DropdownMenuItem className="p-0 cursor-pointer">
              <Link href="/profile" className="flex items-center gap-2 px-3 py-2.5 w-full outline-none transition-colors">
                <UserIcon className="h-4 w-4" />
                <span className="text-sm font-medium">{t("profile")}</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem className="p-0 cursor-pointer">
              <Link href="/settings" className="flex items-center gap-2 px-3 py-2.5 w-full outline-none transition-colors">
                <Settings className="h-4 w-4" />
                <span className="text-sm font-medium">{t("settings")}</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={handleLogout}
              className="flex items-center gap-2 px-3 py-2.5 cursor-pointer text-destructive focus:text-destructive focus:bg-destructive/10 transition-colors"
            >
              <LogOut className="h-4 w-4" />
              <span className="text-sm font-medium">{t("logout")}</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    );
  }

  return (
    <div className="hidden md:flex items-center gap-2 border-l pl-4 border-border">
      <Link
        href="/login"
        className={cn(
          buttonVariants({ variant: "ghost" }),
          "text-foreground/80 hover:text-primary hover:bg-transparent",
        )}>
        {t("login")}
      </Link>
      <Link
        href="/register"
        className={cn(
          buttonVariants({ variant: "default" }),
          "bg-primary text-primary-foreground hover:bg-primary/90 shadow-md",
        )}>
        {t("register")}
      </Link>
    </div>
  );
}
