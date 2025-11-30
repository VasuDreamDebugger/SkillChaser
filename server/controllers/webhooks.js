import { Webhook } from "svix";
import User from "../models/User.js";
import Stripe from "stripe";
import Purchase from "../models/Purchase.js";
import Course from "../models/Course.js";

export const clerkWebhooks = async (req, res) => {
  try {
    if (!process.env.CLERK_WEBHOOK_SECRET) {
      console.error("CLERK_WEBHOOK_SECRET is not set");
      return res.status(500).json({ message: "server configuration error" });
    }

    // Parse raw body if needed
    let payload;
    if (Buffer.isBuffer(req.body)) {
      try {
        payload = JSON.parse(req.body.toString("utf8"));
      } catch (err) {
        console.error("Failed to parse webhook body:", err);
        return res.status(400).json({ message: "invalid JSON payload" });
      }
    } else {
      payload = req.body;
    }

    // Verify signature only in production
    if (process.env.ENVIRONMENT !== "development") {
      const whook = new Webhook(process.env.CLERK_WEBHOOK_SECRET);
      try {
        await whook.verify(JSON.stringify(payload), {
          "svix-id": req.headers["svix-id"],
          "svix-timestamp": req.headers["svix-timestamp"],
          "svix-signature": req.headers["svix-signature"],
        });
      } catch (err) {
        console.error("Signature verification failed:", err);
        return res.status(400).json({ message: "invalid signature" });
      }
    }

    const { data, type } = payload;

    switch (type) {
      case "user.created": {
        const userData = {
          _id: data.id,
          email: data?.email_addresses?.[0]?.email_address || null,
          name:
            [data.first_name, data.last_name].filter(Boolean).join(" ") || null,
          imageUrl: data.image_url || null,
        };

        await User.create(userData);
        console.log("New user created:", data.first_name, data.last_name);
        return res.status(201).json({ message: "newUser created" });
      }

      case "user.updated": {
        const userData = {
          email: data?.email_addresses?.[0]?.email_address || null,
          name:
            [data.first_name, data.last_name].filter(Boolean).join(" ") || null,
          imageUrl: data.image_url || null,
        };

        await User.findByIdAndUpdate(data.id, userData);
        console.log("User updated:", data.first_name, data.last_name);
        return res.status(200).json({ message: "user updated successfully" });
      }

      case "user.deleted": {
        await User.findByIdAndDelete(data.id);
        console.log("User deleted:", data.id);
        return res.status(200).json({ message: "user deleted" });
      }

      default:
        console.warn("Unhandled event type:", type);
        return res.status(400).json({ message: "unhandled event type" });
    }
  } catch (error) {
    console.error(error.stack);
    return res.status(400).json({ message: error.message });
  }
};

export const stripeWebhooks = async (req, res) => {
  console.log("Stripe webhook received");

  const sig = req.headers["stripe-signature"];
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
  let event;

  try {
    // req.body must be the raw body (Buffer) because the route uses express.raw
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.log("⚠️  Webhook signature verification failed.", err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  switch (event.type) {
    // === PAID PAYMENTS (behaves exactly like your original code) ===
    case "payment_intent.succeeded": {
      const paymentIntent = event.data.object;
      const paymentIntentId = paymentIntent.id;

      const sessionList = await stripe.checkout.sessions.list({
        payment_intent: paymentIntentId,
      });

      if (!sessionList || !sessionList.data || sessionList.data.length === 0) {
        console.warn(
          "No checkout session found for payment_intent:",
          paymentIntentId
        );
        break;
      }

      const session = sessionList.data[0];
      const metadata = session.metadata || {};
      const purchaseId = metadata.purchaseId || metadata.purchase_id || null;

      if (!purchaseId) {
        console.warn(
          "No purchaseId present in session metadata for session:",
          session.id
        );
        break;
      }

      const purchaseData = await Purchase.findById(purchaseId);
      if (!purchaseData) {
        console.warn("Purchase not found for id:", purchaseId);
        break;
      }

      const userData = await User.findById(purchaseData.userId);
      const courseData = await Course.findById(
        purchaseData.courseId.toString()
      );

      if (!userData || !courseData) {
        console.warn("User or Course not found in webhook flow", {
          purchaseId,
          userId: purchaseData.userId,
          courseId: purchaseData.courseId,
        });
        break;
      }

      console.log(
        "Course Data in webhook:",
        courseData.courseTitle || courseData.title || courseData._id
      );

      // Enroll user for paid course
      courseData.enrolledStudents.push(userData._id || userData);
      await courseData.save();

      userData.enrolledCourses.push(courseData._id);
      await userData.save();

      purchaseData.status = "completed";
      await purchaseData.save();

      console.log("PaymentIntent was successful. purchaseId:", purchaseId);
      break;
    }

    case "payment_intent.payment_failed": {
      const paymentFailedIntent = event.data.object;
      const paymentFailedIntentId = paymentFailedIntent.id;

      const failedSessionList = await stripe.checkout.sessions.list({
        payment_intent: paymentFailedIntentId,
      });

      if (
        failedSessionList &&
        failedSessionList.data &&
        failedSessionList.data.length > 0
      ) {
        const failedSession = failedSessionList.data[0];
        const failedMetadata = failedSession.metadata || {};
        const failedPurchaseId =
          failedMetadata.purchaseId || failedMetadata.purchase_id || null;

        if (failedPurchaseId) {
          const failedPurchaseData = await Purchase.findById(failedPurchaseId);
          if (failedPurchaseData) {
            failedPurchaseData.status = "failed";
            await failedPurchaseData.save();
          }
        } else {
          console.warn(
            "No purchaseId in failed session metadata",
            failedSession.id
          );
        }
      } else {
        console.warn(
          "No checkout session found for failed payment_intent:",
          paymentFailedIntentId
        );
      }
      break;
    }

    // === FREE / 0-AMOUNT SESSIONS (and status sync) ===
    case "checkout.session.completed": {
      try {
        const completedSession = event.data.object;
        const metadata = completedSession.metadata || {};
        const purchaseId = metadata.purchaseId || metadata.purchase_id || null;

        if (!purchaseId) {
          console.warn(
            "checkout.session.completed received without purchaseId metadata",
            completedSession.id
          );
          break;
        }

        const purchaseData = await Purchase.findById(purchaseId);
        if (!purchaseData) {
          console.warn("Purchase not found for id:", purchaseId);
          break;
        }

        // For FREE courses (₹0) Stripe will typically use "no_payment_required"
        if (completedSession.payment_status === "no_payment_required") {
          const userData = await User.findById(purchaseData.userId);
          const courseData = await Course.findById(
            purchaseData.courseId.toString()
          );

          if (!userData || !courseData) {
            console.warn("User or Course not found in FREE flow", {
              purchaseId,
              userId: purchaseData.userId,
              courseId: purchaseData.courseId,
            });
            break;
          }

          console.log(
            "Enrolling user via FREE checkout.session.completed for course:",
            courseData.courseTitle || courseData.title || courseData._id
          );

          // Enroll user for free course
          courseData.enrolledStudents.push(userData._id || userData);
          await courseData.save();

          userData.enrolledCourses.push(courseData._id);
          await userData.save();
        }

        // In all cases where we reach here, mark the purchase as completed
        purchaseData.status = "completed";
        await purchaseData.save();
      } catch (e) {
        console.warn("Error handling checkout.session.completed", e.message);
      }
      break;
    }

    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  res.json({ received: true });
};
