import express from "express";
import {
  getSalesManagerInfo,
  updateSalesManager,
  deleteSalesManager,
  updateCoverImage,
} from "../Controllers/settingsControllerManager.js";
import { upload } from "../Middlewares/multer.middleware.js";

const router = express.Router();

router.get("/:employeeId", getSalesManagerInfo);

router.put("/:employeeId", updateSalesManager);

router.delete("/:employeeId", deleteSalesManager);

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
