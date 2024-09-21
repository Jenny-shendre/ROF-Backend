import mongoose, { Schema } from "mongoose";

const adminSchema = new Schema(
  {
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      // enum: ['super admin', 'sales executive', 'manager'],
      role: { type: String, default: "super admin" },
    },

    resetOTP: {
      type: String,
    },
    resetOTPExpiry: {
      type: Date,
    },
    employeeId: {
      type: String,
    },
    name: {
      type: String,
    },
    country: {
      type: String,
      default: "INDIA",
    },
    location: {
      type: String,
    },
    postalCode: {
      type: String,
    },
    aadharCard: {
      type: String,
    },
    phone: {
      type: String,
      required: true,
      unique: true,
    },
    CoverImage: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

export const Admin = mongoose.model("Admin", adminSchema);
