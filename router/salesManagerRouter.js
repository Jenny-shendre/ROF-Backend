import express from "express";
import {
  createSalesManager,
  getSalesManagers,
  getSalesManagerById,
  updateSalesManager,
  deleteSalesManager,
  findSalesManagerTeamData,
  getSalesManagerByEmployId,
  findSalesManagerlastTeamData,
} from "../Controllers/salesManagerController.js";

const router = express.Router();

router.get("/fetch-all", getSalesManagers);
router.get("/fetch/:id", getSalesManagerById);
router.post("/save", createSalesManager);
router.put("/update/:id", updateSalesManager);
router.delete("/delete/:id", deleteSalesManager);
router.get("/findSalesManagerteamData/:managerEmail", findSalesManagerTeamData);
router.get(
  "/findSalesManagerlastTeamData/:managerEmail",
  findSalesManagerlastTeamData
);
router.get("/getSalesManagerByEmployId/:employeeId", getSalesManagerByEmployId);

export default router;
