import User from "../models/User.js";
import Course from "../models/Course.js";
import Purchase from "../models/Purchase.js";
import Stripe from "stripe";
import "dotenv/config";
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
