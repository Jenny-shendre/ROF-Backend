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
    CoverImage: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

// SalesManagerSchema.pre("save", async function (next) {
//   if (this.isModified("password") || this.isNew) {
//     try {
//       const salt = await bcrypt.genSalt(10);
//       this.password = await bcrypt.hash(this.password, salt);
//       next();
//     } catch (err) {
//       next(err);
//     }
//   } else {
//     next();
//   }
// });

const SalesManager = mongoose.model("SalesManager", SalesManagerSchema);

export default SalesManager;
