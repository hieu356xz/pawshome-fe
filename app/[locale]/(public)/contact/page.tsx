"use client";

import { useTranslations } from "next-intl";
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  QrCode,
  Heart,
  Copy,
  CheckCircle2,
  Building2,
  ArrowRight,
} from "lucide-react";
import { Link } from "@/lib/navigation";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useToast } from "@/components/ui/toast";
import { PageHeader } from "@/components/shared/PageHeader";

export default function ContactPage() {
  const t = useTranslations("Contact");
  const navbarT = useTranslations("Navbar");
  const { toast } = useToast();
  const [copied, setCopied] = useState<string | null>(null);

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopied(id);
    toast({
      type: "success",
      message: "Copied to clipboard!",
    });
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <div className="min-h-screen bg-[#faf9f6]">
      {/* Hero Section */}
      <PageHeader
        title={t("title")}
        description={t("subtitle")}
        badgeIcon={Mail}
        badgeText={navbarT("contact")}
        variant="primary"
      />

      {/* Main Content */}
      <div className="container mx-auto px-4 md:px-8 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* Left Column: Contact Details */}
          <div className="space-y-12">
            <div className="space-y-8">
              <h2 className="text-3xl font-serif font-bold flex items-center gap-3">
                <span className="h-8 w-1 bg-primary rounded-full" />
                {t("contactInfo")}
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                <div className="p-6 bg-white rounded-2xl border border-border/30 shadow-sm space-y-4">
                  <div className="p-3 bg-primary/10 rounded-xl w-fit text-primary">
                    <MapPin className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg">{t("address")}</h3>
                    <p className="text-muted-foreground text-sm leading-relaxed mt-1">
                      Hà Nội, Việt Nam
                    </p>
                  </div>
                </div>

                <div className="p-6 bg-white rounded-2xl border border-border/30 shadow-sm space-y-4">
                  <div className="p-3 bg-primary/10 rounded-xl w-fit text-primary">
                    <Phone className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg">{t("phone")}</h3>
                    <p className="text-muted-foreground text-sm mt-1">
                      +84 123 456 789
                    </p>
                  </div>
                </div>

                <div className="p-6 bg-white rounded-2xl border border-border/30 shadow-sm space-y-4">
                  <div className="p-3 bg-primary/10 rounded-xl w-fit text-primary">
                    <Mail className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg">{t("email")}</h3>
                    <p className="text-muted-foreground text-sm mt-1">
                      contact@pawshome.com
                    </p>
                  </div>
                </div>

                <div className="p-6 bg-white rounded-2xl border border-border/30 shadow-sm space-y-4">
                  <div className="p-3 bg-primary/10 rounded-xl w-fit text-primary">
                    <Clock className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg">{t("workingHours")}</h3>
                    <p className="text-muted-foreground text-sm mt-1">
                      {t("hours")}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <h3 className="text-2xl font-serif font-bold">
                {t("socialMedia")}
              </h3>
              <p className="text-muted-foreground text-sm">{t("followUs")}</p>
              <div className="flex gap-4">
                <Button
                  variant="outline"
                  size="icon"
                  className="rounded-full h-12 w-12 hover:bg-primary hover:text-white transition-all"
                  title="Facebook">
                  <img
                    src="https://cdn.jsdelivr.net/npm/simple-icons@v16/icons/facebook.svg"
                    width={32}
                    height={32}
                    alt="Facebook"
                  />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  className="rounded-full h-12 w-12 hover:bg-primary hover:text-white transition-all"
                  title="Instagram">
                  <img
                    src="https://cdn.jsdelivr.net/npm/simple-icons@v16/icons/instagram.svg"
                    width={32}
                    height={32}
                    alt="Instagram"
                  />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  className="rounded-full h-12 w-12 hover:bg-primary hover:text-white transition-all"
                  title="Tiktok">
                  <img
                    src="https://cdn.jsdelivr.net/npm/simple-icons@v16/icons/tiktok.svg"
                    width={28}
                    height={28}
                    alt="Tiktok"
                  />
                </Button>
              </div>
            </div>
          </div>

          {/* Right Column: Donation Invite */}
          <div className="space-y-8">
            <div className="bg-white rounded-[2.5rem] border border-border/30 shadow-lg p-8 md:p-10 text-center space-y-8 flex flex-col items-center">
              <div className="h-16 w-16 bg-primary/10 rounded-2xl flex items-center justify-center text-primary">
                <Heart className="h-8 w-8 fill-current" />
              </div>

              <div className="space-y-3">
                <h2 className="text-2xl font-serif font-bold text-foreground">
                  {t("donationTitle")}
                </h2>
                <p className="text-muted-foreground leading-relaxed max-w-sm">
                  {t("donationSubtitle")}
                </p>
              </div>

              {/* Inspiring illustration / details */}
              <div className="w-full bg-primary/[0.02] border border-primary/10 rounded-2xl p-6 text-left space-y-4">
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {t("donationDescription")}
                </p>
                <div className="flex items-center gap-3 text-sm font-bold text-primary">
                  <span className="h-2 w-2 bg-green-500 rounded-full animate-ping" />
                  <span>{t("donationBannerText")}</span>
                </div>
              </div>

              <Link href="/donate" className="w-full">
                <Button className="w-full h-14 text-base font-bold rounded-xl cursor-pointer bg-primary text-white hover:bg-primary/95 flex items-center justify-center gap-2">
                  <span>{t("donateNow")}</span>
                  <ArrowRight className="h-5 w-5 animate-pulse" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
