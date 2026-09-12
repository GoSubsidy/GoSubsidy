import express from "express";
import cors from "cors";
import dotenv from "dotenv";

// ======================================================
// ENVIRONMENT
// ======================================================

dotenv.config();

// ======================================================
// ROUTES
// ======================================================

import schemesRoutes from "./routes/schemes.routes.js";
import eligibilityRoutes from "./routes/eligibility.routes.js";
import emiRoutes from "./routes/emi.routes.js";
import intelligenceRoutes from "./routes/intelligence.routes.js";
import aiRoutes from "./routes/ai.routes.js";
import dprRoutes from "./routes/dpr.routes.js";
import documentRoutes from "./routes/documentRoutes.js";
import analyticsRoutes from "./routes/analytics.routes.js";

// Insurance is currently maintained outside src/routes
import insuranceRoutes from "../routes/insuranceRoutes.js";
import initializeInsuranceServices from "./services/insurance/insuranceSetup.js";

// Razorpay payment routes are maintained in backend/routes
import paymentRoutes from "./routes/paymentRoutes.js";

// ======================================================
// APP INITIALIZATION
// ======================================================

const app = express();

// ======================================================
// INSURANCE SERVICES
// ======================================================

initializeInsuranceServices();

// ======================================================
// CORS
// ======================================================

app.use(
  cors({
    origin: process.env.CORS_ORIGIN || [
      "http://localhost:5173",
      "http://localhost:4000",
    ],
    methods: [
      "GET",
      "POST",
      "PUT",
      "PATCH",
      "DELETE",
      "OPTIONS",
    ],
    allowedHeaders: [
      "Content-Type",
      "Authorization",
    ],
  })
);

// ======================================================
// BODY PARSERS
// ======================================================

// JSON payloads up to 10 MB
app.use(
  express.json({
    limit: "10mb",
  })
);

// URL encoded payloads
app.use(
  express.urlencoded({
    extended: true,
    limit: "10mb",
  })
);

// ======================================================
// PAYMENT ROUTES
// ======================================================

// Razorpay
//
// Frontend base:
// http://localhost:4000/api/payment
//
// Example:
// POST /api/payment/create-order
// POST /api/payment/verify
//

app.use(
  "/api/payment",
  paymentRoutes
);

// ======================================================
// ROOT HEALTH CHECK
// ======================================================

app.get("/", (req, res) => {
  return res.status(200).json({
    success: true,
    service: "GoSubsidy Backend",
    status: "running",
    version: "1.0.0",
  });
});

// ======================================================
// GOVERNMENT SCHEMES
// ======================================================
//
// GET /schemes
// GET /schemes/:id
//

app.use(
  "/schemes",
  schemesRoutes
);

// ======================================================
// ELIGIBILITY ENGINE
// ======================================================
//
// POST /ai/eligibility
//

app.use(
  "/ai",
  eligibilityRoutes
);

// ======================================================
// AI SUBSIDY ADVISOR
// ======================================================
//
// POST /api/ai/recommend
//

app.use(
  "/api/ai",
  aiRoutes
);

// ======================================================
// EMI CALCULATOR
// ======================================================
//
// POST /emi
//

app.use(
  "/emi",
  emiRoutes
);

// ======================================================
// GOSUBSIDY INTELLIGENCE ENGINE
// ======================================================
//
// /api/intelligence
//

app.use(
  "/api/intelligence",
  intelligenceRoutes
);

// ======================================================
// AI DPR GENERATOR
// ======================================================
//
// GET  /api/dpr/status
// POST /api/dpr/generate
//

app.use(
  "/api/dpr",
  dprRoutes
);

app.use(
  "/api/documents", 
  documentRoutes
);

// ======================================================
// ANALYTICS
// ======================================================
// POST /api/analytics/track-visit
// GET  /api/analytics/locations?days=7
app.use(
  "/api/analytics",
  analyticsRoutes
);

// ======================================================
// INSURANCE
// ======================================================
//
// /api/insurance
//

app.use(
  "/api/insurance",
  insuranceRoutes
);

// ======================================================
// API STATUS
// ======================================================

app.get("/api/status", (req, res) => {
  return res.status(200).json({
    success: true,

    message: "GoSubsidy API is running",

    service: "GoSubsidy Backend",

    version: "1.0.0",

    routes: {
      schemes: {
        method: "GET",
        path: "/schemes",
      },

      eligibility: {
        method: "POST",
        path: "/ai/eligibility",
      },

      aiAdvisor: {
        method: "POST",
        path: "/api/ai/recommend",
      },

      emi: {
        method: "POST",
        path: "/emi",
      },

      intelligence: {
        path: "/api/intelligence",
      },

      dprStatus: {
        method: "GET",
        path: "/api/dpr/status",
      },

      generateDPR: {
        method: "POST",
        path: "/api/dpr/generate",
      },

      insurance: {
        path: "/api/insurance",
      },

      payment: {
        path: "/api/payment",
        provider: "Razorpay",
      },

      analytics: {
        path: "/api/analytics",
        trackVisit: {
          method: "POST",
          path: "/api/analytics/track-visit",
        },
        locations: {
          method: "GET",
          path: "/api/analytics/locations",
        },
      },
    },
  });
});

// ======================================================
// 404 HANDLER
// ======================================================

app.use((req, res) => {
  return res.status(404).json({
    success: false,
    message: "API route not found",
    method: req.method,
    path: req.originalUrl,
  });
});

// ======================================================
// GLOBAL ERROR HANDLER
// ======================================================

app.use((err, req, res, next) => {
  console.error("");
  console.error(
    "========================================="
  );

  console.error(
    "❌ GoSubsidy Server Error"
  );

  console.error(
    "========================================="
  );

  console.error(err);

  return res
    .status(err.status || 500)
    .json({
      success: false,
      message:
        err.message ||
        "Internal server error",
    });
});

// ======================================================
// SERVER START
// ======================================================

const PORT =
  process.env.PORT || 4000;

app.listen(
  PORT,
  "0.0.0.0",
  () => {
    console.log("");

    console.log(
      "========================================="
    );

    console.log(
      "🚀 GoSubsidy Backend Started"
    );

    console.log(
      "========================================="
    );

    console.log("");

    console.log(
      `🌐 Server: http://localhost:${PORT}`
    );

    console.log(
      `💚 API Status: http://localhost:${PORT}/api/status`
    );

    console.log("");

    console.log(
      "------------ SCHEMES ------------"
    );

    console.log(
      `📋 Schemes: GET http://localhost:${PORT}/schemes`
    );

    console.log("");

    console.log(
      "------------ ELIGIBILITY ------------"
    );

    console.log(
      `🎯 Eligibility: POST http://localhost:${PORT}/ai/eligibility`
    );

    console.log("");

    console.log(
      "------------ AI ADVISOR ------------"
    );

    console.log(
      `🤖 AI Advisor: POST http://localhost:${PORT}/api/ai/recommend`
    );

    console.log("");

    console.log(
      "------------ DPR ------------"
    );

    console.log(
      `📘 DPR Status: GET http://localhost:${PORT}/api/dpr/status`
    );

    console.log(
      `✨ Generate DPR: POST http://localhost:${PORT}/api/dpr/generate`
    );

    console.log("");

    console.log(
      "------------ RAZORPAY ------------"
    );

    console.log(
      `💳 Payment API: http://localhost:${PORT}/api/payment`
    );

    console.log("");

    console.log(
      "========================================="
    );

    console.log(
      "✅ GoSubsidy APIs Ready"
    );

    console.log(
      "========================================="
    );

    console.log("");
  }
);