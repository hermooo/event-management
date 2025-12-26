import mongoose from "mongoose";

export interface IEvent {
  _id: mongoose.Types.ObjectId;
  organizationId: mongoose.Types.ObjectId;
  slug: string;
  title: string;
  date: Date | string;
  location: string;
  capacity?: number;
  organizerId: mongoose.Types.ObjectId;
  createdAt: Date | string;
}

export interface CreateEventDto {
  organizationId: mongoose.Types.ObjectId;
  slug: string;
  title: string;
  date: string | Date;
  location: string;
  capacity?: number;
  organizerId: mongoose.Types.ObjectId;
}

export interface UpdateEventDto {
  slug?: string;
  title?: string;
  date?: string | Date;
  location?: string;
  capacity?: number;
}

export interface EventQueryParams {
  organizationId?: mongoose.Types.ObjectId;
  organizerId?: mongoose.Types.ObjectId;
  startDate?: string;
  endDate?: string;
  limit?: number;
  page?: number;
}
