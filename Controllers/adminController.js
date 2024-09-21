import { StatusCodes } from "http-status-codes";
import { Admin } from "../Models/adminModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";
import Attendant from "../Models/Attendant.js";
import SalesManager from "../Models/salesManager.js";

const getModelByRole = (role) => {
  switch (role) {
    case "super admin":
      return Admin;
    case "sales executive":
      return Attendant;
    case "manager":
      return SalesManager;
    default:
      return null;
  }
};

export const createAdmin = async (req, res) => {
  try {
    const { email, password, role, phone, ...otherData } = req.body;

    if (!password || password.trim().length === 0) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ message: "Password is required" });
    }

    const existingAdmin = await Admin.findOne({ phone });
    if (existingAdmin) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ message: "Admin with this phone already exists" });
    }
    const lastemployee = await Admin.findOne().sort({ $natural: -1 });
    console.log(lastemployee, "Last employee");
    let employeeId;

    if (lastemployee && lastemployee.employeeId) {
      const lastemployeeIdNum = parseInt(lastemployee.employeeId.substring(6));
      employeeId = `ROFADO${(lastemployeeIdNum + 1).toString()}`;
    } else {
      employeeId = "ROFADO1";
    }

    const hashedPassword = bcrypt.hashSync(password, 10);
    const newAdmin = new Admin({
      email,
      phone,
      password: hashedPassword,
      role,
      ...otherData,
      employeeId,
    });
    await newAdmin.save();

    res.status(StatusCodes.CREATED).json(newAdmin);
  } catch (error) {
    console.error("Error in createAdmin:", error);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: "Server error" });
  }
};

export const loginUser = async (req, res) => {
  try {
    const { phone, password, role } = req.body;
    if (!phone || !password || !role) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ message: "Email, password, and role are required" });
    }

    const Model = getModelByRole(role);
    if (!Model) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ message: "Invalid role" });
    }

    const user = await Model.findOne({ phone });
    if (!user) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ message: "Invalid phone" });
    }

    const isPasswordValid = bcrypt.compareSync(password, user.password);

    if (!isPasswordValid) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ message: "Invalid password" });
    }

    const token = jwt.sign(
      { userEmail: user.email, role: user.role, phone: user.phone },
      "secret1234"
    );

    const response = {
      message: "Login successful",
      token,
      role: user.role,
      employeeId: user.employeeId,
      email: user.email,
      phone: user.phone,
    };

    if (role === "sales executive") {
      response.employeeId = user.employeeId;
    }

    return res.status(StatusCodes.OK).json(response);
  } catch (error) {
    console.error("Error in loginUser:", error);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: "An error occurred, please try again later." });
  }
};

// Generate OTP
const generateOTP = () => {
  return Math.floor(1000 + Math.random() * 9000).toString();
};

// Send OTP via email
const sendOTPEmail = async (email, otp) => {
  try {
    let config = {
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      secure: false, // Use `true` for port 465, `false` for all other ports
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    };
    const transporter = nodemailer.createTransport(config);

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Password Reset OTP",
      html: `Your OTP for password reset is: ${otp}`,
    };

    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error("Error in sendOTPEmail:", error);
    throw new Error("Failed to send OTP email");
  }
};

// const findUserByEmail = async (email) => {
//   const emailRegex = new RegExp(`^${email}$`, "i"); // Case-insensitive regex search

//   let user = await Admin.findOne({ email: emailRegex });
//   if (user) return { user, model: Admin };

//   user = await SalesManager.findOne({ email: emailRegex });
//   if (user) return { user, model: SalesManager };

//   user = await Attendant.findOne({ email: emailRegex });
//   if (user) return { user, model: Attendant };

//   return null;
// };

const findUserByPhone = async (phone) => {
  const phoneRegex = new RegExp(`^${phone}$`, "i"); // Case-insensitive regex search

  let user = await Admin.findOne({ phone: phoneRegex });
  if (user) return { user, model: Admin };

  user = await SalesManager.findOne({ phone: phoneRegex });
  if (user) return { user, model: SalesManager };

  user = await Attendant.findOne({ phone: phoneRegex });
  if (user) return { user, model: Attendant };

  return null;
};

{
  /*
export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ message: "Email is required" });
    }

    const userResult = await findUserByEmail(email);
    if (!userResult) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ message: "User with this email does not exist" });
    }

    const { user, model } = userResult;
    const otp = generateOTP();
    user.resetOTP = otp;
    user.resetOTPExpiry = Date.now() + 3600000; // 1 hour expiry
    await user.save();

    await sendOTPEmail(email, otp);

    res
      .status(StatusCodes.OK)
      .json({ message: "OTP sent to email successfully" });
  } catch (error) {
    console.error("Error in forgotPassword:", error);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: "An error occurred, please try again later." });
  }
};

export const verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;
    if (!email || !otp) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ message: "Email and OTP are required" });
    }

    const userResult = await findUserByEmail(email);
    if (!userResult) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ message: "User not found" });
    }

    const { user } = userResult;

    if (user.resetOTP !== otp || user.resetOTPExpiry < Date.now()) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ message: "Invalid or expired OTP" });
    }

    res
      .status(StatusCodes.OK)
      .json({ success: true, message: "OTP verified successfully" });
  } catch (error) {
    console.error("Error in verifyOtp:", error);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: "An error occurred, please try again later." });
  }
};

export const setNewPassword = async (req, res) => {
  try {
    const { email, newPassword, confirmPassword } = req.body;

    if (!email || !newPassword || !confirmPassword) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        message: "Email, new password, and confirm password are required",
      });
    }

    if (newPassword !== confirmPassword) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ message: "Passwords do not match" });
    }

    const userResult = await findUserByEmail(email);
    if (!userResult) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ message: "User not found" });
    }

    const { user } = userResult;

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    user.password = hashedPassword;
    user.resetOTP = null;
    user.resetOTPExpiry = null;

    await user.save();

    res
      .status(StatusCodes.OK)
      .json({ message: "Password updated successfully" });
  } catch (error) {
    console.error("Error in setNewPassword:", error);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: "An error occurred, please try again later." });
  }
};

export const changePassword = async (req, res) => {
  try {
    const { email, oldPassword, newPassword, confirmPassword } = req.body;

    if (!email || !oldPassword || !newPassword || !confirmPassword) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ message: "All fields are required" });
    }

    if (newPassword !== confirmPassword) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ message: "New passwords do not match" });
    }

    const userResult = await findUserByEmail(email);

    if (!userResult) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ message: "User not found" });
    }

    const { user } = userResult;
    const isOldPasswordValid = await bcrypt.compare(oldPassword, user.password);
    if (!isOldPasswordValid) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ message: "Old password is incorrect" });
    }

    const hashedNewPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedNewPassword;
    await user.save();

    res
      .status(StatusCodes.OK)
      .json({ message: "Password changed successfully" });
  } catch (error) {
    console.error("Error in changePassword:", error);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: "Server error" });
  }
};
*/
}

export const forgotPassword = async (req, res) => {
  try {
    const { phone } = req.body;
    if (!phone) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ message: "Phone number is required" });
    }

    const userResult = await findUserByPhone(phone);
    if (!userResult) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ message: "User with this phone number does not exist" });
    }

    const { user } = userResult;
    const otp = generateOTP();
    user.resetOTP = otp;
    user.resetOTPExpiry = Date.now() + 3600000; // 1 hour expiry
    await user.save();

    await sendOTPText(phone, otp); // Modify this function to send OTP via SMS

    res
      .status(StatusCodes.OK)
      .json({ message: "OTP sent to phone number successfully" });
  } catch (error) {
    console.error("Error in forgotPassword:", error);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: "An error occurred, please try again later." });
  }
};

export const verifyOtp = async (req, res) => {
  try {
    const { phone, otp } = req.body;
    if (!phone || !otp) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ message: "Phone number and OTP are required" });
    }

    const userResult = await findUserByPhone(phone);
    if (!userResult) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ message: "User not found" });
    }

    const { user } = userResult;

    if (user.resetOTP !== otp || user.resetOTPExpiry < Date.now()) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ message: "Invalid or expired OTP" });
    }

    res
      .status(StatusCodes.OK)
      .json({ success: true, message: "OTP verified successfully" });
  } catch (error) {
    console.error("Error in verifyOtp:", error);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: "An error occurred, please try again later." });
  }
};

export const setNewPassword = async (req, res) => {
  try {
    const { phone, newPassword, confirmPassword } = req.body;

    if (!phone || !newPassword || !confirmPassword) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        message:
          "Phone number, new password, and confirm password are required",
      });
    }

    if (newPassword !== confirmPassword) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ message: "Passwords do not match" });
    }

    const userResult = await findUserByPhone(phone);
    if (!userResult) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ message: "User not found" });
    }

    const { user } = userResult;

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    user.password = hashedPassword;
    user.resetOTP = null;
    user.resetOTPExpiry = null;

    await user.save();

    res
      .status(StatusCodes.OK)
      .json({ message: "Password updated successfully" });
  } catch (error) {
    console.error("Error in setNewPassword:", error);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: "An error occurred, please try again later." });
  }
};

export const changePassword = async (req, res) => {
  try {
    const { phone, oldPassword, newPassword, confirmPassword } = req.body;

    if (!phone || !oldPassword || !newPassword || !confirmPassword) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ message: "All fields are required" });
    }

    if (newPassword !== confirmPassword) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ message: "New passwords do not match" });
    }

    const userResult = await findUserByPhone(phone);

    if (!userResult) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ message: "User not found" });
    }

    const { user } = userResult;
    const isOldPasswordValid = await bcrypt.compare(oldPassword, user.password);
    if (!isOldPasswordValid) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ message: "Old password is incorrect" });
    }

    const hashedNewPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedNewPassword;
    await user.save();

    res
      .status(StatusCodes.OK)
      .json({ message: "Password changed successfully" });
  } catch (error) {
    console.error("Error in changePassword:", error);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: "Server error" });
  }
};

export const updateAdmin = async (req, res) => {
  try {
    const { id } = req.params;
    const { email, password, role, phone, ...otherData } = req.body;

    const admin = await Admin.findById(id);
    if (!admin) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ message: "Admin not found" });
    }

    if (email) admin.email = email;
    if (role) admin.role = role;
    if (password) {
      if (!password.trim()) {
        return res
          .status(StatusCodes.BAD_REQUEST)
          .json({ message: "Password cannot be empty" });
      }
      admin.password = bcrypt.hashSync(password, 10);
    }
    Object.assign(admin, otherData);

    await admin.save();

    res.status(StatusCodes.OK).json({ message: "Admin updated successfully" });
  } catch (error) {
    console.error("Error in updateAdmin:", error);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: "Server error" });
  }
};

export const deleteAdmin = async (req, res) => {
  try {
    const { id } = req.params;

    const admin = await Admin.findByIdAndDelete(id);
    if (!admin) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ message: "Admin not found" });
    }

    res.status(StatusCodes.OK).json({ message: "Admin deleted successfully" });
  } catch (error) {
    console.error("Error in deleteAdmin:", error);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: "Server error" });
  }
};

export const deleteAllAdmins = async (req, res) => {
  try {
    await Admin.deleteMany();

    res
      .status(StatusCodes.OK)
      .json({ message: "All admins deleted successfully" });
  } catch (error) {
    console.error("Error in deleteAllAdmins:", error);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: "Server error" });
  }
};
