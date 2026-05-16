"use client";

import React from "react";
import { PetForm } from "@/components/admin/PetForm";
import { useTranslations } from "next-intl";

export default function CreatePetPage() {
  const t = useTranslations("PetManagement");

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-playfair font-bold text-gray-900 tracking-tight">{t("createPet")}</h1>
        <p className="text-gray-500 mt-1">{t("managePetsDesc")}</p>
      </div>
      <PetForm />
    </div>
  );
}
