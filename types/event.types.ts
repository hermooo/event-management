import mongoose from "mongoose";

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

export interface EventQueryParams {
  organizationId?: mongoose.Types.ObjectId;
  organizerId?: mongoose.Types.ObjectId;
  startDate?: string;
  endDate?: string;
  limit?: number;
  page?: number;
}
