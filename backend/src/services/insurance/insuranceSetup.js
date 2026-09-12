/* =========================================================
   GOSUBSIDY INSURANCE
   SERVICE INITIALIZATION
========================================================= */

import supabase from "../../../utils/supabase.js";


/* =========================================================
   DATABASE SERVICES
========================================================= */

import {
  setInsuranceLeadDatabase,
} from "./leadService.js";


import {
  setInsuranceQuoteDatabase,
  quoteRepository,
} from "./quoteService.js";


import {
  setQuoteRepository,
} from "./journeyService.js";


/* =========================================================
   PROVIDER REGISTRY
========================================================= */

import {
  registerProvider,
  getProvider,
  getRegistryStatus,
} from "../../providers/insurance/providerRegistry.js";


/* =========================================================
   MOCK PROVIDER

   Temporary provider used to test the complete GoSubsidy
   insurance quote pipeline before connecting real insurers.
========================================================= */

import mockProvider from "../../providers/insurance/mockProvider.js";


/* =========================================================
   INITIALIZATION STATE
========================================================= */

let initialized = false;


/* =========================================================
   REGISTER INSURANCE PROVIDERS
========================================================= */

function registerInsuranceProviders() {

  /*
     Avoid registering the same provider more than once.
  */

  if (
    mockProvider &&
    mockProvider.id &&
    !getProvider(mockProvider.id)
  ) {

    registerProvider(
      mockProvider
    );

  }


  /* -------------------------------------------------------
     FUTURE REAL INSURERS

     Later we will add:

     registerProvider(hdfcErgoProvider);
     registerProvider(iciciLombardProvider);
     registerProvider(starHealthProvider);
     registerProvider(careHealthProvider);
     registerProvider(tataAigProvider);

     Only approved insurer / partner integrations should
     be registered here.
  ------------------------------------------------------- */

}


/* =========================================================
   INITIALIZE INSURANCE SERVICES
========================================================= */

export function initializeInsuranceServices() {

  /*
     Prevent accidental duplicate initialization.
  */

  if (initialized) {

    return getRegistryStatus();

  }


  /* -------------------------------------------------------
     LEAD STORAGE
  ------------------------------------------------------- */

  setInsuranceLeadDatabase(
    supabase
  );


  /* -------------------------------------------------------
     QUOTE STORAGE
  ------------------------------------------------------- */

  setInsuranceQuoteDatabase(
    supabase
  );


  /* -------------------------------------------------------
     JOURNEY SERVICE → QUOTE REPOSITORY
  ------------------------------------------------------- */

  setQuoteRepository(
    quoteRepository
  );


  /* -------------------------------------------------------
     REGISTER INSURANCE PROVIDERS
  ------------------------------------------------------- */

  registerInsuranceProviders();


  /* -------------------------------------------------------
     MARK INITIALIZED
  ------------------------------------------------------- */

  initialized = true;


  /* -------------------------------------------------------
     PROVIDER STATUS
  ------------------------------------------------------- */

  const registryStatus =
    getRegistryStatus();


  console.log(
    "============================================"
  );

  console.log(
    "✅ GoSubsidy Insurance services initialized"
  );

  console.log(
    `🏢 Insurance Providers: ${registryStatus.totalProviders}`
  );

  console.log(
    `🟢 Enabled Providers: ${registryStatus.enabledProviders}`
  );

  console.log(
    "============================================"
  );


  return registryStatus;

}


/* =========================================================
   STATUS
========================================================= */

export function areInsuranceServicesInitialized() {

  return initialized;

}


/* =========================================================
   GET INSURANCE SERVICE STATUS
========================================================= */

export function getInsuranceServicesStatus() {

  const registryStatus =
    getRegistryStatus();


  return {

    initialized,

    providers:
      registryStatus,

  };

}


/* =========================================================
   DEFAULT EXPORT
========================================================= */

export default initializeInsuranceServices;