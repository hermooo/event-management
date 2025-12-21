import mongoose, { Schema, Model, models, Document } from "mongoose";

export interface IOrganization extends Document {
  name: string;
  slug: string;
  createdAt: Date;
  updatedAt: Date;
}

const OrganizationSchema = new Schema<IOrganization>(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
      maxlength: [200, "Name cannot be more than 200 characters"],
    },
    slug: {
      type: String,
      required: [true, "Slug is required"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^[a-z0-9-]+$/, "Slug can only contain lowercase letters, numbers, and hyphens"],
    },
  },
  {
    timestamps: true,
  }
);

// Prevent model recompilation during development
const Organization: Model<IOrganization> =
  models.Organization || mongoose.model<IOrganization>("Organization", OrganizationSchema);

export default Organization;
