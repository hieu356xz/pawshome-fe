"use client";

import React, { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { userService } from "@/services/user.service";
import { User } from "@/types/auth";
import { 
  Search, 
  MoreHorizontal, 
  UserPlus, 
  Filter, 
  Download,
  Mail,
  Calendar,
  Shield,
  Edit2,
  Trash2,
  Eye,
  Users
} from "lucide-react";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuCheckboxItem,
  DropdownMenuGroup
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { Link } from "@/lib/navigation";
import { adminService } from "@/services/admin.service";
import { Role } from "@/types/auth";

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
        <div className="p-6 border-b border-gray-50 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="relative w-full md:w-96 group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-orange-500 transition-colors" size={18} />
            <Input 
              placeholder={t("searchUsers")}
              className="pl-12 h-12 rounded-2xl bg-gray-50 border-none focus-visible:ring-2 focus-visible:ring-orange-200 transition-all"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger className={cn(
                "rounded-xl border border-gray-200 text-gray-600 gap-2 h-12 px-6 flex items-center justify-center hover:bg-gray-50 transition-all cursor-pointer outline-none",
                (statusFilter || roleFilter) && "border-orange-500 text-orange-600 bg-orange-50"
              )}>
                <Filter size={18} />
                {statusFilter || roleFilter ? "Filters Active" : "Filters"}
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 rounded-2xl p-2 shadow-xl border-gray-100 bg-white z-50">
                <DropdownMenuGroup>
                  <DropdownMenuLabel className="text-xs font-bold text-gray-400 uppercase tracking-widest px-3 py-2">Status</DropdownMenuLabel>
                  <DropdownMenuCheckboxItem 
                    checked={statusFilter === null}
                    onCheckedChange={() => setStatusFilter(null)}
                    className="rounded-xl focus:bg-orange-50 cursor-pointer"
                  >
                    All Status
                  </DropdownMenuCheckboxItem>
                  <DropdownMenuCheckboxItem 
                    checked={statusFilter === 'active'}
                    onCheckedChange={() => setStatusFilter('active')}
                    className="rounded-xl focus:bg-orange-50 cursor-pointer text-emerald-600"
                  >
                    Active
                  </DropdownMenuCheckboxItem>
                  <DropdownMenuCheckboxItem 
                    checked={statusFilter === 'inactive'}
                    onCheckedChange={() => setStatusFilter('inactive')}
                    className="rounded-xl focus:bg-orange-50 cursor-pointer text-amber-600"
                  >
                    Inactive
                  </DropdownMenuCheckboxItem>
                  <DropdownMenuCheckboxItem 
                    checked={statusFilter === 'banned'}
                    onCheckedChange={() => setStatusFilter('banned')}
                    className="rounded-xl focus:bg-orange-50 cursor-pointer text-red-600"
                  >
                    Banned
                  </DropdownMenuCheckboxItem>
                </DropdownMenuGroup>

                <DropdownMenuSeparator className="my-2 bg-gray-50" />
                
                <DropdownMenuGroup>
                  <DropdownMenuLabel className="text-xs font-bold text-gray-400 uppercase tracking-widest px-3 py-2">Roles</DropdownMenuLabel>
                  <DropdownMenuCheckboxItem 
                    checked={roleFilter === null}
                    onCheckedChange={() => setRoleFilter(null)}
                    className="rounded-xl focus:bg-orange-50 cursor-pointer"
                  >
                    All Roles
                  </DropdownMenuCheckboxItem>
                  {roles.map(role => (
                    <DropdownMenuCheckboxItem 
                      key={role.id}
                      checked={roleFilter === role.name}
                      onCheckedChange={() => setRoleFilter(role.name)}
                      className="rounded-xl focus:bg-orange-50 cursor-pointer"
                    >
                      {role.name}
                    </DropdownMenuCheckboxItem>
                  ))}
                </DropdownMenuGroup>

                {(statusFilter || roleFilter) && (
                  <>
                    <DropdownMenuSeparator className="my-2 bg-gray-50" />
                    <DropdownMenuItem 
                      onClick={() => {
                        setStatusFilter(null);
                        setRoleFilter(null);
                      }}
                      className="rounded-xl focus:bg-red-50 focus:text-red-600 text-red-500 cursor-pointer justify-center font-bold text-xs"
                    >
                      Clear All Filters
                    </DropdownMenuItem>
                  </>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/50">
                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">{t("user")}</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">{t("role")}</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">{t("status")}</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">{t("joinedDate")}</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider text-right">{t("actions")}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {isLoading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td className="px-6 py-6"><div className="flex items-center gap-3"><div className="w-10 h-10 bg-gray-100 rounded-xl" /><div className="space-y-2"><div className="w-32 h-4 bg-gray-100 rounded" /><div className="w-48 h-3 bg-gray-50 rounded" /></div></div></td>
                    <td className="px-6 py-6"><div className="w-20 h-6 bg-gray-100 rounded-full" /></td>
                    <td className="px-6 py-6"><div className="w-16 h-6 bg-gray-100 rounded-full" /></td>
                    <td className="px-6 py-6"><div className="w-24 h-4 bg-gray-100 rounded" /></td>
                    <td className="px-6 py-6"><div className="w-8 h-8 bg-gray-100 rounded-lg ml-auto" /></td>
                  </tr>
                ))
              ) : filteredUsers.length > 0 ? (
                filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50/50 transition-colors group">
                    <td className="px-6 py-6">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-2xl overflow-hidden bg-orange-100 flex items-center justify-center text-orange-600 font-bold border-2 border-white shadow-sm group-hover:scale-105 transition-transform duration-300">
                          {user.avatarUrl ? (
                            <img src={user.avatarUrl} alt={user.fullName} className="w-full h-full object-cover" />
                          ) : (
                            user.fullName?.charAt(0) || "U"
                          )}
                        </div>
                        <div>
                          <p className="text-sm font-bold text-gray-900">{user.fullName || "Unnamed User"}</p>
                          <p className="text-xs text-gray-500 flex items-center gap-1 mt-0.5">
                            <Mail size={12} />
                            {user.email}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-6">
                      <div className="flex flex-wrap gap-1">
                        {user.roles && user.roles.length > 0 ? (
                          user.roles.map((role) => (
                            <span key={role.id} className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-blue-50 text-blue-600 text-[10px] font-bold uppercase tracking-wider">
                              <Shield size={10} />
                              {role.name}
                            </span>
                          ))
                        ) : (
                          <span className="text-gray-400 text-xs italic">No roles</span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-6">
                      <span className={cn(
                        "inline-flex items-center px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider",
                        user.status === 'active' ? "bg-emerald-50 text-emerald-600" : 
                        user.status === 'inactive' ? "bg-amber-50 text-amber-600" : "bg-red-50 text-red-600"
                      )}>
                        {user.status}
                      </span>
                    </td>
                    <td className="px-6 py-6">
                      <p className="text-sm text-gray-600 flex items-center gap-1.5">
                        <Calendar size={14} className="text-gray-400" />
                        May 14, 2026
                      </p>
                    </td>
                    <td className="px-6 py-6 text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger className="p-2 hover:bg-gray-100 rounded-xl transition-all text-gray-400 hover:text-gray-900 outline-none border-none cursor-pointer">
                          <MoreHorizontal size={20} />
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-48 rounded-2xl p-2 shadow-xl border-gray-100 bg-white z-50">
                          <DropdownMenuItem className="rounded-xl focus:bg-orange-50 focus:text-orange-600 cursor-pointer flex items-center gap-2 py-2.5 px-3">
                            <Eye size={16} /> {t("viewProfile")}
                          </DropdownMenuItem>
                          <DropdownMenuItem className="p-0 cursor-pointer">
                            <Link href={`/admin/users/${user.id}/edit`} className="flex items-center gap-2 py-2.5 px-3 w-full rounded-xl focus:bg-blue-50 focus:text-blue-600 outline-none">
                              <Edit2 size={16} /> {t("editUser")}
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem className="rounded-xl focus:bg-red-50 focus:text-red-600 cursor-pointer flex items-center gap-2 py-2.5 px-3 text-red-500">
                            <Trash2 size={16} /> {t("deleteUser")}
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="px-6 py-20 text-center text-gray-500">
                    <div className="flex flex-col items-center gap-3">
                      <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center text-gray-300">
                        <Users size={32} />
                      </div>
                      <p>{t("noUsersFound")}</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="p-6 border-t border-gray-50 flex items-center justify-between">
          <p className="text-sm text-gray-500">
            {t("showing")} <span className="font-bold text-gray-900">{filteredUsers.length}</span> {t("of")} <span className="font-bold text-gray-900">{users.length}</span> {t("users")}
          </p>
          <div className="flex items-center gap-2">
            <Button variant="outline" disabled className="rounded-xl border-gray-200 h-10 px-4">{t("previous")}</Button>
            <Button variant="outline" disabled className="rounded-xl border-gray-200 h-10 px-4">{t("next")}</Button>
          </div>
        </div>
      </div>
    </div>
  );
}
