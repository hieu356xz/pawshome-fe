"use client";

import React from "react";
import { SpeciesForm } from "@/components/admin/SpeciesForm";
import { useTranslations } from "next-intl";

export default function CreateSpeciesPage() {
  const t = useTranslations("SpeciesManagement");

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-playfair font-bold text-gray-900 tracking-tight">{t("createSpecies")}</h1>
        <p className="text-gray-500 mt-1">{t("manageSpeciesDesc")}</p>
      </div>
      <SpeciesForm />
    </div>
  );
}
