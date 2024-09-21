import mongoose from "mongoose";

const logSchema = new mongoose.Schema(
  {
    projectName: { type: String, required: true },
    projectLocation: { type: String, required: true },
    attendant: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Attendant",
      required: true,
    },
    attendantName: { type: String, required: true },
    team: { type: String, required: true },
  },
  { timestamps: true, _id: false }
);

const chequeImages = new mongoose.Schema(
  {
    chequeImages: { type: String },
  },
  { timestamps: true, _id: false }
);

const customerSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    mobile: { type: String, required: true },
    projectName: { type: String, required: true },
    projectLocation: { type: String, required: true },
    customerId: { type: String },
    attendant: { type: mongoose.Schema.Types.ObjectId, ref: "Attendant" },
    attendantName: { type: String, required: true },
    team: { type: String, required: true },
    timeResponse: { type: String, default: "00 : 00" },
    timeDuration: { type: String, default: "00 : 00" },
    notes: { type: String },
    Important: { type: String },
    log: [logSchema],
    chequeImage: [chequeImages],
  },
  {
    timestamps: true,
  }
);

const Customer = mongoose.model("Customer", customerSchema);

export default Customer;
