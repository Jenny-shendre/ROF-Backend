import mongoose from 'mongoose';

const RecordSchema = new mongoose.Schema({
  channelPartnerName: { type: String, required: true },
  channelPartnerCompanyName: { type: String, required: true },
  customerName: { type: String, required: true },
  customerMobileLastFour: { type: Number, required: true },
  projectName: { type: String, required: true },
  projectLocation: { type: String, required: true },
  partnerId: { type: String, required: true },
  attendant: { type: String, required: true },
  attendantName: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

const Record = mongoose.model('partners', RecordSchema);
export default Record;
