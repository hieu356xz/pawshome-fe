"use client";

import React, { useState } from "react";
import { useTranslations } from "next-intl";
import { Species } from "@/types/pet";
import { speciesService } from "@/services/species.service";
import { 
  Footprints, 
  Type, 
  FileText,
  CheckCircle2
} from "lucide-react";
import { useRouter } from "next/navigation";

// Modular Admin Form Components
import { AdminFormField } from "./form/AdminFormField";
import { AdminFormSection } from "./form/AdminFormSection";
import { AdminFormHeader } from "./form/AdminFormHeader";

interface SpeciesFormProps {
  initialData?: Species;
  isEdit?: boolean;
}

export function SpeciesForm({ initialData, isEdit = false }: SpeciesFormProps) {
  const t = useTranslations("SpeciesManagement");
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: initialData?.name || "",
    description: initialData?.description || ""
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      if (isEdit && initialData?.id) {
        await speciesService.update(initialData.id, formData);
      } else {
        await speciesService.create(formData);
      }

      router.push("/admin/species");
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
        title={isEdit ? t("editSpecies") : t("addSpecies")}
        backUrl="/admin/species"
        backLabel={t("backToSpecies")}
        submitLabel={isEdit ? t("updateSpecies") : t("createSpecies")}
        isLoading={isLoading}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <AdminFormSection 
            title={t("generalInfo")} 
            icon={<Footprints size={20} />}
          >
            <div className="grid grid-cols-1 gap-6">
              <AdminFormField 
                id="name"
                label={t("speciesName")}
                placeholder="e.g. Dog, Cat, Bird..."
                icon={<Type size={18} />}
                value={formData.name}
                onChange={e => setFormData({...formData, name: e.target.value})}
                required
              />

              <AdminFormField 
                id="description"
                label={t("description")}
                placeholder="Describe this species..."
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
              Guidelines
            </h3>
            
            <div className="p-4 bg-orange-50/50 rounded-2xl border border-orange-100 space-y-3">
              <p className="text-xs text-orange-700/70 leading-relaxed">
                Species are the top-level categories for pets. Breeds will be grouped under these species.
              </p>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
}
