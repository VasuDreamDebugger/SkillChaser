import { clerkClient } from "@clerk/express";

export const protectEducator = async (req, res, next) => {
  try {
    const auth = req.auth();
    const userId = auth.userId;
    const user = await clerkClient.users.getUser(userId);
    if (user.publicMetadata.role !== "educator") {
      return res.json({ success: false, message: "Unauthorized Access" });
    }

    next();
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
