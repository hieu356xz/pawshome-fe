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
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useToast } from "@/components/ui/toast";

export default function ContactPage() {
  const t = useTranslations("Contact");
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
      <section className="relative pt-20 pb-16 overflow-hidden bg-primary/5">
        <div className="container mx-auto px-4 md:px-8 text-center relative">
          <div className="max-w-3xl mx-auto space-y-6">
            <h1 className="text-4xl md:text-6xl font-serif font-bold text-foreground leading-tight">
              {t("title")}
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
              {t("subtitle")}
            </p>
          </div>
        </div>
      </section>

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

          {/* Right Column: Donation */}
          <div className="space-y-8">
            <div className="bg-white rounded-[2rem] border border-border/30 shadow-lg p-8 md:p-10 space-y-8">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary">
                  <Heart className="h-6 w-6 fill-current" />
                </div>
                <div>
                  <h2 className="text-2xl font-serif font-bold text-foreground">
                    {t("donationTitle")}
                  </h2>
                  <p className="text-sm text-muted-foreground">
                    {t("donationSubtitle")}
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-xs font-bold uppercase tracking-widest text-muted-foreground/60 mb-2">
                  {t("bankAccount")}
                </h3>

                {/* Simplified Bank Info Block */}
                <div className="bg-muted/30 rounded-2xl p-6 border border-border/50 space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 bg-white rounded-xl flex items-center justify-center shadow-sm border border-border/10">
                        <Building2 className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="text-[10px] uppercase font-bold text-muted-foreground/60 leading-none mb-1">
                          {t("bankName")}
                        </p>
                        <p className="font-bold text-base">MB BANK (MB)</p>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                    <div className="space-y-1">
                      <p className="text-[10px] uppercase font-bold text-muted-foreground/60">
                        {t("accountNumber")}
                      </p>
                      <div className="flex items-center gap-2 group">
                        <p className="font-mono text-xl font-bold tracking-tight text-foreground">
                          1848108108
                        </p>
                        <button
                          onClick={() => handleCopy("123456789012", "bank1")}
                          className="p-1.5 hover:bg-primary/10 text-muted-foreground hover:text-primary rounded-lg transition-colors">
                          {copied === "bank1" ? (
                            <CheckCircle2 className="h-4 w-4" />
                          ) : (
                            <Copy className="h-4 w-4" />
                          )}
                        </button>
                      </div>
                    </div>
                    <div className="space-y-1">
                      <p className="text-[10px] uppercase font-bold text-muted-foreground/60">
                        {t("accountName")}
                      </p>
                      <p className="font-bold text-base text-foreground">
                        Hanoi Pet Adoption
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col items-center gap-8 bg-primary/[0.03] p-10 rounded-[2rem] border border-primary/10">
                  <div className="bg-white p-5 rounded-3xl shadow-xl border border-border/10 shrink-0 transform transition-transform hover:scale-[1.02]">
                    <div className="w-64 sm:w-80 aspect-square bg-muted/50 flex items-center justify-center relative rounded-2xl overflow-hidden border border-dashed border-border/40">
                      <img
                        src="https://yuexbpigxmlfvfypupww.supabase.co/storage/v1/object/public/pawhome-images/other/donation-qr.png"
                        alt="QR Code"
                        className="w-full h-full object-contain"
                      />
                    </div>
                  </div>
                  <div className="space-y-3 text-center">
                    <h4 className="font-bold text-lg flex items-center justify-center gap-2">
                      <QrCode className="h-5 w-5 text-primary" />
                      {t("qrCode")}
                    </h4>
                    <p className="text-sm text-muted-foreground leading-relaxed max-w-sm">
                      Quét mã QR để quyên góp nhanh qua ứng dụng ngân hàng
                      (Napas247).
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
