// Model Interfaces (duplicated from models for client-side use)

export type UserRole = "admin" | "organizer" | "staff";

export interface IOrganization {
  _id: string;
  name: string;
  slug: string;
  createdAt: Date | string;
}

export interface IUser {
  _id: string;
  organizationId: string;
  name: string;
  email: string;
  passwordHash?: string; // Optional since it's not selected by default
  role: UserRole;
  createdAt: Date | string;
}

export interface ISession {
  _id: string;
  userId: string;
  expiresAt: Date | string;
  createdAt: Date | string;
}

export interface IEvent {
  _id: string;
  organizationId: string;
  slug: string;
  title: string;
  date: Date | string;
  location: string;
  capacity?: number;
  organizerId: string;
  createdAt: Date | string;
}

export interface IRegistration {
  _id: string;
  organizationId: string;
  eventId: string;
  name: string;
  email: string;
  checkedIn: boolean;
  checkedInAt?: Date | string;
  createdAt: Date | string;
}

export interface ICheckInLog {
  _id: string;
  organizationId: string;
  registrationId: string;
  eventId: string;
  staffId: string;
  timestamp: Date | string;
}

// API Response Types
export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string | string[];
  count?: number;
}

// DTOs (Data Transfer Objects) for API requests

export interface CreateOrganizationDto {
  name: string;
  slug: string;
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

export interface CreateEventDto {
  organizationId: string;
  slug: string;
  title: string;
  date: string | Date;
  location: string;
  capacity?: number;
  organizerId: string;
}

export interface UpdateEventDto {
  slug?: string;
  title?: string;
  date?: string | Date;
  location?: string;
  capacity?: number;
}

export interface CreateRegistrationDto {
  organizationId: string;
  eventId: string;
  name: string;
  email: string;
}

export interface CheckInDto {
  registrationId: string;
  staffId: string;
}

// Query Parameters
export interface EventQueryParams {
  organizationId?: string;
  organizerId?: string;
  startDate?: string;
  endDate?: string;
  limit?: number;
  page?: number;
}

export interface RegistrationQueryParams {
  organizationId?: string;
  eventId?: string;
  checkedIn?: boolean;
  limit?: number;
  page?: number;
}

export interface CheckInLogQueryParams {
  organizationId?: string;
  eventId?: string;
  staffId?: string;
  startDate?: string;
  endDate?: string;
  limit?: number;
  page?: number;
}
