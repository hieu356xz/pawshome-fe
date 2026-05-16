"use client";

import React, { useState, useEffect } from "react";
import { BreedForm } from "@/components/admin/BreedForm";
import { breedService } from "@/services/breed.service";
import { Breed } from "@/types/pet";
import { useParams } from "next/navigation";
import { Loader2 } from "lucide-react";
import { useTranslations } from "next-intl";

export default function EditBreedPage() {
  const t = useTranslations("BreedManagement");
  const params = useParams();
  const id = params.id;
  const [breed, setBreed] = useState<Breed | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (id) {
      fetchBreed(parseInt(id as string));
    }
  }, [id]);

  const fetchBreed = async (breedId: number) => {
    try {
      const response = await breedService.getById(breedId);
      setBreed(response.data);
    } catch (error) {
      console.error("Failed to fetch breed:", error);
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

  if (!breed) {
    return (
      <div className="text-center py-20">
        <h2 className="text-2xl font-bold text-gray-900">Breed not found</h2>
        <p className="text-gray-500 mt-2">The breed you are looking for does not exist or has been deleted.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-playfair font-bold text-gray-900 tracking-tight">{t("editBreed")}</h1>
        <p className="text-gray-500 mt-1">{breed.name}</p>
      </div>
      <BreedForm initialData={breed} isEdit={true} />
    </div>
  );
}
