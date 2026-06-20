"use client";

import React, { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { MedicalRecord } from "@/types/pet";
import { petService } from "@/services/pet.service";
import { adminService } from "@/services/admin.service";
import { userService } from "@/services/user.service";
import { toast } from "@/components/ui/toast";
import { 
  X, 
  Loader2, 
  Stethoscope, 
  Type, 
  Calendar, 
  DollarSign, 
  User, 
  FileText,
  Activity
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { AdminFormField } from "./form/AdminFormField";
import { AdminFormSelect } from "./form/AdminFormSelect";
import { AdminFormTextArea } from "./form/AdminFormTextArea";

interface MedicalRecordDialogProps {
  petId: string;
  record?: MedicalRecord; // undefined means Add, defined means Edit
  onSuccess: () => void;
  onClose: () => void;
}

export function MedicalRecordDialog({
  petId,
  record,
  onSuccess,
  onClose,
}: MedicalRecordDialogProps) {
  const t = useTranslations("MedicalRecord");
  const tCommon = useTranslations("AdminCommon");
  const [isLoading, setIsLoading] = useState(false);
  const [veterinarians, setVeterinarians] = useState<any[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [formData, setFormData] = useState({
    title: "",
    recordType: "checkup",
    recordDate: new Date().toISOString().split("T")[0],
    nextDueDate: "",
    cost: "",
    currency: "vnd",
    veterinarianId: "",
    diagnosis: "",
    treatment: "",
    notes: "",
  });

  // Load veterinarian users on mount
  useEffect(() => {
    const fetchVets = async () => {
      try {
        const rolesRes = await adminService.getRoles();
        const vetRole = rolesRes.data.find(
          (r) => r.name === "veterinarian" || r.name.toLowerCase().includes("vet")
        );
        const params: any = {};
        if (vetRole) {
          params.roleId = vetRole.id;
        }
        const usersRes = await userService.getUsers(params);
        setVeterinarians(usersRes.data);
      } catch (err) {
        console.error("Failed to load veterinarians, loading all users instead:", err);
        try {
          const usersRes = await userService.getUsers();
          setVeterinarians(usersRes.data);
        } catch (innerErr) {
          console.error("Failed to load all users:", innerErr);
        }
      }
    };
    fetchVets();
  }, []);

  // Initialize form data if in edit mode
  useEffect(() => {
    if (record) {
      setFormData({
        title: record.title || "",
        recordType: record.recordType || "checkup",
        recordDate: record.recordDate ? new Date(record.recordDate).toISOString().split("T")[0] : new Date().toISOString().split("T")[0],
        nextDueDate: record.nextDueDate ? new Date(record.nextDueDate).toISOString().split("T")[0] : "",
        cost: record.cost !== undefined && record.cost !== null ? String(record.cost) : "",
        currency: record.currency || "vnd",
        veterinarianId: record.veterinarianId || "",
        diagnosis: record.diagnosis || "",
        treatment: record.treatment || "",
        notes: record.notes || "",
      });
    }
  }, [record]);

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.title.trim()) {
      newErrors.title = "Tiêu đề không được bỏ trống";
    }
    if (!formData.recordDate) {
      newErrors.recordDate = "Ngày khám là bắt buộc";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsLoading(true);
    try {
      const payload: any = {
        title: formData.title,
        recordType: formData.recordType,
        recordDate: new Date(formData.recordDate).toISOString(),
        currency: formData.currency,
        diagnosis: formData.diagnosis || null,
        treatment: formData.treatment || null,
        notes: formData.notes || null,
      };

      if (formData.nextDueDate) {
        payload.nextDueDate = new Date(formData.nextDueDate).toISOString();
      } else {
        payload.nextDueDate = null;
      }

      if (formData.cost.trim()) {
        payload.cost = parseFloat(formData.cost);
      } else {
        payload.cost = null;
      }

      if (formData.veterinarianId) {
        payload.veterinarianId = formData.veterinarianId;
      } else {
        payload.veterinarianId = null;
      }

      if (record) {
        // Edit mode
        await petService.updateMedicalRecord(petId, record.id, payload);
        toast.success(tCommon("actionSuccess") || "Đã cập nhật bệnh án thành công!");
      } else {
        // Add mode
        await petService.addMedicalRecord(petId, payload);
        toast.success(tCommon("actionSuccess") || "Đã tạo bệnh án thành công!");
      }

      onSuccess();
    } catch (error: any) {
      console.error("Submit error:", error);
      toast.error(error?.response?.data?.message || tCommon("actionFailed") || "Đã có lỗi xảy ra");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto" onClick={onClose}>
      <div 
        className="bg-white rounded-3xl shadow-2xl border border-gray-100 max-w-2xl w-full overflow-hidden animate-in zoom-in-95 duration-300 flex flex-col my-8 max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-white sticky top-0 z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-orange-50 flex items-center justify-center text-orange-500">
              <Stethoscope size={20} />
            </div>
            <div>
              <h2 className="text-xl font-playfair font-bold text-gray-900">
                {record ? t("editRecord") : t("addRecord")}
              </h2>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-10 h-10 rounded-full hover:bg-gray-50 flex items-center justify-center text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content Form */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-8 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <AdminFormField
              id="title"
              label={t("recordTitle")}
              placeholder="e.g. Tiêm dại mũi 1"
              icon={<Type size={18} />}
              value={formData.title}
              error={errors.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
            />

            <AdminFormSelect
              id="recordType"
              label={t("recordType")}
              icon={<Activity size={18} />}
              options={[
                { label: t("Types.vaccination"), value: "vaccination" },
                { label: t("Types.medication"), value: "medication" },
                { label: t("Types.checkup"), value: "checkup" },
                { label: t("Types.surgery"), value: "surgery" },
                { label: t("Types.other"), value: "other" },
              ]}
              value={formData.recordType}
              onChange={(e) => setFormData({ ...formData, recordType: e.target.value })}
              required
            />

            <AdminFormField
              id="recordDate"
              label={t("recordDate")}
              type="date"
              icon={<Calendar size={18} />}
              value={formData.recordDate}
              error={errors.recordDate}
              onChange={(e) => setFormData({ ...formData, recordDate: e.target.value })}
              required
            />

            <AdminFormField
              id="nextDueDate"
              label={t("nextDueDate")}
              type="date"
              icon={<Calendar size={18} />}
              value={formData.nextDueDate}
              onChange={(e) => setFormData({ ...formData, nextDueDate: e.target.value })}
            />

            <div className="grid grid-cols-3 gap-3 md:col-span-1">
              <div className="col-span-2">
                <AdminFormField
                  id="cost"
                  label={t("cost")}
                  type="number"
                  placeholder="0.00"
                  icon={<DollarSign size={18} />}
                  value={formData.cost}
                  onChange={(e) => setFormData({ ...formData, cost: e.target.value })}
                />
              </div>
              <div>
                <AdminFormSelect
                  id="currency"
                  label={t("currency")}
                  options={[
                    { label: "VND", value: "vnd" },
                    { label: "USD", value: "usd" },
                  ]}
                  value={formData.currency}
                  onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
                />
              </div>
            </div>

            <AdminFormSelect
              id="veterinarianId"
              label={t("veterinarian")}
              icon={<User size={18} />}
              options={[
                { label: t("selectVeterinarian"), value: "" },
                ...veterinarians.map((vet) => ({
                  label: vet.fullName || vet.email,
                  value: vet.id,
                })),
              ]}
              value={formData.veterinarianId}
              onChange={(e) => setFormData({ ...formData, veterinarianId: e.target.value })}
            />
          </div>

          <div className="space-y-6">
            <AdminFormTextArea
              id="diagnosis"
              label={t("diagnosis")}
              placeholder="Nhập chẩn đoán hoặc tình trạng sức khỏe..."
              icon={<Stethoscope size={18} />}
              value={formData.diagnosis}
              onChange={(e) => setFormData({ ...formData, diagnosis: e.target.value })}
            />

            <AdminFormTextArea
              id="treatment"
              label={t("treatment")}
              placeholder="Nhập phương pháp điều trị, đơn thuốc..."
              icon={<Activity size={18} />}
              value={formData.treatment}
              onChange={(e) => setFormData({ ...formData, treatment: e.target.value })}
            />

            <AdminFormTextArea
              id="notes"
              label={t("notes")}
              placeholder="Ghi chú bổ sung..."
              icon={<FileText size={18} />}
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
            />
          </div>

          {/* Form Actions Footer */}
          <div className="pt-6 border-t border-gray-100 flex items-center justify-end gap-3 bg-white sticky bottom-0 z-10 pb-2">
            <Button
              type="button"
              variant="ghost"
              onClick={onClose}
              disabled={isLoading}
              className="rounded-2xl text-gray-500 h-12 px-6 hover:bg-gray-50 transition-all font-bold uppercase tracking-wider text-[10px]"
            >
              {tCommon("cancel")}
            </Button>
            <Button
              type="submit"
              disabled={isLoading}
              className="rounded-2xl bg-orange-500 hover:bg-orange-600 text-white gap-3 shadow-xl shadow-orange-100 h-12 px-10 transition-all font-bold uppercase tracking-widest text-[10px]"
            >
              {isLoading ? (
                <Loader2 className="animate-spin" size={18} />
              ) : (
                tCommon("save")
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
