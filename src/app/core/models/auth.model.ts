export type UserRole = 'ROLE_ADMIN' | 'ROLE_FARMER' | 'ROLE_BUYER';

export interface AuthUser {
  userId: number;
  email: string;
  role: UserRole;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface AuthResponse extends AuthTokens, AuthUser {}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message: string | null;
}
