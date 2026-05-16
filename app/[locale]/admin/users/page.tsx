"use client";

import React, { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { userService } from "@/services/user.service";
import { User } from "@/types/auth";
import { Search, UserPlus, Shield } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Link } from "@/lib/navigation";
import { adminService } from "@/services/admin.service";
import { Role } from "@/types/auth";
import { toast } from "@/components/ui/toast";
import { ConfirmModal } from "@/components/ui/confirm-modal";

import { AdminTable, Column } from "@/components/admin/AdminTable";
import {
  AdminTableFilters,
  FilterGroup,
} from "@/components/admin/AdminTableFilters";
import {
  UserInfoCell,
  StatusCell,
  BadgeGroupCell,
  DateCell,
} from "@/components/admin/table/AdminTableCells";
import {
  AdminTableActions,
  TableActionIcons,
} from "@/components/admin/table/AdminTableActions";

export default function UserManagementPage() {
  const t = useTranslations("UserManagement");
  const tCommon = useTranslations("AdminCommon");
  const [users, setUsers] = useState<User[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [roleFilter, setRoleFilter] = useState<string | null>(null);

  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    totalPages: 1,
    totalItems: 0,
  });

  const [actionModal, setActionModal] = useState<{
    isOpen: boolean;
    userId: string | null;
    type: "delete" | "ban" | "unban";
  }>({
    isOpen: false,
    userId: null,
    type: "delete",
  });

  const [isProcessing, setIsProcessing] = useState(false);
  const [banReason, setBanReason] = useState("");

  useEffect(() => {
    fetchUsers();
  }, [pagination.page, pagination.limit, statusFilter, roleFilter]);

  useEffect(() => {
    fetchRoles();
  }, []);

  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      const response = await userService.getUsers({
        page: pagination.page,
        limit: pagination.limit,
        status: statusFilter,
        role: roleFilter,
      });
      setUsers(response.data);
      if (response.meta) {
        setPagination((prev) => ({
          ...prev,
          totalPages: response.meta?.totalPages || 1,
          totalItems: response.meta?.totalItems || 0,
        }));
      }
    } catch (error) {
      console.error("Failed to fetch users:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchRoles = async () => {
    try {
      const response = await adminService.getRoles();
      setRoles(response.data);
    } catch (error) {
      console.error("Failed to fetch roles:", error);
    }
  };

  const handleAction = (type: "delete" | "ban" | "unban", id: string) => {
    setActionModal({ isOpen: true, userId: id, type });
  };

  const confirmAction = async () => {
    if (!actionModal.userId) return;

    setIsProcessing(true);
    try {
      if (actionModal.type === "delete") {
        await userService.deleteUser(actionModal.userId);
      } else if (actionModal.type === "ban") {
        await userService.banUser(actionModal.userId, banReason);
      } else if (actionModal.type === "unban") {
        await userService.unbanUser(actionModal.userId);
      }

      toast.success(tCommon("actionSuccess") || "Action successful");
      setActionModal({ ...actionModal, isOpen: false, userId: null });
      setBanReason("");
      fetchUsers();
    } catch (error) {
      console.error("Action failed:", error);
    } finally {
      setIsProcessing(false);
    }
  };

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase());

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
        { label: t("Statuses.active"), value: "active" },
        { label: t("Statuses.inactive"), value: "inactive" },
        { label: t("Statuses.banned"), value: "banned" },
      ],
    },
    {
      id: "role",
      label: t("role"),
      activeValue: roleFilter,
      onSelect: (val) => {
        setRoleFilter(val);
        setPagination({ ...pagination, page: 1 });
      },
      options: roles.map((r) => ({ label: r.name, value: r.name })),
    },
  ];

  const columns: Column<User>[] = [
    // ... columns definition remains same ...
    {
      header: t("user"),
      cell: (user) => (
        <UserInfoCell
          name={user.fullName || "Unnamed User"}
          email={user.email}
          avatarUrl={user.avatarUrl}
        />
      ),
    },
    {
      header: t("role"),
      cell: (user) => (
        <BadgeGroupCell
          items={(user.roles || []).map((r) => ({ id: r.id, label: r.name }))}
          icon={<Shield size={10} />}
          variant="blue"
        />
      ),
    },
    {
      header: t("status"),
      cell: (user) => (
        <StatusCell
          status={
            user.isDeleted
              ? t("Statuses.deleted")
              : t(`Statuses.${user.status}`)
          }
          variant={
            user.isDeleted
              ? "error"
              : user.status === "active"
                ? "success"
                : user.status === "inactive"
                  ? "warning"
                  : "error"
          }
        />
      ),
    },
    {
      header: t("joinedDate"),
      cell: (user) => <DateCell date={user.createdAt} />,
    },
    {
      header: tCommon("actions"),
      align: "right",
      cell: (user) => (
        <AdminTableActions
          actions={[
            { label: t("viewProfile"), icon: TableActionIcons.View },
            {
              label: t("editUser"),
              icon: TableActionIcons.Edit,
              href: `/admin/users/${user.id}/edit`,
              disabled: user.isDeleted,
            },
            {
              label: user.status === "banned" ? t("unbanUser") : t("banUser"),
              icon:
                user.status === "banned"
                  ? TableActionIcons.Unban
                  : TableActionIcons.Ban,
              onClick: () =>
                handleAction(
                  user.status === "banned" ? "unban" : "ban",
                  user.id,
                ),
              disabled: user.isDeleted,
            },
            {
              label: t("deleteUser"),
              icon: TableActionIcons.Delete,
              variant: "danger",
              onClick: () => handleAction("delete", user.id),
              disabled: user.isDeleted,
            },
          ]}
        />
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
          <p className="text-gray-500 mt-1">{t("manageUsersDesc")}</p>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/admin/users/create"
            className="rounded-xl bg-orange-500 hover:bg-orange-600 text-white gap-2 shadow-lg shadow-orange-200 transition-all h-10 px-4 flex items-center justify-center font-medium">
            <UserPlus size={18} />
            {t("addUser")}
          </Link>
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
                placeholder={t("searchUsers")}
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
                  setRoleFilter(null);
                  setPagination({ ...pagination, page: 1 });
                }}
              />
            </div>
          </div>
        </div>

        <AdminTable
          columns={columns}
          data={filteredUsers}
          isLoading={isLoading}
          emptyMessage={t("noUsersFound")}
          rowClassName={(user) =>
            user.isDeleted ? "opacity-60 grayscale-[0.5]" : ""
          }
          pagination={{
            currentPage: pagination.page,
            totalPages: pagination.totalPages,
            totalItems: pagination.totalItems,
            onPageChange: (page) => setPagination({ ...pagination, page }),
            showingLabel: tCommon("showing"),
            ofLabel: tCommon("of"),
            itemsLabel: t("users"),
            previousLabel: tCommon("previous"),
            nextLabel: tCommon("next"),
          }}
        />
      </div>

      <ConfirmModal
        isOpen={actionModal.isOpen}
        onClose={() => {
          setActionModal({ ...actionModal, isOpen: false });
          setBanReason("");
        }}
        onConfirm={confirmAction}
        title={
          actionModal.type === "delete"
            ? tCommon("delete")
            : actionModal.type === "ban"
              ? t("banUser")
              : t("unbanUser")
        }
        message={
          actionModal.type === "delete"
            ? t("deleteConfirm")
            : actionModal.type === "ban"
              ? t("banConfirm")
              : t("unbanConfirm")
        }
        confirmText={
          actionModal.type === "delete"
            ? tCommon("delete")
            : actionModal.type === "ban"
              ? t("banUser")
              : t("unbanUser")
        }
        cancelText={tCommon("cancel")}
        variant={actionModal.type === "unban" ? "default" : "danger"}
        isLoading={isProcessing}>
        {actionModal.type === "ban" && (
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">
              {t("banReason")}
            </label>
            <Input
              placeholder={t("banReasonPlaceholder")}
              value={banReason}
              onChange={(e) => setBanReason(e.target.value)}
              className="rounded-xl border-gray-200"
            />
          </div>
        )}
      </ConfirmModal>
    </div>
  );
}
