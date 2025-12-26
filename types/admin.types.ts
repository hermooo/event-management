export interface IAdmin {
  _id: string;
  name: string;
  email: string;
  password?: string;
  createdAt: Date | string;
  updatedAt: Date | string;
}

export interface AdminLoginDto {
  email: string;
  password: string;
}

export interface IAdminSession {
  _id: string;
  adminId: string;
  ipAddress?: string;
  deviceModel?: string;
  userAgent?: string;
  expiresAt: Date | string;
  createdAt: Date | string;
}
