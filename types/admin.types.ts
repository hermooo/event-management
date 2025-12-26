import mongoose from "mongoose";

export interface IAdmin {
  _id: mongoose.Types.ObjectId;
  name: string;
  email: string;
  passwordHash?: string;
  createdAt: Date | string;
  updatedAt: Date | string;
}

export interface AdminLoginDto {
  email: string;
  password: string;
}

export interface IAdminSession {
  _id: mongoose.Types.ObjectId;
  adminId: mongoose.Types.ObjectId;
  ipAddress?: string;
  deviceModel?: string;
  userAgent?: string;
  expiresAt: Date | string;
  createdAt: Date | string;
}
