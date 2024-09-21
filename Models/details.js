import mongoose from 'mongoose';

// Create a Counter schema and model to track the serialNo sequence
const counterSchema = new mongoose.Schema({
  _id: { type: String, required: true },
  seq: { type: Number, default: 0 },
});
const Counter = mongoose.model('Counter', counterSchema);

const detailsSchema = new mongoose.Schema({
  serialNo: { type: Number, unique: true, min: 1 },
  date: { type: Date, required: true },
  customerName: { type: String, required: true },
  last4digitNo: { type: String, required: true },
  listOfChannelPartner: { type: String, required: true },
  agentPhoneNo: { type: String, required: true },
  project: { type: String, required: true },
  attendant: { type: String, required: true },
});

// Pre-save hook to set the serialNo
detailsSchema.pre('save', async function (next) {
  if (this.isNew) {
    const counter = await Counter.findByIdAndUpdate(
      { _id: 'serialNo' },
      { $inc: { seq: 1 } },
      { new: true, upsert: true }
    );
    this.serialNo = counter.seq;
  }
  next();
});

// Post-remove hook to update serialNo of remaining documents
detailsSchema.post('remove', async function (doc) {
  await mongoose.model('Details').updateMany(
    { serialNo: { $gt: doc.serialNo } },
    { $inc: { serialNo: -1 } }
  );
  await Counter.updateOne({ _id: 'serialNo' }, { $inc: { seq: -1 } });
});

// Ensure the serialNo is unique
detailsSchema.index({ serialNo: 1 }, { unique: true });

const Details = mongoose.model('Details', detailsSchema);

export default Details;
