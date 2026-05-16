"use client";

import React, { useState, useEffect } from "react";
import { RoleForm } from "@/components/admin/RoleForm";
import { adminService } from "@/services/admin.service";
import { Role } from "@/types/auth";
import { useParams } from "next/navigation";
import { Loader2 } from "lucide-react";
import { useTranslations } from "next-intl";

export default function EditRolePage() {
  const t = useTranslations("RoleManagement");
  const params = useParams();
  const id = params.id;
  const [role, setRole] = useState<Role | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (id) {
      fetchRole(id as string);
    }
  }, [id]);

  const fetchRole = async (roleId: string) => {
    try {
      const response = await adminService.getRoleById(roleId);
      setRole(response.data);
    } catch (error) {
      console.error("Failed to fetch role:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="h-[60vh] flex items-center justify-center">
        <Loader2 className="w-10 h-10 text-orange-500 animate-spin" />
      </div>
    );
  }

  if (!role) {
    return (
      <div className="text-center py-20">
        <h2 className="text-2xl font-bold text-gray-900">Role not found</h2>
        <p className="text-gray-500 mt-2">The role you are looking for does not exist or has been deleted.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-playfair font-bold text-gray-900 tracking-tight">{t("editRole")}</h1>
        <p className="text-gray-500 mt-1">{role.name}</p>
      </div>
      <RoleForm initialData={role} isEdit={true} />
    </div>
  );
}
