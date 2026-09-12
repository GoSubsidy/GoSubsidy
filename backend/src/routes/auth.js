import express from "express";

const router = express.Router();

/**
 * In-memory OTP store
 * {
 *   "mobile": { otp: "123456", expiresAt: 123456789 }
 * }
 */
const otpStore = {};

// =====================
// LOGIN → SEND OTP
// =====================
router.post("/login", (req, res) => {
  try {
    const { mobile } = req.body;

    if (!mobile || mobile.length < 10) {
      return res.status(400).json({ message: "Invalid mobile number" });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = Date.now() + 2 * 60 * 1000; // 2 minutes

    otpStore[mobile] = { otp, expiresAt };

    // DEV ONLY (remove in production)
    console.log(`OTP for ${mobile}: ${otp}`);

    return res.json({
      success: true,
      message: "OTP sent successfully"
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
});

// =====================
// VERIFY OTP
// =====================
router.post("/verify-otp", (req, res) => {
  try {
    const { mobile, otp } = req.body;

    if (!mobile || !otp) {
      return res.status(400).json({ message: "Mobile and OTP required" });
    }

    const record = otpStore[mobile];

    if (!record) {
      return res.status(400).json({ message: "OTP not found" });
    }

    if (Date.now() > record.expiresAt) {
      delete otpStore[mobile];
      return res.status(400).json({ message: "OTP expired" });
    }

    if (record.otp !== otp) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    delete otpStore[mobile];

    return res.json({
      success: true,
      token: "dummy-jwt-token",
      user: { mobile }
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
});

export default router;
