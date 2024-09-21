import express from "express";
import {
  acceptClient,
  rejectClient,
  attendantMeetingOver,
  upcomingAppointments,
  getClientHistory,
  deleteHistory,
  UpdatesHistory,
} from "../Controllers/clientManagement.js";

const router = express.Router();

router.put("/accept/:employeeId", acceptClient);
router.put("/reject/:employeeId", rejectClient);
router.put("/meetingOver/:employeeId", attendantMeetingOver);
router.get("/upcoming/:employeeId", upcomingAppointments);
router.get("/history/:employeeId", getClientHistory);
router.delete("/deleteHistory/:employeeId/:clientId", deleteHistory);
router.put("/UpdatesHistory/:employeeId/:clientId", UpdatesHistory);

export default router;
