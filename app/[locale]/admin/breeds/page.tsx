"use client";

import React, { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { breedService } from "@/services/breed.service";
import { Breed } from "@/types/pet";
import { 
  Search, 
  Dna,
  Plus
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Link } from "@/lib/navigation";

import { AdminTable, Column } from "@/components/admin/AdminTable";
import { AdminTableActions, TableActionIcons } from "@/components/admin/table/AdminTableActions";

export default function BreedManagementPage() {
  const t = useTranslations("BreedManagement");
  const tCommon = useTranslations("AdminCommon");
  const [breeds, setBreeds] = useState<Breed[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    totalPages: 1,
    totalItems: 0,
  });

  useEffect(() => {
    fetchBreeds();
  }, [pagination.page, pagination.limit]);

  const fetchBreeds = async () => {
    setIsLoading(true);
    try {
      const response = await breedService.getAll({
        page: pagination.page,
        limit: pagination.limit,
        search: searchTerm,
      });
      setBreeds(response.data);
      if (response.meta) {
        setPagination((prev) => ({
          ...prev,
          totalPages: response.meta?.totalPages || 1,
          totalItems: response.meta?.totalItems || 0,
        }));
      }
    } catch (error) {
      console.error("Failed to fetch breeds:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const columns: Column<Breed>[] = [
    // ... columns definition remains same ...
    {
      header: t("breedName"),
      cell: (b) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-orange-50 flex items-center justify-center text-orange-500">
            <Dna size={18} />
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-gray-900 tracking-tight">{b.name}</span>
            {b.description && <span className="text-xs text-gray-400 line-clamp-1">{b.description}</span>}
          </div>
        </div>
      ),
    },
    {
      header: t("species"),
      cell: (b) => (
        <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-bold uppercase tracking-wider">
          {b.species?.name}
        </span>
      ),
    },
    {
      header: tCommon("actions"),
      align: "right",
      cell: (b) => (
        <AdminTableActions 
          actions={[
            { label: t("editBreed"), icon: TableActionIcons.Edit, href: `/admin/breeds/${b.id}/edit` },
            { label: t("deleteBreed"), icon: TableActionIcons.Delete, variant: "danger" },
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
          <p className="text-gray-500 mt-1">{t("manageBreedsDesc")}</p>
        </div>
        <div className="flex items-center gap-3">
          <Link 
            href="/admin/breeds/create"
            className="rounded-xl bg-orange-500 hover:bg-orange-600 text-white gap-2 shadow-lg shadow-orange-200 transition-all h-10 px-4 flex items-center justify-center font-medium"
          >
            <Plus size={18} />
            {t("addBreed")}
          </Link>
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm">
        <div className="p-6 border-b border-gray-50">
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
            <div className="relative w-full md:w-96 group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-orange-500 transition-colors" size={18} />
              <Input 
                placeholder={t("searchBreeds")}
                className="pl-12 h-12 rounded-2xl bg-gray-50 border-none focus-visible:ring-2 focus-visible:ring-orange-200 transition-all"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    setPagination({ ...pagination, page: 1 });
                    fetchBreeds();
                  }
                }}
              />
            </div>
          </div>
        </div>

        <AdminTable 
          columns={columns}
          data={breeds}
          isLoading={isLoading}
          emptyMessage={t("noBreedsFound")}
          pagination={{
            currentPage: pagination.page,
            totalPages: pagination.totalPages,
            totalItems: pagination.totalItems,
            onPageChange: (page) => setPagination({ ...pagination, page }),
            showingLabel: tCommon("showing"),
            ofLabel: tCommon("of"),
            itemsLabel: t("breeds"),
            previousLabel: tCommon("previous"),
            nextLabel: tCommon("next")
          }}
        />
      </div>
    </div>
  );
}
