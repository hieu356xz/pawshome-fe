"use client";

import { useTranslations, useLocale } from "next-intl";
import { Link, usePathname, useRouter } from "@/lib/navigation";
import { Search, Menu, Languages } from "lucide-react";
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
        </nav>

        {/* Actions */}
        <div className="flex items-center space-x-4">
          {/* Language Switcher */}
          <DropdownMenu>
            <DropdownMenuTrigger
              className={cn(
                buttonVariants({ variant: "ghost" }),
                "text-foreground/80 hover:text-primary gap-2 px-2",
              )}>
              <Languages className="h-4 w-4" />
              <span className="font-bold text-xs uppercase">{locale}</span>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className="bg-background border-border">
              <DropdownMenuItem
                onClick={() => toggleLocale("en")}
                className={cn(
                  "cursor-pointer",
                  locale === "en" && "bg-muted font-bold",
                )}>
                English
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => toggleLocale("vi")}
                className={cn(
                  "cursor-pointer",
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
