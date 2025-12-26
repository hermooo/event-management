import mongoose from "mongoose";

export interface IRegistration {
  _id: string;
  organizationId: mongoose.Types.ObjectId;
  eventId: mongoose.Types.ObjectId;
  name: string;
  email: string;
  checkedIn: boolean;
  checkedInAt?: Date | string;
  createdAt: Date | string;
}

export interface CreateRegistrationDto {
  organizationId: mongoose.Types.ObjectId;
  eventId: mongoose.Types.ObjectId;
  name: string;
  email: string;
}

export interface RegistrationQueryParams {
  organizationId?: mongoose.Types.ObjectId;
  eventId?: mongoose.Types.ObjectId;
  checkedIn?: boolean;
  limit?: number;
  page?: number;
}
