"use client";

import React, { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import {
  Heart,
  QrCode,
  Trophy,
  MessageSquare,
  TrendingUp,
  Sparkles,
  ShieldCheck,
  DollarSign,
  Gift,
  ArrowRight,
  Clock,
  User as UserIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/components/ui/toast";
import { PageHeader } from "@/components/shared/PageHeader";
import { useAuth } from "@/providers/AuthContext";
import { donationService } from "@/services/donation.service";
import { DonationStats, Donation } from "@/types/donation";

const PRESET_AMOUNTS = [50000, 100000, 200000, 500000, 1000000];

export default function DonatePage() {
  const t = useTranslations("Donate");
  const commonT = useTranslations("Common");
  const { toast } = useToast();
  const { user } = useAuth();

  const [amount, setAmount] = useState<string>("");
  const [donorName, setDonorName] = useState<string>("");
  const [donorEmail, setDonorEmail] = useState<string>("");
  const [donorPhone, setDonorPhone] = useState<string>("");
  const [message, setMessage] = useState<string>("");
  const [isAnonymous, setIsAnonymous] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const [stats, setStats] = useState<DonationStats | null>(null);
  const [isLoadingStats, setIsLoadingStats] = useState<boolean>(true);

  // Pre-fill user data if logged in
  useEffect(() => {
    if (user) {
      setDonorName(user.fullName || "");
      setDonorEmail(user.email || "");
      setDonorPhone(user.phoneNumber || "");
    }
  }, [user]);

  // Fetch stats on mount
  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    setIsLoadingStats(true);
    try {
      const response = await donationService.getStats();
      if (response.success && response.data) {
        setStats(response.data);
      }
    } catch (error) {
      console.error("Failed to fetch donation stats:", error);
    } finally {
      setIsLoadingStats(false);
    }
  };

  const handlePresetClick = (val: number) => {
    setAmount(val.toString());
  };

  const formatVnd = (value: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const numericAmount = Number(amount);
    if (!amount || isNaN(numericAmount) || numericAmount < 1000) {
      toast({
        type: "error",
        message: "Số tiền quyên góp tối thiểu là 1,000 VND",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await donationService.create({
        amount: numericAmount,
        donorName: donorName.trim() || undefined,
        donorEmail: donorEmail.trim() || undefined,
        donorPhone: donorPhone.trim() || undefined,
        message: message.trim() || undefined,
        isAnonymous,
      });

      if (response.success && response.data?.checkoutUrl) {
        // Redirect to PayOS checkout page
        window.location.href = response.data.checkoutUrl;
      } else {
        toast({
          type: "error",
          message: "Không thể tạo mã thanh toán. Vui lòng thử lại.",
        });
      }
    } catch (error: any) {
      toast({
        type: "error",
        message: error || "Lỗi hệ thống khi kết nối thanh toán.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#faf9f6]">
      <PageHeader
        title={t("title")}
        description={t("subtitle")}
        badgeIcon={Heart}
        badgeText={t("title")}
        variant="primary"
      />

      <div className="container mx-auto px-4 md:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Left Column: Form */}
          <div className="lg:col-span-7 space-y-8">
            <Card className="bg-white rounded-[2rem] border border-border/30 shadow-lg p-8 md:p-10 space-y-8">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary">
                  <Gift className="h-6 w-6" />
                </div>
                <div>
                  <h2 className="text-2xl font-serif font-bold text-foreground">
                    {t("formTitle")}
                  </h2>
                  <p className="text-sm text-muted-foreground mt-1">
                    {t("formSubtitle")}
                  </p>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Predefined Amounts */}
                <div className="space-y-3">
                  <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground/80">
                    {t("quickAmount")}
                  </label>
                  <div className="flex flex-wrap gap-3">
                    {PRESET_AMOUNTS.map((preset) => {
                      const isSelected = amount === preset.toString();
                      return (
                        <button
                          key={preset}
                          type="button"
                          onClick={() => handlePresetClick(preset)}
                          className={`px-5 py-3 rounded-xl border text-sm font-semibold transition-all duration-200 cursor-pointer ${
                            isSelected
                              ? "bg-primary text-white border-primary shadow-md transform -translate-y-0.5"
                              : "bg-muted/10 text-foreground border-border/60 hover:border-primary/50 hover:bg-white"
                          }`}>
                          {preset >= 1000000
                            ? `${preset / 1000000}M`
                            : `${preset / 1000}K`}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Amount Input */}
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground/80">
                    {t("amountLabel")} <span className="text-red-500">*</span>
                  </label>
                  <div className="relative flex items-center">
                    <span className="absolute left-4 text-muted-foreground/75 font-semibold text-lg">
                      đ
                    </span>
                    <Input
                      type="number"
                      required
                      min={1000}
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      placeholder="0"
                      className="pl-9 h-14 text-lg font-mono font-bold tracking-wide"
                    />
                  </div>
                </div>

                {/* Personal Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground/80">
                      {t("donorNameLabel")}
                    </label>
                    <Input
                      type="text"
                      value={donorName}
                      disabled={isAnonymous}
                      onChange={(e) => setDonorName(e.target.value)}
                      placeholder={
                        isAnonymous ? t("anonymousUser") : "Nguyễn Văn A"
                      }
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground/80">
                      {t("donorEmailLabel")}
                    </label>
                    <Input
                      type="email"
                      value={donorEmail}
                      onChange={(e) => setDonorEmail(e.target.value)}
                      placeholder="example@email.com"
                    />
                  </div>
                </div>

                {/* Phone */}
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground/80">
                    {t("donorPhoneLabel")}
                  </label>
                  <Input
                    type="tel"
                    value={donorPhone}
                    onChange={(e) => setDonorPhone(e.target.value)}
                    placeholder="09xx xxx xxx"
                  />
                </div>

                {/* Message */}
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground/80">
                    {t("messageLabel")}
                  </label>
                  <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Nhập lời nhắn yêu thương gửi đến các bé..."
                    className="flex min-h-[100px] w-full rounded-xl border border-input bg-background px-4 py-3 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/20 disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-200 focus:border-primary shadow-sm hover:border-primary/50"
                  />
                </div>

                {/* Anonymous Checkbox */}
                <div className="flex items-center space-x-3 pt-2">
                  <Checkbox
                    id="anonymous"
                    checked={isAnonymous}
                    onCheckedChange={(checked) => {
                      setIsAnonymous(!!checked);
                      if (checked) {
                        setDonorName("");
                      } else if (user) {
                        setDonorName(user.fullName || "");
                      }
                    }}
                  />
                  <label
                    htmlFor="anonymous"
                    className="text-sm font-medium text-foreground cursor-pointer select-none leading-none">
                    {t("isAnonymousLabel")}
                  </label>
                </div>

                {/* Security Badge */}
                <div className="flex items-center gap-2 p-4 bg-emerald-50/50 border border-emerald-100 rounded-2xl text-emerald-800 text-xs">
                  <ShieldCheck className="h-4 w-4 shrink-0 text-emerald-600" />
                  <span>{t("securityNotice")}</span>
                </div>

                {/* Submit Button */}
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full h-14 text-base font-bold rounded-xl cursor-pointer bg-primary text-white hover:bg-primary/95 shadow-md flex items-center justify-center gap-2">
                  {isSubmitting ? (
                    t("submittingButton")
                  ) : (
                    <>
                      {t("submitButton")}
                      <ArrowRight className="h-5 w-5" />
                    </>
                  )}
                </Button>
              </form>
            </Card>
          </div>

          {/* Right Column: Stats & Leaderboard */}
          <div className="lg:col-span-5 space-y-8">
            {/* Quick Metrics */}
            <div className="grid grid-cols-2 gap-4">
              <Card className="bg-white p-6 border border-border/30 shadow-sm flex flex-col justify-between space-y-4">
                <div className="p-3 bg-primary/15 text-primary rounded-2xl w-fit">
                  <TrendingUp className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground/60 leading-none">
                    {t("totalAmount")}
                  </p>
                  <p className="text-2xl font-bold font-mono text-foreground mt-2 leading-none">
                    {isLoadingStats
                      ? "..."
                      : formatVnd(stats?.totalAmount || 0)}
                  </p>
                </div>
              </Card>

              <Card className="bg-white p-6 border border-border/30 shadow-sm flex flex-col justify-between space-y-4">
                <div className="p-3 bg-primary/15 text-primary rounded-2xl w-fit">
                  <Heart className="h-6 w-6 fill-current" />
                </div>
                <div>
                  <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground/60 leading-none">
                    {t("donationCount")}
                  </p>
                  <p className="text-3xl font-bold font-mono text-foreground mt-2 leading-none">
                    {isLoadingStats ? "..." : stats?.donationCount || 0}
                  </p>
                </div>
              </Card>
            </div>

            {/* Honor Board / Leaderboard */}
            <Card className="bg-white border border-border/30 shadow-md rounded-[2rem] p-8 space-y-6">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-amber-50 rounded-xl text-amber-500 border border-amber-100">
                  <Trophy className="h-5 w-5" />
                </div>
                <h3 className="text-xl font-serif font-bold text-foreground">
                  {t("leaderboardTitle")}
                </h3>
              </div>

              {isLoadingStats ? (
                <div className="flex flex-col gap-4 py-4 animate-pulse">
                  {[1, 2, 3].map((i) => (
                    <div
                      key={i}
                      className="h-12 bg-muted/40 rounded-xl w-full"
                    />
                  ))}
                </div>
              ) : stats?.topDonors && stats.topDonors.length > 0 ? (
                <div className="space-y-4">
                  {stats.topDonors.map((donor, idx) => {
                    const placeColors = [
                      "text-amber-500 bg-amber-50 border-amber-100", // Gold
                      "text-slate-400 bg-slate-50 border-slate-100", // Silver
                      "text-amber-700 bg-amber-50/50 border-amber-100/50", // Bronze
                    ];
                    return (
                      <div
                        key={idx}
                        className="flex items-center justify-between p-3.5 bg-muted/10 rounded-2xl border border-border/10 hover:bg-muted/20 transition-colors">
                        <div className="flex items-center gap-3">
                          <span
                            className={`h-7 w-7 rounded-lg text-xs font-bold flex items-center justify-center border shadow-sm ${
                              idx < 3
                                ? placeColors[idx]
                                : "bg-white text-muted-foreground border-border/50"
                            }`}>
                            {idx + 1}
                          </span>
                          <span className="font-bold text-sm text-foreground">
                            {donor.donorName}
                          </span>
                        </div>
                        <span className="font-mono font-bold text-sm text-primary">
                          {formatVnd(donor.totalAmount)}
                        </span>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-8 text-sm text-muted-foreground">
                  {t("emptyStats")}
                </div>
              )}
            </Card>

            {/* Recent Activity Feed */}
            <Card className="bg-white border border-border/30 shadow-md rounded-[2rem] p-8 space-y-6">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-rose-50 rounded-xl text-rose-500 border border-rose-100">
                  <Clock className="h-5 w-5" />
                </div>
                <h3 className="text-xl font-serif font-bold text-foreground">
                  {t("recentTitle")}
                </h3>
              </div>

              {isLoadingStats ? (
                <div className="flex flex-col gap-4 py-4 animate-pulse">
                  {[1, 2].map((i) => (
                    <div
                      key={i}
                      className="h-16 bg-muted/40 rounded-xl w-full"
                    />
                  ))}
                </div>
              ) : stats?.recentDonations && stats.recentDonations.length > 0 ? (
                <div className="space-y-4 divide-y divide-border/20">
                  {stats.recentDonations.map((d, index) => (
                    <div
                      key={d.id || index}
                      className={`pt-4 first:pt-0 flex gap-4 items-start`}>
                      <div className="h-10 w-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary shrink-0">
                        <UserIcon className="h-5 w-5" />
                      </div>
                      <div className="space-y-1.5 flex-1 min-w-0">
                        <div className="flex justify-between items-baseline gap-2">
                          <span className="font-bold text-sm text-foreground truncate">
                            {d.donorName}
                          </span>
                          <span className="font-mono font-bold text-xs text-primary shrink-0">
                            {formatVnd(d.amount)}
                          </span>
                        </div>
                        {d.message && (
                          <div className="flex items-start gap-1 text-xs text-muted-foreground bg-muted/30 p-2.5 rounded-xl border border-border/10">
                            <MessageSquare className="h-3 w-3 mt-0.5 text-muted-foreground/60 shrink-0" />
                            <p className="italic leading-relaxed break-words">
                              {d.message}
                            </p>
                          </div>
                        )}
                        {d.paidAt && (
                          <p className="text-[10px] text-muted-foreground/70">
                            {new Date(d.paidAt).toLocaleDateString("vi-VN", {
                              hour: "2-digit",
                              minute: "2-digit",
                              day: "2-digit",
                              month: "2-digit",
                              year: "numeric",
                            })}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-sm text-muted-foreground">
                  {t("emptyStats")}
                </div>
              )}
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
