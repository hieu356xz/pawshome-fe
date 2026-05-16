export const RESOURCES = [
  "user",
  "role",
  "permission",
  "policy",
  "pet",
  "species",
  "breed",
  "pet-image",
  "medical-record",
  "adoption-request",
  "pet-post",
  "pet-post-comment",
  "blog",
  "blog-comment",
] as const;

export type Resource = (typeof RESOURCES)[number];

export const ACTIONS = [
  "create",
  "read",
  "update",
  "delete",
  "list",
  "assign",
] as const;

export type Action = (typeof ACTIONS)[number];

export type WildcardPermissionKey = `${Resource}:${Action | "*"}` | "*";

export type PermissionKey = `${Resource}:${Action}` | WildcardPermissionKey;

export type RoleName =
  | "admin"
  | "manager"
  | "staff"
  | "veterinarian"
  | "volunteer"
  | "member";

export interface Permission {
  id: string;
  key: string;
  description?: string;
  assignable?: boolean;
}

export interface Role {
  id: string;
  name: string;
  description?: string;
  permissions?: Permission[];
}

export interface User {
  id: string;
  email: string;
  fullName?: string;
  avatarUrl?: string;
  bio?: string;
  phoneNumber?: string;
  address?: string;
  status: "inactive" | "active" | "banned";
  googleId?: string;
  roles?: Role[];
  createdAt: string;
  updatedAt: string;
}

export interface AuthResponse {
  tokens: {
    accessToken: string;
    expiresIn: number;
    tokenType: string;
  };
  user: User;
}

export interface LoginDto {
  email: string;
  password?: string;
}

export interface RegisterDto {
  email: string;
  password?: string;
  fullName?: string;
}
