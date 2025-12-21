import mongoose, { Schema, Model, models, Document } from "mongoose";

export interface IAdmin extends Document {
  name: string;
  email: string;
  password: string;

  createdAt: Date;
  updatedAt: Date;
}

const AdminSchema = new Schema<IAdmin>(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
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
    },
    password: {
      type: String,
      required: [true, "Password hash is required"],
      select: false, // Don't return password hash by default
    },
  },
  {
    timestamps: true,
  }
);

// Prevent model recompilation during development
const Admin: Model<IAdmin> = models.Admin || mongoose.model<IAdmin>("Admin", AdminSchema);

export default Admin;
