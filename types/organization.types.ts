export interface IOrganization {
  _id: string;
  name: string;
  slug: string;
  createdAt: Date | string;
}

export interface CreateOrganizationDto {
  name: string;
  slug: string;
}
