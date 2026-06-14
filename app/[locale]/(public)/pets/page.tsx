"use client";

import { useState, useEffect, useCallback } from "react";
import { useTranslations } from "next-intl";
import {
  Search,
  X,
  ChevronLeft,
  ChevronRight,
  Loader2,
  PawPrint,
  SlidersHorizontal,
  Hash,
  Palette,
} from "lucide-react";
import { PetCard } from "@/components/shared/PetCard";
import { PageHeader } from "@/components/shared/PageHeader";
import { AppPagination } from "@/components/shared/AppPagination";
import { petService } from "@/services/pet.service";
import { speciesService } from "@/services/species.service";
import { breedService } from "@/services/breed.service";
import {
  Pet,
  Species,
  Breed,
  PetGender,
  PetAgeGroup,
  AdoptionStatus,
} from "@/types/pet";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function PetListPage() {
  const t = useTranslations("PetList");
  const pt = useTranslations("PetManagement");
  const navbarT = useTranslations("Navbar");

  // State for data
  const [pets, setPets] = useState<Pet[]>([]);
  const [species, setSpecies] = useState<Species[]>([]);
  const [breeds, setBreeds] = useState<Breed[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalCount, setTotalCount] = useState(0);

  // State for filters
  const [search, setSearch] = useState("");
  const [petCode, setPetCode] = useState("");
  const [selectedSpecies, setSelectedSpecies] = useState<string>("all");
  const [selectedBreed, setSelectedBreed] = useState<string>("all");
  const [selectedGender, setSelectedGender] = useState<string>("all");
  const [selectedAge, setSelectedAge] = useState<string>("all");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [selectedColor, setSelectedColor] = useState("");
  const [page, setPage] = useState(1);
  const pageSize = 8;

  const fetchPets = useCallback(async () => {
    setLoading(true);
    try {
      const response = await petService.getPets({
        page,
        limit: pageSize,
        petCode: petCode || undefined,
        speciesId:
          selectedSpecies !== "all" ? parseInt(selectedSpecies) : undefined,
        breedId: selectedBreed !== "all" ? parseInt(selectedBreed) : undefined,
        gender:
          selectedGender !== "all" ? (selectedGender as PetGender) : undefined,
        ageGroup:
          selectedAge !== "all" ? (selectedAge as PetAgeGroup) : undefined,
        adoptionStatus:
          selectedStatus !== "all"
            ? (selectedStatus as AdoptionStatus)
            : undefined,
        color: selectedColor || undefined,
      });

      if (response.success) {
        setPets(response.data);
        setTotalCount(response.meta?.totalItems || response.data.length);
      }
    } catch (error) {
      console.error("Failed to fetch pets:", error);
    } finally {
      setTimeout(() => setLoading(false), 300);
    }
  }, [
    page,
    petCode,
    selectedSpecies,
    selectedBreed,
    selectedGender,
    selectedAge,
    selectedStatus,
    selectedColor,
  ]);

  useEffect(() => {
    const initFilters = async () => {
      const [speciesRes, allBreedsRes] = await Promise.all([
        speciesService.getAll(),
        breedService.getAll(),
      ]);
      if (speciesRes.success) setSpecies(speciesRes.data);
      if (allBreedsRes.success) setBreeds(allBreedsRes.data);
    };
    initFilters();
  }, []);

  useEffect(() => {
    const updateBreeds = async () => {
      if (selectedSpecies !== "all") {
        const breedRes = await breedService.getAll({
          speciesId: parseInt(selectedSpecies),
        });
        if (breedRes.success) setBreeds(breedRes.data);
      } else {
        const allBreedsRes = await breedService.getAll();
        if (allBreedsRes.success) setBreeds(allBreedsRes.data);
      }
    };
    updateBreeds();
  }, [selectedSpecies]);

  useEffect(() => {
    fetchPets();
  }, [fetchPets]);

  const handleReset = () => {
    setSearch("");
    setPetCode("");
    setSelectedSpecies("all");
    setSelectedBreed("all");
    setSelectedGender("all");
    setSelectedAge("all");
    setSelectedStatus("all");
    setSelectedColor("");
    setPage(1);
  };

  const totalPages = Math.ceil(totalCount / pageSize);

  return (
    <div className="min-h-screen bg-[#faf9f6] pb-24">
      {/* Optimized Hero Section */}
      <PageHeader
        title={t("title")}
        description={t("subtitle")}
        badgeIcon={PawPrint}
        badgeText={navbarT("pets")}
        variant="primary"
      />

      <div className="container mx-auto px-4 md:px-8 mt-12 flex flex-col min-h-[800px]">
        <div className="flex flex-col lg:flex-row gap-12 flex-1">
          {/* Sidebar */}
          <aside className="w-full lg:w-80 flex-shrink-0">
            <div className="bg-white rounded-[1.5rem] border border-border/30 shadow-sm p-8 sticky top-24 max-h-[calc(100vh-8rem)] overflow-y-auto custom-scrollbar">
              <div className="flex items-center justify-between mb-6 pb-4 border-b border-border/40">
                <div className="flex items-center gap-2.5">
                  <SlidersHorizontal className="h-4 w-4 text-primary" />
                  <h2 className="font-serif text-lg font-bold text-foreground">
                    {t("filters")}
                  </h2>
                </div>
                {(selectedSpecies !== "all" ||
                  selectedBreed !== "all" ||
                  selectedGender !== "all" ||
                  selectedAge !== "all" ||
                  selectedStatus !== "all" ||
                  petCode ||
                  selectedColor) && (
                  <button
                    onClick={handleReset}
                    className="h-7 w-7 rounded-full bg-muted/50 flex items-center justify-center text-muted-foreground hover:bg-red-50 hover:text-red-500 transition-all"
                    title={t("clearFilters")}>
                    <X className="h-3.5 w-3.5" />
                  </button>
                )}
              </div>

              <div className="space-y-8">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-[0.15em] text-muted-foreground/80 px-1 flex items-center gap-2">
                    <Hash className="h-3 w-3" />
                    {pt("petCode")}
                  </label>
                  <Input
                    placeholder={t("petCodePlaceholder")}
                    value={petCode}
                    onChange={(e) => {
                      setPetCode(e.target.value);
                      setPage(1);
                    }}
                    className="h-10 bg-muted/20 border-none rounded-xl text-sm focus-visible:ring-1"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-[0.15em] text-muted-foreground/80 px-1">
                    {t("statusLabel")}
                  </label>
                  <select
                    value={selectedStatus}
                    onChange={(e) => {
                      setSelectedStatus(e.target.value);
                      setPage(1);
                    }}
                    className="w-full h-10 px-3 py-1 rounded-xl border-none bg-muted/20 text-xs font-medium focus:ring-1 outline-none appearance-none cursor-pointer">
                    <option value="all">{t("all")}</option>
                    {Object.entries(AdoptionStatus).map(([key, value]) => (
                      <option key={key} value={value}>
                        {pt(`AdoptionStatuses.${value.toLowerCase()}`)}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-[0.15em] text-muted-foreground/80 px-1">
                    {t("speciesLabel")}
                  </label>
                  <select
                    value={selectedSpecies}
                    onChange={(e) => {
                      setSelectedSpecies(e.target.value);
                      setPage(1);
                    }}
                    className="w-full h-10 px-3 py-1 rounded-xl border-none bg-muted/20 text-xs font-medium focus:ring-1 outline-none appearance-none cursor-pointer">
                    <option value="all">{t("all")}</option>
                    {species.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-[0.15em] text-muted-foreground/80 px-1">
                    {t("breedLabel")}
                  </label>
                  <select
                    value={selectedBreed}
                    onChange={(e) => {
                      setSelectedBreed(e.target.value);
                      setPage(1);
                    }}
                    className="w-full h-10 px-3 py-1 rounded-xl border-none bg-muted/20 text-xs font-medium focus:ring-1 outline-none appearance-none cursor-pointer">
                    <option value="all">{t("all")}</option>
                    {breeds.map((b) => (
                      <option key={b.id} value={b.id}>
                        {b.name} {b.species ? `(${b.species.name})` : ""}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-[0.15em] text-muted-foreground/80 px-1">
                    {t("genderLabel")}
                  </label>
                  <select
                    value={selectedGender}
                    onChange={(e) => {
                      setSelectedGender(e.target.value);
                      setPage(1);
                    }}
                    className="w-full h-10 px-3 py-1 rounded-xl border-none bg-muted/20 text-xs font-medium focus:ring-1 outline-none appearance-none cursor-pointer">
                    <option value="all">{t("all")}</option>
                    {Object.entries(PetGender).map(([key, value]) => (
                      <option key={key} value={value}>
                        {pt(`Genders.${value.toLowerCase()}`)}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-[0.15em] text-muted-foreground/80 px-1">
                    {t("ageGroupLabel")}
                  </label>
                  <select
                    value={selectedAge}
                    onChange={(e) => {
                      setSelectedAge(e.target.value);
                      setPage(1);
                    }}
                    className="w-full h-10 px-3 py-1 rounded-xl border-none bg-muted/20 text-xs font-medium focus:ring-1 outline-none appearance-none cursor-pointer">
                    <option value="all">{t("all")}</option>
                    {Object.entries(PetAgeGroup).map(([key, value]) => (
                      <option key={key} value={value}>
                        {pt(`AgeGroups.${value.toLowerCase()}`)}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-[0.15em] text-muted-foreground/80 px-1 flex items-center gap-2">
                    <Palette className="h-3 w-3" />
                    {t("colorLabel")}
                  </label>
                  <Input
                    placeholder={t("colorPlaceholder")}
                    value={selectedColor}
                    onChange={(e) => {
                      setSelectedColor(e.target.value);
                      setPage(1);
                    }}
                    className="h-10 bg-muted/20 border-none rounded-xl text-sm focus-visible:ring-1"
                  />
                </div>
              </div>
            </div>
          </aside>

          {/* Main Content Area */}
          <main className="flex-1 flex flex-col">
            {loading ? (
              <div className="flex flex-col items-center justify-center min-h-[500px] text-muted-foreground space-y-4">
                <Loader2 className="h-12 w-12 animate-spin text-primary/30" />
                <p className="font-serif text-lg font-bold animate-pulse">
                  {t("loading")}
                </p>
              </div>
            ) : pets.length > 0 ? (
              <div className="flex-1 flex flex-col justify-between">
                <div className="flex items-center justify-between mb-8">
                  <p className="text-sm text-muted-foreground">
                    {t("showing")}{" "}
                    <span className="font-bold text-foreground">
                      {pets.length}
                    </span>
                    {" " + t("of") + " "}
                    <span className="font-bold text-foreground">
                      {totalCount}
                    </span>{" "}
                    {pt("pets").toLowerCase()}
                  </p>
                </div>
                {/* Fixed min-height container for the grid to keep layout stable */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6 mb-12">
                  {pets.map((pet, index) => (
                    <div
                      key={pet.id}
                      className="animate-in fade-in slide-in-from-bottom-4 duration-500"
                      style={{ animationDelay: `${index * 50}ms` }}>
                      <PetCard
                        id={pet.id}
                        name={pet.name}
                        ageGroup={pt(`AgeGroups.${pet.ageGroup.toLowerCase()}`)}
                        breed={pet.breed?.name || t("unknown")}
                        species={pet.species?.name || t("unknown")}
                        gender={pt(`Genders.${pet.gender.toLowerCase()}`)}
                        adoptionStatus={pt(
                          `AdoptionStatuses.${pet.adoptionStatus.toLowerCase()}`,
                        )}
                        imageUrl={
                          pet.images?.find((i) => i.isPrimary)?.imageUrl ||
                          pet.images?.[0]?.imageUrl
                        }
                      />
                    </div>
                  ))}
                </div>

                {/* Pagination pushed to the bottom */}
                <div className="pt-8 border-t border-border/20">
                  <AppPagination
                    currentPage={page}
                    totalPages={totalPages}
                    onPageChange={setPage}
                  />
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-[1.5rem] border border-border/30 border-dashed p-12 text-center flex flex-col items-center justify-center min-h-[500px] flex-1">
                <div className="bg-primary/5 p-6 rounded-full mb-6">
                  <PawPrint className="h-10 w-10 text-primary/20" />
                </div>
                <h3 className="font-serif text-xl font-bold text-foreground mb-3">
                  {t("noPetsFound")}
                </h3>
                <p className="text-muted-foreground max-w-sm mb-8 text-sm leading-relaxed">
                  {t("noPetsFoundDesc")}
                </p>
                <Button
                  onClick={handleReset}
                  variant="default"
                  size="sm"
                  className="rounded-xl px-8 h-10 bg-primary hover:bg-primary/90 shadow-md transition-all">
                  {t("clearFilters")}
                </Button>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
