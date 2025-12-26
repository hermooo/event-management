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

export interface CreateRegistrationDto {
  organizationId: string;
  eventId: string;
  name: string;
  email: string;
}

export interface RegistrationQueryParams {
  organizationId?: string;
  eventId?: string;
  checkedIn?: boolean;
  limit?: number;
  page?: number;
}
