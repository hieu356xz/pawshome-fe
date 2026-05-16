export interface Permission {
  id: number;
  name: string;
  description?: string;
  action: string;
  subject: string;
}

export interface Role {
  id: number;
  name: string;
  description?: string;
  permissions?: Permission[];
}

export interface User {
  id: number;
  email: string;
  fullName?: string;
  avatarUrl?: string;
  bio?: string;
  phoneNumber?: string;
  address?: string;
  status: 'inactive' | 'active' | 'banned';
  googleId?: string;
  roles?: Role[];
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
