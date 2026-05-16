"use client";

import React, { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { adminService } from "@/services/admin.service";
import { Role } from "@/types/auth";
import { 
  Search, 
  ShieldPlus, 
  Shield
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Link } from "@/lib/navigation";
import { toast } from "@/components/ui/toast";
import { ConfirmModal } from "@/components/ui/confirm-modal";

import { AdminTable, Column } from "@/components/admin/AdminTable";
import { BadgeGroupCell } from "@/components/admin/table/AdminTableCells";
import { AdminTableActions, TableActionIcons } from "@/components/admin/table/AdminTableActions";

export default function RoleManagementPage() {
  const t = useTranslations("RoleManagement");
  const tCommon = useTranslations("AdminCommon");
  const [roles, setRoles] = useState<Role[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    totalPages: 1,
    totalItems: 0,
  });

  const [deleteModal, setDeleteModal] = useState<{
    isOpen: boolean;
    roleId: string | null;
  }>({
    isOpen: false,
    roleId: null,
  });

  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    fetchRoles();
  }, [pagination.page, pagination.limit]);

  const fetchRoles = async () => {
    setIsLoading(true);
    try {
      const response = await adminService.getRoles({
        page: pagination.page,
        limit: pagination.limit,
        search: searchTerm,
      });
      setRoles(response.data);
      if (response.meta) {
        setPagination((prev) => ({
          ...prev,
          totalPages: response.meta?.totalPages || 1,
          totalItems: response.meta?.totalItems || 0,
        }));
      }
    } catch (error) {
      console.error("Failed to fetch roles:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteRole = (id: string) => {
    setDeleteModal({ isOpen: true, roleId: id });
  };

  const confirmDelete = async () => {
    if (!deleteModal.roleId) return;

    setIsDeleting(true);
    try {
      await adminService.deleteRole(deleteModal.roleId);
      toast.success(tCommon("actionSuccess") || "Role deleted successfully");
      setDeleteModal({ isOpen: false, roleId: null });
      fetchRoles();
    } catch (error) {
      console.error("Delete failed:", error);
    } finally {
      setIsDeleting(false);
    }
  };

  const columns: Column<Role>[] = [
    // ... columns definition remains same ...
    {
      header: t("roleName"),
      cell: (role) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-orange-50 flex items-center justify-center text-orange-500">
            <Shield size={20} />
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-gray-900 uppercase tracking-wider text-sm">{role.name}</span>
            {role.description && <span className="text-xs text-gray-400 line-clamp-1">{role.description}</span>}
          </div>
        </div>
      ),
    },
    {
      header: t("permissions"),
      cell: (role) => (
        <BadgeGroupCell 
          items={(role.permissions || []).map(p => ({ id: p.id, label: p.key }))}
          variant="orange"
          maxVisible={8}
        />
      ),
    },
    {
      header: tCommon("actions"),
      align: "right",
      cell: (role) => (
        <AdminTableActions 
          actions={[
            { label: t("editRole"), icon: TableActionIcons.Edit, href: `/admin/roles/${role.id}/edit` },
            { label: t("deleteRole"), icon: TableActionIcons.Delete, variant: "danger", onClick: () => handleDeleteRole(role.id) },
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
          <p className="text-gray-500 mt-1">{t("manageRolesDesc")}</p>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/admin/roles/create">
            <Button className="rounded-xl bg-orange-500 hover:bg-orange-600 text-white gap-2 shadow-lg shadow-orange-200 transition-all h-10 px-4 font-medium">
              <ShieldPlus size={18} />
              {t("addRole")}
            </Button>
          </Link>
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm">
        <div className="p-6 border-b border-gray-50">
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
            <div className="relative w-full md:w-96 group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-orange-500 transition-colors" size={18} />
              <Input 
                placeholder={t("searchRoles")}
                className="pl-12 h-12 rounded-2xl bg-gray-50 border-none focus-visible:ring-2 focus-visible:ring-orange-200 transition-all"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    setPagination({ ...pagination, page: 1 });
                    fetchRoles();
                  }
                }}
              />
            </div>
          </div>
        </div>

        <AdminTable 
          columns={columns}
          data={roles}
          isLoading={isLoading}
          emptyMessage={t("noRolesFound")}
          pagination={{
            currentPage: pagination.page,
            totalPages: pagination.totalPages,
            totalItems: pagination.totalItems,
            onPageChange: (page) => setPagination({ ...pagination, page }),
            showingLabel: tCommon("showing"),
            ofLabel: tCommon("of"),
            itemsLabel: t("roles"),
            previousLabel: tCommon("previous"),
            nextLabel: tCommon("next")
          }}
        />
      </div>

      <ConfirmModal
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, roleId: null })}
        onConfirm={confirmDelete}
        title={tCommon("delete")}
        message={t("deleteConfirm")}
        confirmText={tCommon("delete")}
        cancelText={tCommon("cancel")}
        variant="danger"
        isLoading={isDeleting}
      />
    </div>
  );
}
