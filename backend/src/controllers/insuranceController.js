/* =========================================================
   GOSUBSIDY INSURANCE
   INSURANCE CONTROLLER

   PURPOSE:
   Handle HTTP requests coming from the GoSubsidy frontend.

   FLOW:

   InsuranceCompare.jsx
          ↓
   POST /api/insurance/quotes
          ↓
   insuranceController
          ↓
   quoteOrchestrator
          ↓
   Connected Insurance Providers
          ↓
   Normalized Live Quotes
          ↓
   Frontend
========================================================= */


import {
  getInsuranceQuotes,
} from "../services/insurance/quoteOrchestrator.js";

import {
  getRegistryStatus,
} from "../providers/insurance/providerRegistry.js";


/* =========================================================
   GET INSURANCE QUOTES

   POST /api/insurance/quotes
========================================================= */

export async function getQuotes(
  req,
  res
) {

  try {

    /* -----------------------------------------------------
       READ REQUEST
    ----------------------------------------------------- */

    const {
      reference,
      insuranceType,
      lead,
    } = req.body || {};


    /* -----------------------------------------------------
       BASIC VALIDATION
    ----------------------------------------------------- */

    if (!reference) {

      return res.status(400).json({

        success: false,

        error: {
          code: "REFERENCE_REQUIRED",
          message:
            "Insurance quote reference is required.",
        },

      });

    }


    if (!insuranceType) {

      return res.status(400).json({

        success: false,

        error: {
          code: "INSURANCE_TYPE_REQUIRED",
          message:
            "Insurance type is required.",
        },

      });

    }


    if (
      !lead ||
      typeof lead !== "object" ||
      Array.isArray(lead)
    ) {

      return res.status(400).json({

        success: false,

        error: {
          code: "LEAD_REQUIRED",
          message:
            "Customer insurance information is required.",
        },

      });

    }


    /* -----------------------------------------------------
       LOG SAFE REQUEST INFORMATION

       Do NOT log:
       mobile
       email
       DOB
       health details
       government IDs
    ----------------------------------------------------- */

    console.log(
      "[Insurance Controller] Quote request",
      {
        reference,
        insuranceType,
      }
    );


    /* -----------------------------------------------------
       CALL QUOTE ORCHESTRATOR
    ----------------------------------------------------- */

    const result =
      await getInsuranceQuotes({

        reference,

        insuranceType,

        lead,

      });


    /* -----------------------------------------------------
       SUCCESS RESPONSE
    ----------------------------------------------------- */

    return res.status(200).json(
      result
    );

  } catch (error) {

    console.error(
      "[Insurance Controller] Quote request failed:",
      error.message
    );


    /* -----------------------------------------------------
       VALIDATION ERRORS FROM SERVICE
    ----------------------------------------------------- */

    if (
      error.message ===
      "Insurance quote reference is required"
    ) {

      return res.status(400).json({

        success: false,

        error: {
          code:
            "REFERENCE_REQUIRED",

          message:
            error.message,
        },

      });

    }


    if (
      error.message ===
      "Insurance type is required"
    ) {

      return res.status(400).json({

        success: false,

        error: {
          code:
            "INSURANCE_TYPE_REQUIRED",

          message:
            error.message,
        },

      });

    }


    if (
      error.message ===
      "Insurance customer information is required"
    ) {

      return res.status(400).json({

        success: false,

        error: {
          code:
            "LEAD_REQUIRED",

          message:
            error.message,
        },

      });

    }


    /* -----------------------------------------------------
       UNKNOWN SERVER ERROR
    ----------------------------------------------------- */

    return res.status(500).json({

      success: false,

      error: {

        code:
          "INSURANCE_QUOTE_ERROR",

        message:
          "Unable to retrieve insurance quotes at this time.",

      },

    });

  }

}


/* =========================================================
   INSURANCE PROVIDER STATUS

   GET /api/insurance/providers

   Useful while developing the integration.

   IMPORTANT:
   providerRegistry.getRegistryStatus()
   returns safe provider information only.
========================================================= */

export async function getProviders(
  req,
  res
) {

  try {

    const status =
      getRegistryStatus();


    return res.status(200).json({

      success:
        true,

      ...status,

    });

  } catch (error) {

    console.error(
      "[Insurance Controller] Provider status failed:",
      error.message
    );


    return res.status(500).json({

      success:
        false,

      error: {

        code:
          "PROVIDER_STATUS_ERROR",

        message:
          "Unable to retrieve insurance provider status.",

      },

    });

  }

}


/* =========================================================
   INSURANCE API HEALTH

   GET /api/insurance/health
========================================================= */

export async function insuranceHealth(
  req,
  res
) {

  try {

    const registry =
      getRegistryStatus();


    return res.status(200).json({

      success:
        true,

      service:
        "GoSubsidy Insurance API",

      status:
        "online",

      providers: {

        total:
          registry.totalProviders,

        enabled:
          registry.enabledProviders,

      },

      timestamp:
        new Date().toISOString(),

    });

  } catch (error) {

    return res.status(500).json({

      success:
        false,

      service:
        "GoSubsidy Insurance API",

      status:
        "error",

    });

  }

}


/* =========================================================
   CREATE INSURER JOURNEY

   POST /api/insurance/journey

   This endpoint will eventually handle:

   View Plans
       ↓
   Find stored quote
       ↓
   Identify insurer
       ↓
   Provider.createJourney()
       ↓
   Proposal / Checkout URL

   We intentionally DO NOT fabricate a URL here.
========================================================= */

export async function createJourney(
  req,
  res
) {

  try {

    const {
      reference,
      quoteId,
    } = req.body || {};


    if (!reference) {

      return res.status(400).json({

        success:
          false,

        error: {

          code:
            "REFERENCE_REQUIRED",

          message:
            "Insurance reference is required.",

        },

      });

    }


    if (!quoteId) {

      return res.status(400).json({

        success:
          false,

        error: {

          code:
            "QUOTE_ID_REQUIRED",

          message:
            "Insurance quote ID is required.",

        },

      });

    }


    /*
       We haven't built persistent quote storage yet.

       Therefore we MUST NOT invent an insurer redirect.

       Later this section will:

       1. Find quote in Supabase
       2. Read insurerId
       3. getProvider(insurerId)
       4. provider.createJourney(...)
       5. Return approved proposal URL
    */


    return res.status(501).json({

      success:
        false,

      error: {

        code:
          "JOURNEY_NOT_CONNECTED",

        message:
          "The insurer proposal journey is not connected yet.",

      },

      reference,

      quoteId,

    });

  } catch (error) {

    console.error(
      "[Insurance Controller] Journey creation failed:",
      error.message
    );


    return res.status(500).json({

      success:
        false,

      error: {

        code:
          "INSURANCE_JOURNEY_ERROR",

        message:
          "Unable to create the insurer journey.",

      },

    });

  }

}


/* =========================================================
   DEFAULT EXPORT
========================================================= */

const insuranceController = {

  getQuotes,

  getProviders,

  insuranceHealth,

  createJourney,

};


export default insuranceController;