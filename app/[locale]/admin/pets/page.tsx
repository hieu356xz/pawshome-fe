"use client";

import React, { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { petService } from "@/services/pet.service";
import { speciesService } from "@/services/species.service";
import { Pet, Species, AdoptionStatus } from "@/types/pet";
import { 
  Search, 
  Plus,
  PawPrint,
  Filter,
  Hash
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Link } from "@/lib/navigation";

import { AdminTable, Column } from "@/components/admin/AdminTable";
import { AdminTableFilters, FilterGroup } from "@/components/admin/AdminTableFilters";
import { StatusCell, BadgeGroupCell, DateCell } from "@/components/admin/table/AdminTableCells";
import { AdminTableActions, TableActionIcons } from "@/components/admin/table/AdminTableActions";

export default function PetManagementPage() {
  const t = useTranslations("PetManagement");
  const tCommon = useTranslations("AdminCommon");
  const [pets, setPets] = useState<Pet[]>([]);
  const [species, setSpecies] = useState<Species[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [speciesFilter, setSpeciesFilter] = useState<string | null>(null);

  useEffect(() => {
    fetchPets();
    fetchSpecies();
  }, []);

  const fetchPets = async () => {
    setIsLoading(true);
    try {
      const response = await petService.getPets();
      setPets(response.data);
    } catch (error) {
      console.error("Failed to fetch pets:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchSpecies = async () => {
    try {
      const response = await speciesService.getAll();
      setSpecies(response.data);
    } catch (error) {
      console.error("Failed to fetch species:", error);
    }
  };

  const filteredPets = pets.filter(pet => {
    const matchesSearch = 
      pet.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pet.petCode.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = !statusFilter || pet.adoptionStatus === statusFilter;
    const matchesSpecies = !speciesFilter || pet.speciesId === parseInt(speciesFilter);
    
    return matchesSearch && matchesStatus && matchesSpecies;
  });

  const filterGroups: FilterGroup[] = [
    {
      id: "status",
      label: t("status"),
      activeValue: statusFilter,
      onSelect: setStatusFilter,
      options: [
        { label: t("AdoptionStatuses.seeking"), value: AdoptionStatus.SEEKING },
        { label: t("AdoptionStatuses.adopted"), value: AdoptionStatus.ADOPTED },
        { label: t("AdoptionStatuses.foster"), value: AdoptionStatus.FOSTER },
        { label: t("AdoptionStatuses.pending"), value: AdoptionStatus.PENDING }
      ]
    },
    {
      id: "species",
      label: t("species"),
      activeValue: speciesFilter,
      onSelect: setSpeciesFilter,
      options: species.map(s => ({ label: s.name, value: s.id.toString() }))
    }
  ];

  const columns: Column<Pet>[] = [
    {
      header: t("petName"),
      cell: (pet) => (
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl overflow-hidden bg-orange-100 flex items-center justify-center border-2 border-white shadow-sm">
            {pet.images && pet.images.find(img => img.isPrimary) ? (
              <img 
                src={pet.images.find(img => img.isPrimary)?.imageUrl} 
                alt={pet.name} 
                className="w-full h-full object-cover" 
              />
            ) : (
              <PawPrint className="text-orange-600" size={20} />
            )}
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-gray-900 tracking-tight">{pet.name}</span>
            <span className="text-[10px] text-gray-400 flex items-center gap-1 font-bold uppercase tracking-wider">
              <Hash size={10} />
              {pet.petCode}
            </span>
          </div>
        </div>
      ),
    },
    {
      header: t("species"),
      cell: (pet) => (
        <div className="flex flex-col">
          <span className="text-sm font-bold text-gray-700">{pet.species?.name}</span>
          <span className="text-xs text-gray-400">{pet.breed?.name}</span>
        </div>
      ),
    },
    {
      header: t("gender"),
      cell: (pet) => (
        <span className="text-sm font-medium text-gray-600">
          {t(`Genders.${pet.gender}`)}
        </span>
      ),
    },
    {
      header: t("status"),
      cell: (pet) => (
        <StatusCell 
          status={t(`AdoptionStatuses.${pet.adoptionStatus}`)} 
          variant={
            pet.adoptionStatus === AdoptionStatus.ADOPTED ? "success" : 
            pet.adoptionStatus === AdoptionStatus.SEEKING ? "info" : 
            pet.adoptionStatus === AdoptionStatus.PENDING ? "warning" : "default"
          }
        />
      ),
    },
    {
      header: t("intakeDate"),
      cell: (pet) => <DateCell date={pet.intakeDate} />,
    },
    {
      header: tCommon("actions"),
      align: "right",
      cell: (pet) => (
        <AdminTableActions 
          actions={[
            { label: t("editPet"), icon: TableActionIcons.Edit, href: `/admin/pets/${pet.id}/edit` },
            { label: t("deletePet"), icon: TableActionIcons.Delete, variant: "danger" },
          ]}
        />
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-playfair font-bold text-gray-900">{t("title")}</h1>
          <p className="text-gray-500 mt-1">{t("managePetsDesc")}</p>
        </div>
        <div className="flex items-center gap-3">
          <Link 
            href="/admin/pets/create"
            className="rounded-xl bg-orange-500 hover:bg-orange-600 text-white gap-2 shadow-lg shadow-orange-200 transition-all h-10 px-4 flex items-center justify-center font-medium"
          >
            <Plus size={18} />
            {t("addPet")}
          </Link>
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-50">
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
            <div className="relative w-full md:w-96 group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-orange-500 transition-colors" size={18} />
              <Input 
                placeholder={t("searchPets")}
                className="pl-12 h-12 rounded-2xl bg-gray-50 border-none focus-visible:ring-2 focus-visible:ring-orange-200 transition-all"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <div className="flex-1 md:flex md:justify-end">
              <AdminTableFilters 
                groups={filterGroups}
                onClearAll={() => {
                  setStatusFilter(null);
                  setSpeciesFilter(null);
                }}
              />
            </div>
          </div>
        </div>

        <AdminTable 
          columns={columns}
          data={filteredPets}
          isLoading={isLoading}
          emptyMessage={t("noPetsFound")}
          pagination={{
            currentPage: 1,
            totalPages: 1,
            totalItems: filteredPets.length,
            onPageChange: () => {},
            showingLabel: tCommon("showing"),
            ofLabel: tCommon("of"),
            itemsLabel: t("pets"),
            previousLabel: tCommon("previous"),
            nextLabel: tCommon("next")
          }}
        />
      </div>
    </div>
  );
}
