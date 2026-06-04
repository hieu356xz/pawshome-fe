"use client";

import React from "react";
import { useTranslations } from "next-intl";
import { CheckCircle2, Home, Heart, ArrowRight } from "lucide-react";
import { Link } from "@/lib/navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export default function DonateSuccessPage() {
  const t = useTranslations("Donate");

  return (
    <div className="min-h-[80vh] bg-[#faf9f6] flex items-center justify-center py-16 px-4">
      <Card className="max-w-md w-full bg-white rounded-[2.5rem] border border-border/30 shadow-xl p-8 md:p-10 text-center space-y-8 flex flex-col items-center">
        
        {/* Animated Check Icon */}
        <div className="h-20 w-20 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600 animate-bounce">
          <CheckCircle2 className="h-12 w-12" />
        </div>

        <div className="space-y-3">
          <h1 className="text-3xl font-serif font-bold text-foreground">
            {t("successTitle")}
          </h1>
          <p className="text-sm text-muted-foreground leading-relaxed">
            {t("successDesc")}
          </p>
        </div>

        {/* Dynamic graphics */}
        <div className="w-full p-4 bg-primary/[0.02] border border-primary/10 rounded-2xl flex items-center justify-center gap-2 text-primary">
          <Heart className="h-4 w-4 fill-current" />
          <span className="text-xs font-bold uppercase tracking-wider">PawsHome Tri Ân Tấm Lòng Vàng</span>
        </div>

        {/* Action Buttons */}
        <div className="w-full flex flex-col sm:flex-row gap-4 pt-4">
          <Link href="/" className="w-full sm:flex-1">
            <Button
              variant="outline"
              className="w-full h-12 rounded-xl text-sm font-semibold cursor-pointer border-border hover:bg-muted/30 flex items-center justify-center gap-2"
            >
              <Home className="h-4 w-4" />
              {t("backToHome")}
            </Button>
          </Link>
          <Link href="/donate" className="w-full sm:flex-1">
            <Button
              className="w-full h-12 rounded-xl text-sm font-semibold cursor-pointer bg-primary text-white hover:bg-primary/95 flex items-center justify-center gap-2"
            >
              {t("backToDonate")}
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>

      </Card>
    </div>
  );
}
