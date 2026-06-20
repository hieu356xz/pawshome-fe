"use client";

import React, { useState, useEffect } from "react";
import { PetForm } from "@/components/admin/PetForm";
import { petService } from "@/services/pet.service";
import { Pet } from "@/types/pet";
import { useParams } from "next/navigation";
import { Loader2 } from "lucide-react";
import { useTranslations } from "next-intl";

import { MedicalRecordsTab } from "@/components/admin/MedicalRecordsTab";

export default function EditPetPage() {
  const t = useTranslations("PetManagement");
  const params = useParams();
  const id = params.id;
  const [pet, setPet] = useState<Pet | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"general" | "medical">("general");

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
      <div className="border-b border-gray-100 pb-5 space-y-4">
        <div>
          <h1 className="text-3xl font-playfair font-bold text-gray-900 tracking-tight">{t("editPet")}</h1>
          <p className="text-gray-500 mt-1">{pet.name} ({pet.petCode})</p>
        </div>
        <div className="flex bg-gray-50 p-1.5 rounded-2xl border border-gray-100/80 w-fit">
          <button
            onClick={() => setActiveTab("general")}
            className={`px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all duration-300 ${
              activeTab === "general"
                ? "bg-white text-orange-600 shadow-sm border border-gray-100/50"
                : "text-gray-400 hover:text-gray-600"
            }`}
          >
            {t("generalInfo")}
          </button>
          <button
            onClick={() => setActiveTab("medical")}
            className={`px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all duration-300 ${
              activeTab === "medical"
                ? "bg-white text-orange-600 shadow-sm border border-gray-100/50"
                : "text-gray-400 hover:text-gray-600"
            }`}
          >
            {t("medicalRecords")}
          </button>
        </div>
      </div>
      
      <div className="mt-6">
        {activeTab === "general" ? (
          <PetForm initialData={pet} isEdit={true} />
        ) : (
          <MedicalRecordsTab petId={pet.id} />
        )}
      </div>
    </div>
  );
}
