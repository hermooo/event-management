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

export const InviteToken: Model<IInviteToken> =
  mongoose.models.InviteToken || mongoose.model<IInviteToken>("InviteToken", InviteTokenSchema);
