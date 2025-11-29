import Course from "../models/Course.js";
import Purchase from "../models/Purchase.js";

//Get all Courses

export const getAllCourses = async (req, res) => {
  try {
    const courses = await Course.find()
      .select(["-courseContent", "-enrolledStudents"])
      .populate({ path: "educator", select: "name email" });
    res.json({ success: true, courses });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

//get Course by ID
export const getCourseById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res
        .status(400)
        .json({ success: false, message: "Course ID is required" });
    }

    const courseData = await Course.findById(id).populate({
      path: "educator",
      select: "name email",
    });
    if (!courseData) {
      return res
        .status(404)
        .json({ success: false, message: "Course not found" });
    }

    courseData.courseContent.forEach((chapter) => {
      chapter.chapterContent.forEach((lecture) => {
        // console.log(lecture.isPreview, lecture.lectureTitle);
      });
    });

    res.json({ success: true, courseData });
  } catch (error) {
    console.error("Error fetching course:", error);
    res
      .status(400)
      .json({ success: false, message: "Invalid course ID format" });
  }
};
