/* =========================================================
   GOSUBSIDY INSURANCE
   QUOTE NORMALIZER

   PURPOSE:
   Convert insurer / partner quote responses into one
   standard GoSubsidy quote format.

   IMPORTANT:
   - Do not calculate or invent premiums here.
   - Premium values must originate from the connected
     insurer / insurance partner.
   - Supports quoteId, providerQuoteId and id.
========================================================= */


/* =========================================================
   NUMBER HELPER
========================================================= */

function toNumber(value) {
  if (
    value === null ||
    value === undefined ||
    value === ""
  ) {
    return 0;
  }

  const parsed = Number(value);

  return Number.isFinite(parsed)
    ? parsed
    : 0;
}


/* =========================================================
   STRING HELPER
========================================================= */

function toStringValue(value) {
  if (
    value === null ||
    value === undefined
  ) {
    return "";
  }

  return String(value).trim();
}


/* =========================================================
   ARRAY HELPER
========================================================= */

function toArray(value) {
  return Array.isArray(value)
    ? value
    : [];
}


/* =========================================================
   NORMALIZE PREMIUM

   IMPORTANT:
   We never manufacture a missing premium.
========================================================= */

export function normalizePremium(premium) {
  if (
    !premium ||
    typeof premium !== "object"
  ) {
    return {
      base: 0,
      tax: 0,
      total: 0,
    };
  }

  return {
    base: toNumber(
      premium.base ??
      premium.basePremium
    ),

    tax: toNumber(
      premium.tax ??
      premium.gst
    ),

    total: toNumber(
      premium.total ??
      premium.totalPremium ??
      premium.finalPremium
    ),
  };
}


/* =========================================================
   NORMALIZE FEATURES
========================================================= */

export function normalizeFeatures(features) {
  if (!Array.isArray(features)) {
    return [];
  }

  return features
    .map((feature) => {
      if (typeof feature === "string") {
        return feature.trim();
      }

      if (
        feature &&
        typeof feature === "object"
      ) {
        return toStringValue(
          feature.label ||
          feature.name ||
          feature.title
        );
      }

      return "";
    })
    .filter(Boolean);
}


/* =========================================================
   NORMALIZE SINGLE QUOTE
========================================================= */

export function normalizeQuote(
  quote,
  provider = null
) {
  if (
    !quote ||
    typeof quote !== "object"
  ) {
    throw new Error(
      "Invalid insurance quote"
    );
  }


  /* -------------------------------------------------------
     PROVIDER INFORMATION
  ------------------------------------------------------- */

  const insurerId =
    toStringValue(
      quote.insurerId ||
      quote.providerId ||
      provider?.id
    );

  const insurerName =
    toStringValue(
      quote.insurerName ||
      quote.providerName ||
      provider?.name
    );

  if (!insurerId) {
    throw new Error(
      "Insurance quote insurerId is required"
    );
  }

  if (!insurerName) {
    throw new Error(
      "Insurance quote insurerName is required"
    );
  }


  /* -------------------------------------------------------
     QUOTE ID

     IMPORTANT:
     Different insurer adapters may return:

     quoteId
     providerQuoteId
     id

     GoSubsidy converts all of them to quoteId.
  ------------------------------------------------------- */

  const quoteId =
    toStringValue(
      quote.quoteId ||
      quote.providerQuoteId ||
      quote.id
    );

  if (!quoteId) {
    throw new Error(
      `${insurerName}: quoteId is required`
    );
  }


  /* -------------------------------------------------------
     PREMIUM
  ------------------------------------------------------- */

  const premium =
    normalizePremium(
      quote.premium
    );


  /* -------------------------------------------------------
     STANDARD GOSUBSIDY QUOTE
  ------------------------------------------------------- */

  return {

    /* -----------------------------------------------------
       IDENTIFIERS
    ----------------------------------------------------- */

    quoteId,

    insurerId,

    insurerName,


    /* -----------------------------------------------------
       DISPLAY INFORMATION
    ----------------------------------------------------- */

    insurerLogo:
      toStringValue(
        quote.insurerLogo ||
        quote.logo
      ),

    productCode:
      toStringValue(
        quote.productCode ||
        quote.planCode
      ),

    productName:
      toStringValue(
        quote.productName ||
        quote.planName
      ),


    /* -----------------------------------------------------
       COVER
    ----------------------------------------------------- */

    sumInsured:
      toNumber(
        quote.sumInsured ??
        quote.coverAmount ??
        quote.cover
      ),


    /* -----------------------------------------------------
       PREMIUM

       Must originate from provider.
    ----------------------------------------------------- */

    premium,


    /* -----------------------------------------------------
       PLAN FEATURES
    ----------------------------------------------------- */

    features:
      normalizeFeatures(
        quote.features ||
        quote.benefits
      ),


    /* -----------------------------------------------------
       OPTIONAL INFORMATION
    ----------------------------------------------------- */

    networkHospitals:
      quote.networkHospitals ??
      quote.network ??
      null,

    waitingPeriod:
      quote.waitingPeriod ??
      null,

    roomRent:
      quote.roomRent ??
      quote.roomRentLimit ??
      null,

    claimAssistance:
      quote.claimAssistance ??
      null,


    /* -----------------------------------------------------
       QUOTE VALIDITY
    ----------------------------------------------------- */

    validUntil:
      quote.validUntil ||
      quote.validity ||
      quote.expiresAt ||
      null,


    /* -----------------------------------------------------
       PROVIDER QUOTE TOKEN

       Used when View Plans is clicked.

       Never put insurer API secrets here.
    ----------------------------------------------------- */

    quoteToken:
      toStringValue(
        quote.quoteToken ||
        quote.providerQuoteToken ||
        quote.token
      ),


    /* -----------------------------------------------------
       JOURNEY INFORMATION
    ----------------------------------------------------- */

    journey: {

      available:
        Boolean(
          quote.journey?.available ??
          quote.journeyAvailable
        ),

      type:
        toStringValue(
          quote.journey?.type ||
          quote.journeyType
        ) || "server",

    },


    /* -----------------------------------------------------
       METADATA
    ----------------------------------------------------- */

    metadata:
      quote.metadata &&
      typeof quote.metadata === "object"
        ? quote.metadata
        : {},


    /* -----------------------------------------------------
       SOURCE INFORMATION
    ----------------------------------------------------- */

    source: {

      providerId:
        insurerId,

      receivedAt:
        quote.receivedAt ||
        new Date().toISOString(),

    },

  };
}


/* =========================================================
   NORMALIZE MULTIPLE QUOTES
========================================================= */

export function normalizeQuotes(
  quotes,
  provider = null
) {
  if (!Array.isArray(quotes)) {
    return [];
  }

  const normalized = [];

  for (const quote of quotes) {
    try {
      normalized.push(
        normalizeQuote(
          quote,
          provider
        )
      );
    } catch (error) {
      console.error(
        "[Insurance Quote Normalizer] Invalid quote skipped:",
        {
          provider:
            provider?.id ||
            "unknown",

          error:
            error.message,
        }
      );
    }
  }

  return normalized;
}


/* =========================================================
   REMOVE DUPLICATE QUOTES
========================================================= */

export function removeDuplicateQuotes(quotes) {
  const seen = new Set();

  return toArray(quotes).filter(
    (quote) => {

      const key =
        `${quote.insurerId}:${quote.quoteId}`;

      if (seen.has(key)) {
        return false;
      }

      seen.add(key);

      return true;
    }
  );
}


/* =========================================================
   VALID QUOTE CHECK
========================================================= */

export function isValidQuote(quote) {
  if (!quote) {
    return false;
  }

  if (!quote.quoteId) {
    return false;
  }

  if (!quote.insurerId) {
    return false;
  }

  if (!quote.insurerName) {
    return false;
  }


  /*
     A comparison quote must contain a
     positive provider-returned premium.

     GoSubsidy must NEVER invent one.
  */

  const totalPremium =
    Number(
      quote.premium?.total
    );

  if (
    !Number.isFinite(totalPremium) ||
    totalPremium <= 0
  ) {
    return false;
  }

  return true;
}


/* =========================================================
   FILTER VALID QUOTES
========================================================= */

export function filterValidQuotes(quotes) {
  return toArray(quotes).filter(
    isValidQuote
  );
}


/* =========================================================
   PREPARE QUOTES FOR FRONTEND

   Provider
      ↓
   Normalize
      ↓
   Remove duplicates
      ↓
   Validate premium
      ↓
   InsuranceCompare.jsx
========================================================= */

export function prepareQuotes(
  quotes,
  provider = null
) {
  const normalized =
    normalizeQuotes(
      quotes,
      provider
    );

  const unique =
    removeDuplicateQuotes(
      normalized
    );

  return filterValidQuotes(
    unique
  );
}


/* =========================================================
   DEFAULT EXPORT
========================================================= */

const quoteNormalizer = {

  normalizePremium,

  normalizeFeatures,

  normalizeQuote,

  normalizeQuotes,

  removeDuplicateQuotes,

  isValidQuote,

  filterValidQuotes,

  prepareQuotes,

};

export default quoteNormalizer;