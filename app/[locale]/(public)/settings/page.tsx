"use client";

import React, { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { useAuth } from "@/providers/AuthContext";
import { useRouter } from "@/lib/navigation";
import { authService } from "@/services/auth.service";
import { toast } from "@/components/ui/toast";
import {
  Lock,
  Eye,
  EyeOff,
  Loader2,
  ShieldAlert,
  CheckCircle2,
  Info,
  AlertCircle,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function SettingsPage() {
  const t = useTranslations("Settings");
  const { user, isLoading: isAuthLoading } = useAuth();
  const router = useRouter();

  // Password fields
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Error/Success state
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Toggle Password visibility
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Redirect if not logged in
  useEffect(() => {
    if (!isAuthLoading && !user) {
      router.push("/login");
    }
  }, [user, isAuthLoading, router]);

  const mapErrorMessage = (message: string) => {
    if (message === "Invalid current password")
      return t("invalidCurrentPassword");
    if (message === "Current password is required")
      return t("oldPasswordRequired");
    return message;
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setError(null);
    setSuccess(null);

    // Validate matching passwords
    if (newPassword !== confirmPassword) {
      setError(t("passwordMismatch"));
      return;
    }

    setIsSubmitting(true);
    try {
      const payload: any = { newPassword };
      if (oldPassword.trim()) {
        payload.oldPassword = oldPassword;
      }

      await authService.changePassword(payload);

      setSuccess(t("passwordChangedSuccess"));
      // Reset form
      setOldPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err: any) {
      console.error("Failed to change password:", err);
      const backendMessage =
        typeof err === "string"
          ? err
          : err?.response?.data?.message || err?.message;
      setError(mapErrorMessage(backendMessage) || t("passwordChangedError"));
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isAuthLoading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-muted/10">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-10 w-10 animate-spin text-primary" />
          <p className="text-muted-foreground font-medium animate-pulse">
            {t("loading")}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted/10 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Page Title */}
        <div className="space-y-1">
          <h1 className="text-3xl font-serif font-bold text-foreground">
            {t("title")}
          </h1>
          <p className="text-sm text-muted-foreground font-medium">
            {t("subtitle")}
          </p>
        </div>

        {/* Change Password Card */}
        <Card className="rounded-[2rem] border border-border/30 shadow-sm bg-white overflow-hidden">
          <CardHeader className="bg-muted/10 border-b border-border/40">
            <CardTitle className="text-lg font-bold text-foreground font-serif flex items-center gap-2">
              <Lock size={18} className="text-primary" />
              <span>{t("changePassword")}</span>
            </CardTitle>
            <CardDescription className="text-xs">
              {t("passwordCardDesc")}
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <form
              onSubmit={handleChangePassword}
              className="space-y-5 max-w-lg">
              {/* Error Alert */}
              {error && (
                <div className="bg-destructive/10 border border-destructive/20 text-destructive text-sm p-3 rounded-xl flex items-center gap-3 animate-in fade-in slide-in-from-top-1">
                  <AlertCircle className="size-4 shrink-0" />
                  <p>{error}</p>
                </div>
              )}

              {/* Success Alert */}
              {success && (
                <div className="bg-emerald-50 border border-emerald-100 text-emerald-800 text-sm p-3 rounded-xl flex items-center gap-3 animate-in fade-in slide-in-from-top-1">
                  <CheckCircle2 className="size-4 shrink-0 text-emerald-600" />
                  <p>{success}</p>
                </div>
              )}

              {/* Note for Google login users */}
              {user.googleId && (
                <div className="bg-primary/5 border border-primary/10 rounded-2xl p-4 flex gap-3 text-primary text-sm">
                  <Info size={20} className="shrink-0 mt-0.5" />
                  <div className="space-y-1">
                    <p className="font-bold">{t("googleConnectedTitle")}</p>
                    <p className="text-primary/80 leading-relaxed text-xs">
                      {t("googlePasswordNote")}
                    </p>
                  </div>
                </div>
              )}

              {/* Current Password */}
              <div className="space-y-1.5 relative">
                <Label
                  htmlFor="oldPassword"
                  className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  {t("oldPassword")}
                </Label>
                <div className="relative">
                  <Input
                    id="oldPassword"
                    type={showOldPassword ? "text" : "password"}
                    value={oldPassword}
                    onChange={(e) => setOldPassword(e.target.value)}
                    placeholder={t("oldPasswordPlaceholder")}
                    className="rounded-xl border-border focus-visible:ring-primary pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowOldPassword(!showOldPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors focus:outline-none">
                    {showOldPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              {/* New Password */}
              <div className="space-y-1.5 relative">
                <Label
                  htmlFor="newPassword"
                  className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  {t("newPassword")}
                </Label>
                <div className="relative">
                  <Input
                    id="newPassword"
                    type={showNewPassword ? "text" : "password"}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder={t("newPasswordPlaceholder")}
                    className="rounded-xl border-border focus-visible:ring-primary pr-10"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors focus:outline-none">
                    {showNewPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              {/* Confirm New Password */}
              <div className="space-y-1.5 relative">
                <Label
                  htmlFor="confirmNewPassword"
                  className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  {t("confirmNewPassword")}
                </Label>
                <div className="relative">
                  <Input
                    id="confirmNewPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder={t("confirmPasswordPlaceholder")}
                    className="rounded-xl border-border focus-visible:ring-primary pr-10"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors focus:outline-none">
                    {showConfirmPassword ? (
                      <EyeOff size={16} />
                    ) : (
                      <Eye size={16} />
                    )}
                  </button>
                </div>
              </div>

              <Button
                type="submit"
                disabled={isSubmitting}
                className="bg-primary hover:bg-primary/95 text-primary-foreground font-bold rounded-xl shadow px-6">
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    {t("changePassword")}...
                  </>
                ) : (
                  t("changePassword")
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Social Connection Info Card */}
        <Card className="rounded-[2rem] border border-border/30 shadow-sm bg-white overflow-hidden">
          <CardHeader className="bg-muted/10 border-b border-border/40">
            <CardTitle className="text-lg font-bold text-foreground font-serif flex items-center gap-2">
              <CheckCircle2 size={18} className="text-emerald-500" />
              <span>{t("googleConnection")}</span>
            </CardTitle>
            <CardDescription className="text-xs">
              {t("googleStatusDesc")}
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="h-10 w-10 rounded-full bg-white border flex items-center justify-center shrink-0 shadow-sm">
                <img
                  src="https://cdn.jsdelivr.net/gh/glincker/thesvg@main/public/icons/google/default.svg"
                  width={24}
                  height={24}
                  alt="Google"
                />
              </div>
              <div className="flex-1">
                <p className="font-bold text-gray-800 text-sm">
                  {t("googleAuthTitle")}
                </p>
                <p className="text-xs text-muted-foreground font-semibold pt-0.5">
                  Status:{" "}
                  {user.googleId ? (
                    <span className="text-emerald-600 font-bold">
                      {t("googleConnected")}
                    </span>
                  ) : (
                    <span className="text-muted-foreground font-bold">
                      {t("googleNotConnected")}
                    </span>
                  )}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Danger Zone Card */}
        <Card className="rounded-[2rem] border-2 border-red-200 shadow-md bg-red-50/5 overflow-hidden relative">
          <CardHeader className="bg-red-50/50 border-b border-red-100 pl-8">
            <CardTitle className="text-lg font-bold text-red-700 font-serif flex items-center gap-2">
              <ShieldAlert size={20} className="text-red-600 animate-pulse" />
              <span>{t("dangerZone")}</span>
            </CardTitle>
            <CardDescription className="text-red-600/70 text-xs font-medium">
              {t("dangerZoneDesc")}
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6 pl-8 space-y-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="space-y-1.5">
                <p className="font-bold text-gray-900 text-sm">
                  {t("deactivateAccount")}
                </p>
                <p className="text-xs text-gray-500 leading-relaxed max-w-xl">
                  {t("deactivateDesc")}
                </p>
              </div>
              <Button
                className="bg-red-600 hover:bg-red-700 active:bg-red-800 text-white font-bold rounded-xl shadow-md px-6 py-2.5 transition-transform hover:scale-105 self-start md:self-center shrink-0"
                onClick={() => {
                  toast.error(t("deactivateAdminNotice"));
                }}>
                {t("deactivateButton")}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
