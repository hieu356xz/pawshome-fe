"use client";

import React, { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { adoptionService } from "@/services/adoption.service";
import { AdoptionRequest, AdoptionRequestStatus } from "@/types/adoption";
import { Search, Filter, User, PawPrint, Clock, Eye, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { AdminTable, Column } from "@/components/admin/AdminTable";
import {
  AdminTableFilters,
  FilterGroup,
} from "@/components/admin/AdminTableFilters";
import { StatusCell, DateCell } from "@/components/admin/table/AdminTableCells";
import { AdoptionReviewDialog } from "@/components/admin/AdoptionReviewDialog";

export default function AdoptionManagementPage() {
  const t = useTranslations("AdoptionManagement");
  const tCommon = useTranslations("AdminCommon");
  const [requests, setRequests] = useState<AdoptionRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string | null>(null);

  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    totalPages: 1,
    totalItems: 0,
  });

  const [selectedRequest, setSelectedRequest] =
    useState<AdoptionRequest | null>(null);

  useEffect(() => {
    fetchRequests();
  }, [pagination.page, pagination.limit, statusFilter]);

  const fetchRequests = async () => {
    setIsLoading(true);
    try {
      const response = await adoptionService.getAllRequests({
        page: pagination.page,
        limit: pagination.limit,
        status: statusFilter,
      });
      setRequests(response.data);
      if (response.meta) {
        setPagination((prev) => ({
          ...prev,
          totalPages: response.meta?.totalPages || 1,
          totalItems: response.meta?.totalItems || 0,
        }));
      }
    } catch (error) {
      console.error("Failed to fetch requests:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredRequests = requests.filter((req) => {
    const matchesSearch =
      req.applicantName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      req.pet?.name.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesSearch;
  });

  const filterGroups: FilterGroup[] = [
    {
      id: "status",
      label: t("status"),
      activeValue: statusFilter,
      onSelect: (val) => {
        setStatusFilter(val);
        setPagination({ ...pagination, page: 1 });
      },
      options: [
        {
          label: t("AdoptionStatuses.pending"),
          value: AdoptionRequestStatus.PENDING,
        },
        {
          label: t("AdoptionStatuses.approved"),
          value: AdoptionRequestStatus.APPROVED,
        },
        {
          label: t("AdoptionStatuses.rejected"),
          value: AdoptionRequestStatus.REJECTED,
        },
      ],
    },
  ];

  const columns: Column<AdoptionRequest>[] = [
    // ... columns definition remains same ...
    {
      header: t("applicant"),
      cell: (req) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-500 border border-blue-100">
            <User size={18} />
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-gray-900 tracking-tight">
              {req.applicantName}
            </span>
            <span className="text-[10px] text-gray-400 font-medium uppercase">
              {req.email}
            </span>
          </div>
        </div>
      ),
    },
    {
      header: t("pet"),
      cell: (req) => (
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-orange-50 flex items-center justify-center text-orange-500">
            <PawPrint size={14} />
          </div>
          <span className="text-sm font-bold text-gray-700">
            {req.pet?.name}
          </span>
        </div>
      ),
    },
    {
      header: t("status"),
      cell: (req) => (
        <StatusCell
          status={t(`AdoptionStatuses.${req.status}`)}
          variant={
            req.status === AdoptionRequestStatus.APPROVED
              ? "success"
              : req.status === AdoptionRequestStatus.REJECTED
                ? "error"
                : "warning"
          }
        />
      ),
    },
    {
      header: t("requestDate"),
      cell: (req) => <DateCell date={req.createdAt} />,
    },
    {
      header: tCommon("actions"),
      align: "right",
      cell: (req) => (
        <div className="flex justify-end gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setSelectedRequest(req)}
            className="rounded-xl hover:bg-orange-50 hover:text-orange-600 transition-all gap-2 h-9 px-4">
            <Eye size={16} />
            <span className="text-xs font-bold uppercase tracking-wider">
              {t("review")}
            </span>
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={async () => {
              if (confirm("Delete this request?")) {
                await adoptionService.deleteRequest(req.petId, req.id);
                fetchRequests();
              }
            }}
            className="rounded-xl hover:bg-red-50 hover:text-red-600 transition-all p-2 h-9 w-9">
            <X size={16} />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-playfair font-bold text-gray-900">
            {t("title")}
          </h1>
          <p className="text-gray-500 mt-1">{t("manageAdoptionsDesc")}</p>
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm">
        <div className="p-6 border-b border-gray-50">
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
            <div className="relative w-full md:w-96 group">
              <Search
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-orange-500 transition-colors"
                size={18}
              />
              <Input
                placeholder={t("searchRequests")}
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
                  setPagination({ ...pagination, page: 1 });
                }}
              />
            </div>
          </div>
        </div>

        <AdminTable
          columns={columns}
          data={filteredRequests}
          isLoading={isLoading}
          emptyMessage={t("noRequestsFound")}
          pagination={{
            currentPage: pagination.page,
            totalPages: pagination.totalPages,
            totalItems: pagination.totalItems,
            onPageChange: (page) => setPagination({ ...pagination, page }),
            showingLabel: tCommon("showing"),
            ofLabel: tCommon("of"),
            itemsLabel: t("title").toLowerCase(),
            previousLabel: tCommon("previous"),
            nextLabel: tCommon("next"),
          }}
        />
      </div>

      {selectedRequest && (
        <AdoptionReviewDialog
          request={selectedRequest}
          onClose={() => setSelectedRequest(null)}
          onSuccess={fetchRequests}
        />
      )}
    </div>
  );
}
