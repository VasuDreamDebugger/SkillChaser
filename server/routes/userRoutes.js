import express from "express";
import { getUser, userEnrolledCourses } from "../controllers/userController.js";
import { purchaseCourse } from "../controllers/userController.js";
const userRouter = express.Router();

userRouter.get("/data", getUser);
userRouter.get("/enrolled-courses", userEnrolledCourses);
userRouter.post("/purchase", purchaseCourse);
export default userRouter;
