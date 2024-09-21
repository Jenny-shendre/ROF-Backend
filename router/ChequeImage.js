import express from "express";
import { upload } from "../Middlewares/multer.middleware.js";
import {
  ChequeImage,
  getChequeImages,
  getAllCheques,
  getEntriesWithChequeImage,
} from "../Controllers/chequeImage.js";
const router = express.Router();
router.post(
  "/save",
  upload.fields([
    {
      name: "chequeImage",
      maxCount: 1,
    },
  ]),
  ChequeImage
);

router.get("/fetch", getChequeImages);

router.get("/fetch-all", getAllCheques);

router.post("/entries-with-cheque-image", getEntriesWithChequeImage);

export default router;
