import express from "express";

import { upload } from "../Middlewares/multer.middleware.js";
import {
  AdminupdateCoverImage,
  deleteAdmin,
  getAdminInfo,
  updateAdmin,
} from "../Controllers/settingControllerAdmin.js";
const router = express.Router();

router.get("/:employeeId", getAdminInfo);

router.put("/:employeeId", updateAdmin);

router.delete("/:employeeId", deleteAdmin);

router.put(
  "/CoverImage/:employeeId",
  upload.fields([
    {
      name: "CoverImage",
      maxCount: 1,
    },
  ]),
  AdminupdateCoverImage
);
export default router;
