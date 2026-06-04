"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/lib/navigation";

export function Footer() {
  const t = useTranslations("Footer");

  return (
    <footer className="w-full border-t bg-muted/30 pt-16 pb-8">
      <div className="container mx-auto px-4 md:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
          {/* Brand Section */}
          <div className="md:col-span-1">
            <Link href="/" className="inline-block mb-4">
              <span className="font-serif text-2xl font-bold text-primary">
                PawsHome
              </span>
            </Link>
            <p className="text-muted-foreground text-sm leading-relaxed max-w-xs">
              {t("desc")}
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-serif font-bold text-foreground mb-6">
              {t("quickLinks")}
            </h4>
            <ul className="space-y-4 text-sm text-muted-foreground">
              <li>
                <Link href="/" className="hover:text-primary transition-colors">
                  {t("home")}
                </Link>
              </li>
              <li>
                <Link
                  href="/pets"
                  className="hover:text-primary transition-colors">
                  {t("findPet")}
                </Link>
              </li>
              <li>
                <Link
                  href="/community-posts"
                  className="hover:text-primary transition-colors">
                  {t("communityPosts")}
                </Link>
              </li>
              <li>
                <Link
                  href="/blog"
                  className="hover:text-primary transition-colors">
                  {t("petBlog")}
                </Link>
              </li>
            </ul>
          </div>

          {/* Community */}
          <div>
            <h4 className="font-serif font-bold text-foreground mb-6">
              {t("community")}
            </h4>
            <ul className="space-y-4 text-sm text-muted-foreground">
              <li>
                <Link
                  href="/adoption"
                  className="hover:text-primary transition-colors">
                  {t("adoptionProcess")}
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="hover:text-primary transition-colors">
                  {t("contactUs")}
                </Link>
              </li>
              <li>
                <Link
                  href="/donate"
                  className="hover:text-primary transition-colors">
                  {t("donate")}
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          {/* <div>
            <h4 className="font-serif font-bold text-foreground mb-6">
              {t("newsletter")}
            </h4>
            <p className="text-sm text-muted-foreground mb-4">
              {t("newsletterDesc")}
            </p>
            <div className="flex">
              <input
                type="email"
                placeholder={t("newsletterPlaceholder")}
                className="bg-background border px-4 py-2 text-sm rounded-l-md w-full focus:outline-none focus:ring-1 focus:ring-primary"
              />
              <button className="bg-primary text-primary-foreground px-4 py-2 text-sm font-medium rounded-r-md hover:bg-primary/90 transition-colors">
                {t("newsletterButton")}
              </button>
            </div>
          </div> */}
        </div>

        <div className="pt-8 border-t border-border flex flex-col md:flex-row justify-between items-center text-xs text-muted-foreground gap-4">
          <p>{t("copyright")}</p>
          {/* <div className="flex space-x-6">
            <Link href="/privacy" className="hover:text-primary">
              {t("privacy")}
            </Link>
            <Link href="/terms" className="hover:text-primary">
              {t("terms")}
            </Link>
          </div> */}
        </div>
      </div>
    </footer>
  );
}
