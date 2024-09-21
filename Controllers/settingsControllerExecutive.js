import Attendant from "../Models/Attendant.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
export const getInfo = async (req, res) => {
  const { employeeId } = req.params;
  try {
    const employee = await Attendant.findOne({ employeeId });
    if (!employee) {
      return res.status(404).json({ message: "Employee not found" });
    }
    res.status(200).json(employee);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateAttendant = async (req, res) => {
  const { employeeId } = req.params;
  const { name, email, country, location, postalCode, aadharCard } = req.body;

  try {
    const updatedAttendant = await Attendant.findOneAndUpdate(
      { employeeId },
      {
        name,
        email,
        country,
        location,
        postalCode,
        aadharCard,
      },
      { new: true, runValidators: true }
    );
    console.log("updatedAttendant", updatedAttendant);
    if (!updatedAttendant) {
      return res.status(404).json({ message: "Employee not found" });
    }
    res.status(200).json(updatedAttendant);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteAttendant = async (req, res) => {
  const { employeeId } = req.params;
  try {
    const deletedAttendant = await Attendant.findOneAndDelete({ employeeId });
    if (!deletedAttendant) {
      return res.status(404).json({ message: "Employee not found" });
    }
    res.status(200).json({ message: "Employee deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateCoverImage = async (req, res) => {
  const { employeeId } = req.params;

  const FindData = await Attendant.findOne({ employeeId });
  if (!req.files || !req.files?.CoverImage || !req.files?.CoverImage[0]) {
    return res.status(400).json({ message: "Cheque Image file is required" });
  }

  const chequeImageLocalPath = req.files.CoverImage[0].path;
  console.log(chequeImageLocalPath);
  // Upload the image to Cloudinary
  const chequeImageUpload = await uploadOnCloudinary(chequeImageLocalPath);
  console.log(chequeImageUpload);
  const AttendantUploadImage = await Attendant.findByIdAndUpdate(
    FindData._id,
    {
      CoverImage: chequeImageUpload.url,
    },
    { new: true }
  );

  return res.status(200).json(AttendantUploadImage);
};
