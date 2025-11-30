// server.js
import express from "express";
import cors from "cors";
import { clerkMiddleware } from "@clerk/express";

import connectDB from "./configs/mongodb.js";
import connectCloudinary from "./configs/cloudinary.js";

import { clerkWebhooks, stripeWebhooks } from "./controllers/webhooks.js";
import educatorRoutes from "./routes/educatorRoutes.js";
import userRouter from "./routes/userRoutes.js";
import courseRouter from "./routes/courseRoutes.js";

const app = express();

// Middlewares
app.use(cors());
app.use(clerkMiddleware());

// Routes that use JSON body
app.use("/api/educator", express.json(), educatorRoutes);
app.use("/api/user", express.json(), userRouter);
app.use("/api/course", express.json(), courseRouter);

app.get("/", (req, res) => {
  res.send("Hello world");
});

app.get("/api/ping", (req, res) => {
  res.json({ ok: true, message: "pong from server" });
});

// Webhook routes MUST use raw body and come BEFORE any body parser for that path
app.post("/clerk", express.raw({ type: "application/json" }), clerkWebhooks);
app.post("/stripe", express.raw({ type: "application/json" }), stripeWebhooks);

// Start function
const startServer = async () => {
  await connectDB(); // ✅ wait for Mongo
  await connectCloudinary(); // ✅ wait for Cloudinary

  if (process.env.ENVIRONMENT === "development") {
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
      console.log(`Local server running at http://localhost:${PORT}`);
    });
  }
};

startServer();

export default app;
