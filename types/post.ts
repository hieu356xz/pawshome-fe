import { User } from './auth';
import { PaginationParams, SortOrder } from './common';

export enum PostType {
  LOST = 'lost',
  FOUND = 'found',
}

export enum PostStatus {
  ACTIVE = 'active',
  CLOSED = 'closed',
}

export interface PostImage {
  id: string;
  postId: string;
  imageUrl: string;
  s3Key?: string;
}

export interface Tag {
  id: number;
  name: string;
  slug: string;
}

export interface Comment {
  id: string;
  userId: string;
  content: string;
  parentId?: string;
  createdAt: string;
  updatedAt: string;
  user?: User;
  replies?: Comment[];
}

export interface PetPost {
  id: string;
  userId: string;
  postType: PostType;
  title: string;
  description: string | null;
  location: string | null;
  contact: string;
  postStatus: PostStatus;
  createdAt: string;
  updatedAt: string;
  images?: PostImage[];
  comments?: Comment[];
  user?: User;
}

export interface PetPostQuery extends PaginationParams {
  postType?: PostType;
  postStatus?: PostStatus;
  userId?: string;
  sortBy?: string;
  sortOrder?: SortOrder;
}

export interface BlogPost {
  id: string;
  userId: string;
  title: string;
  slug: string;
  content: string;
  excerpt?: string;
  status: 'draft' | 'published' | 'archived';
  featuredImageUrl?: string;
  viewCount: number;
  tags?: Tag[];
  createdAt: string;
  updatedAt: string;
  comments?: Comment[];
  user?: User;
}
