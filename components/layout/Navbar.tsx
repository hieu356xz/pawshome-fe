"use client";

import Link from "next/link";
import { Search, Menu } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function Navbar() {
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
        <nav className="hidden md:flex items-center space-x-8 text-sm font-medium">
          <Link
            href="/"
            className="transition-colors hover:text-primary text-foreground/80"
          >
            Home
          </Link>
          <Link
            href="/pets"
            className="transition-colors hover:text-primary text-foreground/80"
          >
            Pets
          </Link>
          <Link
            href="/pet-posts"
            className="transition-colors hover:text-primary text-foreground/80"
          >
            Pet Posts
          </Link>
          <Link
            href="/blog"
            className="transition-colors hover:text-primary text-foreground/80"
          >
            Blog
          </Link>
        </nav>

        {/* Actions */}
        <div className="flex items-center space-x-4">
          <Link href="/search" className="p-2 text-foreground/80 hover:text-primary transition-colors">
            <Search className="h-5 w-5" />
          </Link>
          
          <div className="hidden md:flex items-center space-x-2 border-l pl-4 border-border">
            <Link 
              href="/login" 
              className={cn(buttonVariants({ variant: "ghost" }), "text-foreground/80 hover:text-primary hover:bg-transparent")}
            >
              Login
            </Link>
            <Link 
              href="/register" 
              className={cn(buttonVariants({ variant: "default" }), "bg-primary text-primary-foreground hover:bg-primary/90 shadow-md")}
            >
              Register
            </Link>
          </div>

          <button className="md:hidden p-2">
            <Menu className="h-6 w-6 text-foreground" />
          </button>
        </div>
      </div>
    </header>
  );
}
