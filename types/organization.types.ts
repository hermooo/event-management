import mongoose from "mongoose";

export interface IOrganization {
  _id: mongoose.Types.ObjectId;
  name: string;
  slug: string;
  createdAt: Date | string;
}

export interface CreateOrganizationDto {
  name: string;
  slug: string;
}
