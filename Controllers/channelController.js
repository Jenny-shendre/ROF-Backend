import Channel from "../Models/channel.js";

// Utility function to generate the channel ID
const generateChannelID = async () => {
  const lastChannel = await Channel.findOne().sort({ $natural: -1 });
  let newChannelID;
  if (lastChannel) {
    const lastIDNum = parseInt(lastChannel.channelID.substring(5));
    newChannelID = `CHROF${(lastIDNum + 1).toString().padStart(4, "0")}`;
  } else {
    newChannelID = "CHROF0001";
  }
  return newChannelID;
};

export const getAllChannels = async (req, res) => {
  try {
    const channels = await Channel.find();
    res.status(200).json(channels);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createChannel = async (req, res) => {
  const { name, email, phone, address } = req.body;

  try {
    const channelID = await generateChannelID();
    const newChannel = new Channel({ channelID, name, email, phone, address });
    await newChannel.save();
    res.status(201).json(newChannel);
  } catch (error) {
    res.status(409).json({ message: error.message });
  }
};

export const getChannelById = async (req, res) => {
  const { id } = req.params;
  try {
    const channel = await Channel.findById(id);
    res.status(200).json(channel);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export const updateChannel = async (req, res) => {
  const { id } = req.params;
  const { channelID, name, email, phone, address } = req.body;

  try {
    const updatedChannel = await Channel.findByIdAndUpdate(
      id,
      { channelID, name, email, phone, address },
      { new: true }
    );
    res.status(200).json(updatedChannel);
  } catch (error) {
    res.status(409).json({ message: error.message });
  }
};

export const deleteChannel = async (req, res) => {
  const { id } = req.params;
  try {
    await Channel.findByIdAndDelete(id);
    res.status(200).json({ message: "Channel deleted successfully." });
  } catch (error) {
    res.status(409).json({ message: error.message });
  }
};
