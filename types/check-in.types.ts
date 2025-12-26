export interface ICheckInLog {
  _id: string;
  organizationId: string;
  registrationId: string;
  eventId: string;
  staffId: string;
  timestamp: Date | string;
}

export interface CheckInDto {
  registrationId: string;
  staffId: string;
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
