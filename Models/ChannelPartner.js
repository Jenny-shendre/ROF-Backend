import mongoose from "mongoose";

// const logSchema = new mongoose.Schema({
//   projectName: { type: String, required: true },
//   projectLocation: { type: String, required: true },
//   attendant: { type: mongoose.Schema.Types.ObjectId, ref: 'Attendant', required: true },
//   attendantName: { type: String, required: true },
//   team: { type: String, required: true }
// }, { timestamps: true}, { _id : false });
const chequeImages = new mongoose.Schema(
  {
    chequeImages: { type: String },
  },
  { timestamps: true },
  { _id: false }
);
const partnerSchema = new mongoose.Schema(
  {
    channelPartnerName: String,
    channelPartnerCompanyName: String,
    customerName: String,
    customerMobileLastFour: String,
    projectName: String,
    projectLocation: String,
    partnerId: String,
    attendant: { type: mongoose.Schema.Types.ObjectId, ref: "Attendant" },
    attendantName: { type: String, required: true },
    timeDuration: { type: String, default: "00 : 00" },
    notes: { type: String },
    channelID: { type: String, required: true },
    timeResponse: { type: String, default: "00 : 00" },
    // log: [logSchema]
    chequeImage: [chequeImages],
  },
  {
    timestamps: true,
  }
);

const Partner = mongoose.model("Partner", partnerSchema);

export default Partner;
