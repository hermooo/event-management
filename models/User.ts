import mongoose, { Schema, Model, models, Document } from "mongoose";

export type UserRole = "admin" | "organizer" | "staff";

export interface IUser extends Document {
  organizationId: string;
  name: string;
  email: string;
  password: string;
  role: UserRole;
  createdAt: Date;
}

const UserSchema = new Schema<IUser>(
  {
    organizationId: {
      type: String,
      required: [true, "Organization ID is required"],
      ref: "Organization",
      index: true,
    },
    name: {
      type: String,
      required: [true, "User name is required"],
      trim: true,
      maxlength: [200, "Name cannot be more than 200 characters"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, "Please provide a valid email address"],
      index: true,
    },
    password: {
      type: String,
      required: [true, "Password hash is required"],
      select: false, // Don't return password hash by default
    },
    role: {
      type: String,
      enum: ["admin", "organizer", "staff"],
      default: "staff",
      required: [true, "User role is required"],
      index: true,
    },
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
  },
);

// Compound index for organization + email uniqueness
UserSchema.index({ organizationId: 1, email: 1 }, { unique: true });

// Index for role-based queries
UserSchema.index({ organizationId: 1, role: 1 });

// Prevent model recompilation during development
const User: Model<IUser> = models.User || mongoose.model<IUser>("User", UserSchema);

export default User;
