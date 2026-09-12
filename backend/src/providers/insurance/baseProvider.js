/* =========================================================
   GOSUBSIDY INSURANCE
   BASE INSURANCE PROVIDER
========================================================= */

/**
 * Base class for every insurer / insurance partner adapter.
 *
 * Every real provider such as:
 *
 * HDFC ERGO
 * ICICI Lombard
 * Tata AIG
 * Care Health
 * Star Health
 * ACKO
 * Bajaj Allianz
 *
 * will extend this class.
 *
 * IMPORTANT:
 * Never place API keys, passwords or secrets in this file.
 * Provider credentials must come from backend environment
 * variables (.env).
 */

class BaseInsuranceProvider {

  /* =======================================================
     CONSTRUCTOR
  ======================================================= */

  constructor(config = {}) {

    if (!config.id) {
      throw new Error(
        "Insurance provider id is required."
      );
    }

    if (!config.name) {
      throw new Error(
        `Insurance provider "${config.id}" must have a name.`
      );
    }

    this.id =
      String(config.id)
        .trim()
        .toLowerCase();

    this.name =
      String(config.name).trim();

    this.enabled =
      config.enabled !== false;

    this.supportedProducts =
      Array.isArray(config.supportedProducts)
        ? config.supportedProducts.map(
            (product) =>
              String(product)
                .trim()
                .toLowerCase()
          )
        : [];

    this.integrationMode =
      config.integrationMode ||
      "api";

    this.website =
      config.website ||
      null;

    this.logo =
      config.logo ||
      null;

    this.metadata =
      config.metadata || {};

  }


  /* =======================================================
     ENABLED STATUS
  ======================================================= */

  isEnabled() {

    return (
      this.enabled === true
    );

  }


  enable() {

    this.enabled = true;

    return this;

  }


  disable() {

    this.enabled = false;

    return this;

  }


  /* =======================================================
     CONFIGURATION STATUS

     Real insurer adapters should override this method.

     Example:

     isConfigured() {
       return Boolean(
         process.env.HDFC_CLIENT_ID &&
         process.env.HDFC_CLIENT_SECRET
       );
     }
  ======================================================= */

  isConfigured() {

    return false;

  }


  /* =======================================================
     PRODUCT SUPPORT
  ======================================================= */

  supportsProduct(
    insuranceType
  ) {

    if (!insuranceType) {
      return false;
    }

    const product =
      String(insuranceType)
        .trim()
        .toLowerCase();

    return this.supportedProducts.includes(
      product
    );

  }


  /* =======================================================
     GET SUPPORTED PRODUCTS
  ======================================================= */

  getSupportedProducts() {

    return [
      ...this.supportedProducts
    ];

  }


  /* =======================================================
     PROVIDER INFORMATION

     Safe information only.

     NEVER expose:
     API keys
     client secrets
     passwords
     access tokens
  ======================================================= */

  getInfo() {

    return {

      id:
        this.id,

      name:
        this.name,

      enabled:
        this.isEnabled(),

      configured:
        this.isConfigured(),

      integrationMode:
        this.integrationMode,

      supportedProducts:
        this.getSupportedProducts(),

      website:
        this.website,

      logo:
        this.logo,

    };

  }


  /* =======================================================
     VALIDATE QUOTE REQUEST

     Common validation before calling insurer API.
  ======================================================= */

  validateQuoteRequest(
    request = {}
  ) {

    if (
      !request ||
      typeof request !== "object"
    ) {

      return {

        valid: false,

        error:
          "Quote request must be an object.",

      };

    }


    const insuranceType =
      request.insuranceType ||
      request.productType ||
      request.type;


    if (!insuranceType) {

      return {

        valid: false,

        error:
          "Insurance type is required.",

      };

    }


    if (
      !this.supportsProduct(
        insuranceType
      )
    ) {

      return {

        valid: false,

        error:
          `Provider "${this.name}" does not support "${insuranceType}".`,

      };

    }


    return {

      valid: true,

      insuranceType:
        String(insuranceType)
          .trim()
          .toLowerCase(),

    };

  }


  /* =======================================================
     GET QUOTES

     EVERY insurer adapter should override this.

     Example:

     async getQuotes(request) {

       const response =
         await fetch(
           insurerQuoteEndpoint,
           ...
         );

       return response;
     }
  ======================================================= */

  async getQuotes(
    request = {}
  ) {

    throw new Error(
      `getQuotes() is not implemented for provider "${this.id}".`
    );

  }


  /* =======================================================
     CREATE PROVIDER JOURNEY

     Used when customer clicks:

          View Plans
              ↓
          Buy Online
              ↓
          Insurer proposal/payment page

     Every provider with online checkout should override it.
  ======================================================= */

  async createJourney(
    request = {}
  ) {

    throw new Error(
      `createJourney() is not implemented for provider "${this.id}".`
    );

  }


  /* =======================================================
     OPTIONAL QUOTE DETAILS

     Some insurers require another API request after the
     initial quote response.
  ======================================================= */

  async getQuoteDetails(
    request = {}
  ) {

    return {

      success: false,

      providerId:
        this.id,

      reason:
        "NOT_IMPLEMENTED",

      message:
        `Quote details are not implemented for ${this.name}.`,

    };

  }


  /* =======================================================
     OPTIONAL PROPOSAL CREATION

     Future insurer API integration:

     Quote
       ↓
     Proposal
       ↓
     Payment
       ↓
     Policy
  ======================================================= */

  async createProposal(
    request = {}
  ) {

    return {

      success: false,

      providerId:
        this.id,

      reason:
        "NOT_IMPLEMENTED",

      message:
        `Proposal creation is not implemented for ${this.name}.`,

    };

  }


  /* =======================================================
     OPTIONAL PAYMENT JOURNEY
  ======================================================= */

  async createPaymentJourney(
    request = {}
  ) {

    return {

      success: false,

      providerId:
        this.id,

      reason:
        "NOT_IMPLEMENTED",

      message:
        `Payment journey is not implemented for ${this.name}.`,

    };

  }


  /* =======================================================
     OPTIONAL POLICY STATUS
  ======================================================= */

  async getPolicyStatus(
    request = {}
  ) {

    return {

      success: false,

      providerId:
        this.id,

      reason:
        "NOT_IMPLEMENTED",

      message:
        `Policy status is not implemented for ${this.name}.`,

    };

  }


  /* =======================================================
     OPTIONAL HEALTH CHECK

     Useful later for checking whether insurer APIs are
     responding.
  ======================================================= */

  async healthCheck() {

    return {

      providerId:
        this.id,

      providerName:
        this.name,

      enabled:
        this.isEnabled(),

      configured:
        this.isConfigured(),

      status:
        this.isEnabled() &&
        this.isConfigured()
          ? "ready"
          : "not_ready",

      checkedAt:
        new Date().toISOString(),

    };

  }


  /* =======================================================
     SAFE ERROR FORMATTER
  ======================================================= */

  formatError(
    error,
    operation = "UNKNOWN"
  ) {

    return {

      success: false,

      providerId:
        this.id,

      providerName:
        this.name,

      operation,

      error:
        error?.message ||
        "Insurance provider request failed.",

      timestamp:
        new Date().toISOString(),

    };

  }

}


/* =========================================================
   EXPORT

   Your backend uses:

   "type": "module"

   Therefore we use ES Module export syntax.
========================================================= */

export {
  BaseInsuranceProvider
};

export default BaseInsuranceProvider;