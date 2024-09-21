import express from "express";
import {
  requestService,
  getrequestService,
  getAllRequestService,
  statusFeedbackAndStar,
  ProjectFilter,
} from "../Controllers/serviceRequestController.js";
const router = express.Router();

router
  .route("/")
  .post(requestService)
  .put(getrequestService)
  .get(getAllRequestService);
router.route("/feedback/:id").put(statusFeedbackAndStar);
router.route("/ProjectFilter").post(ProjectFilter);
export default router;
