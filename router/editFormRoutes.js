import express from "express";
import {
  createForm,
  getForms,
  getFormById,
  updateForm,
  deleteForm,
} from "../Controllers/editFormController.js";

const router = express.Router();

router.post("/createForm", createForm);
router.get("/getForms", getForms);
router.get("/getFormBy/:id", getFormById);
router.put("/updateForm/:id", updateForm);
router.delete("/deleteForm/:id", deleteForm);

export default router;
