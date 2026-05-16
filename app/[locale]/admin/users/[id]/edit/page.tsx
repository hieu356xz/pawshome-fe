"use client";

import React, { useState, useEffect } from "react";
import { UserForm } from "@/components/admin/UserForm";
import { userService } from "@/services/user.service";
import { User } from "@/types/auth";
import { useParams } from "next/navigation";
import { Loader2 } from "lucide-react";
import { useTranslations } from "next-intl";

export default function EditUserPage() {
  const t = useTranslations("UserManagement");
  const params = useParams();
  const id = params.id;
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  console.log("EditUserPage Params:", params);

  useEffect(() => {
    if (id) {
      fetchUser(id as string);
    }
  }, [id]);

  const fetchUser = async (userId: string) => {
    try {
      const response = await userService.getUserById(userId);
      setUser(response.data);
    } catch (error) {
      console.error("Failed to fetch user:", error);
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

  if (!user) {
    return (
      <div className="text-center py-20">
        <h2 className="text-2xl font-bold text-gray-900">{t("userNotFound")}</h2>
        <p className="text-gray-500 mt-2">{t("userNotFoundDesc")}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-playfair font-bold text-gray-900 tracking-tight">{t("editUser")}</h1>
        <p className="text-gray-500 mt-1">{t("updateMemberDesc", { name: user.fullName || user.email })}</p>
      </div>
      <UserForm initialData={user} isEdit={true} />
    </div>
  );
}
