import express from "express";
import cors from "cors";
import connectDB from "./configs/mongodb.js";
import { clerkWebhooks } from "./controllers/webhooks.js";
import educatorRoutes from "./routes/educatorRoutes.js";
import { clerkMiddleware } from "@clerk/express";
import connectCloudinary from "./configs/cloudinary.js";

const app = express();

app.use(cors());
app.use(clerkMiddleware());

connectDB();
await connectCloudinary();

app.get("/", (req, res) => {
  res.send("Hello world");
});

// Simple API ping for client-server connectivity checks
app.get("/api/ping", express.json(), (req, res) => {
  res.json({ ok: true, message: "pong from server" });
});

app.use("/api/educator", express.json(), educatorRoutes);

// Use raw body for Clerk webhook route so the Svix signature can be verified
app.post("/clerk", express.json(), clerkWebhooks);
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`server running at PORT ${PORT}`);
});
