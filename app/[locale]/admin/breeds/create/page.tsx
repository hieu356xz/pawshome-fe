"use client";

import React from "react";
import { BreedForm } from "@/components/admin/BreedForm";
import { useTranslations } from "next-intl";

export default function CreateBreedPage() {
  const t = useTranslations("BreedManagement");

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-playfair font-bold text-gray-900 tracking-tight">{t("createBreed")}</h1>
        <p className="text-gray-500 mt-1">{t("manageBreedsDesc")}</p>
      </div>
      <BreedForm />
    </div>
  );
}
