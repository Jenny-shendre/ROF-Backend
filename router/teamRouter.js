import express from "express";
import {
  createTeam,
  getAllTeams,
  getTeamsById,
  updateTeams,
  deleteTeams,
  addonemember,
  teamfliter,
  updateSalesManagerTeam,
  deleteTeamMember,
} from "../Controllers/teamController.js";

const router = express.Router();

router.post("/save", createTeam);
router.post("/addOne", addonemember);
router.post("/teamfliter", teamfliter);
router.get("/fetch-all", getAllTeams);
router.get("/:id", getTeamsById);
router.put("/:id", updateTeams);
router.put("/updateSalesManagerTeam/:id", updateSalesManagerTeam);
router.delete("/:id", deleteTeams);
router.delete("/deleteTeamsMembers/:teamId/:memberId", deleteTeamMember);

export default router;
