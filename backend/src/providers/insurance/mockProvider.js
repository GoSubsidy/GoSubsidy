/* =========================================================
   GOSUBSIDY INSURANCE
   MOCK / DEVELOPMENT PROVIDER

   PURPOSE:
   - Development and frontend testing only
   - Generates predictable mock insurance quotes
   - Must NOT be treated as a real insurer
   - Replace with approved insurer / broker APIs in production
========================================================= */

import BaseInsuranceProvider from "./baseProvider.js";


/* =========================================================
   MOCK PROVIDER
========================================================= */

class MockInsuranceProvider extends BaseInsuranceProvider {

  constructor() {

    super({
      id: "gosubsidy_mock",
      name: "GoSubsidy Development Provider",

      enabled: true,

      supportedProducts: [
        "health",
        "motor",
        "life",
        "term",
        "travel",
      ],
    });

  }


  /* =======================================================
     PROVIDER CONFIGURATION
  ======================================================= */

  isConfigured() {
    return true;
  }


  /* =======================================================
     GENERATE QUOTES
  ======================================================= */

  async getQuotes(payload = {}) {

    const insuranceType =
      String(
        payload.insuranceType ||
        payload.type ||
        "health"
      )
        .trim()
        .toLowerCase();


    if (!this.supportsProduct(insuranceType)) {

      throw new Error(
        `Mock provider does not support insurance type: ${insuranceType}`
      );

    }


    switch (insuranceType) {

      case "health":
        return this.getHealthQuotes(payload);

      case "motor":
        return this.getMotorQuotes(payload);

      case "life":
      case "term":
        return this.getLifeQuotes(payload);

      case "travel":
        return this.getTravelQuotes(payload);

      default:
        return [];

    }

  }


  /* =======================================================
     HEALTH INSURANCE
  ======================================================= */

  async getHealthQuotes(payload = {}) {

    const lead =
      payload.lead || payload.customer || payload;

    const sumInsured =
      this.getNumber(
        lead.sumInsured ||
        payload.sumInsured,
        1000000
      );


    const age =
      this.getNumber(
        lead.age ||
        payload.age,
        35
      );


    /*
      Development-only premium calculation.

      This is intentionally marked MOCK.
      Never display this as a live insurer premium.
    */

    const basePremium =
      Math.round(
        9500 +
        Math.max(age - 25, 0) * 180 +
        sumInsured * 0.003
      );


    return [
      {
        quoteId:
          this.createQuoteId("H"),

        insurerId:
          this.id,

        insurerName:
          this.name,

        providerId:
          this.id,

        providerName:
          this.name,

        productCode:
          "MOCK_HEALTH_STANDARD",

        productName:
          "Development Health Plan",

        insuranceType:
          "health",

        sumInsured,

        premium: {
          amount: basePremium,
          currency: "INR",
          frequency: "yearly",
          taxIncluded: true,
        },

        annualPremium:
          basePremium,

        monthlyPremium:
          Math.round(
            basePremium / 12
          ),

        networkHospitals:
          10000,

        waitingPeriod:
          "30 days",

        roomRent:
          "No limit",

        claimAssistance:
          "Available",

        features: [
          "Cashless hospitalization",
          "Pre & post hospitalization",
          "Day-care procedures",
          "Ambulance cover",
        ],

        benefits: [
          "Cashless hospitalization",
          "Pre & post hospitalization",
          "Day-care procedures",
          "Ambulance cover",
        ],

        quoteToken:
          this.createToken(),

        journey: {
          type: "redirect",

          /*
            Development journey only.

            Real insurer integration should replace this
            with the proposal/payment URL returned by
            the insurer API.
          */

          url: null,
        },

        metadata: {
          mock: true,
          environment: "development",
          source: "gosubsidy_mock",
        },

        validUntil:
          this.getValidityDate(30),
      },
    ];

  }


  /* =======================================================
     MOTOR INSURANCE
  ======================================================= */

  async getMotorQuotes(payload = {}) {

    const lead =
      payload.lead || payload.customer || payload;


    const vehicleValue =
      this.getNumber(
        lead.vehicleValue ||
        lead.idv ||
        payload.vehicleValue ||
        payload.idv,
        700000
      );


    const premium =
      Math.round(
        Math.max(
          vehicleValue * 0.018,
          4500
        )
      );


    return [
      {
        quoteId:
          this.createQuoteId("M"),

        insurerId:
          this.id,

        insurerName:
          this.name,

        providerId:
          this.id,

        providerName:
          this.name,

        productCode:
          "MOCK_MOTOR_COMPREHENSIVE",

        productName:
          "Development Motor Plan",

        insuranceType:
          "motor",

        idv:
          vehicleValue,

        premium: {
          amount: premium,
          currency: "INR",
          frequency: "yearly",
          taxIncluded: true,
        },

        annualPremium:
          premium,

        features: [
          "Own damage cover",
          "Third-party liability",
          "Cashless garage support",
          "Roadside assistance",
        ],

        quoteToken:
          this.createToken(),

        journey: {
          type: "redirect",
          url: null,
        },

        metadata: {
          mock: true,
          environment: "development",
        },

        validUntil:
          this.getValidityDate(15),
      },
    ];

  }


  /* =======================================================
     LIFE / TERM INSURANCE
  ======================================================= */

  async getLifeQuotes(payload = {}) {

    const lead =
      payload.lead || payload.customer || payload;


    const coverAmount =
      this.getNumber(
        lead.coverAmount ||
        lead.sumInsured ||
        payload.coverAmount ||
        payload.sumInsured,
        10000000
      );


    const age =
      this.getNumber(
        lead.age ||
        payload.age,
        35
      );


    const premium =
      Math.round(
        6500 +
        Math.max(age - 25, 0) * 350 +
        coverAmount * 0.0002
      );


    return [
      {
        quoteId:
          this.createQuoteId("L"),

        insurerId:
          this.id,

        insurerName:
          this.name,

        providerId:
          this.id,

        providerName:
          this.name,

        productCode:
          "MOCK_TERM_STANDARD",

        productName:
          "Development Term Plan",

        insuranceType:
          "term",

        sumAssured:
          coverAmount,

        premium: {
          amount: premium,
          currency: "INR",
          frequency: "yearly",
          taxIncluded: true,
        },

        annualPremium:
          premium,

        features: [
          "Life cover",
          "Flexible policy term",
          "Nominee benefit",
          "Online proposal journey",
        ],

        quoteToken:
          this.createToken(),

        journey: {
          type: "redirect",
          url: null,
        },

        metadata: {
          mock: true,
          environment: "development",
        },

        validUntil:
          this.getValidityDate(30),
      },
    ];

  }


  /* =======================================================
     TRAVEL INSURANCE
  ======================================================= */

  async getTravelQuotes(payload = {}) {

    const lead =
      payload.lead || payload.customer || payload;


    const travellers =
      this.getNumber(
        lead.travellers ||
        payload.travellers,
        1
      );


    const premium =
      Math.round(
        Math.max(
          850 * travellers,
          850
        )
      );


    return [
      {
        quoteId:
          this.createQuoteId("T"),

        insurerId:
          this.id,

        insurerName:
          this.name,

        providerId:
          this.id,

        providerName:
          this.name,

        productCode:
          "MOCK_TRAVEL_STANDARD",

        productName:
          "Development Travel Plan",

        insuranceType:
          "travel",

        premium: {
          amount: premium,
          currency: "INR",
          frequency: "trip",
          taxIncluded: true,
        },

        features: [
          "Emergency medical cover",
          "Trip cancellation support",
          "Baggage protection",
          "Travel assistance",
        ],

        quoteToken:
          this.createToken(),

        journey: {
          type: "redirect",
          url: null,
        },

        metadata: {
          mock: true,
          environment: "development",
        },

        validUntil:
          this.getValidityDate(15),
      },
    ];

  }


  /* =======================================================
     START JOURNEY

     Real insurer providers will normally call the insurer
     proposal API here and return the proposal/payment URL.
  ======================================================= */

  async startJourney(payload = {}) {

    const quote =
      payload.quote || payload;


    return {
      success: true,

      providerId:
        this.id,

      quoteId:
        quote.quoteId || null,

      quoteToken:
        quote.quoteToken || null,

      journeyType:
        "development",

      redirectUrl:
        null,

      message:
        "Mock provider has no insurer payment page. Connect an approved insurer API for the live proposal journey.",

      metadata: {
        mock: true,
      },
    };

  }


  /* =======================================================
     HELPERS
  ======================================================= */

  getNumber(value, fallback = 0) {

    const number =
      Number(value);

    return Number.isFinite(number)
      ? number
      : fallback;

  }


  createQuoteId(prefix = "Q") {

    return (
      `MOCK-${prefix}-` +
      `${Date.now()}-` +
      Math.random()
        .toString(36)
        .slice(2, 8)
        .toUpperCase()
    );

  }


  createToken() {

    return (
      "MQT-" +
      Date.now() +
      "-" +
      Math.random()
        .toString(36)
        .slice(2, 12)
        .toUpperCase()
    );

  }


  getValidityDate(days = 30) {

    const date =
      new Date();

    date.setDate(
      date.getDate() + days
    );

    return date.toISOString();

  }

}


/* =========================================================
   CREATE SINGLE PROVIDER INSTANCE
========================================================= */

const mockProvider =
  new MockInsuranceProvider();


/* =========================================================
   EXPORT
========================================================= */

export {
  MockInsuranceProvider,
  mockProvider,
};

export default mockProvider;