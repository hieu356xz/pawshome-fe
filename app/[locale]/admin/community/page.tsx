"use client";

import React, { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { petPostService } from "@/services/pet-post.service";
import { PetPost, PostType, PostStatus } from "@/types/post";
import {
  Search,
  MapPin,
  User as UserIcon,
  Image as ImageIcon,
  Tag,
  CheckCircle2,
  XCircle,
  Plus,
} from "lucide-react";
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
  UserInfoCell,
} from "@/components/admin/table/AdminTableCells";
import {
  AdminTableActions,
  TableActionIcons,
} from "@/components/admin/table/AdminTableActions";

export default function CommunityManagementPage() {
  const t = useTranslations("CommunityManagement");
  const tCommon = useTranslations("AdminCommon");
  const [posts, setPosts] = useState<PetPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [typeFilter, setTypeFilter] = useState<string | null>(null);

  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    totalPages: 1,
    totalItems: 0,
  });

  useEffect(() => {
    fetchPosts();
  }, [pagination.page, pagination.limit, statusFilter, typeFilter]);

  const fetchPosts = async () => {
    setIsLoading(true);
    try {
      const response = await petPostService.getPosts({
        page: pagination.page,
        limit: pagination.limit,
        postStatus: statusFilter as PostStatus,
        postType: typeFilter as PostType,
      });
      setPosts(response.data);
      if (response.meta) {
        setPagination((prev) => ({
          ...prev,
          totalPages: response.meta?.totalPages || 1,
          totalItems: response.meta?.totalItems || 0,
        }));
      }
    } catch (error) {
      console.error("Failed to fetch community posts:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm(t("deleteConfirm"))) return;
    try {
      await petPostService.deletePost(id);
      fetchPosts();
    } catch (error) {
      console.error("Delete failed:", error);
    }
  };

  const handleToggleStatus = async (post: PetPost) => {
    const newStatus = post.postStatus === PostStatus.ACTIVE ? PostStatus.CLOSED : PostStatus.ACTIVE;
    try {
      await petPostService.updateStatus(post.id, newStatus);
      fetchPosts();
    } catch (error) {
      console.error("Failed to update status:", error);
    }
  };

  const filteredPosts = posts.filter((post) => {
    const matchesSearch =
      post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.user?.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.location?.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesSearch;
  });

  const filterGroups: FilterGroup[] = [
    {
      id: "postType",
      label: t("postType"),
      activeValue: typeFilter,
      onSelect: (val) => {
        setTypeFilter(val);
        setPagination({ ...pagination, page: 1 });
      },
      options: [
        { label: t("PostTypes.lost"), value: PostType.LOST },
        { label: t("PostTypes.found"), value: PostType.FOUND },
      ],
    },
    {
      id: "postStatus",
      label: t("status"),
      activeValue: statusFilter,
      onSelect: (val) => {
        setStatusFilter(val);
        setPagination({ ...pagination, page: 1 });
      },
      options: [
        { label: t("PostStatuses.active"), value: PostStatus.ACTIVE },
        { label: t("PostStatuses.closed"), value: PostStatus.CLOSED },
      ],
    },
  ];

  const columns: Column<PetPost>[] = [
    {
      header: t("postTitle"),
      cell: (post) => (
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-gray-100 overflow-hidden flex-shrink-0 border border-gray-50 shadow-sm">
            {post.images && post.images.length > 0 ? (
              <img
                src={post.images[0].imageUrl}
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
            <div className="flex items-center gap-1 text-[10px] text-gray-400 font-medium">
              <MapPin size={10} />
              <span className="truncate">{post.location || "N/A"}</span>
            </div>
          </div>
        </div>
      ),
    },
    {
      header: t("postType"),
      cell: (post) => (
        <StatusCell
          status={t(`PostTypes.${post.postType}`)}
          variant={post.postType === PostType.LOST ? "error" : "success"}
        />
      ),
    },
    {
      header: t("status"),
      cell: (post) => (
        <StatusCell
          status={t(`PostStatuses.${post.postStatus}`)}
          variant={post.postStatus === PostStatus.ACTIVE ? "info" : "warning"}
        />
      ),
    },
    {
      header: t("author"),
      cell: (post) => (
        <UserInfoCell
          name={post.user?.fullName || "Member"}
          email={post.user?.email || ""}
          avatarUrl={post.user?.avatarUrl}
        />
      ),
    },
    {
      header: t("date"),
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
              href: `/community/${post.id}`, // Assuming public route
            },
            {
              label: post.postStatus === PostStatus.ACTIVE ? t("PostStatuses.closed") : t("PostStatuses.active"),
              icon: post.postStatus === PostStatus.ACTIVE ? <XCircle size={14} /> : <CheckCircle2 size={14} />,
              onClick: () => handleToggleStatus(post),
            },
            {
              label: tCommon("edit"),
              icon: TableActionIcons.Edit,
              href: `/admin/community/${post.id}/edit`,
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
          <p className="text-gray-500 mt-1">{t("managePostsDesc")}</p>
        </div>
        <Link
          href="/admin/community/new"
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
                onClearAll={() => {
                  setStatusFilter(null);
                  setTypeFilter(null);
                  setPagination({ ...pagination, page: 1 });
                }}
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
            currentPage: pagination.page,
            totalPages: pagination.totalPages,
            totalItems: pagination.totalItems,
            onPageChange: (page) => setPagination({ ...pagination, page }),
            showingLabel: tCommon("showing"),
            ofLabel: tCommon("of"),
            itemsLabel: t("posts"),
            previousLabel: tCommon("previous"),
            nextLabel: tCommon("next"),
          }}
        />
      </div>
    </div>
  );
}
