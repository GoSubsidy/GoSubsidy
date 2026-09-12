/* =========================================================
   GOSUBSIDY INSURANCE
   LEAD SERVICE

   PURPOSE:
   - Create insurance leads
   - Update lead status
   - Find leads by reference
   - Maintain insurance journey progress
   - Prepare for Supabase persistence

   IMPORTANT:
   Customer information must remain on the backend/database.
   Do not expose service-role credentials to React.
========================================================= */


/* =========================================================
   CONFIGURATION
========================================================= */

const TABLE_NAME = "insurance_leads";

let databaseClient = null;


/* =========================================================
   SET DATABASE CLIENT

   Later from server startup:

   setInsuranceLeadDatabase(supabase);

   This keeps this service independent from the exact
   Supabase client file/path used in your project.
========================================================= */

export function setInsuranceLeadDatabase(client) {

  if (!client) {

    throw new Error(
      "Insurance lead database client is required"
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
        "Insurance lead database is not configured"
      );

    error.code =
      "INSURANCE_DATABASE_NOT_CONFIGURED";

    throw error;

  }

  return databaseClient;

}


/* =========================================================
   CREATE REFERENCE
========================================================= */

export function createInsuranceReference() {

  const timestamp =
    Date.now()
      .toString()
      .slice(-8);

  const random =
    Math.floor(
      100 + Math.random() * 900
    );

  return `GI-${timestamp}${random}`;

}


/* =========================================================
   NORMALIZE STRING
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


/* =========================================================
   NORMALIZE MOBILE
========================================================= */

function cleanMobile(value) {

  if (!value) {
    return null;
  }

  const digits =
    String(value)
      .replace(/\D/g, "")
      .slice(-10);

  return digits || null;

}


/* =========================================================
   NORMALIZE LEAD

   This creates the structure that will be saved into
   Supabase.

   Product-specific information remains inside
   product_data JSONB.
========================================================= */

export function normalizeInsuranceLead(
  lead = {}
) {

  const reference =
    cleanString(
      lead.reference
    ) ||
    createInsuranceReference();


  const insuranceType =
    cleanString(
      lead.insuranceType
    );


  if (!insuranceType) {

    const error =
      new Error(
        "Insurance type is required"
      );

    error.code =
      "INSURANCE_TYPE_REQUIRED";

    throw error;

  }


  const now =
    new Date().toISOString();


  return {

    reference,

    insurance_type:
      insuranceType,

    customer_name:
      cleanString(
        lead.name
      ),

    mobile:
      cleanMobile(
        lead.mobile
      ),

    email:
      cleanString(
        lead.email
      ),

    pincode:
      cleanString(
        lead.pincode
      ),

    city:
      cleanString(
        lead.city
      ),

    state:
      cleanString(
        lead.state
      ),

    source:
      cleanString(
        lead.source
      ) ||
      "GoSubsidy Insurance",

    status:
      cleanString(
        lead.status
      ) ||
      "QUOTE_REQUESTED",

    /*
       Keep product-specific quote information together.

       Examples:

       Health:
       members, dob, gender, cover,
       preExisting, existingPolicy

       Motor:
       vehicleType, registrationNumber,
       vehicleMake, vehicleModel

       Life:
       annualIncome, smoker,
       occupation, lifeCover

       Business:
       turnover, employees, etc.
    */

    product_data: {

      gender:
        lead.gender ?? null,

      dob:
        lead.dob ?? null,

      members:
        Array.isArray(
          lead.members
        )
          ? lead.members
          : [],

      cover:
        lead.cover ?? null,

      preExisting:
        lead.preExisting ?? null,

      existingPolicy:
        lead.existingPolicy ?? null,

      smoker:
        lead.smoker ?? null,

      annualIncome:
        lead.annualIncome ?? null,

      occupation:
        lead.occupation ?? null,

      lifeCover:
        lead.lifeCover ?? null,

      vehicleType:
        lead.vehicleType ?? null,

      registrationNumber:
        lead.registrationNumber ?? null,

      vehicleMake:
        lead.vehicleMake ?? null,

      vehicleModel:
        lead.vehicleModel ?? null,

      vehicleYear:
        lead.vehicleYear ?? null,

      businessName:
        lead.businessName ?? null,

      businessType:
        lead.businessType ?? null,

      annualTurnover:
        lead.annualTurnover ?? null,

      employees:
        lead.employees ?? null,

      propertyType:
        lead.propertyType ?? null,

      buildingValue:
        lead.buildingValue ?? null,

      stockValue:
        lead.stockValue ?? null,

      machineryValue:
        lead.machineryValue ?? null,

      industryType:
        lead.industryType ?? null,

      plantValue:
        lead.plantValue ?? null,

      farmType:
        lead.farmType ?? null,

      farmCapacity:
        lead.farmCapacity ?? null,

      birdType:
        lead.birdType ?? null,

      animalType:
        lead.animalType ?? null,

      animalCount:
        lead.animalCount ?? null,

      agricultureType:
        lead.agricultureType ?? null,

      landArea:
        lead.landArea ?? null,

      cropType:
        lead.cropType ?? null,

      goodsType:
        lead.goodsType ?? null,

      transitMode:
        lead.transitMode ?? null,

      transitValue:
        lead.transitValue ?? null,

      destination:
        lead.destination ?? null,

      travellers:
        lead.travellers ?? null,

      travelDays:
        lead.travelDays ?? null,

      employeeCount:
        lead.employeeCount ?? null,

      employeeCoverType:
        lead.employeeCoverType ?? null,

      notes:
        lead.notes ?? null,

    },

    updated_at:
      now,

  };

}


/* =========================================================
   CREATE / UPSERT LEAD

   We use reference as the business identifier.

   If the same reference already exists, the lead is updated
   rather than creating a duplicate.
========================================================= */

export async function saveInsuranceLead(
  lead
) {

  const db =
    getDatabase();


  const normalized =
    normalizeInsuranceLead(
      lead
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
          onConflict:
            "reference",
        }
      )
      .select()
      .single();


  if (error) {

    console.error(
      "[Insurance Lead Service] Save failed:",
      error.message
    );


    const serviceError =
      new Error(
        "Unable to save insurance lead"
      );


    serviceError.code =
      "INSURANCE_LEAD_SAVE_FAILED";


    serviceError.originalError =
      error;


    throw serviceError;

  }


  return data;

}


/* =========================================================
   FIND LEAD BY REFERENCE
========================================================= */

export async function getInsuranceLead(
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
      .maybeSingle();


  if (error) {

    console.error(
      "[Insurance Lead Service] Lookup failed:",
      error.message
    );


    const serviceError =
      new Error(
        "Unable to retrieve insurance lead"
      );


    serviceError.code =
      "INSURANCE_LEAD_LOOKUP_FAILED";


    throw serviceError;

  }


  return data || null;

}


/* =========================================================
   UPDATE LEAD STATUS

   Examples:

   QUOTE_REQUESTED
   QUOTES_RECEIVED
   VIEW_PLANS_CLICKED
   PROPOSAL_STARTED
   PAYMENT_PENDING
   POLICY_ISSUED
   LOST
========================================================= */

export async function updateInsuranceLeadStatus(
  reference,
  status,
  extra = {}
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


  if (!status) {

    const error =
      new Error(
        "Insurance lead status is required"
      );

    error.code =
      "STATUS_REQUIRED";

    throw error;

  }


  const db =
    getDatabase();


  const payload = {

    status,

    updated_at:
      new Date().toISOString(),

    ...extra,

  };


  /*
     Never allow these values to be changed
     accidentally through extra.
  */

  delete payload.id;
  delete payload.reference;


  const {
    data,
    error,
  } =
    await db
      .from(TABLE_NAME)
      .update(
        payload
      )
      .eq(
        "reference",
        reference
      )
      .select()
      .maybeSingle();


  if (error) {

    console.error(
      "[Insurance Lead Service] Status update failed:",
      error.message
    );


    const serviceError =
      new Error(
        "Unable to update insurance lead"
      );


    serviceError.code =
      "INSURANCE_LEAD_UPDATE_FAILED";


    throw serviceError;

  }


  return data || null;

}


/* =========================================================
   MARK QUOTES RECEIVED
========================================================= */

export async function markQuotesReceived(
  reference,
  quoteCount = 0
) {

  return updateInsuranceLeadStatus(

    reference,

    "QUOTES_RECEIVED",

    {

      quote_count:
        Number(
          quoteCount || 0
        ),

      quotes_received_at:
        new Date().toISOString(),

    }

  );

}


/* =========================================================
   MARK VIEW PLANS
========================================================= */

export async function markViewPlans(
  reference,
  {
    quoteId = null,
    insurerId = null,
  } = {}
) {

  return updateInsuranceLeadStatus(

    reference,

    "VIEW_PLANS_CLICKED",

    {

      selected_quote_id:
        quoteId,

      selected_insurer_id:
        insurerId,

      view_plans_at:
        new Date().toISOString(),

    }

  );

}


/* =========================================================
   MARK PROPOSAL STARTED
========================================================= */

export async function markProposalStarted(
  reference,
  {
    quoteId = null,
    insurerId = null,
  } = {}
) {

  return updateInsuranceLeadStatus(

    reference,

    "PROPOSAL_STARTED",

    {

      selected_quote_id:
        quoteId,

      selected_insurer_id:
        insurerId,

      proposal_started_at:
        new Date().toISOString(),

    }

  );

}


/* =========================================================
   MARK POLICY ISSUED
========================================================= */

export async function markPolicyIssued(
  reference,
  {
    policyNumber = null,
    insurerId = null,
    premium = null,
  } = {}
) {

  return updateInsuranceLeadStatus(

    reference,

    "POLICY_ISSUED",

    {

      selected_insurer_id:
        insurerId,

      policy_number:
        policyNumber,

      issued_premium:
        premium,

      policy_issued_at:
        new Date().toISOString(),

    }

  );

}


/* =========================================================
   DELETE SENSITIVE EMPTY VALUES

   Optional helper for provider payload preparation.

   This removes undefined / null / empty-string fields.
========================================================= */

export function removeEmptyValues(
  object = {}
) {

  return Object.fromEntries(

    Object.entries(
      object
    ).filter(
      ([, value]) =>

        value !== undefined &&
        value !== null &&
        value !== ""

    )

  );

}


/* =========================================================
   SAFE LEAD SUMMARY

   Useful for logs.

   Do NOT return customer mobile, email, DOB or health
   information in server logs.
========================================================= */

export function getSafeLeadSummary(
  lead = {}
) {

  return {

    reference:
      lead.reference ||
      null,

    insuranceType:
      lead.insuranceType ||
      lead.insurance_type ||
      null,

    status:
      lead.status ||
      null,

    source:
      lead.source ||
      null,

  };

}


/* =========================================================
   DEFAULT EXPORT
========================================================= */

const leadService = {

  setInsuranceLeadDatabase,

  createInsuranceReference,

  normalizeInsuranceLead,

  saveInsuranceLead,

  getInsuranceLead,

  updateInsuranceLeadStatus,

  markQuotesReceived,

  markViewPlans,

  markProposalStarted,

  markPolicyIssued,

  removeEmptyValues,

  getSafeLeadSummary,

};


export default leadService;