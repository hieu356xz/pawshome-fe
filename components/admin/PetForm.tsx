"use client";

import React, { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { 
  Pet, 
  Species, 
  Breed, 
  PetGender, 
  PetAgeGroup, 
  AdoptionStatus 
} from "@/types/pet";
import { petService } from "@/services/pet.service";
import { speciesService } from "@/services/species.service";
import { breedService } from "@/services/breed.service";
import { 
  PawPrint, 
  Type, 
  FileText,
  Info,
  Calendar,
  Layers,
  Activity,
  Heart,
  Scale,
  Palette,
  Hash,
  Image as ImageIcon,
  Syringe,
  Scissors,
  Stethoscope
} from "lucide-react";
import { useRouter } from "next/navigation";

// Modular Admin Form Components
import { AdminFormField } from "./form/AdminFormField";
import { AdminFormSection } from "./form/AdminFormSection";
import { AdminFormHeader } from "./form/AdminFormHeader";
import { AdminFormSelect } from "./form/AdminFormSelect";
import { AdminFormTextArea } from "./form/AdminFormTextArea";
import { AdminFormSwitch } from "./form/AdminFormSwitch";
import { AdminPetGallery } from "./AdminPetGallery";

interface PetFormProps {
  initialData?: Pet;
  isEdit?: boolean;
}

export function PetForm({ initialData, isEdit = false }: PetFormProps) {
  const t = useTranslations("PetManagement");
  const commonT = useTranslations("Common");
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  
  const [species, setSpecies] = useState<Species[]>([]);
  const [filteredBreeds, setFilteredBreeds] = useState<Breed[]>([]);

  const [formData, setFormData] = useState({
    name: initialData?.name || "",
    petCode: initialData?.petCode || "",
    speciesId: initialData?.speciesId || 0,
    breedId: initialData?.breedId || 0,
    gender: initialData?.gender || PetGender.UNKNOWN,
    ageGroup: initialData?.ageGroup || PetAgeGroup.YOUNG,
    adoptionStatus: initialData?.adoptionStatus || AdoptionStatus.SEEKING,
    color: initialData?.color || "",
    weight: initialData?.weight || 0,
    intakeDate: initialData?.intakeDate ? new Date(initialData.intakeDate).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
    description: initialData?.description || "",
    isVaccinated: initialData?.isVaccinated || false,
    isNeutered: initialData?.isNeutered || false,
    healthSummary: initialData?.healthSummary || ""
  });

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    let active = true;
    const fetchBreedsForSpecies = async () => {
      if (formData.speciesId) {
        try {
          const breedRes = await breedService.getAll({
            speciesId: formData.speciesId,
            limit: 100,
          });
          if (active && breedRes.success) {
            setFilteredBreeds(breedRes.data);
            
            // If the current breed is not in the new fetched list and is not 0 (Unknown), reset it to 0
            if (formData.breedId !== 0 && !breedRes.data.some(b => b.id === formData.breedId)) {
              setFormData(prev => ({ 
                ...prev, 
                breedId: 0 
              }));
            }
          }
        } catch (error) {
          console.error("Failed to fetch breeds for species:", error);
        }
      } else {
        if (active) {
          setFilteredBreeds([]);
        }
      }
    };

    fetchBreedsForSpecies();
    return () => {
      active = false;
    };
  }, [formData.speciesId]);

  const fetchData = async () => {
    try {
      const speciesRes = await speciesService.getAll();
      setSpecies(speciesRes.data);
      
      if (!isEdit && speciesRes.data.length > 0) {
        setFormData(prev => ({ ...prev, speciesId: speciesRes.data[0].id }));
      }
    } catch (error) {
      console.error("Failed to fetch data:", error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.speciesId) return;

    setIsLoading(true);
    try {
      const payload = {
        ...formData,
        breedId: formData.breedId || null,
      };

      if (isEdit && initialData?.id) {
        await petService.updatePet(initialData.id, payload);
      } else {
        await petService.createPet(payload);
      }

      router.push("/admin/pets");
      router.refresh();
    } catch (error) {
      console.error("Submit error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8 max-w-6xl animate-in fade-in slide-in-from-bottom-4 duration-700">
      <AdminFormHeader 
        title={isEdit ? t("editPet") : t("addPet")}
        backUrl="/admin/pets"
        backLabel={t("backToPets")}
        submitLabel={isEdit ? t("updatePet") : t("createPet")}
        isLoading={isLoading}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          {/* General Information */}
          <AdminFormSection 
            title={t("generalInfo")} 
            icon={<PawPrint size={20} />}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <AdminFormField 
                id="name"
                label={t("petName")}
                placeholder="e.g. Buddy"
                icon={<Type size={18} />}
                value={formData.name}
                onChange={e => setFormData({...formData, name: e.target.value})}
                required
              />

              <AdminFormField 
                id="petCode"
                label={t("petCode")}
                placeholder="e.g. PH-101"
                icon={<Hash size={18} />}
                value={formData.petCode}
                onChange={e => setFormData({...formData, petCode: e.target.value})}
                required
              />

              <AdminFormSelect 
                id="speciesId"
                label={t("species")}
                icon={<Info size={18} />}
                options={species.map(s => ({ label: s.name, value: s.id }))}
                value={formData.speciesId}
                onChange={e => setFormData({...formData, speciesId: parseInt(e.target.value)})}
                required
              />

              <AdminFormSelect 
                id="breedId"
                label={t("breed")}
                icon={<Layers size={18} />}
                options={[
                  { label: commonT("unknown"), value: 0 },
                  ...filteredBreeds.map(b => ({ label: b.name, value: b.id }))
                ]}
                value={formData.breedId}
                onChange={e => setFormData({...formData, breedId: parseInt(e.target.value) || 0})}
                disabled={filteredBreeds.length === 0}
              />

              <AdminFormSelect 
                id="gender"
                label={t("gender")}
                icon={<Activity size={18} />}
                options={[
                  { label: t("Genders.male"), value: PetGender.MALE },
                  { label: t("Genders.female"), value: PetGender.FEMALE },
                  { label: t("Genders.unknown"), value: PetGender.UNKNOWN }
                ]}
                value={formData.gender}
                onChange={e => setFormData({...formData, gender: e.target.value as PetGender})}
                required
              />

              <AdminFormSelect 
                id="ageGroup"
                label={t("ageGroup")}
                icon={<Calendar size={18} />}
                options={[
                  { label: t("AgeGroups.newborn"), value: PetAgeGroup.NEWBORN },
                  { label: t("AgeGroups.young"), value: PetAgeGroup.YOUNG },
                  { label: t("AgeGroups.adult"), value: PetAgeGroup.ADULT },
                  { label: t("AgeGroups.senior"), value: PetAgeGroup.SENIOR }
                ]}
                value={formData.ageGroup}
                onChange={e => setFormData({...formData, ageGroup: e.target.value as PetAgeGroup})}
                required
              />
            </div>
          </AdminFormSection>

          {/* Bio / Description */}
          <AdminFormSection 
            title={t("description")} 
            icon={<FileText size={20} />}
          >
            <AdminFormTextArea 
              id="description"
              label={t("description")}
              placeholder="Tell Buddy's story..."
              icon={<Heart size={18} />}
              value={formData.description}
              onChange={e => setFormData({...formData, description: e.target.value})}
            />
          </AdminFormSection>

          {/* Health Summary */}
          <AdminFormSection 
            title={t("healthSummary")} 
            icon={<Stethoscope size={20} />}
          >
            <AdminFormTextArea 
              id="healthSummary"
              label={t("healthSummary")}
              placeholder="Provide a summary of medical history, allergies, or special needs..."
              icon={<Activity size={18} />}
              value={formData.healthSummary}
              onChange={e => setFormData({...formData, healthSummary: e.target.value})}
            />
          </AdminFormSection>

          {/* Media / Photos */}
          <AdminFormSection 
            title={t("media")} 
            icon={<ImageIcon size={20} />}
          >
            {isEdit && initialData?.id ? (
              <AdminPetGallery petId={initialData.id} />
            ) : (
              <div className="p-8 text-center bg-gray-50 rounded-2xl border border-gray-100">
                <p className="text-sm text-gray-500">
                  Photos can be uploaded after the pet profile is created.
                </p>
              </div>
            )}
          </AdminFormSection>
        </div>

        {/* Sidebar Settings */}
        <div className="space-y-8">
          <div className="bg-white rounded-3xl border border-gray-100 p-8 shadow-sm space-y-6">
            <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2 uppercase tracking-wider">
              <Activity size={18} className="text-orange-500" />
              {t("healthAndAdoption")}
            </h3>
            
            <AdminFormSelect 
              id="adoptionStatus"
              label={t("status")}
              options={[
                { label: t("AdoptionStatuses.new_intake"), value: AdoptionStatus.NEW_INTAKE },
                { label: t("AdoptionStatuses.seeking"), value: AdoptionStatus.SEEKING },
                { label: t("AdoptionStatuses.pending"), value: AdoptionStatus.PENDING },
                { label: t("AdoptionStatuses.foster"), value: AdoptionStatus.FOSTER },
                { label: t("AdoptionStatuses.adopted"), value: AdoptionStatus.ADOPTED },
                { label: t("AdoptionStatuses.permanent_foster"), value: AdoptionStatus.PERMANENT_FOSTER }
              ]}
              value={formData.adoptionStatus}
              onChange={e => setFormData({...formData, adoptionStatus: e.target.value as AdoptionStatus})}
              required
            />

            <div className="grid grid-cols-1 gap-4">
              <AdminFormSwitch 
                id="isVaccinated"
                label={t("isVaccinated")}
                icon={<Syringe size={18} />}
                checked={formData.isVaccinated}
                onCheckedChange={checked => setFormData({...formData, isVaccinated: checked})}
              />

              <AdminFormSwitch 
                id="isNeutered"
                label={t("isNeutered")}
                icon={<Scissors size={18} />}
                checked={formData.isNeutered}
                onCheckedChange={checked => setFormData({...formData, isNeutered: checked})}
              />
            </div>

            <div className="grid grid-cols-1 gap-6">
              <AdminFormField 
                id="color"
                label={t("color")}
                placeholder="e.g. White & Brown"
                icon={<Palette size={18} />}
                value={formData.color}
                required
                onChange={e => setFormData({...formData, color: e.target.value})}
              />

              <AdminFormField 
                id="weight"
                label={t("weight")}
                type="number"
                step="0.1"
                icon={<Scale size={18} />}
                value={formData.weight}
                onChange={e => setFormData({...formData, weight: parseFloat(e.target.value)})}
              />

              <AdminFormField 
                id="intakeDate"
                label={t("intakeDate")}
                type="date"
                icon={<Calendar size={18} />}
                value={formData.intakeDate}
                onChange={e => setFormData({...formData, intakeDate: e.target.value})}
                required
              />
            </div>
          </div>

          {/* Quick Stats / Info Card */}
          <div className="bg-orange-50 rounded-3xl p-8 border border-orange-100">
            <h4 className="text-orange-900 font-bold text-sm mb-4">Summary</h4>
            <div className="space-y-3">
              <div className="flex justify-between items-center text-xs">
                <span className="text-orange-700/60 font-medium">Pet Code</span>
                <span className="text-orange-900 font-bold">{formData.petCode || "---"}</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-orange-700/60 font-medium">Category</span>
                <span className="text-orange-900 font-bold">
                  {species.find(s => s.id === formData.speciesId)?.name} / {filteredBreeds.find(b => b.id === formData.breedId)?.name || commonT("unknown")}
                </span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-orange-700/60 font-medium">Status</span>
                <span className="px-2 py-0.5 bg-orange-100 text-orange-600 rounded-md font-bold">
                  {t(`AdoptionStatuses.${formData.adoptionStatus}`)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
}
