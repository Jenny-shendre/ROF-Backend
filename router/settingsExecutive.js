import express from "express";
import {
  getInfo,
  updateAttendant,
  deleteAttendant,
  updateCoverImage,
} from "../Controllers/settingsControllerExecutive.js";
import { upload } from "../Middlewares/multer.middleware.js";
const router = express.Router();

router.get("/:employeeId", getInfo);

router.put("/:employeeId", updateAttendant);

router.delete("/:employeeId", deleteAttendant);

router.put(
  "/CoverImage/:employeeId",
  upload.fields([
    {
      name: "CoverImage",
      maxCount: 1,
    },
  ]),
  updateCoverImage
);
export default router;
