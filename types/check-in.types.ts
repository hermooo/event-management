import mongoose from "mongoose";

export interface ICheckInLog {
  _id: mongoose.Types.ObjectId;
  organizationId: mongoose.Types.ObjectId;
  registrationId: mongoose.Types.ObjectId;
  eventId: mongoose.Types.ObjectId;
  staffId: mongoose.Types.ObjectId;
  timestamp: Date | string;
}

export interface CheckInDto {
  registrationId: mongoose.Types.ObjectId;
  staffId: mongoose.Types.ObjectId;
}

export interface CheckInLogQueryParams {
  organizationId?: mongoose.Types.ObjectId;
  eventId?: mongoose.Types.ObjectId;
  staffId?: mongoose.Types.ObjectId;
  startDate?: string;
  endDate?: string;
  limit?: number;
  page?: number;
}
