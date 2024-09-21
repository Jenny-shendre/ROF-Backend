import express from "express";
import {
  createAttendant,
  deleteAttendant,
  getAttendantById,
  getAttendants,
  updateAttendant,
  makeAttendantAvailable,
  makeAllAttendantsAvailable,
  addTeamMember,
  clientConversion,
  onlineEmploy,
  checktimeout,
  updateCreatelogTimes,
} from "../Controllers/attendantController.js";

const router = express.Router();

router.post("/save", createAttendant);
router.get("/fetch-all", getAttendants);
router.get("/fetch/:id", getAttendantById);
router.put("/update/:id", updateAttendant);
router.put("/attendantAvailable/:id", makeAttendantAvailable);
router.put("/allAttendantAvailable", makeAllAttendantsAvailable);
router.delete("/delete/:id", deleteAttendant);
router.put("/addTeamMember", addTeamMember);
router.put("/clientConversion/:employeeId", clientConversion);
router.put("/status/:employeeId", onlineEmploy);
router.get("/check-timeout/:attendantId", checktimeout);
router.put("/update-createlog-times/:attendantId/:logId", updateCreatelogTimes);
export default router;
