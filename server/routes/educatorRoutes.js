import express from "express";
import { requireAuth } from "@clerk/express";
import {
  updateRoleToEducator,
  addCourse,
  getEducatorCourses,
  getEducatorDashboardData,
  getEnrolledStudentsData,
} from "../controllers/educatorController.js";
import upload from "../configs/multer.js";
import { protectEducator } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/update-role", requireAuth(), updateRoleToEducator);
router.post(
  "/add-course",
  upload.single("image"),
  requireAuth(),
  protectEducator,
  addCourse
);

router.get("/courses", requireAuth(), protectEducator, getEducatorCourses);
router.get(
  "/dashboard",
  requireAuth(),
  protectEducator,
  getEducatorDashboardData
);

router.get(
  "/enrolled-students",
  requireAuth(),
  protectEducator,
  getEnrolledStudentsData
);
export default router;
