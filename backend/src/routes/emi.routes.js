import express from "express";
import {
  calculateEMI,
  compareBankEMI,
} from "../services/emi.service.js";

const router = express.Router();

/**
 * POST /api/emi/calculate
 */
router.post("/calculate", (req, res) => {
  try {
    const result = calculateEMI(req.body);

    res.json({
      success: true,
      data: result,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
});

/**
 * POST /api/emi/compare
 */
router.post("/compare", (req, res) => {
  try {
    const result = compareBankEMI(req.body);

    res.json({
      success: true,
      data: result,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
});

export default router;
