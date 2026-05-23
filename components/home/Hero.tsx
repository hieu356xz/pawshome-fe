"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/lib/navigation";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function Hero() {
  const t = useTranslations("Hero");

  return (
    <section
      suppressHydrationWarning
      className="relative w-full py-20 md:py-32 overflow-hidden bg-background">
      {/* Decorative background element */}
      <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/4 w-96 h-96 bg-accent/10 rounded-full blur-3xl" />

      <div className="container mx-auto px-4 md:px-8 relative z-10">
        <div className="flex flex-col md:flex-row items-center gap-12 md:gap-24">
          <div className="flex-1 text-center md:text-left space-y-8">
            <div className="inline-block px-4 py-1.5 bg-accent/20 border border-accent/30 rounded-full text-accent-foreground text-xs font-bold uppercase tracking-widest">
              {t("badge")}
            </div>

            <h1 className="text-5xl md:text-7xl leading-[1.1] text-foreground">
              {t.rich("title", {
                italic: (chunks) => (
                  <span className="text-primary italic">{chunks}</span>
                ),
              })}
            </h1>

            <p className="text-lg md:text-xl text-muted-foreground leading-relaxed max-w-2xl mx-auto md:mx-0">
              {t("description")}
            </p>

            <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 pt-4">
              <Link
                href="/pets"
                className={cn(
                  buttonVariants({ variant: "default", size: "lg" }),
                  "h-14 px-10 text-lg bg-primary hover:bg-primary/90 shadow-lg",
                )}>
                {t("adoptButton")}
              </Link>
              <Link
                href="/community-posts"
                className={cn(
                  buttonVariants({ variant: "outline", size: "lg" }),
                  "h-14 px-10 text-lg border-primary text-primary hover:bg-primary/5",
                )}>
                {t("communityButton")}
              </Link>
            </div>

            <div className="flex items-center justify-center md:justify-start space-x-12 pt-8">
              <div>
                <p className="text-3xl font-serif font-bold text-primary">
                  500+
                </p>
                <p className="text-xs text-muted-foreground uppercase tracking-wider">
                  {t("statsAdopted")}
                </p>
              </div>
              <div className="border-l border-border pl-12">
                <p className="text-3xl font-serif font-bold text-primary">
                  1200+
                </p>
                <p className="text-xs text-muted-foreground uppercase tracking-wider">
                  {t("statsMembers")}
                </p>
              </div>
            </div>
          </div>

          <div className="flex-1 w-full max-w-xl">
            <div className="relative aspect-[4/5] rounded-2xl overflow-hidden shadow-2xl border-8 border-white">
              <div className="absolute inset-0 bg-[url('https://yuexbpigxmlfvfypupww.supabase.co/storage/v1/object/public/pawhome-images/public/hero-page-2.jpg')] bg-cover bg-center" />
              <div className="absolute inset-0 bg-gradient-to-t from-primary/20 to-transparent" />
            </div>

            {/* Floating badge */}
            <div className="absolute -bottom-6 -right-6 md:right-12 bg-white p-6 rounded-xl shadow-xl border border-border hidden sm:block">
              <div className="flex items-center space-x-4">
                <div className="h-12 w-12 bg-accent/20 rounded-full flex items-center justify-center text-accent-foreground font-serif text-xl font-bold">
                  24/7
                </div>
                <div>
                  <p className="font-bold text-sm">{t("floatingBadgeTitle")}</p>
                  <p className="text-xs text-muted-foreground">
                    {t("floatingBadgeDesc")}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
