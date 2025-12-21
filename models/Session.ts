import mongoose, { Schema, Model, models, Document } from "mongoose";

export interface ISession extends Document {
  userId: string;
  expiresAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

const SessionSchema = new Schema<ISession>(
  {
    userId: {
      type: String,
      required: [true, "User ID is required"],
      ref: "User",
    },
    expiresAt: {
      type: Date,
      required: [true, "Expiration date is required"],
    },
  },
  {
    timestamps: true,
  },
);

// Compound index for user + expiration queries
SessionSchema.index({ userId: 1, expiresAt: 1 });

// TTL index to automatically delete expired sessions
SessionSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

// Prevent model recompilation during development
const Session: Model<ISession> = models.Session || mongoose.model<ISession>("Session", SessionSchema);

export default Session;
