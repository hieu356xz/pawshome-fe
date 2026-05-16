"use client";

import React, { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { Breed, Species } from "@/types/pet";
import { breedService } from "@/services/breed.service";
import { speciesService } from "@/services/species.service";
import { 
  Dna, 
  Type, 
  FileText,
  Info,
  CheckCircle2
} from "lucide-react";
import { useRouter } from "next/navigation";

// Modular Admin Form Components
import { AdminFormField } from "./form/AdminFormField";
import { AdminFormSection } from "./form/AdminFormSection";
import { AdminFormHeader } from "./form/AdminFormHeader";
import { AdminFormSelect } from "./form/AdminFormSelect";

interface BreedFormProps {
  initialData?: Breed;
  isEdit?: boolean;
}

export function BreedForm({ initialData, isEdit = false }: BreedFormProps) {
  const t = useTranslations("BreedManagement");
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [species, setSpecies] = useState<Species[]>([]);

  const [formData, setFormData] = useState({
    name: initialData?.name || "",
    description: initialData?.description || "",
    speciesId: initialData?.speciesId || (species.length > 0 ? species[0].id : 0)
  });

  useEffect(() => {
    fetchSpecies();
  }, []);

  useEffect(() => {
    if (species.length > 0 && !formData.speciesId) {
      setFormData(prev => ({ ...prev, speciesId: species[0].id }));
    }
  }, [species]);

  const fetchSpecies = async () => {
    try {
      const response = await speciesService.getAll();
      setSpecies(response.data);
    } catch (error) {
      console.error("Failed to fetch species:", error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.speciesId) return;

    setIsLoading(true);
    try {
      if (isEdit && initialData?.id) {
        await breedService.update(initialData.id, formData);
      } else {
        await breedService.create(formData);
      }

      router.push("/admin/breeds");
      router.refresh();
    } catch (error) {
      console.error("Submit error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8 max-w-5xl animate-in fade-in slide-in-from-bottom-4 duration-700">
      <AdminFormHeader 
        title={isEdit ? t("editBreed") : t("addBreed")}
        backUrl="/admin/breeds"
        backLabel={t("backToBreeds")}
        submitLabel={isEdit ? t("updateBreed") : t("createBreed")}
        isLoading={isLoading}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <AdminFormSection 
            title={t("generalInfo")} 
            icon={<Dna size={20} />}
          >
            <div className="grid grid-cols-1 gap-6">
              <AdminFormSelect 
                id="speciesId"
                label={t("species")}
                icon={<Info size={18} />}
                options={species.map(s => ({ label: s.name, value: s.id }))}
                value={formData.speciesId}
                onChange={e => setFormData({...formData, speciesId: parseInt(e.target.value)})}
                required
              />

              <AdminFormField 
                id="name"
                label={t("breedName")}
                placeholder="e.g. Golden Retriever"
                icon={<Type size={18} />}
                value={formData.name}
                onChange={e => setFormData({...formData, name: e.target.value})}
                required
              />

              <AdminFormField 
                id="description"
                label={t("description")}
                placeholder="Describe this breed's characteristics..."
                icon={<FileText size={18} />}
                value={formData.description || ""}
                onChange={e => setFormData({...formData, description: e.target.value})}
              />
            </div>
          </AdminFormSection>
        </div>

        <div className="space-y-8">
          <div className="bg-white rounded-3xl border border-gray-100 p-8 shadow-sm space-y-6">
            <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2">
              <CheckCircle2 size={18} className="text-orange-500" />
              Information
            </h3>
            
            <div className="p-4 bg-orange-50/50 rounded-2xl border border-orange-100 space-y-3">
              <p className="text-xs text-orange-700/70 leading-relaxed">
                Breeds are specific to a species. Make sure to select the correct species before creating a breed.
              </p>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between text-xs font-bold text-gray-400 uppercase tracking-widest px-1">
                <span>Summary</span>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm py-2 border-b border-gray-50">
                  <span className="text-gray-500">Species</span>
                  <span className="font-bold text-gray-900">
                    {species.find(s => s.id === formData.speciesId)?.name || "Not selected"}
                  </span>
                </div>
                <div className="flex justify-between text-sm py-2">
                  <span className="text-gray-500">Name</span>
                  <span className="font-bold text-gray-900">{formData.name || "None"}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
}
