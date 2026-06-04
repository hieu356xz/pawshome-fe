"use client";

import { useTranslations, useLocale } from "next-intl";
import { Link, usePathname, useRouter } from "@/lib/navigation";
import { Search, Menu, Languages, Heart } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import UserMenu from "./UserMenu";

export function Navbar() {
  const t = useTranslations("Navbar");
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();
  const toggleLocale = (newLocale: "en" | "vi") => {
    router.replace(pathname, { locale: newLocale });
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-20 items-center justify-between px-4 md:px-8">
        {/* Logo */}
        <Link href="/" className="flex items-center space-x-2">
          <span className="font-serif text-3xl font-bold tracking-tight text-primary">
            PawsHome
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium">
          <Link
            href="/"
            className="transition-colors hover:text-primary text-foreground/80">
            {t("home")}
          </Link>
          <Link
            href="/pets"
            className="transition-colors hover:text-primary text-foreground/80">
            {t("pets")}
          </Link>
          <Link
            href="/community-posts"
            className="transition-colors hover:text-primary text-foreground/80">
            {t("community")}
          </Link>
          <Link
            href="/blog"
            className="transition-colors hover:text-primary text-foreground/80">
            {t("blog")}
          </Link>
          <Link
            href="/contact"
            className="transition-colors hover:text-primary text-foreground/80">
            {t("contact")}
          </Link>
        </nav>

        {/* Actions */}
        <div className="flex items-center space-x-4">
          {/* Donate Button */}
          <Link
            href="/donate"
            className={cn(
              buttonVariants({ variant: "default" }),
              "hidden md:flex rounded-xl font-bold cursor-pointer bg-primary text-white hover:bg-primary/90 gap-2 h-10 px-4"
            )}
          >
            <Heart className="h-4 w-4 fill-current animate-pulse text-white" />
            {t("donate")}
          </Link>

          {/* Language Switcher */}
          <DropdownMenu>
            <DropdownMenuTrigger className="flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-gray-50 transition-all text-gray-500 outline-none border-none cursor-pointer">
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
                  "rounded-xl cursor-pointer py-2 px-3 flex items-center gap-2 outline-none mb-1",
                  locale === "en" && "bg-muted  font-bold",
                )}>
                English
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => toggleLocale("vi")}
                className={cn(
                  "rounded-xl cursor-pointer py-2 px-3 flex items-center gap-2 outline-none",
                  locale === "vi" && "bg-muted font-bold",
                )}>
                Tiếng Việt
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <Link
            href="/search"
            className="p-2 text-foreground/80 hover:text-primary transition-colors">
            <Search className="h-5 w-5" />
          </Link>

          <UserMenu />

          <button className="md:hidden p-2">
            <Menu className="h-6 w-6 text-foreground" />
          </button>
        </div>
      </div>
    </header>
  );
}
