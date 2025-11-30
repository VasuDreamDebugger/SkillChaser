// configs/mongodb.js
import "dotenv/config";
import mongoose from "mongoose";

const connectDB = async () => {
  try {
    if (!process.env.MONGO_URI) {
      throw new Error("MONGO_URI is not defined in environment variables");
    }

    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ Database connected");
  } catch (error) {
    console.error("❌ Database connection error:", error.message);
    console.error(error.stack);
    process.exit(1);
  }
};

export default connectDB;
