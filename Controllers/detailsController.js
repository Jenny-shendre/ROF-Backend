import Details from '../Models/details.js';

export const getAllDetails = async (req, res) => {
  try {
    const details = await Details.find();
    res.status(200).json(details);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createDetails = async (req, res) => {
  const {  date, customerName, last4digitNo, listOfChannelPartner, agentPhoneNo, project, attendant } = req.body;

  const newDetails = new Details({  date, customerName, last4digitNo, listOfChannelPartner, agentPhoneNo, project, attendant });

  try {
    await newDetails.save();
    res.status(201).json(newDetails);
  } catch (error) {
    res.status(409).json({ message: error.message });
  }
};

export const getDetailsById = async (req, res) => {
  const { id } = req.params;
  try {
    const details = await Details.findById(id);
    res.status(200).json(details);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export const updateDetails = async (req, res) => {
  const { id } = req.params;
  const {  date, customerName, last4digitNo, listOfChannelPartner, agentPhoneNo, project, attendant } = req.body;

  try {
    const updatedDetails = await Details.findByIdAndUpdate(id, {  date, customerName, last4digitNo, listOfChannelPartner, agentPhoneNo, project, attendant }, { new: true });
    res.status(200).json(updatedDetails);
  } catch (error) {
    res.status(409).json({ message: error.message });
  }
};

export const deleteDetails = async (req, res) => {
  const { id } = req.params;
  try {
    await Details.findByIdAndRemove(id);
    res.status(200).json({ message: "Details deleted successfully." });
  } catch (error) {
    res.status(409).json({ message: error.message });
  }
};
