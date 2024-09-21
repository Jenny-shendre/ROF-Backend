import Attendant from "../Models/Attendant.js";
import { Admin } from "../Models/adminModel.js";
import SalesManager from "../Models/salesManager.js";

export const ViewMembers = async (req, res) => {
  const AllMembers = [];
  const AllMembersAttendant = await Attendant.find();
  const AllMembersSalesManager = await SalesManager.find();
  const AllMembersAdmin = await Admin.find();
  AllMembers.push(
    ...AllMembersAttendant,
    ...AllMembersSalesManager,
    ...AllMembersAdmin
  );

  res.status(200).json(AllMembers);
};

export const ViewMembersDelete = async (req, res) => {
  const { id } = req.params;

  try {
    // Attempt to delete the user from each collection
    const attendantDelete = await Attendant.findByIdAndDelete(id);
    const salesManagerDelete = await SalesManager.findByIdAndDelete(id);
    const adminDelete = await Admin.findByIdAndDelete(id);

    // Check if any deletion was successful
    if (attendantDelete || salesManagerDelete || adminDelete) {
      return res.status(200).json({ message: "Deleted successfully" });
    } else {
      return res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    console.error("Error deleting user:", error);
    return res.status(500).json({ message: "Server error" });
  }
};
