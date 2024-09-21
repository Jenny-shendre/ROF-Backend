import mongoose from "mongoose";

const teamsSchema = new mongoose.Schema({
  name: { type: String, required: true },
  employeeId: { type: String, required: true },
  teamName: { type: String },
  email: { type: String, required: true },
  projectName: { type: String, required: true },
  managerName: { type: String },
  ClientName: { type: Array },
  clientConversion: {
    type: Number,
    default: 0,
  },
});

const teamSchema = new mongoose.Schema(
  {
    teamName: { type: String, required: true },
    projectName: { type: String, required: true },
    managerName: { type: String, required: true },
    managerEmail: { type: String, required: true },
    teamMemberNames: [teamsSchema],
  },
  {
    timestamps: true,
  }
);

const Team = mongoose.model("Team", teamSchema);

export default Team;
