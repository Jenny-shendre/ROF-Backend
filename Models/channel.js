import mongoose from 'mongoose';

const channelSchema = new mongoose.Schema({
  channelID: { type: String, required: true },
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  address: { type: String, required: true }
});

const Channel = mongoose.model('Channel', channelSchema);

export default Channel;
