import mongoose from "mongoose";

const courseProgressSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      ref: "User",
      required: true,
    },
    courseId: {
      type: String,
      ref: "Course",
      required: true,
    },
    completed: { type: Boolean, default: false },
    lectureCompleted: [],
  },
  { minimize: false }
);
const CourseProgress = mongoose.model("CourseProgress", courseProgressSchema);
export default CourseProgress;
