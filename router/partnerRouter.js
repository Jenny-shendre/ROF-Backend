import express from "express";
import {
  createPartner,
  deletePartner,
  getPartnerById,
  getPartners,
  updatePartner,
  getCustomersByPartnerName,
  filterchannel,
} from "../Controllers/partnerController.js";
const router = express.Router();

router.post("/save", createPartner);
router.get("/fetch-all", getPartners);
router.get("/fetch/:id", getPartnerById);
router.put("/update/:id", updatePartner);
router.delete("/delete/:id", deletePartner);
router.post("/fetchByName", getCustomersByPartnerName);
router.get("/filterchannel/:channelID", filterchannel);

export default router;
