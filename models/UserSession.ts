import mongoose, { Schema, Model, models, Document } from "mongoose";

export interface IUserSession extends Document {
  userId: mongoose.Types.ObjectId;
  ipAddress?: string;
  deviceModel?: string;
  userAgent?: string;
  expiresAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

const UserSessionSchema = new Schema<IUserSession>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      required: [true, "User ID is required"],
      ref: "User",
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

// Compound index for user + expiration queries
UserSessionSchema.index({ userId: 1, expiresAt: 1 });

// TTL index to automatically delete expired sessions
UserSessionSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

// Prevent model recompilation during development
const UserSession: Model<IUserSession> =
  models.UserSession || mongoose.model<IUserSession>("UserSession", UserSessionSchema);

export default UserSession;
