"use client";

import React, { useState, useEffect } from "react";
import { SpeciesForm } from "@/components/admin/SpeciesForm";
import { speciesService } from "@/services/species.service";
import { Species } from "@/types/pet";
import { useParams } from "next/navigation";
import { Loader2 } from "lucide-react";
import { useTranslations } from "next-intl";

export default function EditSpeciesPage() {
  const t = useTranslations("SpeciesManagement");
  const params = useParams();
  const id = params.id;
  const [species, setSpecies] = useState<Species | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (id) {
      fetchSpecies(parseInt(id as string));
    }
  }, [id]);

  const fetchSpecies = async (speciesId: number) => {
    try {
      const response = await speciesService.getById(speciesId);
      setSpecies(response.data);
    } catch (error) {
      console.error("Failed to fetch species:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="h-[60vh] flex items-center justify-center">
        <Loader2 className="w-10 h-10 text-orange-500 animate-spin" />
      </div>
    );
  }

  if (!species) {
    return (
      <div className="text-center py-20">
        <h2 className="text-2xl font-bold text-gray-900">Species not found</h2>
        <p className="text-gray-500 mt-2">The species you are looking for does not exist or has been deleted.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-playfair font-bold text-gray-900 tracking-tight">{t("editSpecies")}</h1>
        <p className="text-gray-500 mt-1">{species.name}</p>
      </div>
      <SpeciesForm initialData={species} isEdit={true} />
    </div>
  );
}
