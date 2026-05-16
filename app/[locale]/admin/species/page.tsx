"use client";

import React, { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { speciesService } from "@/services/species.service";
import { Species } from "@/types/pet";
import { 
  Search, 
  Footprints,
  Plus
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Link } from "@/lib/navigation";

import { AdminTable, Column } from "@/components/admin/AdminTable";
import { AdminTableActions, TableActionIcons } from "@/components/admin/table/AdminTableActions";

export default function SpeciesManagementPage() {
  const t = useTranslations("SpeciesManagement");
  const tCommon = useTranslations("AdminCommon");
  const [species, setSpecies] = useState<Species[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    totalPages: 1,
    totalItems: 0,
  });

  useEffect(() => {
    fetchSpecies();
  }, [pagination.page, pagination.limit]);

  const fetchSpecies = async () => {
    setIsLoading(true);
    try {
      const response = await speciesService.getAll({
        page: pagination.page,
        limit: pagination.limit,
        search: searchTerm,
      });
      setSpecies(response.data);
      if (response.meta) {
        setPagination((prev) => ({
          ...prev,
          totalPages: response.meta?.totalPages || 1,
          totalItems: response.meta?.totalItems || 0,
        }));
      }
    } catch (error) {
      console.error("Failed to fetch species:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const columns: Column<Species>[] = [
    // ... columns definition remains same ...
    {
      header: t("speciesName"),
      cell: (s) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-orange-50 flex items-center justify-center text-orange-500">
            <Footprints size={18} />
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-gray-900 tracking-tight">{s.name}</span>
            {s.description && <span className="text-xs text-gray-400 line-clamp-1">{s.description}</span>}
          </div>
        </div>
      ),
    },
    {
      header: tCommon("actions"),
      align: "right",
      cell: (s) => (
        <AdminTableActions 
          actions={[
            { label: t("editSpecies"), icon: TableActionIcons.Edit, href: `/admin/species/${s.id}/edit` },
            { label: t("deleteSpecies"), icon: TableActionIcons.Delete, variant: "danger" },
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
          <p className="text-gray-500 mt-1">{t("manageSpeciesDesc")}</p>
        </div>
        <div className="flex items-center gap-3">
          <Link 
            href="/admin/species/create"
            className="rounded-xl bg-orange-500 hover:bg-orange-600 text-white gap-2 shadow-lg shadow-orange-200 transition-all h-10 px-4 flex items-center justify-center font-medium"
          >
            <Plus size={18} />
            {t("addSpecies")}
          </Link>
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm">
        <div className="p-6 border-b border-gray-50">
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
            <div className="relative w-full md:w-96 group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-orange-500 transition-colors" size={18} />
              <Input 
                placeholder={t("searchSpecies")}
                className="pl-12 h-12 rounded-2xl bg-gray-50 border-none focus-visible:ring-2 focus-visible:ring-orange-200 transition-all"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    setPagination({ ...pagination, page: 1 });
                    fetchSpecies();
                  }
                }}
              />
            </div>
          </div>
        </div>

        <AdminTable 
          columns={columns}
          data={species}
          isLoading={isLoading}
          emptyMessage={t("noSpeciesFound")}
          pagination={{
            currentPage: pagination.page,
            totalPages: pagination.totalPages,
            totalItems: pagination.totalItems,
            onPageChange: (page) => setPagination({ ...pagination, page }),
            showingLabel: tCommon("showing"),
            ofLabel: tCommon("of"),
            itemsLabel: t("species"),
            previousLabel: tCommon("previous"),
            nextLabel: tCommon("next")
          }}
        />
      </div>
    </div>
  );
}
