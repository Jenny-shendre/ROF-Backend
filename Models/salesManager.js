import mongoose from "mongoose";
import bcrypt from "bcrypt";

const SalesManagerSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
      unique: true,
    },
    password: { type: String, required: true },
    role: { type: String, default: "manager" },
    resetOTP: {
      type: String,
    },
    resetOTPExpiry: {
      type: Date,
    },
    employeeId: {
      type: String,
    },
    location: {
      type: String,
    },
    country: {
      type: String,
      default: "INDIA",
    },
    postalCode: {
      type: String,
    },
    aadharCard: {
      type: String,
    },
    StaffStatus: {
      type: String,
      enum: ["online", "offline"],
      default: "offline",
    },
    CoverImage: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);



const SalesManager = mongoose.model("SalesManager", SalesManagerSchema);

export default SalesManager;
