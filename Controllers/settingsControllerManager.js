import SalesManager from "../Models/salesManager.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
export const getSalesManagerInfo = async (req, res) => {
  const { employeeId } = req.params;
  try {
    const salesManager = await SalesManager.findOne({ employeeId });
    if (!salesManager) {
      return res.status(404).json({ message: "Sales Manager not found" });
    }
    res.status(200).json(salesManager);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateSalesManager = async (req, res) => {
  const { employeeId } = req.params;
  const { name, email, country, location, postalCode, aadharCard } = req.body;

  try {
    const updatedSalesManager = await SalesManager.findOneAndUpdate(
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
    if (!updatedSalesManager) {
      return res.status(404).json({ message: "Sales Manager not found" });
    }
    res.status(200).json(updatedSalesManager);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteSalesManager = async (req, res) => {
  const { employeeId } = req.params;
  try {
    const deletedSalesManager = await SalesManager.findOneAndDelete({
      employeeId,
    });
    if (!deletedSalesManager) {
      return res.status(404).json({ message: "Sales Manager not found" });
    }
    res.status(200).json({ message: "Sales Manager deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateCoverImage = async (req, res) => {
  const { employeeId } = req.params;
  try {
    const FindData = await SalesManager.findOne({ employeeId });
    if (!req.files || !req.files?.CoverImage || !req.files?.CoverImage[0]) {
      return res.status(400).json({ message: "Cheque Image file is required" });
    }

    const chequeImageLocalPath = req.files.CoverImage[0].path;
    console.log(chequeImageLocalPath);
    // Upload the image to Cloudinary
    const chequeImageUpload = await uploadOnCloudinary(chequeImageLocalPath);
    console.log(chequeImageUpload);
    const AttendantUploadImage = await SalesManager.findByIdAndUpdate(
      FindData._id,
      {
        CoverImage: chequeImageUpload.url,
      },
      { new: true }
    );

    return res.status(200).json(AttendantUploadImage);
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};
