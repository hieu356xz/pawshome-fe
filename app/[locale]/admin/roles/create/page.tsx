"use client";

import React from "react";
import { RoleForm } from "@/components/admin/RoleForm";
import { useTranslations } from "next-intl";

export default function CreateRolePage() {
  const t = useTranslations("RoleManagement");

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-playfair font-bold text-gray-900 tracking-tight">{t("createRole")}</h1>
        <p className="text-gray-500 mt-1">{t("manageRolesDesc")}</p>
      </div>
      <RoleForm />
    </div>
  );
}
