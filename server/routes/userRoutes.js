import express from "express";
import {
  getUser,
  userEnrolledCourses,
  updateUserCourseProgress,
  getUserCourseProgress,
  addUserRating,
} from "../controllers/userController.js";
import { purchaseCourse } from "../controllers/userController.js";
const userRouter = express.Router();

userRouter.get("/data", getUser);
userRouter.get("/enrolled-courses", userEnrolledCourses);
userRouter.post("/purchase", purchaseCourse);
userRouter.post("/update-course-progress", updateUserCourseProgress);
userRouter.get("/get-course-progress/", getUserCourseProgress);
userRouter.post("/add-rating", addUserRating);
export default userRouter;
