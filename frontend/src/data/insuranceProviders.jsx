/* =========================================================
   GOSUBSIDY INSURANCE PROVIDER INTEGRATION LAYER
   =========================================================

   PURPOSE:
   InsuranceCompare.jsx should NOT contain insurer URLs.

   Add / edit insurer integrations only in this file.

   IMPORTANT:
   Production URLs, partner codes and API credentials must
   come from your approved insurer / intermediary agreement.

   Never put API secrets in this frontend file.
========================================================= */


/* =========================================================
   INTEGRATION TYPES
========================================================= */

export const INTEGRATION_TYPES = {
  REDIRECT: "redirect",
  LEAD_REDIRECT: "lead_redirect",
  API: "api",
  ASSISTED: "assisted",
};


/* =========================================================
   PROVIDERS
========================================================= */

export const INSURANCE_PROVIDERS = [

  /* -------------------------------------------------------
     DEMO PROVIDER ALPHA
  ------------------------------------------------------- */

  {
    id: "demo-alpha",

    name: "Demo Insurer Alpha",

    shortName: "Alpha",

    logo: null,

    active: true,

    categories: [
      "health",
      "life",
    ],

    integration: {
      type: INTEGRATION_TYPES.REDIRECT,

      /*
       Replace ONLY with an approved provider / partner URL.
      */
      viewPlansUrl: "",

      partnerCode: "",

      campaignCode: "",

      supportsPrefill: false,

      leadApiEnabled: false,

      quoteApiEnabled: false,

      checkoutEnabled: false,
    },
  },


  /* -------------------------------------------------------
     DEMO PROVIDER BETA
  ------------------------------------------------------- */

  {
    id: "demo-beta",

    name: "Demo Insurer Beta",

    shortName: "Beta",

    logo: null,

    active: true,

    categories: [
      "health",
      "motor",
      "travel",
    ],

    integration: {
      type: INTEGRATION_TYPES.LEAD_REDIRECT,

      viewPlansUrl: "",

      partnerCode: "",

      campaignCode: "",

      supportsPrefill: false,

      leadApiEnabled: false,

      quoteApiEnabled: false,

      checkoutEnabled: false,
    },
  },


  /* -------------------------------------------------------
     DEMO PROVIDER GAMMA
  ------------------------------------------------------- */

  {
    id: "demo-gamma",

    name: "Demo Insurer Gamma",

    shortName: "Gamma",

    logo: null,

    active: true,

    categories: [
      "health",
      "business",
      "property",
    ],

    integration: {
      type: INTEGRATION_TYPES.API,

      viewPlansUrl: "",

      partnerCode: "",

      campaignCode: "",

      supportsPrefill: false,

      leadApiEnabled: false,

      quoteApiEnabled: false,

      checkoutEnabled: false,
    },
  },


  /* -------------------------------------------------------
     DEMO PROVIDER DELTA
  ------------------------------------------------------- */

  {
    id: "demo-delta",

    name: "Demo Insurer Delta",

    shortName: "Delta",

    logo: null,

    active: true,

    categories: [
      "health",
      "agriculture",
      "poultry",
      "livestock",
    ],

    integration: {
      type: INTEGRATION_TYPES.ASSISTED,

      viewPlansUrl: "",

      partnerCode: "",

      campaignCode: "",

      supportsPrefill: false,

      leadApiEnabled: false,

      quoteApiEnabled: false,

      checkoutEnabled: false,
    },
  },
];


/* =========================================================
   FIND PROVIDER
========================================================= */

export function getInsuranceProvider(providerId) {

  return (
    INSURANCE_PROVIDERS.find(
      (provider) =>
        provider.id === providerId &&
        provider.active
    ) || null
  );
}


/* =========================================================
   GET PROVIDERS BY CATEGORY
========================================================= */

export function getProvidersByCategory(category) {

  return INSURANCE_PROVIDERS.filter(
    (provider) =>
      provider.active &&
      provider.categories.includes(category)
  );
}


/* =========================================================
   BUILD PROVIDER DESTINATION
========================================================= */

export function buildProviderDestination(
  provider,
  {
    reference = "",
    insuranceType = "",
    lead = {},
  } = {}
) {

  if (!provider?.integration?.viewPlansUrl) {
    return null;
  }

  const integration = provider.integration;

  try {

    const url = new URL(
      integration.viewPlansUrl
    );


    /*
     -------------------------------------------------------
     ONLY add parameters your provider officially supports.
     -------------------------------------------------------

     These generic tracking parameters are examples.

     Do NOT automatically send name/mobile/email to a third
     party unless your approved integration specifically
     supports it and your consent/data handling flow allows it.
    */


    if (reference) {
      url.searchParams.set(
        "reference",
        reference
      );
    }


    if (insuranceType) {
      url.searchParams.set(
        "insurance_type",
        insuranceType
      );
    }


    if (integration.partnerCode) {
      url.searchParams.set(
        "partner_code",
        integration.partnerCode
      );
    }


    if (integration.campaignCode) {
      url.searchParams.set(
        "campaign",
        integration.campaignCode
      );
    }


    /*
     PREFILL PLACEHOLDER

     Later, for an approved provider integration:

     if (integration.supportsPrefill) {

       url.searchParams.set(
         "name",
         lead.name
       );

       ...

     }

     Provider-specific field names should be configured
     according to that provider's documentation.
    */


    return url.toString();

  } catch (error) {

    console.error(
      "Invalid insurer destination URL:",
      provider.id,
      error
    );

    return null;
  }
}


/* =========================================================
   PROVIDER JOURNEY
========================================================= */

export async function createProviderJourney({
  providerId,
  reference,
  insuranceType,
  lead,
  quote,
}) {

  const provider =
    getInsuranceProvider(providerId);


  if (!provider) {

    return {
      success: false,
      reason: "PROVIDER_NOT_FOUND",
    };

  }


  const integration =
    provider.integration;


  /* -------------------------------------------------------
     SIMPLE REDIRECT
  ------------------------------------------------------- */

  if (
    integration.type ===
    INTEGRATION_TYPES.REDIRECT
  ) {

    const redirectUrl =
      buildProviderDestination(
        provider,
        {
          reference,
          insuranceType,
          lead,
        }
      );


    if (!redirectUrl) {

      return {
        success: false,
        reason: "INTEGRATION_NOT_CONFIGURED",
        provider,
      };

    }


    return {
      success: true,
      mode: "redirect",
      provider,
      redirectUrl,
    };
  }


  /* -------------------------------------------------------
     LEAD + REDIRECT

     Production:
     Call GoSubsidy BACKEND here.

     Do not call insurer secret APIs directly from React.
  ------------------------------------------------------- */

  if (
    integration.type ===
    INTEGRATION_TYPES.LEAD_REDIRECT
  ) {

    /*
      FUTURE:

      const response = await fetch(
        "/api/insurance/provider-journey",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            providerId,
            reference,
            insuranceType,
            quoteId: quote?.quoteId,
          }),
        }
      );

      return response.json();
    */


    const redirectUrl =
      buildProviderDestination(
        provider,
        {
          reference,
          insuranceType,
          lead,
        }
      );


    if (!redirectUrl) {

      return {
        success: false,
        reason: "INTEGRATION_NOT_CONFIGURED",
        provider,
      };

    }


    return {
      success: true,
      mode: "lead_redirect",
      provider,
      redirectUrl,
    };
  }


  /* -------------------------------------------------------
     FULL API
  ------------------------------------------------------- */

  if (
    integration.type ===
    INTEGRATION_TYPES.API
  ) {

    /*
      FUTURE:

      const response = await fetch(
        "/api/insurance/provider-journey",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            providerId,
            reference,
            insuranceType,
            quoteId: quote?.quoteId,
          }),
        }
      );

      return response.json();
    */


    return {
      success: false,
      reason: "API_NOT_CONNECTED",
      provider,
    };
  }


  /* -------------------------------------------------------
     ASSISTED
  ------------------------------------------------------- */

  return {
    success: false,
    reason: "ASSISTED_ONLY",
    provider,
  };
}


/* =========================================================
   CHECK IF VIEW PLANS IS AVAILABLE
========================================================= */

export function providerHasOnlineJourney(
  providerId
) {

  const provider =
    getInsuranceProvider(providerId);

  return Boolean(
    provider?.integration?.viewPlansUrl
  );
}