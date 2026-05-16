"use client";

import React from "react";
import { UserForm } from "@/components/admin/UserForm";
import { useTranslations } from "next-intl";

export default function CreateUserPage() {
  const t = useTranslations("UserManagement");
  
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-playfair font-bold text-gray-900 tracking-tight">{t("createUser")}</h1>
        <p className="text-gray-500 mt-1">{t("createMemberDesc")}</p>
      </div>
      <UserForm isEdit={false} />
    </div>
  );
}
