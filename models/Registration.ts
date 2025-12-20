import mongoose, { Schema, Model, models, Document } from "mongoose";

export interface IRegistration extends Document {
  organizationId: string;
  eventId: string;
  name: string;
  email: string;
  checkedIn: boolean;
  checkedInAt?: Date;
  createdAt: Date;
}

const RegistrationSchema = new Schema<IRegistration>(
  {
    organizationId: {
      type: String,
      required: [true, "Organization ID is required"],
      ref: "Organization",
      index: true,
    },
    eventId: {
      type: String,
      required: [true, "Event ID is required"],
      ref: "Event",
      index: true,
    },
    name: {
      type: String,
      required: [true, "Registrant name is required"],
      trim: true,
      maxlength: [200, "Name cannot be more than 200 characters"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, "Please provide a valid email address"],
    },
    checkedIn: {
      type: Boolean,
      default: false,
      index: true,
    },
    checkedInAt: {
      type: Date,
    },
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
  },
);

// Compound unique index to prevent duplicate registrations
RegistrationSchema.index({ eventId: 1, email: 1 }, { unique: true });

// Index for organization queries
RegistrationSchema.index({ organizationId: 1, createdAt: -1 });

// Index for event + check-in status queries
RegistrationSchema.index({ eventId: 1, checkedIn: 1 });

// Prevent model recompilation during development
const Registration: Model<IRegistration> =
  models.Registration || mongoose.model<IRegistration>("Registration", RegistrationSchema);

export default Registration;
