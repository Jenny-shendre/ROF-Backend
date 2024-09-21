import mongoose from "mongoose";
import bcrypt from "bcrypt";

const createlog = new mongoose.Schema(
  {
    ClientName: { type: String },
    ClientId: { type: String },
    ClientEmail: { type: String },
    ClientMobile: { type: String },
    ClientProject: { type: String },
    completed: {
      type: String,
      enum: ["completed", "notCompleted", "progress"],
      default: "progress",
    },
    accepted: {
      type: String,
      enum: ["accepted", "rejected", "pending"],
      default: "pending",
    },
    timeDuration: {
      type: String,
      default: "00:00",
    },
    notes: {
      type: String,
    },
    attendTime: Date,
    callCloseTime: Date,
  },
  {
    timestamps: true,
  }
);

const attendantSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["available", "assigned", "not available"],
      default: "not available",
    },
    team: {
      type: String,
    },
    employeeId: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: { type: String, default: "sales executive" },
    resetOTP: {
      type: String,
    },
    resetOTPExpiry: {
      type: Date,
    },
    ClientName: [createlog],
    project: {
      type: String,
    },
    phone: {
      type: String,
      required: true,
      unique: true,
    },
    managerName: {
      type: String,
    },
    endTime: {
      type: Date,
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
    clientConversion: {
      type: Number,
      default: 0,
    },
    StaffStatus: {
      type: String,
      enum: ["online", "offline"],
      default: "offline",
    },
  },
  {
    timestamps: true,
  }
);

// attendantSchema.pre("save", async function (next) {
//   if (this.isModified("password") || this.isNew) {
//     try {
//       if (!this.password) {
//         this.password = this.phone; // Default password
//       }
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

const Attendant = mongoose.model("Attendant", attendantSchema);

export default Attendant;
