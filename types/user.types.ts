export type UserRole = "organizer" | "staff";
export type UserStatus = "pending" | "active";

export interface IUser {
  _id: string;
  organizationId: string;
  name: string;
  email: string;
  password?: string; // Optional since it's not selected by default
  role: UserRole;
  status: UserStatus;
  createdAt: Date | string;
}

export interface IUserSession {
  _id: string;
  userId: string;
  ipAddress?: string;
  deviceModel?: string;
  userAgent?: string;
  expiresAt: Date | string;
  createdAt: Date | string;
}

export interface CreateUserDto {
  organizationId: string;
  name: string;
  email: string;
  password: string;
  role?: UserRole;
}

export interface LoginDto {
  email: string;
  password: string;
}
