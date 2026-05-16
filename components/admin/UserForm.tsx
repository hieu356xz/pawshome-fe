"use client";

import React, { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { User, Role } from "@/types/auth";
import { adminService } from "@/services/admin.service";
import { userService } from "@/services/user.service";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { 
  ArrowLeft, 
  Save, 
  User as UserIcon, 
  Mail, 
  Phone, 
  MapPin, 
  Shield,
  Loader2,
  Edit2,
  Check,
  Lock
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

interface UserFormProps {
  initialData?: User;
  isEdit?: boolean;
}

export function UserForm({ initialData, isEdit = false }: UserFormProps) {
  const t = useTranslations("UserManagement");
  const router = useRouter();
  const [roles, setRoles] = useState<Role[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isFetchingRoles, setIsFetchingRoles] = useState(true);

  const [formData, setFormData] = useState({
    fullName: initialData?.fullName || "",
    email: initialData?.email || "",
    password: "", // Add password field
    phoneNumber: initialData?.phoneNumber || "",
    address: initialData?.address || "",
    status: initialData?.status || "active",
    roleIds: initialData?.roles?.map(r => r.id) || [] as string[]
  });

  useEffect(() => {
    fetchRoles();
  }, []);

  const fetchRoles = async () => {
    try {
      const response = await adminService.getRoles();
      setRoles(response.data);
    } catch (error) {
      console.error("Failed to fetch roles:", error);
    } finally {
      setIsFetchingRoles(false);
    }
  };

  const handleRoleToggle = (roleId: string) => {
    setFormData(prev => ({
      ...prev,
      roleIds: prev.roleIds.includes(roleId)
        ? prev.roleIds.filter(id => id !== roleId)
        : [...prev.roleIds, roleId]
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      let userId = initialData?.id;

      if (isEdit && userId) {
        // Step 1: Update user info
        await userService.updateUser(userId, {
          fullName: formData.fullName,
          phoneNumber: formData.phoneNumber,
          address: formData.address,
        });
      } else {
        // Step 1: Create user
        const response = await userService.createUser({
          email: formData.email,
          password: formData.password,
          fullName: formData.fullName,
          phoneNumber: formData.phoneNumber,
          address: formData.address,
        });
        userId = response.data.id;
      }

      // Step 2: Assign roles via separate API
      if (userId) {
        await userService.assignRoles(userId, formData.roleIds);
      }

      router.push("/admin/users");
      router.refresh();
    } catch (error) {
      console.error("Submit error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8 max-w-4xl animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex items-center justify-between">
        <Link href="/admin/users" className="flex items-center gap-2 text-gray-500 hover:text-gray-900 transition-colors">
          <ArrowLeft size={20} />
          {t("backToUsers")}
        </Link>
        <Button 
          type="submit" 
          disabled={isLoading}
          className="rounded-xl bg-orange-500 hover:bg-orange-600 text-white gap-2 px-8 h-12 shadow-lg shadow-orange-200 transition-all"
        >
          {isLoading ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
          {isEdit ? t("updateUser") : t("createUser")}
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Avatar & Basic Info */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-3xl border border-gray-100 p-8 shadow-sm space-y-6">
            <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
              <UserIcon size={20} className="text-orange-500" />
              {t("generalInfo")}
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="fullName" className="text-sm font-bold text-gray-700">{t("fullName")}</Label>
                <div className="relative">
                  <UserIcon size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                  <Input 
                    id="fullName" 
                    placeholder="John Doe" 
                    className="pl-12 h-12 rounded-2xl bg-gray-50 border-none focus-visible:ring-2 focus-visible:ring-orange-200"
                    value={formData.fullName}
                    onChange={e => setFormData({...formData, fullName: e.target.value})}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-bold text-gray-700">{t("email")}</Label>
                <div className="relative">
                  <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                  <Input 
                    id="email" 
                    type="email"
                    placeholder="john@example.com" 
                    className="pl-12 h-12 rounded-2xl bg-gray-50 border-none focus-visible:ring-2 focus-visible:ring-orange-200"
                    value={formData.email}
                    onChange={e => setFormData({...formData, email: e.target.value})}
                  />
                </div>
              </div>

              {!isEdit && (
                <div className="space-y-2">
                  <Label htmlFor="password" className="text-sm font-bold text-gray-700">{t("password")}</Label>
                  <div className="relative">
                    <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                    <Input 
                      id="password" 
                      type="password"
                      placeholder="••••••••" 
                      className="pl-12 h-12 rounded-2xl bg-gray-50 border-none focus-visible:ring-2 focus-visible:ring-orange-200"
                      value={formData.password}
                      onChange={e => setFormData({...formData, password: e.target.value})}
                    />
                  </div>
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="phoneNumber" className="text-sm font-bold text-gray-700">{t("phoneNumber")}</Label>
                <div className="relative">
                  <Phone size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                  <Input 
                    id="phoneNumber" 
                    placeholder="+84 123 456 789" 
                    className="pl-12 h-12 rounded-2xl bg-gray-50 border-none focus-visible:ring-2 focus-visible:ring-orange-200"
                    value={formData.phoneNumber}
                    onChange={e => setFormData({...formData, phoneNumber: e.target.value})}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="address" className="text-sm font-bold text-gray-700">{t("address")}</Label>
                <div className="relative">
                  <MapPin size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                  <Input 
                    id="address" 
                    placeholder="District 1, HCMC" 
                    className="pl-12 h-12 rounded-2xl bg-gray-50 border-none focus-visible:ring-2 focus-visible:ring-orange-200"
                    value={formData.address}
                    onChange={e => setFormData({...formData, address: e.target.value})}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-3xl border border-gray-100 p-8 shadow-sm space-y-6">
            <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
              <Shield size={20} className="text-orange-500" />
              {t("rolesAndPermissions")}
            </h3>
            
            {isFetchingRoles ? (
              <div className="flex items-center gap-2 text-gray-400">
                <Loader2 size={16} className="animate-spin" />
                {t("loadingRoles")}
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-4">
                {roles.map(role => (
                  <div 
                    key={role.id} 
                    onClick={() => handleRoleToggle(role.id)}
                    className={cn(
                      "p-4 rounded-2xl border-2 transition-all cursor-pointer flex items-center justify-between group",
                      formData.roleIds.includes(role.id)
                        ? "border-orange-500 bg-orange-50/50 shadow-sm"
                        : "border-gray-50 bg-gray-50 hover:border-gray-200 hover:bg-white"
                    )}
                  >
                    <div className="flex flex-col">
                      <span className={cn(
                        "text-sm font-bold uppercase tracking-wider",
                        formData.roleIds.includes(role.id) ? "text-orange-700" : "text-gray-700"
                      )}>
                        {role.name}
                      </span>
                      {role.description && (
                        <span className="text-[10px] text-gray-400 mt-0.5 line-clamp-1">{role.description}</span>
                      )}
                    </div>
                    <div className={cn(
                      "w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all duration-300",
                      formData.roleIds.includes(role.id) 
                        ? "bg-orange-500 border-orange-500 scale-110 shadow-lg shadow-orange-200" 
                        : "bg-white border-gray-200 group-hover:border-orange-200"
                    )}>
                      {formData.roleIds.includes(role.id) && <Check size={14} className="text-white stroke-[3]" />}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Status & Profile Image */}
        <div className="space-y-6">
          <div className="bg-white rounded-3xl border border-gray-100 p-8 shadow-sm text-center space-y-6">
            <Label className="text-sm font-bold text-gray-700 block text-left mb-2">{t("profileImage")}</Label>
            <div className="relative inline-block group">
              <div className="w-32 h-32 rounded-3xl bg-orange-50 border-4 border-white shadow-xl overflow-hidden flex items-center justify-center text-orange-500 mx-auto">
                {initialData?.avatarUrl ? (
                  <img src={initialData.avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
                ) : (
                  <UserIcon size={48} />
                )}
              </div>
              <button type="button" className="absolute -bottom-2 -right-2 w-10 h-10 bg-white rounded-xl shadow-lg border border-gray-100 flex items-center justify-center text-gray-500 hover:text-orange-500 transition-colors">
                <Edit2 size={18} />
              </button>
            </div>
            <p className="text-xs text-gray-400 px-4">Upload a high-quality JPG or PNG image. Recommended size: 400x400px.</p>
          </div>

          <div className="bg-white rounded-3xl border border-gray-100 p-8 shadow-sm space-y-6">
            <Label className="text-sm font-bold text-gray-700 block mb-2">{t("accountStatus")}</Label>
            <div className="space-y-3">
              {['active', 'inactive', 'banned'].map(status => (
                <div 
                  key={status}
                  onClick={() => setFormData({...formData, status: status as any})}
                  className={cn(
                    "p-3 rounded-xl border-2 transition-all cursor-pointer flex items-center justify-between",
                    formData.status === status
                      ? "border-orange-500 bg-orange-50 text-orange-700"
                      : "border-gray-50 bg-gray-50 text-gray-500 hover:border-gray-200"
                  )}
                >
                  <span className="text-sm font-bold capitalize">{status}</span>
                  <div className={cn(
                    "w-4 h-4 rounded-full border-2",
                    formData.status === status ? "bg-orange-500 border-orange-500" : "bg-white border-gray-300"
                  )} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </form>
  );
}
