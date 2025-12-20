import mongoose, { Schema, Model, models, Document } from "mongoose";

export interface IEvent extends Document {
  organizationId: string;
  slug: string;
  title: string;
  date: Date;
  location: string;
  capacity?: number;
  organizerId: string;
  createdAt: Date;
}

const EventSchema = new Schema<IEvent>(
  {
    organizationId: {
      type: String,
      required: [true, "Organization ID is required"],
      ref: "Organization",
      index: true,
    },
    slug: {
      type: String,
      required: [true, "Event slug is required"],
      lowercase: true,
      trim: true,
      match: [/^[a-z0-9-]+$/, "Slug can only contain lowercase letters, numbers, and hyphens"],
    },
    title: {
      type: String,
      required: [true, "Event title is required"],
      trim: true,
      maxlength: [200, "Title cannot be more than 200 characters"],
    },
    date: {
      type: Date,
      required: [true, "Event date is required"],
      index: true,
    },
    location: {
      type: String,
      required: [true, "Location is required"],
      trim: true,
      maxlength: [500, "Location cannot be more than 500 characters"],
    },
    capacity: {
      type: Number,
      min: [1, "Capacity must be at least 1"],
    },
    organizerId: {
      type: String,
      required: [true, "Organizer ID is required"],
      ref: "User",
      index: true,
    },
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
  },
);

// Compound unique index for organization + slug
EventSchema.index({ organizationId: 1, slug: 1 }, { unique: true });

// Index for date-based queries
EventSchema.index({ organizationId: 1, date: 1 });

// Index for organizer queries
EventSchema.index({ organizerId: 1, date: -1 });

// Prevent model recompilation during development
const Event: Model<IEvent> = models.Event || mongoose.model<IEvent>("Event", EventSchema);

export default Event;
