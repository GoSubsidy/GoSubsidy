import express from "express";
import { getAdvice } from "../controllers/aiController.js";

const router = express.Router();

/* AI Advisor status test */
router.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    service: "GoSubsidy AI Advisor",
    status: "running",
  });
});

/* AI Recommendation */
router.post("/recommend", async (req, res, next) => {
  try {
    await getAdvice(req, res);
  } catch (error) {
    next(error);
  }
});

export default router;