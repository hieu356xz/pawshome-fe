"use client";

import { useTranslations } from "next-intl";
import {
  Search,
  FileText,
  UserCheck,
  Home,
  ChevronRight,
  ShieldCheck,
  Heart,
  MessageCircle,
} from "lucide-react";
import { Link } from "@/lib/navigation";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function AdoptionProcessPage() {
  const t = useTranslations("Adoption");

  const steps = [
    {
      title: t("step1Title"),
      desc: t("step1Desc"),
      icon: <Search className="h-6 w-6" />,
      color: "bg-blue-500/10 text-blue-600",
    },
    {
      title: t("step2Title"),
      desc: t("step2Desc"),
      icon: <FileText className="h-6 w-6" />,
      color: "bg-orange-500/10 text-orange-600",
    },
    {
      title: t("step3Title"),
      desc: t("step3Desc"),
      icon: <UserCheck className="h-6 w-6" />,
      color: "bg-purple-500/10 text-purple-600",
    },
    {
      title: t("step4Title"),
      desc: t("step4Desc"),
      icon: <Home className="h-6 w-6" />,
      color: "bg-green-500/10 text-green-600",
    },
  ];

  return (
    <div className="min-h-screen bg-[#faf9f6] pb-24">
      {/* Hero Section */}
      <section className="pt-20 pb-16 bg-white border-b border-border/10">
        <div className="container mx-auto px-4 md:px-8 text-center">
          <div className="max-w-3xl mx-auto space-y-6">
            <h1 className="text-4xl md:text-5xl font-serif font-bold text-foreground">
              {t("title")}
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed">
              {t("subtitle")}
            </p>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 md:px-8 mt-16">
        <div className="max-w-4xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Steps Column */}
          <div className="lg:col-span-7 space-y-8">
            {steps.map((step, index) => (
              <div key={index} className="relative flex gap-6 group">
                {/* Connector Line */}
                {index !== steps.length - 1 && (
                  <div className="absolute left-7 top-14 bottom-0 w-0.5 bg-border/40 group-hover:bg-primary/20 transition-colors" />
                )}

                <div
                  className={`flex-shrink-0 w-14 h-14 rounded-2xl flex items-center justify-center shadow-sm z-10 ${step.color}`}>
                  {step.icon}
                </div>

                <div className="pt-2 pb-8 space-y-2">
                  <h3 className="text-xl font-bold text-foreground">
                    {step.title}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {step.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Sidebar: Requirements */}
          <div className="lg:col-span-5">
            <div className="bg-white rounded-[2rem] border border-border/30 shadow-xl p-8 sticky top-24 space-y-8">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded-lg text-primary">
                  <ShieldCheck className="h-6 w-6" />
                </div>
                <h2 className="text-2xl font-serif font-bold">
                  {t("requirements")}
                </h2>
              </div>

              <div className="space-y-6">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex gap-4">
                    <div className="mt-1">
                      <Heart className="h-4 w-4 text-primary fill-current" />
                    </div>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {t(`req${i}`)}
                    </p>
                  </div>
                ))}
              </div>

              <div className="pt-6 border-t border-border/40 space-y-4">
                <Link
                  href="/pets"
                  className={cn(
                    buttonVariants({ variant: "default" }),
                    "w-full h-12 rounded-xl text-base font-bold shadow-md",
                  )}>
                  {t("step1Title").split(".")[1].trim()}{" "}
                  <ChevronRight className="ml-2 h-4 w-4" />
                </Link>
                <Link
                  href="/contact"
                  className={cn(
                    buttonVariants({ variant: "outline" }),
                    "w-full h-12 rounded-xl text-base font-bold",
                  )}>
                  <MessageCircle className="mr-2 h-5 w-5" /> {t("contactBtn")}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
