import User from "../models/User.js";
import Course from "../models/Course.js";
import Purchase from "../models/Purchase.js";
import Stripe from "stripe";
import "dotenv/config";
import CourseProgress from "../models/CourseProgress.js";
//Get all Users
export const getUser = async (req, res) => {
  try {
    const auth = req.auth();
    const { userId } = auth;

    const user = await User.findById(userId).select("-password");
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }
    res.json({ success: true, user });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

//get User Enrolled Courses
export const userEnrolledCourses = async (req, res) => {
  try {
    const auth = req.auth();
    const { userId } = auth;
    const userData = await User.findById(userId).populate({
      path: "enrolledCourses",
    });

    res.json({ success: true, enrolledCourses: userData.enrolledCourses });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

//purchase controller

export const purchaseCourse = async (req, res) => {
  try {
    const { courseId } = req.body;
    const auth = req.auth();
    const { userId } = auth;
    const { origin } = req.headers;
    const courseData = await Course.findById(courseId);
    if (!courseData || !userId) {
      return res
        .status(404)
        .json({ success: false, message: "Course not found" });
    }

    const purchaseData = {
      courseId: courseData._id,
      userId,
      amount: (
        courseData.coursePrice -
        (courseData.discount * courseData.coursePrice) / 100
      ).toFixed(2),
    };

    const newPurchase = await Purchase.create(purchaseData);

    //Stripe Gateway intialization
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
    const currency = "inr";
    const line_items = [
      {
        price_data: {
          currency,
          product_data: {
            name: courseData.courseTitle,
          },
          unit_amount: parseInt(newPurchase.amount * 100),
        },
        quantity: 1,
      },
    ];
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items,
      success_url: `${origin}/loading/my-enrollments`,
      cancel_url: `${origin}/`,
      metadata: { purchaseId: newPurchase._id.toString() },
    });
    res.json({ success: true, session_url: session.url });
  } catch (error) {
    res.json({ success: false, message: error });
  }
};

//update user course progress

export const updateUserCourseProgress = async (req, res) => {
  try {
    const { courseId, lectureId } = req.body;
    const auth = req.auth();
    const { userId } = auth;
    const progressData = await CourseProgress.findOne({ userId, courseId });
    if (progressData) {
      if (progressData.lectureCompleted.includes(lectureId)) {
        return res.json({
          success: true,
          message: "Lecture Already Completed",
        });
      }
      progressData.lectureCompleted.push(lectureId);
      await progressData.save();
    } else {
      await CourseProgress.create({
        userId,
        courseId,
        lectureCompleted: [lectureId],
      });
    }
    res.json({ message: "progress Updated" });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

//get user course progress
export const getUserCourseProgress = async (req, res) => {
  try {
    const { courseId } = req.params;
    const auth = req.auth();
    const { userId } = auth;
    const progressData = await CourseProgress.findOne({ userId, courseId });

    res.json({ success: true, progressData });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

//Add user course rating

export const addUserRating = async (req, res) => {
  try {
    const { courseId, rating } = req.body;
    const auth = req.auth();
    const { userId } = auth;
    if (!courseId || !rating) {
      return res
        .status(400)
        .json({ success: false, message: "All fields are required" });
    }
    const courseData = await Course.findById(courseId);
    if (!courseData) {
      return res
        .status(404)
        .json({ success: false, message: "Course not found" });
    }
    const user = await User.findById(userId);
    if (!user || !user.enrolledCourses.includes(courseId)) {
      return res
        .status(403)
        .json({ success: false, message: "User not enrolled in the course" });
    }

    const existingRatingIndex = courseData.courseRatings.findIndex(
      (r) => r.userId === userId
    );
    if (existingRatingIndex > -1) {
      courseData.courseRatings[existingRatingIndex].rating = rating;
    } else {
      courseData.courseRatings.push({ userId, rating });
    }
    await courseData.save();
    res.json({ success: true, message: "Rating added/updated successfully" });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};
