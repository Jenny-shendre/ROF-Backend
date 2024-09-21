import mongoose from 'mongoose';

const formSchema = new mongoose.Schema({
  customerName: { type: String, required: true },
  channelName: { type: String, required: true },
  channelPartnerName: { type: String, required: true },
  project: { type: String, required: true },
  attendant: { type: String, required: true },
  date: { type: Date, required: true }, // Store in UTC
  responseTime: { type: String }, // Store as HH:mm
  meetingDuration: { type: Number, required: true },
  executiveNote: { type: String, required: true },
  partnerId: { type: String, required: true },
});

const Form = mongoose.model('Form', formSchema);

export default Form;
