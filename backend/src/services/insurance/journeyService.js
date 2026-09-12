/* =========================================================
   GOSUBSIDY INSURANCE
   JOURNEY SERVICE

   PURPOSE:

   Customer clicks "View Plans"
          ↓
   GoSubsidy backend receives:
      reference + quoteId
          ↓
   Find stored quote
          ↓
   Identify insurance provider
          ↓
   provider.createJourney()
          ↓
   Receive approved proposal / checkout URL
          ↓
   Track journey
          ↓
   Return safe redirect information to frontend

   IMPORTANT:
   - Never fabricate insurer URLs.
   - Never expose insurer API credentials.
   - Never trust an insurerId or redirect URL supplied by
     the frontend.
========================================================= */


import {
  getProvider,
} from "../../providers/insurance/providerRegistry.js";

import {
  markViewPlans,
  markProposalStarted,
} from "./leadService.js";


/* =========================================================
   DEPENDENCIES

   We will connect the real Supabase quote repository later.

   The journey service intentionally does NOT keep quotes
   in browser/sessionStorage.
========================================================= */

let quoteRepository = null;

let journeyRepository = null;


/* =========================================================
   SET QUOTE REPOSITORY

   Expected repository method:

   getQuoteByReferenceAndId(reference, quoteId)

   Example later:

   setQuoteRepository({
      getQuoteByReferenceAndId: async (...) => {...}
   });
========================================================= */

export function setQuoteRepository(
  repository
) {

  if (
    !repository ||
    typeof repository
      .getQuoteByReferenceAndId !==
      "function"
  ) {

    throw new Error(
      "Valid insurance quote repository is required"
    );

  }


  quoteRepository =
    repository;

}


/* =========================================================
   SET JOURNEY REPOSITORY

   Optional.

   Used later to save:
   - View Plans clicks
   - Proposal URLs
   - Provider journey IDs
   - Conversion status
========================================================= */

export function setJourneyRepository(
  repository
) {

  if (!repository) {

    throw new Error(
      "Insurance journey repository is required"
    );

  }


  journeyRepository =
    repository;

}


/* =========================================================
   CREATE JOURNEY ID
========================================================= */

function createJourneyId() {

  return (
    "IJ-" +
    Date.now() +
    "-" +
    Math.random()
      .toString(36)
      .substring(2, 8)
      .toUpperCase()
  );

}


/* =========================================================
   VALIDATE REQUEST
========================================================= */

function validateJourneyRequest({
  reference,
  quoteId,
} = {}) {

  if (!reference) {

    const error =
      new Error(
        "Insurance reference is required"
      );

    error.code =
      "REFERENCE_REQUIRED";

    throw error;

  }


  if (!quoteId) {

    const error =
      new Error(
        "Insurance quote ID is required"
      );

    error.code =
      "QUOTE_ID_REQUIRED";

    throw error;

  }


  return true;

}


/* =========================================================
   GET STORED QUOTE

   SECURITY:

   We find the quote using BOTH:

      reference
      quoteId

   We do not accept insurerId from the browser as truth.
========================================================= */

async function getStoredQuote(
  reference,
  quoteId
) {

  if (
    !quoteRepository
  ) {

    const error =
      new Error(
        "Insurance quote repository is not configured"
      );

    error.code =
      "QUOTE_REPOSITORY_NOT_CONFIGURED";

    throw error;

  }


  const quote =
    await quoteRepository
      .getQuoteByReferenceAndId(
        reference,
        quoteId
      );


  if (!quote) {

    const error =
      new Error(
        "Insurance quote was not found"
      );

    error.code =
      "QUOTE_NOT_FOUND";

    throw error;

  }


  return quote;

}


/* =========================================================
   CHECK REDIRECT URL

   Only HTTPS URLs are allowed in production.

   localhost HTTP is allowed during local development.
========================================================= */

function validateRedirectUrl(
  value
) {

  if (!value) {

    const error =
      new Error(
        "Insurance provider did not return a redirect URL"
      );

    error.code =
      "REDIRECT_URL_MISSING";

    throw error;

  }


  let url;


  try {

    url =
      new URL(value);

  } catch {

    const error =
      new Error(
        "Insurance provider returned an invalid redirect URL"
      );

    error.code =
      "INVALID_REDIRECT_URL";

    throw error;

  }


  const localhost =
    url.hostname === "localhost" ||
    url.hostname === "127.0.0.1";


  if (
    url.protocol !== "https:" &&
    !localhost
  ) {

    const error =
      new Error(
        "Insurance provider redirect must use HTTPS"
      );

    error.code =
      "UNSAFE_REDIRECT_URL";

    throw error;

  }


  return url.toString();

}


/* =========================================================
   SAVE JOURNEY EVENT

   Optional until journey persistence is connected.
========================================================= */

async function saveJourneyEvent(
  event
) {

  if (
    !journeyRepository ||
    typeof journeyRepository
      .saveJourneyEvent !==
      "function"
  ) {

    return null;

  }


  try {

    return await journeyRepository
      .saveJourneyEvent(
        event
      );

  } catch (error) {

    /*
       Tracking failure should be logged.

       It should not automatically destroy a successfully
       created insurer proposal journey.
    */

    console.error(
      "[Insurance Journey] Event save failed:",
      error.message
    );


    return null;

  }

}


/* =========================================================
   CREATE INSURANCE JOURNEY
========================================================= */

export async function createInsuranceJourney({
  reference,
  quoteId,
} = {}) {

  validateJourneyRequest({
    reference,
    quoteId,
  });


  const journeyId =
    createJourneyId();


  const startedAt =
    Date.now();


  /* -------------------------------------------------------
     1. FIND STORED QUOTE
  ------------------------------------------------------- */

  const quote =
    await getStoredQuote(
      reference,
      quoteId
    );


  /*
     Depending on the final Supabase schema, the stored
     field may be insurer_id or insurerId.

     Supporting both here makes the service easier to
     connect later.
  */

  const insurerId =
    quote.insurerId ||
    quote.insurer_id;


  if (!insurerId) {

    const error =
      new Error(
        "Stored quote does not contain an insurer ID"
      );

    error.code =
      "QUOTE_INSURER_MISSING";

    throw error;

  }


  /* -------------------------------------------------------
     2. FIND REGISTERED PROVIDER
  ------------------------------------------------------- */

  const provider =
    getProvider(
      insurerId
    );


  if (!provider) {

    const error =
      new Error(
        "Insurance provider is not registered"
      );

    error.code =
      "PROVIDER_NOT_FOUND";

    throw error;

  }


  if (
    typeof provider.isEnabled ===
      "function" &&
    !provider.isEnabled()
  ) {

    const error =
      new Error(
        "Insurance provider is currently unavailable"
      );

    error.code =
      "PROVIDER_DISABLED";

    throw error;

  }


  /* -------------------------------------------------------
     3. TRACK VIEW PLANS
  ------------------------------------------------------- */

  try {

    await markViewPlans(
      reference,
      {
        quoteId,
        insurerId,
      }
    );

  } catch (error) {

    /*
       Lead tracking should be logged.

       During early development the database may not yet
       be configured, so we don't let this alone prevent
       provider journey creation.
    */

    console.error(
      "[Insurance Journey] Unable to mark View Plans:",
      error.message
    );

  }


  await saveJourneyEvent({

    journeyId,

    reference,

    quoteId,

    insurerId,

    event:
      "VIEW_PLANS_CLICKED",

    createdAt:
      new Date().toISOString(),

  });


  /* -------------------------------------------------------
     4. ASK PROVIDER TO CREATE JOURNEY

     Each real provider adapter implements:

       async createJourney(request)

     The provider may:
       - call proposal API
       - create session
       - create checkout token
       - create approved deep link
  ------------------------------------------------------- */

  const providerJourney =
    await provider.createJourney({

      journeyId,

      reference,

      quoteId,

      quote,

    });


  if (
    !providerJourney ||
    typeof providerJourney !==
      "object"
  ) {

    const error =
      new Error(
        "Insurance provider returned an invalid journey"
      );

    error.code =
      "INVALID_PROVIDER_JOURNEY";

    throw error;

  }


  /* -------------------------------------------------------
     5. READ PROVIDER JOURNEY
  ------------------------------------------------------- */

  const redirectUrl =
    validateRedirectUrl(
      providerJourney.redirectUrl
    );


  const providerJourneyId =
    providerJourney.journeyId ||
    providerJourney.sessionId ||
    providerJourney.proposalId ||
    null;


  /* -------------------------------------------------------
     6. TRACK PROPOSAL START
  ------------------------------------------------------- */

  try {

    await markProposalStarted(
      reference,
      {
        quoteId,
        insurerId,
      }
    );

  } catch (error) {

    console.error(
      "[Insurance Journey] Unable to mark proposal:",
      error.message
    );

  }


  await saveJourneyEvent({

    journeyId,

    reference,

    quoteId,

    insurerId,

    providerJourneyId,

    event:
      "PROPOSAL_STARTED",

    createdAt:
      new Date().toISOString(),

  });


  /* -------------------------------------------------------
     7. SAFE FRONTEND RESPONSE

     Do NOT include:
       API key
       client secret
       access token
       raw provider credentials
  ------------------------------------------------------- */

  return {

    success:
      true,

    journeyId,

    reference,

    quoteId,

    insurerId,

    insurerName:
      provider.name,

    mode:
      providerJourney.mode ||
      "redirect",

    redirectUrl,

    providerJourneyId,

    duration:
      Date.now() -
      startedAt,

    createdAt:
      new Date().toISOString(),

  };

}


/* =========================================================
   SAFE ERROR RESPONSE HELPER
========================================================= */

export function getJourneyErrorResponse(
  error
) {

  const code =
    error?.code ||
    "INSURANCE_JOURNEY_ERROR";


  const safeMessages = {

    REFERENCE_REQUIRED:
      "Insurance reference is required.",

    QUOTE_ID_REQUIRED:
      "Insurance quote ID is required.",

    QUOTE_NOT_FOUND:
      "The selected insurance quote could not be found.",

    QUOTE_REPOSITORY_NOT_CONFIGURED:
      "Insurance quote storage is not connected yet.",

    QUOTE_INSURER_MISSING:
      "The selected quote does not contain provider information.",

    PROVIDER_NOT_FOUND:
      "The insurance provider is not connected.",

    PROVIDER_DISABLED:
      "The insurance provider is currently unavailable.",

    REDIRECT_URL_MISSING:
      "The insurer did not return an online proposal journey.",

    INVALID_REDIRECT_URL:
      "The insurer returned an invalid proposal destination.",

    UNSAFE_REDIRECT_URL:
      "The insurer proposal destination could not be verified.",

    INVALID_PROVIDER_JOURNEY:
      "The insurer returned an invalid proposal journey.",

    INSURANCE_JOURNEY_ERROR:
      "Unable to start the insurance proposal journey.",

  };


  return {

    success:
      false,

    error: {

      code,

      message:
        safeMessages[code] ||
        safeMessages
          .INSURANCE_JOURNEY_ERROR,

    },

  };

}


/* =========================================================
   DEFAULT EXPORT
========================================================= */

const journeyService = {

  setQuoteRepository,

  setJourneyRepository,

  createInsuranceJourney,

  getJourneyErrorResponse,

};


export default journeyService;