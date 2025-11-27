import { clerkClient } from "@clerk/express";
import Course from "../models/Course.js";
import { v2 as cloudinary } from "cloudinary";

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
