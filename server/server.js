import express from "express";
import cors from "cors";
import connectDB from "./configs/mongodb.js";
import { clerkWebhooks } from "./controllers/webhooks.js";

const app = express();
app.use(express.json());
app.use(cors());

connectDB();

app.get("/", (req, res) => {
  res.send("Hello world");
});

app.post("/clerk", clerkWebhooks);
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`server running at PORT ${PORT}`);
});
