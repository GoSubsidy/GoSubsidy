/* =========================================================
   GOSUBSIDY INSURANCE
   QUOTE SERVICE

   PURPOSE:
   - Save real insurer quotes
   - Retrieve quote by reference + quoteId
   - Retrieve all quotes for an enquiry
   - Expire old quotes
   - Provide a repository for journeyService.js

   IMPORTANT:
   - Never fabricate premiums here.
   - Quotes stored here must originate from approved
     insurer / insurance-partner integrations.
   - Supabase service-role credentials remain backend-only.
========================================================= */


const TABLE_NAME = "insurance_quotes";

let databaseClient = null;


/* =========================================================
   SET DATABASE CLIENT

   Later during backend startup:

   setInsuranceQuoteDatabase(supabase);
========================================================= */

export function setInsuranceQuoteDatabase(
  client
) {

  if (!client) {

    throw new Error(
      "Insurance quote database client is required"
    );

  }

  databaseClient = client;

}


/* =========================================================
   GET DATABASE
========================================================= */

function getDatabase() {

  if (!databaseClient) {

    const error =
      new Error(
        "Insurance quote database is not configured"
      );

    error.code =
      "INSURANCE_QUOTE_DATABASE_NOT_CONFIGURED";

    throw error;

  }

  return databaseClient;

}


/* =========================================================
   HELPERS
========================================================= */

function cleanString(value) {

  if (
    value === null ||
    value === undefined
  ) {
    return null;
  }

  const cleaned =
    String(value).trim();

  return cleaned || null;

}


function toNumber(value) {

  if (
    value === null ||
    value === undefined ||
    value === ""
  ) {
    return 0;
  }

  const number =
    Number(value);

  return Number.isFinite(number)
    ? number
    : 0;

}


function toArray(value) {

  return Array.isArray(value)
    ? value
    : [];

}


/* =========================================================
   NORMALIZE QUOTE FOR DATABASE

   Converts our standard GoSubsidy quote into the
   insurance_quotes table structure.
========================================================= */

export function normalizeQuoteForDatabase(
  quote,
  {
    reference,
    requestId = null,
    insuranceType = null,
  } = {}
) {

  if (!reference) {

    const error =
      new Error(
        "Insurance reference is required"
      );

    error.code =
      "REFERENCE_REQUIRED";

    throw error;

  }


  if (
    !quote ||
    typeof quote !== "object"
  ) {

    const error =
      new Error(
        "Insurance quote is required"
      );

    error.code =
      "QUOTE_REQUIRED";

    throw error;

  }


  const quoteId =
    cleanString(
      quote.quoteId ||
      quote.id
    );


  if (!quoteId) {

    const error =
      new Error(
        "Insurance quote ID is required"
      );

    error.code =
      "QUOTE_ID_REQUIRED";

    throw error;

  }


  const insurerId =
    cleanString(
      quote.insurerId ||
      quote.insurer_id
    );


  if (!insurerId) {

    const error =
      new Error(
        "Insurance provider ID is required"
      );

    error.code =
      "INSURER_ID_REQUIRED";

    throw error;

  }


  const insurerName =
    cleanString(
      quote.insurerName ||
      quote.insurer_name
    );


  const premium =
    quote.premium &&
    typeof quote.premium === "object"
      ? quote.premium
      : {};


  const now =
    new Date().toISOString();


  return {

    reference,

    request_id:
      cleanString(
        requestId
      ),

    insurance_type:
      cleanString(
        insuranceType
      ),

    quote_id:
      quoteId,

    insurer_id:
      insurerId,

    insurer_name:
      insurerName,

    insurer_logo:
      cleanString(
        quote.insurerLogo
      ),

    product_code:
      cleanString(
        quote.productCode
      ),

    product_name:
      cleanString(
        quote.productName
      ),

    sum_insured:
      toNumber(
        quote.sumInsured
      ),

    premium_base:
      toNumber(
        premium.base
      ),

    premium_tax:
      toNumber(
        premium.tax
      ),

    premium_total:
      toNumber(
        premium.total
      ),

    features:
      toArray(
        quote.features
      ),

    network_hospitals:
      quote.networkHospitals ??
      null,

    waiting_period:
      quote.waitingPeriod ??
      null,

    room_rent:
      quote.roomRent ??
      null,

    claim_assistance:
      quote.claimAssistance ??
      null,

    valid_until:
      quote.validUntil ||
      quote.validity ||
      null,

    quote_token:
      cleanString(
        quote.quoteToken
      ),

    journey_available:
      Boolean(
        quote.journey?.available
      ),

    journey_type:
      cleanString(
        quote.journey?.type
      ) ||
      "server",

    /*
       Provider metadata may contain provider-specific
       non-sensitive information needed later.

       Do NOT put API secrets in metadata.
    */

    metadata:
      quote.metadata &&
      typeof quote.metadata === "object"
        ? quote.metadata
        : {},

    status:
      "ACTIVE",

    received_at:
      quote.source?.receivedAt ||
      quote.receivedAt ||
      now,

    updated_at:
      now,

  };

}


/* =========================================================
   SAVE ONE QUOTE
========================================================= */

export async function saveInsuranceQuote(
  quote,
  context = {}
) {

  const db =
    getDatabase();


  const normalized =
    normalizeQuoteForDatabase(
      quote,
      context
    );


  const {
    data,
    error,
  } =
    await db
      .from(TABLE_NAME)
      .upsert(
        normalized,
        {
          /*
             Supabase table should have a unique constraint:

             reference + quote_id
          */

          onConflict:
            "reference,quote_id",
        }
      )
      .select()
      .single();


  if (error) {

    console.error(
      "[Insurance Quote Service] Save failed:",
      error.message
    );


    const serviceError =
      new Error(
        "Unable to save insurance quote"
      );


    serviceError.code =
      "INSURANCE_QUOTE_SAVE_FAILED";


    serviceError.originalError =
      error;


    throw serviceError;

  }


  return data;

}


/* =========================================================
   SAVE MULTIPLE QUOTES
========================================================= */

export async function saveInsuranceQuotes(
  quotes,
  context = {}
) {

  if (!Array.isArray(quotes)) {

    const error =
      new Error(
        "Insurance quotes must be an array"
      );

    error.code =
      "INVALID_QUOTES";

    throw error;

  }


  if (quotes.length === 0) {
    return [];
  }


  const db =
    getDatabase();


  const rows =
    quotes.map(
      (quote) =>
        normalizeQuoteForDatabase(
          quote,
          context
        )
    );


  const {
    data,
    error,
  } =
    await db
      .from(TABLE_NAME)
      .upsert(
        rows,
        {
          onConflict:
            "reference,quote_id",
        }
      )
      .select();


  if (error) {

    console.error(
      "[Insurance Quote Service] Bulk save failed:",
      error.message
    );


    const serviceError =
      new Error(
        "Unable to save insurance quotes"
      );


    serviceError.code =
      "INSURANCE_QUOTES_SAVE_FAILED";


    serviceError.originalError =
      error;


    throw serviceError;

  }


  return data || [];

}


/* =========================================================
   DATABASE ROW → STANDARD QUOTE

   Converts the stored Supabase row back into the format
   expected by GoSubsidy services/frontend.
========================================================= */

export function databaseRowToQuote(
  row
) {

  if (!row) {
    return null;
  }


  return {

    id:
      row.id,

    reference:
      row.reference,

    requestId:
      row.request_id,

    insuranceType:
      row.insurance_type,

    quoteId:
      row.quote_id,

    insurerId:
      row.insurer_id,

    insurerName:
      row.insurer_name,

    insurerLogo:
      row.insurer_logo,

    productCode:
      row.product_code,

    productName:
      row.product_name,

    sumInsured:
      toNumber(
        row.sum_insured
      ),

    premium: {

      base:
        toNumber(
          row.premium_base
        ),

      tax:
        toNumber(
          row.premium_tax
        ),

      total:
        toNumber(
          row.premium_total
        ),

    },

    features:
      toArray(
        row.features
      ),

    networkHospitals:
      row.network_hospitals,

    waitingPeriod:
      row.waiting_period,

    roomRent:
      row.room_rent,

    claimAssistance:
      row.claim_assistance,

    validUntil:
      row.valid_until,

    quoteToken:
      row.quote_token,

    journey: {

      available:
        Boolean(
          row.journey_available
        ),

      type:
        row.journey_type ||
        "server",

    },

    metadata:
      row.metadata || {},

    status:
      row.status,

    receivedAt:
      row.received_at,

  };

}


/* =========================================================
   GET ONE QUOTE

   IMPORTANT SECURITY:

   We search using BOTH:

   reference + quoteId

   Therefore a customer cannot simply send another quoteId
   and access a quote belonging to a different enquiry.
========================================================= */

export async function getQuoteByReferenceAndId(
  reference,
  quoteId
) {

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


  const db =
    getDatabase();


  const {
    data,
    error,
  } =
    await db
      .from(TABLE_NAME)
      .select("*")
      .eq(
        "reference",
        reference
      )
      .eq(
        "quote_id",
        quoteId
      )
      .maybeSingle();


  if (error) {

    console.error(
      "[Insurance Quote Service] Quote lookup failed:",
      error.message
    );


    const serviceError =
      new Error(
        "Unable to retrieve insurance quote"
      );


    serviceError.code =
      "INSURANCE_QUOTE_LOOKUP_FAILED";


    throw serviceError;

  }


  return databaseRowToQuote(
    data
  );

}


/* =========================================================
   GET ALL QUOTES FOR REFERENCE
========================================================= */

export async function getQuotesByReference(
  reference
) {

  if (!reference) {

    const error =
      new Error(
        "Insurance reference is required"
      );

    error.code =
      "REFERENCE_REQUIRED";

    throw error;

  }


  const db =
    getDatabase();


  const {
    data,
    error,
  } =
    await db
      .from(TABLE_NAME)
      .select("*")
      .eq(
        "reference",
        reference
      )
      .eq(
        "status",
        "ACTIVE"
      )
      .order(
        "premium_total",
        {
          ascending:
            true,
        }
      );


  if (error) {

    console.error(
      "[Insurance Quote Service] Quote list failed:",
      error.message
    );


    const serviceError =
      new Error(
        "Unable to retrieve insurance quotes"
      );


    serviceError.code =
      "INSURANCE_QUOTES_LOOKUP_FAILED";


    throw serviceError;

  }


  return (data || []).map(
    databaseRowToQuote
  );

}


/* =========================================================
   GET QUOTES BY REQUEST ID
========================================================= */

export async function getQuotesByRequestId(
  requestId
) {

  if (!requestId) {

    const error =
      new Error(
        "Insurance quote request ID is required"
      );

    error.code =
      "REQUEST_ID_REQUIRED";

    throw error;

  }


  const db =
    getDatabase();


  const {
    data,
    error,
  } =
    await db
      .from(TABLE_NAME)
      .select("*")
      .eq(
        "request_id",
        requestId
      )
      .order(
        "premium_total",
        {
          ascending:
            true,
        }
      );


  if (error) {

    const serviceError =
      new Error(
        "Unable to retrieve quote request"
      );


    serviceError.code =
      "INSURANCE_QUOTES_LOOKUP_FAILED";


    throw serviceError;

  }


  return (data || []).map(
    databaseRowToQuote
  );

}


/* =========================================================
   UPDATE QUOTE STATUS
========================================================= */

export async function updateQuoteStatus(
  reference,
  quoteId,
  status
) {

  if (
    !reference ||
    !quoteId ||
    !status
  ) {

    const error =
      new Error(
        "Reference, quote ID and status are required"
      );

    error.code =
      "INVALID_QUOTE_STATUS_REQUEST";

    throw error;

  }


  const db =
    getDatabase();


  const {
    data,
    error,
  } =
    await db
      .from(TABLE_NAME)
      .update({

        status,

        updated_at:
          new Date().toISOString(),

      })
      .eq(
        "reference",
        reference
      )
      .eq(
        "quote_id",
        quoteId
      )
      .select()
      .maybeSingle();


  if (error) {

    const serviceError =
      new Error(
        "Unable to update insurance quote"
      );


    serviceError.code =
      "INSURANCE_QUOTE_UPDATE_FAILED";


    throw serviceError;

  }


  return databaseRowToQuote(
    data
  );

}


/* =========================================================
   EXPIRE OLD QUOTES

   Marks quotes whose valid_until has passed as EXPIRED.

   We do not delete them because they may be needed for
   audit / lead / conversion history.
========================================================= */

export async function expireOldQuotes() {

  const db =
    getDatabase();


  const now =
    new Date().toISOString();


  const {
    data,
    error,
  } =
    await db
      .from(TABLE_NAME)
      .update({

        status:
          "EXPIRED",

        updated_at:
          now,

      })
      .eq(
        "status",
        "ACTIVE"
      )
      .lt(
        "valid_until",
        now
      )
      .not(
        "valid_until",
        "is",
        null
      )
      .select(
        "id, reference, quote_id"
      );


  if (error) {

    console.error(
      "[Insurance Quote Service] Expiry update failed:",
      error.message
    );


    const serviceError =
      new Error(
        "Unable to expire insurance quotes"
      );


    serviceError.code =
      "INSURANCE_QUOTE_EXPIRY_FAILED";


    throw serviceError;

  }


  return data || [];

}


/* =========================================================
   QUOTE REPOSITORY

   journeyService.js expects:

   getQuoteByReferenceAndId(reference, quoteId)

   Therefore this object can be passed directly to:

   setQuoteRepository(quoteRepository);
========================================================= */

export const quoteRepository = {

  getQuoteByReferenceAndId,

  getQuotesByReference,

  getQuotesByRequestId,

};


/* =========================================================
   DEFAULT EXPORT
========================================================= */

const quoteService = {

  setInsuranceQuoteDatabase,

  normalizeQuoteForDatabase,

  saveInsuranceQuote,

  saveInsuranceQuotes,

  databaseRowToQuote,

  getQuoteByReferenceAndId,

  getQuotesByReference,

  getQuotesByRequestId,

  updateQuoteStatus,

  expireOldQuotes,

  quoteRepository,

};


export default quoteService;