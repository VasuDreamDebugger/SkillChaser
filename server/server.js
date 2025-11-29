import express from "express";
import cors from "cors";
import connectDB from "./configs/mongodb.js";
import { clerkWebhooks, stripeWebhooks } from "./controllers/webhooks.js";
import educatorRoutes from "./routes/educatorRoutes.js";
import { clerkMiddleware } from "@clerk/express";
import connectCloudinary from "./configs/cloudinary.js";
import userRouter from "./routes/userRoutes.js";
import courseRouter from "./routes/courseRoutes.js";
const app = express();

app.use(cors());
app.use(clerkMiddleware());

connectDB();
await connectCloudinary();

app.get("/", (req, res) => {
  res.send("Hello world");
});

app.get("/api/ping", (req, res) => {
  res.json({ ok: true, message: "pong from server" });
});

app.use("/api/educator", express.json(), educatorRoutes);
app.use("/api/user", express.json(), userRouter);
app.use("/api/course", express.json(), courseRouter);

// Clerk webhook route must use raw body
app.post("/clerk", express.raw({ type: "application/json" }), clerkWebhooks);
app.post("/stripe", express.raw({ type: "application/json" }), stripeWebhooks);

// ✅ Only run app.listen if ENVIRONMENT is "development"
if (process.env.ENVIRONMENT === "development") {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`Local server running at http://localhost:${PORT}`);
  });
}

export default app;
