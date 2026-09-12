/* =========================================================
   GOSUBSIDY INSURANCE
   API ROUTES
   BASE PATH: /api/insurance
========================================================= */

import express from "express";
import {
  getQuotes,
  getProviders,
  insuranceHealth,
  createJourney,
} from "../src/controllers/insuranceController.js";
const router = express.Router();


/* =========================================================
   INSURANCE API HEALTH

   GET /api/insurance/health
========================================================= */

router.get(
  "/health",
  insuranceHealth
);


/* =========================================================
   PROVIDER STATUS

   GET /api/insurance/providers

   Development / admin endpoint.

   Returns safe provider information only.
========================================================= */

router.get(
  "/providers",
  getProviders
);


/* =========================================================
   GET LIVE INSURANCE QUOTES

   POST /api/insurance/quotes

   Expected body:

   {
     "reference": "GI-123456",
     "insuranceType": "health",
     "lead": {
       ...
     }
   }

   FLOW:

   Frontend
      ↓
   insuranceController
      ↓
   quoteOrchestrator
      ↓
   Provider Registry
      ↓
   Connected Insurers
      ↓
   Normalized Quotes
========================================================= */

router.post(
  "/quotes",
  getQuotes
);


/* =========================================================
   CREATE INSURER PROPOSAL JOURNEY

   POST /api/insurance/journey

   Expected body:

   {
     "reference": "GI-123456",
     "quoteId": "QUOTE-123"
   }

   SECURITY:

   Frontend does NOT provide:
   - insurer redirect URL
   - API credentials
   - provider secrets

   Backend resolves the stored quote and provider.
========================================================= */

router.post(
  "/journey",
  createJourney
);


/* =========================================================
   EXPORT
========================================================= */

export default router;