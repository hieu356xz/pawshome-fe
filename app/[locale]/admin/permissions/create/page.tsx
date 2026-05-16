"use client";

import React from "react";
import { PermissionForm } from "@/components/admin/PermissionForm";
import { useTranslations } from "next-intl";

export default function CreatePermissionPage() {
  const t = useTranslations("PermissionManagement");

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-playfair font-bold text-gray-900 tracking-tight">{t("createPermission")}</h1>
        <p className="text-gray-500 mt-1">{t("managePermissionsDesc")}</p>
      </div>
      <PermissionForm />
    </div>
  );
}
