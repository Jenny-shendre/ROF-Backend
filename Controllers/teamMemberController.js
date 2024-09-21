import asyncHandler from "../utils/asyncHandler.js";
import Attendant from "../Models/Attendant.js";

export const getAllTeamMembers = asyncHandler(async (req, res) => {
  const allAttendants = await Attendant.find();
  const allTeamMembers = allAttendants.map((a) => ({
    name: a.name,
    status: a.status,
    team: a.team,
    email: a.email,
    clientsAttended: a.ClientName.length,
    phone: a.phone,
  }));

  if (allTeamMembers.length === 0) {
    return res.status(404).json({ message: "Team members not found!" });
  }

  res.status(200).json({ allTeamMembers });
});

export const getAvailableTeamMembers = asyncHandler(async (req, res) => {
  const allAttendants = await Attendant.find({ status: "available" });
  const allTeamMembers = allAttendants.map((a) => ({
    name: a.name,
    status: a.status,
    team: a.team,
    email: a.email,
    clientsAttended: a.ClientName.length,
    phone: a.phone,
  }));

  if (allTeamMembers.length === 0) {
    return res.status(404).json({ message: "Team members not found!" });
  }

  res.status(200).json({ allTeamMembers });
});

export const getAssignedTeamMembers = asyncHandler(async (req, res) => {
  const allAttendants = await Attendant.find({ status: "assigned" });
  const allTeamMembers = allAttendants.map((a) => ({
    name: a.name,
    status: a.status,
    team: a.team,
    email: a.email,
    clientsAttended: a.ClientName.length,
    phone: a.phone,
  }));

  if (allTeamMembers.length === 0) {
    return res.status(404).json({ message: "Team members not found!" });
  }

  res.status(200).json({ allTeamMembers });
});
