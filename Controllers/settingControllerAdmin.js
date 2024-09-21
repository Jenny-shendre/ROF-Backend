import { Admin } from "../Models/adminModel.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";

export const getAdminInfo = async (req, res) => {
  const { employeeId } = req.params;
  try {
    const findInfo = await Admin.findOne({ employeeId });
    if (!findInfo) {
      return res.status(400).json({ message: "Admin not found" });
    }
    return res.status(200).json(findInfo);
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

export const updateAdmin = async (req, res) => {
  const { employeeId } = req.params;
  const { name, email, country, location, postalCode, aadharCard, phone } =
    req.body;

  try {
    const updatedAdmin = await Admin.findOneAndUpdate(
      { employeeId },
      {
        name,
        email,
        country,
        location,
        postalCode,
        aadharCard,
        phone,
      },
      { new: true, runValidators: true }
    );
    console.log("updatedAdmin", updatedAdmin);
    if (!updatedAdmin) {
      return res.status(404).json({ message: "admin not found" });
    }
    res.status(200).json(updatedAdmin);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteAdmin = async (req, res) => {
  const { employeeId } = req.params;
  try {
    const deletedAdmin = await Admin.findOneAndDelete({ employeeId });
    if (!deletedAdmin) {
      return res.status(404).json({ message: "Admin not found" });
    }
    res.status(200).json({ message: "Admin deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const AdminupdateCoverImage = async (req, res) => {
  const { employeeId } = req.params;

  const FindData = await Admin.findOne({ employeeId });
  if (!req.files || !req.files?.CoverImage || !req.files?.CoverImage[0]) {
    return res.status(400).json({ message: "Cheque Image file is required" });
  }

  const chequeImageLocalPath = req.files.CoverImage[0].path;
  console.log(chequeImageLocalPath);
  // Upload the image to Cloudinary
  const chequeImageUpload = await uploadOnCloudinary(chequeImageLocalPath);
  console.log(chequeImageUpload);
  const AdminUploadImage = await Admin.findByIdAndUpdate(
    FindData._id,
    {
      CoverImage: chequeImageUpload.url,
    },
    { new: true }
  );

  return res.status(200).json(AdminUploadImage);
};
