import { clerkClient } from "@clerk/express";

export const updateRoleToEducator = async (req, res) => {
  try {
    console.log("Updating user role to educator");

    // Always call req.auth() as a function
    const auth = req.auth();
    console.log(auth);

    if (!auth.userId) {
      return res.status(401).json({ error: "Unauthorized: No userId found" });
    }

    const { userId } = auth;

    // Update Clerk metadata
    await clerkClient.users.updateUserMetadata(userId, {
      publicMetadata: { role: "educator" },
    });

    console.log(`User ${userId} role updated to educator`);
    res.status(200).json({ message: "Role updated to educator" });
  } catch (error) {
    console.error("Failed to update role:", error);
    res.status(500).json({ error: "Server error" });
  }
};
