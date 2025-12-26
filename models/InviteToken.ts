import mongoose, { Schema, Document, Model } from "mongoose";

export interface IInviteToken extends Document {
  userId: mongoose.Types.ObjectId;
  tokenHash: string;
  expiresAt: Date;
  usedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

const InviteTokenSchema = new Schema<IInviteToken>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    tokenHash: {
      type: String,
      required: true,
      unique: true,
    },
    expiresAt: {
      type: Date,
      required: true,
    },
    usedAt: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
);

// Index for token validation queries
InviteTokenSchema.index({ tokenHash: 1, usedAt: 1, expiresAt: 1 });

export const InviteToken: Model<IInviteToken> =
  mongoose.models.InviteToken || mongoose.model<IInviteToken>("InviteToken", InviteTokenSchema);
