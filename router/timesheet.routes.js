import { Router } from "express";
import {
  TimeCalcul,
  timeResponse,
} from "../Controllers/TimesheetsController.js";

const router = Router();

router.put("/timeline/:customerId", TimeCalcul);
router.put("/timeResponse/:customerId", timeResponse);

export default router;
