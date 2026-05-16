"use client";

import React, { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { userService } from "@/services/user.service";
import { User } from "@/types/auth";
import { 
  Search, 
  UserPlus, 
  Shield
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Link } from "@/lib/navigation";
import { adminService } from "@/services/admin.service";
import { Role } from "@/types/auth";

import { AdminTable, Column } from "@/components/admin/AdminTable";
import { AdminTableFilters, FilterGroup } from "@/components/admin/AdminTableFilters";
import { UserInfoCell, StatusCell, BadgeGroupCell, DateCell } from "@/components/admin/table/AdminTableCells";
import { AdminTableActions, TableActionIcons } from "@/components/admin/table/AdminTableActions";

export default function UserManagementPage() {
  const t = useTranslations("UserManagement");
  const [users, setUsers] = useState<User[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [roleFilter, setRoleFilter] = useState<string | null>(null);

  useEffect(() => {
    fetchUsers();
    fetchRoles();
  }, []);

  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      const response = await userService.getUsers();
      setUsers(response.data);
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

  const filteredUsers = users.filter(user => {
    const matchesSearch = 
      user.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = !statusFilter || user.status === statusFilter;
    
    const matchesRole = !roleFilter || user.roles?.some(r => r.name === roleFilter);
    
    return matchesSearch && matchesStatus && matchesRole;
  });

  const filterGroups: FilterGroup[] = [
    {
      id: "status",
      label: "Status",
      activeValue: statusFilter,
      onSelect: setStatusFilter,
      options: [
        { label: "Active", value: "active" },
        { label: "Inactive", value: "inactive" },
        { label: "Banned", value: "banned" }
      ]
    },
    {
      id: "role",
      label: "Roles",
      activeValue: roleFilter,
      onSelect: setRoleFilter,
      options: roles.map(r => ({ label: r.name, value: r.name }))
    }
  ];

  const columns: Column<User>[] = [
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
          items={(user.roles || []).map(r => ({ id: r.id, label: r.name }))}
          icon={<Shield size={10} />}
          variant="blue"
        />
      ),
    },
    {
      header: t("status"),
      cell: (user) => (
        <StatusCell 
          status={user.status} 
          variant={
            user.status === 'active' ? "success" : 
            user.status === 'inactive' ? "warning" : "error"
          }
        />
      ),
    },
    {
      header: t("joinedDate"),
      cell: () => <DateCell date="May 14, 2026" />,
    },
    {
      header: t("actions"),
      align: "right",
      cell: (user) => (
        <AdminTableActions 
          actions={[
            { label: t("viewProfile"), icon: TableActionIcons.View },
            { label: t("editUser"), icon: TableActionIcons.Edit, href: `/admin/users/${user.id}/edit` },
            { label: t("deleteUser"), icon: TableActionIcons.Delete, variant: "danger" },
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
          <p className="text-gray-500 mt-1">{t("manageUsersDesc")}</p>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/admin/users/create">
            <Button className="rounded-xl bg-orange-500 hover:bg-orange-600 text-white gap-2 shadow-lg shadow-orange-200 transition-all h-10 px-4">
              <UserPlus size={18} />
              {t("addUser")}
            </Button>
          </Link>
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-50">
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
            <div className="relative w-full md:w-96 group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-orange-500 transition-colors" size={18} />
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
          pagination={{
            currentPage: 1,
            totalPages: 1,
            totalItems: filteredUsers.length,
            onPageChange: () => {},
            showingLabel: t("showing"),
            ofLabel: t("of"),
            itemsLabel: t("users"),
            previousLabel: t("previous"),
            nextLabel: t("next")
          }}
        />
      </div>
    </div>
  );
}
