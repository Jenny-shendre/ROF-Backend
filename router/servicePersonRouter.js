import express from "express";
const router = express.Router();
import {
  getServices,
  createServicePerson,
  getServicePersonById,
  updateServiceById,
  deleteService,
  makeservicePersonAvailable,
  makeAllServicePersonAvailable,
} from "../Controllers/servicePersonController.js";

router
  .route("/makeAllServicePersonAvailable")
  .put(makeAllServicePersonAvailable);
router.route("/").get(getServices).post(createServicePerson);
router
  .route("/:id")
  .get(getServicePersonById)
  .put(updateServiceById)
  .delete(deleteService);
router.route("/servicePersonAvailable/:id").put(makeservicePersonAvailable);

export default router;
