"use client";

import React, { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { blogService } from "@/services/blog.service";
import { BlogPost } from "@/types/post";
import {
  Search,
  Plus,
  FileText,
  User as UserIcon,
  Calendar,
  ExternalLink,
  Edit,
  Trash2,
  Image as ImageIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";

import { AdminTable, Column } from "@/components/admin/AdminTable";
import {
  AdminTableFilters,
  FilterGroup,
} from "@/components/admin/AdminTableFilters";
import {
  StatusCell,
  DateCell,
  BadgeGroupCell,
} from "@/components/admin/table/AdminTableCells";
import {
  AdminTableActions,
  TableActionIcons,
} from "@/components/admin/table/AdminTableActions";

export default function BlogManagementPage() {
  const t = useTranslations("BlogManagement");
  const tCommon = useTranslations("AdminCommon");
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string | null>(null);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    setIsLoading(true);
    try {
      const response = await blogService.getPosts();
      setPosts(response.data);
    } catch (error) {
      console.error("Failed to fetch posts:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm(t("deleteConfirm"))) return;
    try {
      await blogService.deletePost(id);
      setPosts(posts.filter((p) => p.id !== id));
    } catch (error) {
      console.error("Delete failed:", error);
    }
  };

  const filteredPosts = posts.filter((post) => {
    const matchesSearch =
      post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.user?.fullName?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = !statusFilter || post.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const filterGroups: FilterGroup[] = [
    {
      id: "status",
      label: t("status"),
      activeValue: statusFilter,
      onSelect: setStatusFilter,
      options: [
        { label: t("PostStatuses.draft"), value: "draft" },
        { label: t("PostStatuses.published"), value: "published" },
        { label: t("PostStatuses.archived"), value: "archived" },
      ],
    },
  ];

  const columns: Column<BlogPost>[] = [
    {
      header: t("postTitle"),
      cell: (post) => (
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-gray-100 overflow-hidden flex-shrink-0 border border-gray-50 shadow-sm">
            {post.featuredImageUrl ? (
              <img
                src={post.featuredImageUrl}
                alt=""
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-300">
                <ImageIcon size={20} />
              </div>
            )}
          </div>
          <div className="flex flex-col max-w-md">
            <span className="font-bold text-gray-900 line-clamp-1 tracking-tight">
              {post.title}
            </span>
            <span className="text-[10px] text-gray-400 font-medium truncate uppercase tracking-tighter">
              /{post.slug}
            </span>
          </div>
        </div>
      ),
    },
    {
      header: t("status"),
      cell: (post) => (
        <StatusCell
          status={t(`PostStatuses.${post.status}`)}
          variant={
            post.status === "published"
              ? "success"
              : post.status === "archived"
                ? "info"
                : "warning"
          }
        />
      ),
    },
    {
      header: t("author"),
      cell: (post) => (
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-full bg-blue-50 flex items-center justify-center text-blue-500">
            <UserIcon size={12} />
          </div>
          <span className="text-xs font-bold text-gray-700">
            {post.user?.fullName || "Staff"}
          </span>
        </div>
      ),
    },
    {
      header: t("tags"),
      cell: (post) => (
        <BadgeGroupCell
          items={
            post.tags?.map((tag) => ({
              id: tag.id.toString(),
              label: tag.name,
            })) || []
          }
          variant="orange"
        />
      ),
    },
    {
      header: t("publishDate"),
      cell: (post) => <DateCell date={post.createdAt} />,
    },
    {
      header: tCommon("actions"),
      align: "right",
      cell: (post) => (
        <AdminTableActions
          actions={[
            {
              label: tCommon("view"),
              icon: TableActionIcons.View,
              href: `/blog/${post.slug}`,
            },
            {
              label: tCommon("edit"),
              icon: TableActionIcons.Edit,
              href: `/admin/blog/${post.id}/edit`,
            },
            {
              label: tCommon("delete"),
              icon: TableActionIcons.Delete,
              variant: "danger",
              onClick: () => handleDelete(post.id),
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
          <p className="text-gray-500 mt-1">{t("manageBlogDesc")}</p>
        </div>
        <Link
          href="/admin/blog/new"
          className="bg-orange-500 hover:bg-orange-600 text-white rounded-2xl h-12 px-6 shadow-lg shadow-orange-100 flex items-center gap-2 transition-all font-medium">
          <Plus size={20} />
          {t("createPost")}
        </Link>
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
                placeholder={t("searchPosts")}
                className="pl-12 h-12 rounded-2xl bg-gray-50 border-none focus-visible:ring-2 focus-visible:ring-orange-200 transition-all"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="flex-1 md:flex md:justify-end">
              <AdminTableFilters
                groups={filterGroups}
                onClearAll={() => setStatusFilter(null)}
              />
            </div>
          </div>
        </div>

        <AdminTable
          columns={columns}
          data={filteredPosts}
          isLoading={isLoading}
          emptyMessage={t("noPostsFound")}
          pagination={{
            currentPage: 1,
            totalPages: 1,
            totalItems: filteredPosts.length,
            onPageChange: () => {},
            showingLabel: tCommon("showing"),
            ofLabel: tCommon("of"),
            itemsLabel: t("title").toLowerCase(),
            previousLabel: tCommon("previous"),
            nextLabel: tCommon("next"),
          }}
        />
      </div>
    </div>
  );
}
