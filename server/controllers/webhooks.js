import { Webhook } from "svix";
import User from "../models/User.js";

export const clerkWebhooks = async (req, res) => {
  try {
    if (!process.env.CLERK_WEBHOOK_SECRET) {
      console.error("CLERK_WEBHOOK_SECRET is not set");
      return res.status(500).json({ message: "server configuration error" });
    }

    const whook = new Webhook(process.env.CLERK_WEBHOOK_SECRET);
    // Pass the raw body (Buffer) to Svix verify. The route uses express.raw({type: 'application/json'}).
    // await whook.verify(JSON.stringify(req.body), {
    //   "svix-id": req.headers["svix-id"],
    //   "svix-timestamp": req.headers["svix-timestamp"],
    //   "svix-signature": req.headers["svix-signature"],
    // });

    // req.body is a Buffer when using express.raw for this route.
    // Parse it to JSON; if it's already an object, use it directly.
    // let payload;
    // if (Buffer.isBuffer(req.body)) {
    //   try {
    //     payload = JSON.parse(req.body.toString("utf8"));
    //   } catch (err) {
    //     console.error("Failed to parse webhook body:", err);
    //     return res.status(400).json({ message: "invalid JSON payload" });
    //   }
    // } else {
    //   payload = req.body;
    // }

    const { data, type } = req.body;
    switch (type) {
      case "user.created": {
        const userData = {
          _id: data.id,
          email: data?.email_addresses?.[0]?.email_address || null,
          name:
            [data.first_name, data.last_name].filter(Boolean).join(" ") || null,
          imageUrl: data.image_url || null,
        };

        // const newUser = new User(userData);
        // await newUser.save();
        await User.create(userData);
        console.log("New user created:", data.first_name, data.last_name);
        res.status(201).json({ message: "newUser created" });
        break;
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
        res.status(200).json({ message: "user updated successfully" });
        break;
      }
      case "user.deleted": {
        await User.findByIdAndDelete(data.id);
        console.log("User deleted:", data.id);
        res.status(200).json({ message: "user deleted" });
        break;
      }
      default:
        res.status(400).json({ message: "unhandled event type" });
        break;
    }
  } catch (error) {
    console.log(error.stack);
    res.status(400).json({ message: error.message });
  }
};
