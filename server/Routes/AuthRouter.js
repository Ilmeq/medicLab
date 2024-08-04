import express from "express";

const router = express.Router();

// Logout route
router.post("/logout", (req, res) => {
  // Clear authentication tokens or sessions
  res.clearCookie("token"); // If using cookies
  res.json({ Status: true, Message: "Logged out successfully" });
});

router.get("/logout", (req, res) => {
  res.clearCookie("token");
  return res.json({ Status: true });
});

export { router as authRouter };
