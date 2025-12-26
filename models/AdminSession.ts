import mongoose, { Schema, Model, models, Document } from "mongoose";

export interface IAdminSession extends Document {
  adminId: mongoose.Types.ObjectId;
  ipAddress?: string;
  deviceModel?: string;
  userAgent?: string;
  expiresAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

const AdminSessionSchema = new Schema<IAdminSession>(
  {
    adminId: {
      type: Schema.Types.ObjectId,
      required: [true, "Admin ID is required"],
      ref: "Admin",
    },
    ipAddress: {
      type: String,
    },
    deviceModel: {
      type: String,
    },
    userAgent: {
      type: String,
    },
    expiresAt: {
      type: Date,
      required: [true, "Expiration date is required"],
    },
  },
  {
    timestamps: true,
  }
);

// Compound index for admin + expiration queries
AdminSessionSchema.index({ adminId: 1, expiresAt: 1 });

// TTL index to automatically delete expired sessions
AdminSessionSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

// Prevent model recompilation during development
const AdminSession: Model<IAdminSession> =
  models.AdminSession || mongoose.model<IAdminSession>("AdminSession", AdminSessionSchema);

export default AdminSession;
