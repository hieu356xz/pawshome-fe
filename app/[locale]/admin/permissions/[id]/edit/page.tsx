"use client";

import React, { useState, useEffect } from "react";
import { PermissionForm } from "@/components/admin/PermissionForm";
import { adminService } from "@/services/admin.service";
import { Permission } from "@/types/auth";
import { useParams } from "next/navigation";
import { Loader2 } from "lucide-react";
import { useTranslations } from "next-intl";

export default function EditPermissionPage() {
  const t = useTranslations("PermissionManagement");
  const params = useParams();
  const id = params.id;
  const [permission, setPermission] = useState<Permission | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (id) {
      fetchPermission(id as string);
    }
  }, [id]);

  const fetchPermission = async (permissionId: string) => {
    try {
      const response = await adminService.getPermissionById(permissionId);
      setPermission(response.data);
    } catch (error) {
      console.error("Failed to fetch permission:", error);
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

  if (!permission) {
    return (
      <div className="text-center py-20">
        <h2 className="text-2xl font-bold text-gray-900">Permission not found</h2>
        <p className="text-gray-500 mt-2">The permission you are looking for does not exist or has been deleted.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-playfair font-bold text-gray-900 tracking-tight">{t("editPermission")}</h1>
        <p className="text-gray-500 mt-1">{permission.key}</p>
      </div>
      <PermissionForm initialData={permission} isEdit={true} />
    </div>
  );
}
