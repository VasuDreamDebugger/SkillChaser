import { Webhook } from "svix";
import User from "../models/User.js";

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
