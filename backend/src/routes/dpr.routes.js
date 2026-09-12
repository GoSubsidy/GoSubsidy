// ======================================================
// GoSubsidy - DPR Routes
// File: backend/src/routes/dpr.routes.js
// ======================================================

import express from "express";
import { generateDPR } from "../controllers/dprController.js";

const router = express.Router();

// ======================================================
// TEST DPR ROUTE
// GET /api/dpr/status
// ======================================================

router.get("/status", (req, res) => {
  return res.status(200).json({
    success: true,
    message: "GoSubsidy DPR API is running with multilingual support.",
  });
});

// ======================================================
// GENERATE AI DPR (Supports Multilingual Indian Languages)
// POST /api/dpr/generate
// Body: { project: {...}, language: "te" | "hi" | "en" | ... }
// ======================================================

router.post("/generate", async (req, res, next) => {
  try {
    // Attach or forward language preference to controller execution context if needed
    if (req.body?.language) {
      req.selectedLanguage = req.body.language;
    }
    return await generateDPR(req, res, next);
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: error?.message || "Internal server error during multilingual DPR generation.",
    });
  }
});

// ======================================================
// EXPORT ROUTER
// ======================================================

export default router;