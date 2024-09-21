import express from "express";
import { upload } from "../Middlewares/multer.middleware.js";
import {
  getProjects,
  getProjectLocation,
  createProject,
  updateProject,
  deleteProject,
  ProjectFilter,
  projectone,
} from "../Controllers/projectController.js";

const router = express.Router();

router.get("/", getProjects);
router.get("/location/:name", getProjectLocation);

router.post(
  "/",
  upload.fields([
    {
      name: "projectImage",
      maxCount: 1,
    },
  ]),
  createProject
);

router.put(
  "/update/:id",
  upload.fields([
    {
      name: "projectImage",
      maxCount: 1,
    },
  ]),
  updateProject
);
router.delete("/delete/:id", deleteProject);
router.post("/ProjectFilter", ProjectFilter);
router.get("/project/:id", projectone);

export default router;
