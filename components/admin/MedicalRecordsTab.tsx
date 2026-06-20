"use client";

import React, { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { MedicalRecord } from "@/types/pet";
import { petService } from "@/services/pet.service";
import { ConfirmModal } from "@/components/ui/confirm-modal";
import { MedicalRecordDialog } from "./MedicalRecordDialog";
import {
  Plus,
  Search,
  Calendar,
  User,
  DollarSign,
  Edit,
  Trash2,
  ChevronDown,
  ChevronUp,
  Syringe,
  Activity,
  Stethoscope,
  Scissors,
  FileText,
  Clock,
  Loader2,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface MedicalRecordsTabProps {
  petId: string;
}

export function MedicalRecordsTab({ petId }: MedicalRecordsTabProps) {
  const t = useTranslations("MedicalRecord");
  const tCommon = useTranslations("AdminCommon");

  const [records, setRecords] = useState<MedicalRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [expandedRecords, setExpandedRecords] = useState<
    Record<string, boolean>
  >({});

  // Dialog & Modal State
  const [dialogState, setDialogState] = useState<{
    isOpen: boolean;
    record?: MedicalRecord;
  }>({
    isOpen: false,
  });

  const [deleteModalState, setDeleteModalState] = useState<{
    isOpen: boolean;
    recordId: string | null;
  }>({
    isOpen: false,
    recordId: null,
  });

  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    if (petId) {
      fetchRecords();
    }
  }, [petId]);

  const fetchRecords = async () => {
    setIsLoading(true);
    try {
      const response = await petService.getMedicalRecords(petId);
      // Sort records by recordDate descending
      const sorted = (response.data || []).sort(
        (a, b) =>
          new Date(b.recordDate).getTime() - new Date(a.recordDate).getTime(),
      );
      setRecords(sorted);
    } catch (error) {
      console.error("Failed to fetch medical records:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenAddDialog = () => {
    setDialogState({ isOpen: true });
  };

  const handleOpenEditDialog = (record: MedicalRecord) => {
    setDialogState({ isOpen: true, record });
  };

  const handleSuccess = () => {
    setDialogState({ isOpen: false });
    fetchRecords();
  };

  const handleOpenDeleteModal = (recordId: string) => {
    setDeleteModalState({ isOpen: true, recordId });
  };

  const confirmDelete = async () => {
    if (!deleteModalState.recordId) return;

    setIsDeleting(true);
    try {
      await petService.deleteMedicalRecord(petId, deleteModalState.recordId);
      setRecords(records.filter((r) => r.id !== deleteModalState.recordId));
      setDeleteModalState({ isOpen: false, recordId: null });
    } catch (error) {
      console.error("Failed to delete medical record:", error);
    } finally {
      setIsDeleting(false);
    }
  };

  const toggleExpand = (id: string) => {
    setExpandedRecords((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  // Filter logic
  const filteredRecords = records.filter((record) => {
    const matchesSearch =
      record.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (record.diagnosis &&
        record.diagnosis.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (record.treatment &&
        record.treatment.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesType =
      typeFilter === "all" || record.recordType === typeFilter;

    return matchesSearch && matchesType;
  });

  const getRecordTypeDetails = (type: string) => {
    switch (type) {
      case "vaccination":
        return {
          icon: <Syringe size={20} />,
          bg: "bg-blue-50 text-blue-600 border-blue-100",
          label: t("Types.vaccination"),
        };
      case "medication":
        return {
          icon: <Activity size={20} />,
          bg: "bg-purple-50 text-purple-600 border-purple-100",
          label: t("Types.medication"),
        };
      case "checkup":
        return {
          icon: <Stethoscope size={20} />,
          bg: "bg-emerald-50 text-emerald-600 border-emerald-100",
          label: t("Types.checkup"),
        };
      case "surgery":
        return {
          icon: <Scissors size={20} />,
          bg: "bg-rose-50 text-rose-600 border-rose-100",
          label: t("Types.surgery"),
        };
      default:
        return {
          icon: <FileText size={20} />,
          bg: "bg-gray-50 text-gray-600 border-gray-100",
          label: t("Types.other"),
        };
    }
  };

  const formatCost = (cost?: number, currency?: string) => {
    if (cost === undefined || cost === null) return null;
    if (currency?.toLowerCase() === "usd") {
      return `$${Number(cost).toLocaleString("en-US", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })}`;
    }
    // VND: Round to integer (no decimal places) and use thousands separator
    return `${Math.round(cost).toLocaleString("vi-VN")} VND`;
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20 bg-white rounded-3xl border border-gray-100 shadow-sm">
        <Loader2 className="w-10 h-10 text-orange-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Controls & Search */}
      <div className="bg-white rounded-3xl border border-gray-100 p-6 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex flex-1 flex-col md:flex-row gap-4">
            <div className="relative group flex-1 max-w-md">
              <Search
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-orange-500 transition-colors"
                size={18}
              />
              <input
                type="text"
                placeholder={t("recordTitle") + ", " + t("diagnosis") + "..."}
                className="w-full pl-12 pr-4 h-12 rounded-2xl bg-gray-50 border-none focus:outline-none focus:ring-2 focus:ring-orange-200 transition-all text-sm"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="relative group w-full md:w-56">
              <select
                className="w-full h-12 px-4 rounded-2xl bg-gray-50 border-none focus:outline-none focus:ring-2 focus:ring-orange-200 transition-all text-sm appearance-none cursor-pointer"
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}>
                <option value="all">{tCommon("all") || "Tất cả"}</option>
                <option value="vaccination">{t("Types.vaccination")}</option>
                <option value="medication">{t("Types.medication")}</option>
                <option value="checkup">{t("Types.checkup")}</option>
                <option value="surgery">{t("Types.surgery")}</option>
                <option value="other">{t("Types.other")}</option>
              </select>
              <div className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
                <ChevronDown size={16} />
              </div>
            </div>
          </div>
          <button
            onClick={handleOpenAddDialog}
            className="rounded-xl bg-orange-500 hover:bg-orange-600 text-white gap-2 shadow-lg shadow-orange-200 transition-all h-11 px-5 flex items-center justify-center font-bold text-xs uppercase tracking-wider whitespace-nowrap self-stretch md:self-auto">
            <Plus size={16} />
            {t("addRecord")}
          </button>
        </div>
      </div>

      {/* Records List */}
      <div className="space-y-4">
        {filteredRecords.map((record) => {
          const typeDetails = getRecordTypeDetails(record.recordType);
          const isExpanded = !!expandedRecords[record.id];
          const hasCost = record.cost !== undefined && record.cost !== null;
          const costFormatted = formatCost(record.cost, record.currency);

          return (
            <div
              key={record.id}
              className={cn(
                "bg-white rounded-3xl border transition-all duration-300 overflow-hidden",
                isExpanded
                  ? "border-orange-200 shadow-lg shadow-orange-50/50"
                  : "border-gray-100 hover:border-gray-200 shadow-sm",
              )}>
              {/* Header Info */}
              <div
                className="p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 cursor-pointer"
                onClick={() => toggleExpand(record.id)}>
                <div className="flex items-start gap-4">
                  {/* Record Type Icon */}
                  <div
                    className={cn(
                      "w-12 h-12 rounded-2xl border flex items-center justify-center shrink-0 shadow-inner",
                      typeDetails.bg,
                    )}>
                    {typeDetails.icon}
                  </div>

                  {/* Title & Metadata */}
                  <div className="space-y-1.5">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="font-bold text-gray-900 leading-snug">
                        {record.title}
                      </h3>
                      <span
                        className={cn(
                          "px-2 py-0.5 rounded-lg text-[10px] font-bold uppercase tracking-wider border",
                          typeDetails.bg,
                        )}>
                        {typeDetails.label}
                      </span>
                    </div>

                    <div className="flex flex-wrap items-center gap-y-1 gap-x-4 text-xs text-gray-500 font-medium">
                      <span className="flex items-center gap-1.5">
                        <Calendar size={14} className="text-gray-400" />
                        {new Date(record.recordDate).toLocaleDateString()}
                      </span>
                      {record.nextDueDate && (
                        <span className="flex items-center gap-1.5 text-orange-600 font-bold bg-orange-50/60 px-2 py-0.5 rounded-lg">
                          <Clock size={14} />
                          {t("nextDueDate")}:{" "}
                          {new Date(record.nextDueDate).toLocaleDateString()}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Right side Actions & Price */}
                <div className="flex items-center justify-between md:justify-end gap-6 border-t md:border-t-0 pt-4 md:pt-0 border-gray-50">
                  {hasCost && (
                    <div className="text-right">
                      <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block">
                        {t("cost")}
                      </span>
                      <span className="text-sm font-bold text-gray-700">
                        {costFormatted}
                      </span>
                    </div>
                  )}

                  <div
                    className="flex items-center gap-2"
                    onClick={(e) => e.stopPropagation()}>
                    <button
                      onClick={() => handleOpenEditDialog(record)}
                      className="w-9 h-9 rounded-xl hover:bg-orange-50 hover:text-orange-500 text-gray-400 flex items-center justify-center transition-colors"
                      title={tCommon("edit") || "Sửa"}>
                      <Edit size={16} />
                    </button>
                    <button
                      onClick={() => handleOpenDeleteModal(record.id)}
                      className="w-9 h-9 rounded-xl hover:bg-red-50 hover:text-red-500 text-gray-400 flex items-center justify-center transition-colors"
                      title={tCommon("delete") || "Xóa"}>
                      <Trash2 size={16} />
                    </button>
                    <button
                      onClick={() => toggleExpand(record.id)}
                      className="w-9 h-9 rounded-xl hover:bg-gray-50 text-gray-400 flex items-center justify-center transition-colors ml-1">
                      {isExpanded ? (
                        <ChevronUp size={16} />
                      ) : (
                        <ChevronDown size={16} />
                      )}
                    </button>
                  </div>
                </div>
              </div>

              {/* Expandable Body */}
              {isExpanded && (
                <div className="px-6 pb-6 border-t border-gray-50 pt-6 bg-gray-50/30 space-y-6 animate-in slide-in-from-top-2 duration-300">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Diagnosis */}
                    <div className="space-y-2">
                      <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-1.5">
                        <Stethoscope size={12} />
                        {t("diagnosis")}
                      </h4>
                      <p className="text-sm text-gray-700 bg-white p-4 rounded-2xl border border-gray-100 shadow-sm leading-relaxed whitespace-pre-wrap min-h-[60px]">
                        {record.diagnosis || "---"}
                      </p>
                    </div>

                    {/* Treatment */}
                    <div className="space-y-2">
                      <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-1.5">
                        <Activity size={12} />
                        {t("treatment")}
                      </h4>
                      <p className="text-sm text-gray-700 bg-white p-4 rounded-2xl border border-gray-100 shadow-sm leading-relaxed whitespace-pre-wrap min-h-[60px]">
                        {record.treatment || "---"}
                      </p>
                    </div>
                  </div>

                  {/* Notes */}
                  {record.notes && (
                    <div className="space-y-2">
                      <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-1.5">
                        <FileText size={12} />
                        {t("notes")}
                      </h4>
                      <p className="text-sm text-gray-600 bg-white p-4 rounded-2xl border border-gray-100 shadow-sm leading-relaxed whitespace-pre-wrap">
                        {record.notes}
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}

        {filteredRecords.length === 0 && (
          <div className="py-16 text-center bg-white rounded-3xl border border-gray-100 shadow-sm">
            <div className="w-14 h-14 bg-orange-50 rounded-2xl flex items-center justify-center text-orange-500 mx-auto mb-4">
              <Stethoscope size={24} />
            </div>
            <h3 className="font-bold text-gray-900 mb-1">{t("title")}</h3>
            <p className="text-gray-400 text-sm max-w-sm mx-auto">
              {searchTerm || typeFilter !== "all"
                ? "Không tìm thấy hồ sơ y tế nào phù hợp với bộ lọc."
                : t("noRecords")}
            </p>
          </div>
        )}
      </div>

      {/* Add/Edit Modal */}
      {dialogState.isOpen && (
        <MedicalRecordDialog
          petId={petId}
          record={dialogState.record}
          onSuccess={handleSuccess}
          onClose={() => setDialogState({ isOpen: false })}
        />
      )}

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={deleteModalState.isOpen}
        onClose={() => setDeleteModalState({ isOpen: false, recordId: null })}
        onConfirm={confirmDelete}
        title={t("deleteRecord")}
        message={t("deleteConfirm")}
        confirmText={tCommon("delete")}
        cancelText={tCommon("cancel")}
        variant="danger"
        isLoading={isDeleting}
      />
    </div>
  );
}
