"use client";

import React, { useState } from "react";
import { useTranslations } from "next-intl";
import { Permission, RESOURCES, ACTIONS } from "@/types/auth";
import { adminService } from "@/services/admin.service";
import { 
  Key, 
  Type, 
  FileText,
  Layers,
  Activity,
  CheckCircle2
} from "lucide-react";
import { useRouter } from "next/navigation";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

// Modular Admin Form Components
import { AdminFormField } from "./form/AdminFormField";
import { AdminFormSection } from "./form/AdminFormSection";
import { AdminFormHeader } from "./form/AdminFormHeader";
import { cn } from "@/lib/utils";

interface PermissionFormProps {
  initialData?: Permission;
  isEdit?: boolean;
}

export function PermissionForm({ initialData, isEdit = false }: PermissionFormProps) {
  const t = useTranslations("PermissionManagement");
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const [formData, setFormData] = useState({
    key: initialData?.key || "",
    description: initialData?.description || "",
    assignable: initialData?.assignable !== undefined ? initialData.assignable : true
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      if (isEdit && initialData?.id) {
        // Only description is allowed in UpdatePermissionDto
        await adminService.updatePermission(initialData.id, {
          description: formData.description
        });
      } else {
        await adminService.createPermission(formData);
      }

      router.push("/admin/permissions");
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
        title={isEdit ? t("editPermission") : t("addPermission")}
        backUrl="/admin/permissions"
        backLabel={t("backToPermissions")}
        submitLabel={isEdit ? t("updatePermission") : t("createPermission")}
        isLoading={isLoading}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <AdminFormSection 
            title={t("generalInfo")} 
            icon={<Key size={20} />}
          >
            <div className="grid grid-cols-1 gap-6">
              <AdminFormField 
                id="key"
                label={t("permissionKey")}
                placeholder="e.g. user:create"
                icon={<Type size={18} />}
                value={formData.key}
                disabled={isEdit}
                onChange={e => setFormData({...formData, key: e.target.value})}
                required
              />

              <AdminFormField 
                id="description"
                label={t("description")}
                placeholder="Briefly describe what this permission allows..."
                icon={<FileText size={18} />}
                value={formData.description}
                onChange={e => setFormData({...formData, description: e.target.value})}
              />
            </div>
          </AdminFormSection>
        </div>

        <div className="space-y-8">
          <div className="bg-white rounded-3xl border border-gray-100 p-8 shadow-sm space-y-6">
            <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2">
              <Activity size={18} className="text-orange-500" />
              Settings
            </h3>
            
            <div className={cn(
              "flex items-center justify-between p-4 rounded-2xl border transition-all",
              isEdit ? "bg-gray-50/50 border-gray-100 opacity-70" : "bg-gray-50 border-gray-100"
            )}>
              <div className="space-y-0.5">
                <Label htmlFor="assignable" className="text-sm font-bold text-gray-700 cursor-pointer">
                  {t("assignable")}
                </Label>
                <p className="text-[10px] text-gray-400">Can be manually assigned to roles</p>
              </div>
              <Switch 
                id="assignable"
                checked={formData.assignable}
                disabled={isEdit}
                onCheckedChange={val => setFormData({...formData, assignable: val})}
              />
            </div>

            <div className="p-4 bg-orange-50/50 rounded-2xl border border-orange-100 space-y-3">
              <div className="flex items-center gap-2 text-orange-600 font-bold text-xs uppercase tracking-wider">
                <CheckCircle2 size={14} />
                Format Guide
              </div>
              <p className="text-xs text-orange-700/70 leading-relaxed">
                Permissions should follow the <code className="bg-white px-1.5 py-0.5 rounded border border-orange-200 text-orange-600">resource:action</code> format. 
                Use <code className="bg-white px-1.5 py-0.5 rounded border border-orange-200 text-orange-600">*</code> for wildcards.
              </p>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
}
