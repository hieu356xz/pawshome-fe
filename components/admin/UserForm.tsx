"use client";

import React, { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { User, Role } from "@/types/auth";
import { adminService } from "@/services/admin.service";
import { userService } from "@/services/user.service";
import { Label } from "@/components/ui/label";
import { 
  User as UserIcon, 
  Mail, 
  Phone, 
  MapPin, 
  Shield,
  Edit2,
  Lock,
  Loader2
} from "lucide-react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

// Modular Admin Form Components
import { AdminFormField } from "./form/AdminFormField";
import { AdminFormSection } from "./form/AdminFormSection";
import { AdminFormHeader } from "./form/AdminFormHeader";
import { AdminStatusSelection } from "./form/AdminStatusSelection";
import { AdminRoleSelection } from "./form/AdminRoleSelection";
import { AdminFormError } from "./form/AdminFormError";
import { useToast } from "@/components/ui/toast";

interface UserFormProps {
  initialData?: User;
  isEdit?: boolean;
}

export function UserForm({ initialData, isEdit = false }: UserFormProps) {
  const t = useTranslations("UserManagement");
  const router = useRouter();
  const { toast } = useToast();
  const [roles, setRoles] = useState<Role[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isUpdatingRoles, setIsUpdatingRoles] = useState(false);
  const [isFetchingRoles, setIsFetchingRoles] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    fullName: initialData?.fullName || "",
    email: initialData?.email || "",
    password: "",
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

  const handleSaveRoles = async () => {
    if (!initialData?.id) return;
    
    setIsUpdatingRoles(true);
    setError(null);
    try {
      await userService.assignRoles(initialData.id, formData.roleIds);
      toast({ 
        type: "success", 
        message: t("rolesUpdated") || "Roles updated successfully" 
      });
      router.refresh();
    } catch (err: any) {
      console.error("Failed to update roles:", err);
      setError(err);
    } finally {
      setIsUpdatingRoles(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    try {
      let userId = initialData?.id;

      if (isEdit && userId) {
        await userService.updateUser(userId, {
          fullName: formData.fullName,
          phoneNumber: formData.phoneNumber,
          address: formData.address,
        });
      } else {
        const response = await userService.createUser({
          email: formData.email,
          password: formData.password,
          fullName: formData.fullName,
          phoneNumber: formData.phoneNumber,
          address: formData.address,
        });
        userId = response.data.id;
      }

      if (!isEdit && userId) {
        await userService.assignRoles(userId, formData.roleIds);
      }

      toast({ 
        type: "success", 
        message: isEdit ? "User updated successfully" : "User created successfully" 
      });
      
      router.push("/admin/users");
      router.refresh();
    } catch (err: any) {
      console.error("Submit error:", err);
      setError(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8 max-w-5xl animate-in fade-in slide-in-from-bottom-4 duration-700">
      <AdminFormHeader 
        title={isEdit ? t("editUser") : t("addUser")}
        backUrl="/admin/users"
        backLabel={t("backToUsers")}
        submitLabel={isEdit ? t("updateUser") : t("createUser")}
        isLoading={isLoading}
      />

      <AdminFormError message={error} onClear={() => setError(null)} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <AdminFormSection 
            title={t("generalInfo")} 
            icon={<UserIcon size={20} />}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <AdminFormField 
                id="fullName"
                label={t("fullName")}
                placeholder="John Doe"
                icon={<UserIcon size={18} />}
                value={formData.fullName}
                onChange={e => setFormData({...formData, fullName: e.target.value})}
              />

              <AdminFormField 
                id="email"
                type="email"
                label={t("email")}
                placeholder="john@example.com"
                icon={<Mail size={18} />}
                value={formData.email}
                disabled={isEdit}
                onChange={e => setFormData({...formData, email: e.target.value})}
              />

              {!isEdit && (
                <AdminFormField 
                  id="password"
                  type="password"
                  label={t("password")}
                  placeholder="••••••••"
                  icon={<Lock size={18} />}
                  value={formData.password}
                  onChange={e => setFormData({...formData, password: e.target.value})}
                />
              )}

              <AdminFormField 
                id="phoneNumber"
                label={t("phoneNumber")}
                placeholder="+84 123 456 789"
                icon={<Phone size={18} />}
                value={formData.phoneNumber}
                onChange={e => setFormData({...formData, phoneNumber: e.target.value})}
              />

              <AdminFormField 
                id="address"
                label={t("address")}
                placeholder="District 1, HCMC"
                icon={<MapPin size={18} />}
                containerClassName="md:col-span-2"
                value={formData.address}
                onChange={e => setFormData({...formData, address: e.target.value})}
              />
            </div>
          </AdminFormSection>

          <div className="bg-white rounded-3xl border border-gray-100 p-8 shadow-sm">
            <AdminRoleSelection 
              label={t("rolesAndPermissions")}
              roles={roles}
              selectedIds={formData.roleIds}
              onToggle={handleRoleToggle}
              isLoading={isFetchingRoles}
              loadingLabel={t("loadingRoles")}
              action={isEdit && (
                <button
                  type="button"
                  onClick={handleSaveRoles}
                  disabled={isUpdatingRoles}
                  className="px-4 py-2 bg-orange-500 text-white rounded-xl text-sm font-medium hover:bg-orange-600 disabled:opacity-50 transition-colors flex items-center gap-2"
                >
                  {isUpdatingRoles ? <Loader2 className="animate-spin" size={16} /> : <Shield size={16} />}
                  {t("saveRoles")}
                </button>
              )}
            />
          </div>
        </div>

        <div className="space-y-8">
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

          <div className="bg-white rounded-3xl border border-gray-100 p-8 shadow-sm">
            <AdminStatusSelection 
              label={t("accountStatus")}
              value={formData.status}
              onChange={val => setFormData({...formData, status: val as any})}
              options={[
                { value: 'active', label: 'Active' },
                { value: 'inactive', label: 'Inactive' },
                { value: 'banned', label: 'Banned' }
              ]}
            />
          </div>
        </div>
      </div>
    </form>
  );
}
