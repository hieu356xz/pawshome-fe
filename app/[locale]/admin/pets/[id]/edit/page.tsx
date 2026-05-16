"use client";

import React, { useState, useEffect } from "react";
import { PetForm } from "@/components/admin/PetForm";
import { petService } from "@/services/pet.service";
import { Pet } from "@/types/pet";
import { useParams } from "next/navigation";
import { Loader2 } from "lucide-react";
import { useTranslations } from "next-intl";

export default function EditPetPage() {
  const t = useTranslations("PetManagement");
  const params = useParams();
  const id = params.id;
  const [pet, setPet] = useState<Pet | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (id) {
      fetchPet(id as string);
    }
  }, [id]);

  const fetchPet = async (petId: string) => {
    try {
      const response = await petService.getPetById(petId);
      setPet(response.data);
    } catch (error) {
      console.error("Failed to fetch pet:", error);
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

  if (!pet) {
    return (
      <div className="text-center py-20">
        <h2 className="text-2xl font-bold text-gray-900">Pet profile not found</h2>
        <p className="text-gray-500 mt-2">The pet profile you are looking for does not exist or has been deleted.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-playfair font-bold text-gray-900 tracking-tight">{t("editPet")}</h1>
        <p className="text-gray-500 mt-1">{pet.name} ({pet.petCode})</p>
      </div>
      <PetForm initialData={pet} isEdit={true} />
    </div>
  );
}
