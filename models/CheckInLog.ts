import mongoose, { Schema, Model, models, Document } from "mongoose";

export interface ICheckInLog extends Document {
  organizationId: mongoose.Types.ObjectId;
  registrationId: mongoose.Types.ObjectId;
  eventId: mongoose.Types.ObjectId;
  staffId: mongoose.Types.ObjectId;
  timestamp: Date;
  createdAt: Date;
  updatedAt: Date;
}

const CheckInLogSchema = new Schema<ICheckInLog>(
  {
    organizationId: {
      type: Schema.Types.ObjectId,
      required: [true, "Organization ID is required"],
      ref: "Organization",
    },
    registrationId: {
      type: Schema.Types.ObjectId,
      required: [true, "Registration ID is required"],
      ref: "Registration",
    },
    eventId: {
      type: Schema.Types.ObjectId,
      required: [true, "Event ID is required"],
      ref: "Event",
    },
    staffId: {
      type: Schema.Types.ObjectId,
      required: [true, "Staff ID is required"],
      ref: "User",
    },
    timestamp: {
      type: Date,
      required: [true, "Timestamp is required"],
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

// Compound index for event-based queries
CheckInLogSchema.index({ eventId: 1, timestamp: -1 });

// Index for organization queries
CheckInLogSchema.index({ organizationId: 1, timestamp: -1 });

// Index for staff activity tracking
CheckInLogSchema.index({ staffId: 1, timestamp: -1 });

// Index for registration history
CheckInLogSchema.index({ registrationId: 1, timestamp: -1 });

// Prevent model recompilation during development
const CheckInLog: Model<ICheckInLog> =
  models.CheckInLog || mongoose.model<ICheckInLog>("CheckInLog", CheckInLogSchema);

export default CheckInLog;
