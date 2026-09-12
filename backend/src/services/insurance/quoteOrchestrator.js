/* =========================================================
   GOSUBSIDY INSURANCE
   QUOTE ORCHESTRATOR

   PURPOSE:
   1. Receive insurance quote request
   2. Find eligible providers
   3. Send request to providers
   4. Normalize provider quotes
   5. Remove invalid / duplicate quotes
   6. Return standard GoSubsidy response

   IMPORTANT:
   - No fake premiums are generated here.
   - Premiums must come from insurer / partner.
========================================================= */


import {
  getProvidersForProduct,
} from "../../providers/insurance/providerRegistry.js";


import {
  prepareQuotes,
  removeDuplicateQuotes,
  filterValidQuotes,
} from "./quoteNormalizer.js";


/* =========================================================
   SETTINGS
========================================================= */

const DEFAULT_PROVIDER_TIMEOUT =
  Number(
    process.env.INSURANCE_PROVIDER_TIMEOUT_MS
  ) || 15000;


/* =========================================================
   CREATE REQUEST ID
========================================================= */

function createRequestId() {

  return (
    "IQR-" +
    Date.now() +
    "-" +
    Math.random()
      .toString(36)
      .substring(2, 8)
      .toUpperCase()
  );

}


/* =========================================================
   TIMEOUT HELPER
========================================================= */

function withTimeout(
  promise,
  milliseconds,
  providerName
) {

  let timeoutId;

  const timeoutPromise =
    new Promise((_, reject) => {

      timeoutId =
        setTimeout(() => {

          const error =
            new Error(
              `${providerName} quote request timed out`
            );

          error.code =
            "PROVIDER_TIMEOUT";

          reject(error);

        }, milliseconds);

    });


  return Promise.race([
    promise,
    timeoutPromise,
  ]).finally(() => {

    clearTimeout(
      timeoutId
    );

  });

}


/* =========================================================
   VALIDATE MAIN REQUEST
========================================================= */

function validateRequest({
  reference,
  insuranceType,
  lead,
} = {}) {

  if (!reference) {

    throw new Error(
      "Insurance quote reference is required"
    );

  }


  if (!insuranceType) {

    throw new Error(
      "Insurance type is required"
    );

  }


  if (
    !lead ||
    typeof lead !== "object"
  ) {

    throw new Error(
      "Insurance customer information is required"
    );

  }


  return true;

}


/* =========================================================
   BUILD PROVIDER REQUEST

   IMPORTANT:

   We keep the full lead object.

   We ALSO expose common insurance fields at root level
   because some provider adapters expect:

   request.age
   request.pincode
   request.sumInsured

   instead of:

   request.lead.age
========================================================= */

function buildProviderRequest({
  requestId,
  reference,
  insuranceType,
  lead,
}) {

  return {

    /* -----------------------------------------------------
       GOSUBSIDY REQUEST INFORMATION
    ----------------------------------------------------- */

    requestId,

    reference,

    insuranceType,


    /* -----------------------------------------------------
       COMPLETE CUSTOMER / LEAD OBJECT
    ----------------------------------------------------- */

    lead,


    /* -----------------------------------------------------
       COMMON CUSTOMER FIELDS

       Compatibility layer for insurer adapters.
    ----------------------------------------------------- */

    name:
      lead.name ??
      lead.fullName ??
      "",

    mobile:
      lead.mobile ??
      lead.phone ??
      "",

    email:
      lead.email ??
      "",

    age:
      lead.age ??
      null,

    dateOfBirth:
      lead.dateOfBirth ??
      lead.dob ??
      null,

    gender:
      lead.gender ??
      null,

    pincode:
      lead.pincode ??
      lead.pinCode ??
      lead.postalCode ??
      "",

    city:
      lead.city ??
      "",

    state:
      lead.state ??
      "",


    /* -----------------------------------------------------
       INSURANCE COVER
    ----------------------------------------------------- */

    sumInsured:
      lead.sumInsured ??
      lead.coverAmount ??
      lead.cover ??
      null,

    coverAmount:
      lead.coverAmount ??
      lead.sumInsured ??
      lead.cover ??
      null,


    /* -----------------------------------------------------
       HEALTH INSURANCE FIELDS
    ----------------------------------------------------- */

    members:
      lead.members ??
      lead.familyMembers ??
      [],

    familyMembers:
      lead.familyMembers ??
      lead.members ??
      [],

    medicalConditions:
      lead.medicalConditions ??
      lead.preExistingDiseases ??
      [],

    preExistingDiseases:
      lead.preExistingDiseases ??
      lead.medicalConditions ??
      [],


    /* -----------------------------------------------------
       MOTOR INSURANCE FIELDS
    ----------------------------------------------------- */

    vehicleNumber:
      lead.vehicleNumber ??
      lead.registrationNumber ??
      null,

    registrationNumber:
      lead.registrationNumber ??
      lead.vehicleNumber ??
      null,

    vehicleType:
      lead.vehicleType ??
      null,

    vehicleMake:
      lead.vehicleMake ??
      lead.make ??
      null,

    vehicleModel:
      lead.vehicleModel ??
      lead.model ??
      null,


    /* -----------------------------------------------------
       TERM / LIFE INSURANCE FIELDS
    ----------------------------------------------------- */

    annualIncome:
      lead.annualIncome ??
      lead.income ??
      null,

    occupation:
      lead.occupation ??
      null,

    smoker:
      lead.smoker ??
      lead.isSmoker ??
      null,


    /* -----------------------------------------------------
       TRAVEL INSURANCE FIELDS
    ----------------------------------------------------- */

    destination:
      lead.destination ??
      null,

    travelStartDate:
      lead.travelStartDate ??
      lead.startDate ??
      null,

    travelEndDate:
      lead.travelEndDate ??
      lead.endDate ??
      null,

    travellers:
      lead.travellers ??
      lead.travelers ??
      [],


    /* -----------------------------------------------------
       REQUEST METADATA
    ----------------------------------------------------- */

    requestedAt:
      new Date().toISOString(),

  };

}


/* =========================================================
   REQUEST QUOTES FROM ONE PROVIDER
========================================================= */

async function requestProviderQuotes(
  provider,
  request
) {

  const startedAt =
    Date.now();


  try {

    /* -----------------------------------------------------
       VALIDATE PROVIDER REQUEST
    ----------------------------------------------------- */

    if (
      typeof provider.validateQuoteRequest ===
      "function"
    ) {

      provider.validateQuoteRequest(
        request
      );

    }


    console.log(
      `[Insurance Quotes] Requesting ${request.insuranceType} quotes from ${provider.name}`
    );


    /* -----------------------------------------------------
       VALIDATE PROVIDER METHOD
    ----------------------------------------------------- */

    if (
      typeof provider.getQuotes !==
      "function"
    ) {

      const error =
        new Error(
          `${provider.name} does not implement getQuotes()`
        );

      error.code =
        "PROVIDER_METHOD_NOT_IMPLEMENTED";

      throw error;

    }


    /* -----------------------------------------------------
       CALL PROVIDER
    ----------------------------------------------------- */

    const providerResponse =
      await withTimeout(

        provider.getQuotes(
          request
        ),

        DEFAULT_PROVIDER_TIMEOUT,

        provider.name

      );


    /* -----------------------------------------------------
       EXTRACT PROVIDER QUOTES

       Supported:

       [quote, quote]

       OR

       {
         quotes: [...]
       }
    ----------------------------------------------------- */

    let rawQuotes = [];


    if (
      Array.isArray(
        providerResponse
      )
    ) {

      rawQuotes =
        providerResponse;

    } else if (
      Array.isArray(
        providerResponse?.quotes
      )
    ) {

      rawQuotes =
        providerResponse.quotes;

    }


    /* -----------------------------------------------------
       NORMALIZE PROVIDER QUOTES

       providerQuoteId
              ↓
       quoteNormalizer
              ↓
       quoteId
    ----------------------------------------------------- */

    const quotes =
      prepareQuotes(
        rawQuotes,
        provider
      );


    const duration =
      Date.now() -
      startedAt;


    console.log(
      `[Insurance Quotes] ${provider.name}: ${quotes.length} valid quote(s) in ${duration}ms`
    );


    return {

      success:
        true,

      providerId:
        provider.id,

      providerName:
        provider.name,

      duration,

      rawQuoteCount:
        rawQuotes.length,

      quotes,

      error:
        null,

    };


  } catch (error) {

    const duration =
      Date.now() -
      startedAt;


    /*
       IMPORTANT:

       Failure of one insurer must never
       stop the complete comparison.
    */

    console.error(
      `[Insurance Quotes] ${provider.name} failed:`,
      error.message
    );


    return {

      success:
        false,

      providerId:
        provider.id,

      providerName:
        provider.name,

      duration,

      rawQuoteCount:
        0,

      quotes:
        [],

      error: {

        code:
          error.code ||
          "PROVIDER_ERROR",

        message:
          error.message ||
          "Insurance provider request failed",

      },

    };

  }

}


/* =========================================================
   MAIN QUOTE ORCHESTRATOR
========================================================= */

export async function getInsuranceQuotes({
  reference,
  insuranceType,
  lead,
} = {}) {


  /* -------------------------------------------------------
     VALIDATE
  ------------------------------------------------------- */

  validateRequest({
    reference,
    insuranceType,
    lead,
  });


  /* -------------------------------------------------------
     REQUEST ID
  ------------------------------------------------------- */

  const requestId =
    createRequestId();


  const startedAt =
    Date.now();


  console.log(
    `[Insurance Quotes] ${requestId} started`,
    {
      reference,
      insuranceType,
    }
  );


  /* -------------------------------------------------------
     FIND ELIGIBLE PROVIDERS
  ------------------------------------------------------- */

  const providers =
    getProvidersForProduct(
      insuranceType
    );


  console.log(
    `[Insurance Quotes] ${providers.length} eligible provider(s) found for ${insuranceType}`
  );


  /* -------------------------------------------------------
     NO PROVIDERS

     Never generate fake insurer quotes.
  ------------------------------------------------------- */

  if (
    providers.length === 0
  ) {

    console.warn(
      `[Insurance Quotes] No enabled providers found for ${insuranceType}`
    );


    return {

      success:
        true,

      requestId,

      reference,

      insuranceType,

      quotes:
        [],

      providers: {

        requested:
          0,

        successful:
          0,

        failed:
          0,

      },

      providerResults:
        [],

      message:
        "No live insurance provider is currently connected for this product.",

      duration:
        Date.now() -
        startedAt,

      generatedAt:
        new Date().toISOString(),

    };

  }


  /* -------------------------------------------------------
     BUILD STANDARD PROVIDER REQUEST
  ------------------------------------------------------- */

  const providerRequest =
    buildProviderRequest({

      requestId,

      reference,

      insuranceType,

      lead,

    });


  /* -------------------------------------------------------
     REQUEST ALL PROVIDERS IN PARALLEL
  ------------------------------------------------------- */

  const results =
    await Promise.all(

      providers.map(
        (provider) =>

          requestProviderQuotes(
            provider,
            providerRequest
          )
      )

    );


  /* -------------------------------------------------------
     COLLECT QUOTES
  ------------------------------------------------------- */

  let quotes =
    results.flatMap(
      (result) =>
        result.quotes || []
    );


  /* -------------------------------------------------------
     FINAL SAFETY PIPELINE
  ------------------------------------------------------- */

  quotes =
    removeDuplicateQuotes(
      quotes
    );


  quotes =
    filterValidQuotes(
      quotes
    );


  /* -------------------------------------------------------
     SORT BY PROVIDER-RETURNED PREMIUM

     We only sort.

     We NEVER calculate premiums.
  ------------------------------------------------------- */

  quotes.sort(
    (a, b) =>

      Number(
        a.premium?.total || 0
      ) -

      Number(
        b.premium?.total || 0
      )
  );


  /* -------------------------------------------------------
     PROVIDER STATISTICS
  ------------------------------------------------------- */

  const successful =
    results.filter(
      (result) =>
        result.success
    ).length;


  const failed =
    results.filter(
      (result) =>
        !result.success
    ).length;


  const duration =
    Date.now() -
    startedAt;


  /* -------------------------------------------------------
     LOG RESULT
  ------------------------------------------------------- */

  console.log(
    `[Insurance Quotes] ${requestId} completed`,
    {

      reference,

      insuranceType,

      quotes:
        quotes.length,

      providers:
        providers.length,

      successful,

      failed,

      duration,

    }
  );


  /* -------------------------------------------------------
     FINAL STANDARD RESPONSE
  ------------------------------------------------------- */

  return {

    success:
      true,

    requestId,

    reference,

    insuranceType,

    quotes,

    providers: {

      requested:
        providers.length,

      successful,

      failed,

    },


    /* -----------------------------------------------------
       DEVELOPMENT / MONITORING INFORMATION

       Does not expose provider credentials.
    ----------------------------------------------------- */

    providerResults:
      results.map(
        (result) => ({

          providerId:
            result.providerId,

          providerName:
            result.providerName,

          success:
            result.success,

          rawQuoteCount:
            result.rawQuoteCount,

          quoteCount:
            result.quotes.length,

          duration:
            result.duration,

          error:
            result.error,

        })
      ),

    duration,

    generatedAt:
      new Date().toISOString(),

  };

}


/* =========================================================
   DEFAULT EXPORT
========================================================= */

const quoteOrchestrator = {

  getInsuranceQuotes,

};


export default quoteOrchestrator;