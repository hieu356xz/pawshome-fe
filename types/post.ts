import { User } from './auth';
import { PaginationParams } from './common';

export enum PostType {
  LOST = 'lost',
  FOUND = 'found',
}

export enum PostStatus {
  ACTIVE = 'active',
  CLOSED = 'closed',
}

export interface PostImage {
  id: number;
  postId: number;
  imageUrl: string;
}

export interface Comment {
  id: number;
  userId: number;
  content: string;
  parentId?: number;
  createdAt: string;
  updatedAt: string;
  user?: User;
  replies?: Comment[];
}

export interface PetPost {
  id: number;
  userId: number;
  postType: PostType;
  title: string;
  description: string;
  location?: string;
  contact?: string;
  postStatus: PostStatus;
  createdAt: string;
  updatedAt: string;
  images?: PostImage[];
  comments?: Comment[];
}

export interface PetPostQuery extends PaginationParams {
  postType?: PostType;
  postStatus?: PostStatus;
  userId?: number;
}

export interface BlogPost {
  id: number;
  userId: number;
  title: string;
  slug: string;
  content: string;
  excerpt?: string;
  status: 'DRAFT' | 'PUBLISHED';
  featuredImageUrl?: string;
  viewCount: number;
  tags?: string[];
  createdAt: string;
  updatedAt: string;
  comments?: Comment[];
}
