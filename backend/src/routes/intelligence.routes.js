import express from "express";
import { getSchemeById } from "../services/scheme.service.js";

const router = express.Router();

// GET scheme by ID
router.get("/schemes/:id", (req, res) => {
  try {
    const scheme = getSchemeById(req.params.id);
    res.json({ success: true, data: scheme });
  } catch (err) {
    res.status(404).json({
      success: false,
      message: err.message,
    });
  }
});

export default router;
