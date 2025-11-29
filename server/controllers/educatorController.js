import { clerkClient } from "@clerk/express";
import Course from "../models/Course.js";
import Purchase from "../models/Purchase.js";
import { v2 as cloudinary } from "cloudinary";
import User from "../models/User.js";

export const updateRoleToEducator = async (req, res) => {
  try {
    console.log("Updating user role to educator");

    // Always call req.auth() as a function
    const auth = req.auth();
    console.log(auth);

    if (!auth.userId) {
      return res.status(401).json({ error: "Unauthorized: No userId found" });
    }

    const { userId } = auth;

    // Update Clerk metadata
    await clerkClient.users.updateUserMetadata(userId, {
      publicMetadata: { role: "educator" },
    });

    console.log(`User ${userId} role updated to educator`);
    res.status(200).json({ message: "Role updated to educator" });
  } catch (error) {
    console.error("Failed to update role:", error);
    res.status(500).json({ error: "Server error" });
  }
};

//Add New Course

export const addCourse = async (req, res) => {
  try {
    const { courseData } = req.body;
    const imageFile = req.file;
    const auth = req.auth();
    const { userId } = auth;

    if (!imageFile)
      return res.json({ success: false, message: "courseThumbnail not found" });

    const parsedCourseData = await JSON.parse(courseData);
    parsedCourseData.educator = userId;
    const newCourse = await Course.create(parsedCourseData);
    const imageUpload = await cloudinary.uploader.upload(imageFile.path);
    newCourse.courseThumbnail = imageUpload.secure_url;
    await newCourse.save();

    return res.json({ success: true, message: "Course Added" });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

//get Educator Courses
export const getEducatorCourses = async (req, res) => {
  try {
    const auth = req.auth();
    const { userId } = auth;
    const courses = await Course.find({ educator: userId });
    return res.json({ success: true, courses });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// Get Educator Dashboard Data
export const getEducatorDashboardData = async (req, res) => {
  try {
    const auth = req.auth();
    const { userId } = auth;
    // Fetch necessary data for the educator dashboard
    const courses = await Course.find({ educator: userId });
    const totalCourses = courses.length;
    const courseIds = courses.map((course) => course._id);

    const purchases = await Purchase.find({
      courseId: { $in: courseIds },
      status: "completed",
    });

    const totalEarnings = purchases.reduce((total, purchase) => {
      return total + purchase.amount;
    }, 0);
    //collect unique student ids with their course titles
    const enrolledStudentsData = [];
    for (const course of courses) {
      const students = await User.find(
        { _id: { $in: course.enrolledStudents } },
        "name image"
      );
      students.forEach((student) => {
        enrolledStudentsData.push({
          student,
          courseTitle: course.courseTitle,
        });
      });

      res.json({
        success: true,
        dashboardData: {
          totalCourses,
          totalEarnings,
          enrolledStudentsData,
        },
      });
    }
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

//get enrolled students with purchase data

export const getEnrolledStudentsData = async (req, res) => {
  try {
    const auth = req.auth();
    const { userId } = auth;
    const courses = await Course.find({ educator: userId });
    const courseIds = courses.map((course) => course._id);
    const purchases = await Purchase.find({
      courseId: { $in: courseIds },
      status: "completed",
    })
      .populate("userId", "name imageUrl")
      .populate("courseId", "courseTitle");
    const enrolledStudents = purchases.map((purchase) => ({
      student: {
        name: purchase.userId,
        imageUrl: purchase.userId.imageUrl,
      },
      courseTitle: purchase.courseId.courseTitle,
      purchaseDate: purchase.createdAt,
    }));
    res.json({ success: true, enrolledStudents });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};
