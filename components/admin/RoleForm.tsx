"use client";

import React, { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { Role, Permission } from "@/types/auth";
import { adminService } from "@/services/admin.service";
import { 
  Shield, 
  Type, 
  FileText
} from "lucide-react";
import { useRouter } from "next/navigation";

// Modular Admin Form Components
import { AdminFormField } from "./form/AdminFormField";
import { AdminFormSection } from "./form/AdminFormSection";
import { AdminFormHeader } from "./form/AdminFormHeader";
import { AdminPermissionSelection } from "./form/AdminPermissionSelection";

interface RoleFormProps {
  initialData?: Role;
  isEdit?: boolean;
}

export function RoleForm({ initialData, isEdit = false }: RoleFormProps) {
  const t = useTranslations("RoleManagement");
  const router = useRouter();
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isFetchingPermissions, setIsFetchingPermissions] = useState(true);

  const [formData, setFormData] = useState({
    name: initialData?.name || "",
    description: initialData?.description || "",
    permissionIds: initialData?.permissions?.map(p => p.id) || [] as string[]
  });

  useEffect(() => {
    fetchPermissions();
  }, []);

  const fetchPermissions = async () => {
    try {
      // Backend has @Max(100) constraint on limit
      const response = await adminService.getPermissions({ limit: 100 });
      setPermissions(response.data);
    } catch (error) {
      console.error("Failed to fetch permissions:", error);
    } finally {
      setIsFetchingPermissions(false);
    }
  };

  const handlePermissionToggle = (permissionId: string) => {
    setFormData(prev => ({
      ...prev,
      permissionIds: prev.permissionIds.includes(permissionId)
        ? prev.permissionIds.filter(id => id !== permissionId)
        : [...prev.permissionIds, permissionId]
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      let roleId = initialData?.id;

      if (isEdit && roleId) {
        await adminService.updateRole(roleId, {
          name: formData.name,
          description: formData.description,
        });
      } else {
        const response = await adminService.createRole({
          name: formData.name,
          description: formData.description,
        });
        roleId = response.data.id;
      }

      if (roleId) {
        await adminService.assignPermissionsToRole(roleId, formData.permissionIds);
      }

      router.push("/admin/roles");
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
        title={isEdit ? t("editRole") : t("addRole")}
        backUrl="/admin/roles"
        backLabel={t("backToRoles")}
        submitLabel={isEdit ? t("updateRole") : t("createRole")}
        isLoading={isLoading}
      />

      <div className="space-y-8">
        <AdminFormSection 
          title={t("generalInfo")} 
          icon={<Shield size={20} />}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <AdminFormField 
              id="name"
              label={t("roleName")}
              placeholder="e.g. Content Manager"
              icon={<Type size={18} />}
              value={formData.name}
              onChange={e => setFormData({...formData, name: e.target.value})}
              required
            />

            <AdminFormField 
              id="description"
              label={t("description")}
              placeholder="Describe what this role does..."
              icon={<FileText size={18} />}
              value={formData.description}
              onChange={e => setFormData({...formData, description: e.target.value})}
            />
          </div>
        </AdminFormSection>

        <div className="bg-white rounded-3xl border border-gray-100 p-8 shadow-sm">
          <AdminPermissionSelection 
            label={t("permissionsList")}
            permissions={permissions}
            selectedIds={formData.permissionIds}
            onToggle={handlePermissionToggle}
            isLoading={isFetchingPermissions}
            loadingLabel={t("loadingPermissions")}
          />
        </div>
      </div>
    </form>
  );
}
