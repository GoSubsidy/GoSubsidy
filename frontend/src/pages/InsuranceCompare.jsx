import {
  createProviderJourney,
} from "../data/insuranceProviders";
import React, { useEffect, useMemo, useState } from "react";
import {
  Link,
  useNavigate,
  useSearchParams,
} from "react-router-dom";

import Footer from "../components/layout/Footer";

/* =========================================================
   GOSUBSIDY INSURANCE COMPARE
   ---------------------------------------------------------
   API READY ARCHITECTURE

   Later replace:
   1. fetchInsuranceQuotes()
   2. createCheckout()

   with your GoSubsidy backend APIs.
========================================================= */


/* =========================================================
   INSURANCE TYPE LABELS
========================================================= */

const INSURANCE_TYPES = {
  health: "Health Insurance",
  motor: "Motor Insurance",
  life: "Life Insurance",
  business: "Business Insurance",
  property: "Property Insurance",
  industrial: "Industrial Insurance",
  poultry: "Poultry Insurance",
  livestock: "Livestock Insurance",
  agriculture: "Agriculture Insurance",
  marine: "Marine Insurance",
  travel: "Travel Insurance",
  employee: "Employee Insurance",
};


/* =========================================================
   DEMO QUOTE API
   ---------------------------------------------------------
   TEMPORARY ONLY.
   Replace this function with backend API later.
========================================================= */

async function fetchInsuranceQuotes({
  insuranceType,
  reference,
}) {

  await new Promise((resolve) =>
    setTimeout(resolve, 900)
  );

  return [
    {
      quoteId: "DEMO-QT-1001",

      insurerId: "demo-alpha",
      insurerName: "Demo Insurer Alpha",
      insurerLogo: null,

      productName: "Secure Plus",
      productCode: "DEMO-SP-01",

      badge: "Popular",

      sumInsured: 1000000,

      premium: {
        base: 10550,
        tax: 1899,
        total: 12449,
      },

      monthlyPremium: 1037,

      networkHospitals: "10,000+",

      claimSupport: "Available",

      waitingPeriod: "3 Years",

      roomRent: "No Limit",

      features: [
        "Cashless hospitalization",
        "Pre & post hospitalization",
        "Day-care procedures",
        "Ambulance cover",
      ],

      exclusions: [
        "As per policy wording",
        "Subject to insurer terms",
      ],

      checkoutAvailable: true,

      quoteToken: "demo-token-1001",

      expiresAt: null,
    },

    {
      quoteId: "DEMO-QT-1002",

      insurerId: "demo-beta",
      insurerName: "Demo Insurer Beta",
      insurerLogo: null,

      productName: "Family Protect Gold",
      productCode: "DEMO-FPG-02",

      badge: "Best Value",

      sumInsured: 1000000,

      premium: {
        base: 10075,
        tax: 1814,
        total: 11889,
      },

      monthlyPremium: 991,

      networkHospitals: "9,500+",

      claimSupport: "Available",

      waitingPeriod: "3 Years",

      roomRent: "Single Private Room",

      features: [
        "Family floater cover",
        "Cashless hospitalization",
        "Annual health check-up",
        "Day-care procedures",
      ],

      exclusions: [
        "As per policy wording",
        "Subject to insurer terms",
      ],

      checkoutAvailable: true,

      quoteToken: "demo-token-1002",

      expiresAt: null,
    },

    {
      quoteId: "DEMO-QT-1003",

      insurerId: "demo-gamma",
      insurerName: "Demo Insurer Gamma",
      insurerLogo: null,

      productName: "Complete Protect Elite",
      productCode: "DEMO-CPE-03",

      badge: "Premium",

      sumInsured: 1500000,

      premium: {
        base: 12136,
        tax: 2184,
        total: 14320,
      },

      monthlyPremium: 1193,

      networkHospitals: "11,000+",

      claimSupport: "Available",

      waitingPeriod: "2 Years",

      roomRent: "No Limit",

      features: [
        "Restoration benefit",
        "Cashless hospitalization",
        "Preventive health benefits",
        "Emergency ambulance",
      ],

      exclusions: [
        "As per policy wording",
        "Subject to insurer terms",
      ],

      checkoutAvailable: true,

      quoteToken: "demo-token-1003",

      expiresAt: null,
    },

    {
      quoteId: "DEMO-QT-1004",

      insurerId: "demo-delta",
      insurerName: "Demo Insurer Delta",
      insurerLogo: null,

      productName: "Smart Protect",
      productCode: "DEMO-SMART-04",

      badge: "",

      sumInsured: 500000,

      premium: {
        base: 8980,
        tax: 1616,
        total: 10596,
      },

      monthlyPremium: 883,

      networkHospitals: "8,500+",

      claimSupport: "Available",

      waitingPeriod: "3 Years",

      roomRent: "As per Plan",

      features: [
        "Hospitalization cover",
        "Day-care procedures",
        "Pre-hospitalization",
        "Post-hospitalization",
      ],

      exclusions: [
        "As per policy wording",
        "Subject to insurer terms",
      ],

      checkoutAvailable: false,

      quoteToken: "demo-token-1004",

      expiresAt: null,
    },
  ];
}


/* =========================================================
   CHECKOUT API PLACEHOLDER
========================================================= */

async function createCheckout({
  quote,
  leadReference,
}) {

  /*
    PRODUCTION VERSION LATER:

    const response = await fetch(
      "/api/insurance/checkout",
      {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          quoteId: quote.quoteId,
          quoteToken: quote.quoteToken,
          leadReference,
        }),
      }
    );

    if (!response.ok) {
      throw new Error(
        "Unable to create insurer checkout."
      );
    }

    return response.json();
  */

  await new Promise((resolve) =>
    setTimeout(resolve, 600)
  );

  return {
    demo: true,
    redirectUrl: null,
  };
}


/* =========================================================
   LEAD EVENT TRACKING
========================================================= */

function trackInsuranceEvent(
  eventName,
  data = {}
) {

  const event = {
    eventName,
    ...data,
    timestamp: new Date().toISOString(),
  };

  const oldEvents = JSON.parse(
    sessionStorage.getItem(
      "gosubsidyInsuranceEvents"
    ) || "[]"
  );

  oldEvents.push(event);

  sessionStorage.setItem(
    "gosubsidyInsuranceEvents",
    JSON.stringify(oldEvents)
  );

  console.log(
    "[GoSubsidy Insurance Event]",
    event
  );
}


/* =========================================================
   FORMAT MONEY
========================================================= */

function money(value) {

  return new Intl.NumberFormat(
    "en-IN",
    {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }
  ).format(value);
}


/* =========================================================
   MAIN COMPONENT
========================================================= */

export default function InsuranceCompare() {

  const navigate = useNavigate();

  const [searchParams] = useSearchParams();


  /* -------------------------------------------------------
     URL DATA
  ------------------------------------------------------- */

  const insuranceType =
    searchParams.get("type") || "health";

  const referenceFromUrl =
    searchParams.get("ref");


  /* -------------------------------------------------------
     LEAD DATA
  ------------------------------------------------------- */

  const storedLead = useMemo(() => {
    try {
      return JSON.parse(
        sessionStorage.getItem(
          "gosubsidyInsuranceLead"
        ) || "{}"
      );
    } catch {
      return {};
    }
  }, []);


  const leadReference =
    referenceFromUrl ||
    storedLead.reference ||
    "GS-DEMO";


  /* -------------------------------------------------------
     PROVIDER STATE
  ------------------------------------------------------- */

  const [providerLoading, setProviderLoading] =
    useState(null);

  const [demoMessage, setDemoMessage] =
    useState("");


  /* -------------------------------------------------------
     VIEW PLANS
  ------------------------------------------------------- */

  const handleViewPlans = async (quote) => {

    try {

      setProviderLoading(
        quote.quoteId
      );

      setDemoMessage("");


      /* -----------------------------------------
         TRACK CLICK
      ----------------------------------------- */

      trackInsuranceEvent(
        "VIEW_PLANS_CLICKED",
        {
          leadReference,

          quoteId:
            quote.quoteId,

          insurerId:
            quote.insurerId,

          productCode:
            quote.productCode,

          insuranceType,

          premium:
            quote.premium?.total,
        }
      );


      /* -----------------------------------------
         CREATE PROVIDER JOURNEY
      ----------------------------------------- */

      const journey =
        await createProviderJourney({
          providerId:
            quote.insurerId,

          reference:
            leadReference,

          insuranceType,

          lead:
            storedLead,

          quote,
        });


      /* -----------------------------------------
         REDIRECT AVAILABLE
      ----------------------------------------- */

      if (
        journey.success &&
        journey.redirectUrl
      ) {

        trackInsuranceEvent(
          "PROVIDER_REDIRECT_STARTED",
          {
            leadReference,

            quoteId:
              quote.quoteId,

            insurerId:
              quote.insurerId,

            integrationMode:
              journey.mode,
          }
        );


        window.location.assign(
          journey.redirectUrl
        );

        return;
      }


      /* -----------------------------------------
         NOT CONFIGURED
      ----------------------------------------- */

      if (
        journey.reason ===
        "INTEGRATION_NOT_CONFIGURED"
      ) {

        setDemoMessage(
          `${quote.insurerName} online journey is not connected yet. Add its approved View Plans URL in insuranceProviders.js.`
        );

        return;
      }


      /* -----------------------------------------
         API NOT CONNECTED
      ----------------------------------------- */

      if (
        journey.reason ===
        "API_NOT_CONNECTED"
      ) {

        setDemoMessage(
          `${quote.insurerName} is configured for API integration, but the GoSubsidy backend connection is not active yet.`
        );

        return;
      }


      /* -----------------------------------------
         ASSISTED ONLY
      ----------------------------------------- */

      if (
        journey.reason ===
        "ASSISTED_ONLY"
      ) {

        setDemoMessage(
          `${quote.insurerName} currently requires assisted insurance support.`
        );

        return;
      }


      setDemoMessage(
        "This insurance provider journey is currently unavailable."
      );

    } catch (error) {

      console.error(
        "Provider journey error:",
        error
      );

      setDemoMessage(
        "Unable to open the insurance provider. Please try again."
      );

    } finally {

      setProviderLoading(null);

    }
  };

  const insuranceLabel =
    INSURANCE_TYPES[insuranceType] ||
    "Insurance";


  /* -------------------------------------------------------
     STATE
  ------------------------------------------------------- */

  const [quotes, setQuotes] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const [sortBy, setSortBy] =
    useState("recommended");

  const [cashlessOnly, setCashlessOnly] =
    useState(false);

  const [noRoomRent, setNoRoomRent] =
    useState(false);

  const [selectedPlans, setSelectedPlans] =
    useState([]);

  const [detailsPlan, setDetailsPlan] =
    useState(null);

  const [checkoutQuote, setCheckoutQuote] =
    useState(null);

  const [checkoutLoading, setCheckoutLoading] =
    useState(false);

  /* =======================================================
     LOAD QUOTES
  ======================================================= */

  useEffect(() => {

    let active = true;

    async function loadQuotes() {

      try {

        setLoading(true);
        setError("");

        trackInsuranceEvent(
          "COMPARE_VIEWED",
          {
            leadReference,
            insuranceType,
          }
        );

        const response =
          await fetchInsuranceQuotes({
            insuranceType,
            reference: leadReference,
          });

        if (!active) return;

        setQuotes(response);

        trackInsuranceEvent(
          "QUOTES_RECEIVED",
          {
            leadReference,
            insuranceType,
            quoteCount: response.length,
          }
        );

      } catch (err) {

        if (!active) return;

        console.error(err);

        setError(
          "We could not load insurance quotes. Please try again."
        );

      } finally {

        if (active) {
          setLoading(false);
        }

      }

    }

    loadQuotes();

    return () => {
      active = false;
    };

  }, [
    insuranceType,
    leadReference,
  ]);


  /* =======================================================
     FILTER + SORT
  ======================================================= */

  const visibleQuotes =
    useMemo(() => {

      let data = [...quotes];

      if (cashlessOnly) {

        data = data.filter(
          (quote) =>
            quote.networkHospitals
        );

      }

      if (noRoomRent) {

        data = data.filter(
          (quote) =>
            quote.roomRent ===
            "No Limit"
        );

      }

      if (sortBy === "premium-low") {

        data.sort(
          (a, b) =>
            a.premium.total -
            b.premium.total
        );

      }

      if (sortBy === "premium-high") {

        data.sort(
          (a, b) =>
            b.premium.total -
            a.premium.total
        );

      }

      if (sortBy === "cover-high") {

        data.sort(
          (a, b) =>
            b.sumInsured -
            a.sumInsured
        );

      }

      return data;

    }, [
      quotes,
      cashlessOnly,
      noRoomRent,
      sortBy,
    ]);


  /* =======================================================
     COMPARE SELECTION
  ======================================================= */

  const toggleCompare = (quote) => {

    setSelectedPlans((current) => {

      const exists =
        current.some(
          (item) =>
            item.quoteId ===
            quote.quoteId
        );

      if (exists) {

        return current.filter(
          (item) =>
            item.quoteId !==
            quote.quoteId
        );

      }

      if (current.length >= 3) {

        setDemoMessage(
          "You can compare up to 3 plans."
        );

        return current;

      }

      trackInsuranceEvent(
        "PLAN_ADDED_TO_COMPARE",
        {
          leadReference,
          quoteId: quote.quoteId,
          insurerId: quote.insurerId,
        }
      );

      return [
        ...current,
        quote,
      ];

    });

  };


  /* =======================================================
     VIEW DETAILS
  ======================================================= */

  const openDetails = (quote) => {

    trackInsuranceEvent(
      "PLAN_DETAILS_VIEWED",
      {
        leadReference,
        quoteId: quote.quoteId,
        insurerId: quote.insurerId,
      }
    );

    setDetailsPlan(quote);

  };


  /* =======================================================
     GET QUOTE
  ======================================================= */

  const handleGetQuote = (quote) => {

    trackInsuranceEvent(
      "GET_QUOTE_CLICKED",
      {
        leadReference,
        quoteId: quote.quoteId,
        insurerId: quote.insurerId,
      }
    );

    /*
      Later this can call an insurer-specific
      proposal/quote API.
    */

    setDetailsPlan(quote);

  };


  /* =======================================================
     BUY ONLINE
     -------------------------------------------------------
     DEMO MODE:
     Open the GoSubsidy demo proposal journey for the
     configured demo insurers. No fake external insurer URL.
  ======================================================= */

  const handleBuyOnline =
    async (quote) => {

      if (!quote.checkoutAvailable) {

        setDemoMessage(
          "Online purchase is not available for this plan. Request assistance instead."
        );

        return;
      }

      try {

        setCheckoutQuote(quote);
        setCheckoutLoading(true);
        setDemoMessage("");

        trackInsuranceEvent(
          "BUY_ONLINE_CLICKED",
          {
            leadReference,
            quoteId: quote.quoteId,
            insurerId: quote.insurerId,
            premium: quote.premium?.total,
          }
        );

        /*
         * DEMO PROVIDERS
         *
         * All current demo quotes use checkoutAvailable=true.
         * Route them to the internal GoSubsidy demo proposal
         * page instead of returning redirectUrl:null.
         */
        if (
          quote.insurerId === "demo-alpha" ||
          quote.insurerId === "demo-beta" ||
          quote.insurerId === "demo-gamma"
        ) {

          trackInsuranceEvent(
            "DEMO_PROVIDER_JOURNEY_STARTED",
            {
              leadReference,
              quoteId: quote.quoteId,
              insurerId: quote.insurerId,
              insurerName: quote.insurerName,
              productCode: quote.productCode,
              premium: quote.premium?.total,
            }
          );

          navigate(
            "/insurance/demo-proposal",
            {
              state: {
                quote,
                lead: storedLead,
                reference: leadReference,
                insuranceType,
                providerId: quote.insurerId,
                providerName: quote.insurerName,
                mode: "DEMO",
              },
            }
          );

          return;
        }

        /*
         * FUTURE PRODUCTION CHECKOUT
         *
         * Keep the existing backend-ready path for a real
         * approved insurer/partner integration.
         */
        const checkout =
          await createCheckout({
            quote,
            leadReference,
          });

        if (checkout.redirectUrl) {

          trackInsuranceEvent(
            "CHECKOUT_STARTED",
            {
              leadReference,
              quoteId: quote.quoteId,
              insurerId: quote.insurerId,
            }
          );

          window.location.assign(
            checkout.redirectUrl
          );

          return;
        }

        setDemoMessage(
          "This insurance provider is not connected to an online checkout yet."
        );

      } catch (err) {

        console.error(
          "Buy online error:",
          err
        );

        setDemoMessage(
          "Unable to start the insurance journey. Please try again."
        );

      } finally {

        setCheckoutLoading(false);
        setCheckoutQuote(null);

      }
    };


  /* =======================================================
     RENDER
  ======================================================= */

  return (
    <>
      <main className="gic-page">


        {/* =================================================
            HERO
        ================================================= */}

        <section className="gic-hero">

          <div className="container">

            <div className="gic-breadcrumb">

              <Link to="/">
                <i className="bi bi-house-door"></i>
                Home
              </Link>

              <i className="bi bi-chevron-right"></i>

              <Link to="/insurance">
                Insurance
              </Link>

              <i className="bi bi-chevron-right"></i>

              <span>
                Compare
              </span>

            </div>


            <div className="row align-items-center g-4">

              <div className="col-lg-8">

                <div className="gic-eyebrow">

                  <i className="bi bi-shield-check"></i>

                  GOSUBSIDY INSURANCE MARKETPLACE

                </div>

                <h1>
                  Compare.
                  Choose.
                  <span>
                    Protect.
                  </span>
                </h1>

                <p>

                  Compare insurance plans,
                  understand key benefits and
                  continue with the option that
                  suits your requirements.

                </p>

              </div>


              <div className="col-lg-4">

                <div className="gic-reference">

                  <div className="gic-reference-icon">
                    <i className="bi bi-file-earmark-check"></i>
                  </div>

                  <div>

                    <small>
                      QUOTE REFERENCE
                    </small>

                    <strong>
                      {leadReference}
                    </strong>

                    <span>
                      {insuranceLabel}
                    </span>

                  </div>

                </div>

              </div>

            </div>

          </div>

        </section>


        {/* =================================================
            DEVELOPMENT NOTICE
        ================================================= */}

        <div className="container">

          <div className="gic-demo-notice">

            <i className="bi bi-info-circle-fill"></i>

            <div>

              <strong>
                Development / Demo Quotes
              </strong>

              <span>
                The insurers, premiums and benefits
                shown below are demonstration data.
                Live production results will be
                supplied by approved insurer or
                insurance-partner integrations.
              </span>

            </div>

          </div>

        </div>


        {/* =================================================
            CONTENT
        ================================================= */}

        <section className="gic-content">

          <div className="container">

            <div className="row g-4">


              {/* ===========================================
                  SIDEBAR
              ============================================ */}

              <div className="col-xl-3 col-lg-4">

                <aside className="gic-sidebar">


                  <div className="gic-side-head">

                    <div>

                      <span>
                        YOUR REQUIREMENT
                      </span>

                      <h3>
                        {insuranceLabel}
                      </h3>

                    </div>

                    <Link
                      to={`/insurance/quote?type=${insuranceType}`}
                    >
                      Edit
                    </Link>

                  </div>


                  <div className="gic-line"></div>


                  <SideInfo
                    icon="bi-shield-check"
                    label="Insurance"
                    value={insuranceLabel}
                  />

                  <SideInfo
                    icon="bi-hash"
                    label="Reference"
                    value={leadReference}
                  />

                  <SideInfo
                    icon="bi-geo-alt"
                    label="Location"
                    value={
                      storedLead.city ||
                      storedLead.location ||
                      "Your Location"
                    }
                  />


                  <div className="gic-line"></div>


                  <h4>
                    Plan Preferences
                  </h4>


                  <label className="gic-check">

                    <input
                      type="checkbox"
                      checked={cashlessOnly}
                      onChange={(e) =>
                        setCashlessOnly(
                          e.target.checked
                        )
                      }
                    />

                    <span>
                      Cashless network
                    </span>

                  </label>


                  <label className="gic-check">

                    <input
                      type="checkbox"
                      checked={noRoomRent}
                      onChange={(e) =>
                        setNoRoomRent(
                          e.target.checked
                        )
                      }
                    />

                    <span>
                      No room-rent limit
                    </span>

                  </label>


                  <div className="gic-help">

                    <div className="gic-help-icon">

                      <i className="bi bi-headset"></i>

                    </div>

                    <span>
                      NEED HELP?
                    </span>

                    <h3>
                      Insurance Assistance
                    </h3>

                    <p>
                      Need help understanding
                      coverage, benefits or the
                      purchase process?
                    </p>

                    <Link to="/contact">

                      Talk to GoSubsidy

                      <i className="bi bi-arrow-right"></i>

                    </Link>

                  </div>


                </aside>

              </div>


              {/* ===========================================
                  RESULTS
              ============================================ */}

              <div className="col-xl-9 col-lg-8">


                {/* TOOLBAR */}

                <div className="gic-toolbar">

                  <div>

                    <span>
                      INSURANCE OPTIONS
                    </span>

                    <h2>

                      {loading
                        ? "Finding plans..."
                        : `${visibleQuotes.length} Plans Available`
                      }

                    </h2>

                    <p>
                      Compare important policy
                      features before proceeding.
                    </p>

                  </div>


                  <div className="gic-sort">

                    <i className="bi bi-sort-down"></i>

                    <select
                      value={sortBy}
                      onChange={(e) =>
                        setSortBy(
                          e.target.value
                        )
                      }
                    >

                      <option value="recommended">
                        Recommended
                      </option>

                      <option value="premium-low">
                        Premium: Low to High
                      </option>

                      <option value="premium-high">
                        Premium: High to Low
                      </option>

                      <option value="cover-high">
                        Cover: High to Low
                      </option>

                    </select>

                  </div>

                </div>


                {/* MESSAGE */}

                {demoMessage && (

                  <div className="gic-message">

                    <i className="bi bi-info-circle-fill"></i>

                    <span>
                      {demoMessage}
                    </span>

                    <button
                      type="button"
                      onClick={() =>
                        setDemoMessage("")
                      }
                    >
                      <i className="bi bi-x-lg"></i>
                    </button>

                  </div>

                )}


                {/* LOADING */}

                {loading && (

                  <QuoteLoading />

                )}


                {/* ERROR */}

                {!loading && error && (

                  <div className="gic-error">

                    <i className="bi bi-exclamation-circle"></i>

                    <h3>
                      Unable to Load Quotes
                    </h3>

                    <p>
                      {error}
                    </p>

                    <button
                      type="button"
                      onClick={() =>
                        window.location.reload()
                      }
                    >
                      Try Again
                    </button>

                  </div>

                )}


                {/* QUOTES */}

                {!loading &&
                  !error &&
                  visibleQuotes.map(
                    (quote) => (

                      <QuoteCard
                        key={quote.quoteId}

                        quote={quote}

                        selected={
                          selectedPlans.some(
                            (item) =>
                              item.quoteId ===
                              quote.quoteId
                          )
                        }

                        onCompare={() =>
                          toggleCompare(quote)
                        }

                        onDetails={() =>
                          openDetails(quote)
                        }

                        onGetQuote={() =>
                          handleGetQuote(quote)
                        }

                        onViewPlans={() =>
                          handleViewPlans(quote)
                        }

                        onBuy={() =>
                          handleBuyOnline(quote)
                        }

                        providerLoading={
                          providerLoading ===
                          quote.quoteId
                        }

                        checkoutLoading={
                          checkoutLoading &&
                          checkoutQuote?.quoteId ===
                            quote.quoteId
                        }
                      />

                    )
                  )}


                {/* NO RESULTS */}

                {!loading &&
                  !error &&
                  visibleQuotes.length === 0 && (

                    <div className="gic-empty">

                      <i className="bi bi-search"></i>

                      <h3>
                        No Matching Plans
                      </h3>

                      <p>
                        Try changing your plan
                        preferences.
                      </p>

                      <button
                        type="button"
                        onClick={() => {

                          setCashlessOnly(false);
                          setNoRoomRent(false);

                        }}
                      >
                        Clear Filters
                      </button>

                    </div>

                  )}


                {/* DISCLAIMER */}

                {!loading && !error && (

                  <div className="gic-disclaimer">

                    <i className="bi bi-shield-exclamation"></i>

                    <p>
                      Premium, eligibility,
                      coverage, exclusions and
                      policy issuance are subject
                      to the insurer's applicable
                      terms, underwriting and
                      policy wording. Review the
                      official policy documents
                      before purchase.
                    </p>

                  </div>

                )}


              </div>

            </div>

          </div>

        </section>


        {/* =================================================
            COMPARE BAR
        ================================================= */}

        {selectedPlans.length > 0 && (

          <div className="gic-compare-bar">

            <div className="gic-compare-left">

              <div className="gic-count">
                {selectedPlans.length}
              </div>

              <div>

                <strong>
                  Plans Selected
                </strong>

                <span>
                  Select up to 3 plans
                </span>

              </div>

            </div>


            <div className="gic-selected-icons">

              {selectedPlans.map(
                (plan) => (

                  <div
                    key={plan.quoteId}
                    title={plan.insurerName}
                  >
                    <i className="bi bi-shield-check"></i>
                  </div>

                )
              )}

            </div>


            <button
              type="button"
              disabled={
                selectedPlans.length < 2
              }
              onClick={() => {

                trackInsuranceEvent(
                  "COMPARE_PLANS_CLICKED",
                  {
                    leadReference,
                    quoteIds:
                      selectedPlans.map(
                        (item) =>
                          item.quoteId
                      ),
                  }
                );

                setDemoMessage(
                  "Detailed side-by-side comparison will be connected in the next step."
                );

              }}
            >

              Compare Plans

              <i className="bi bi-arrow-right"></i>

            </button>

          </div>

        )}


        {/* =================================================
            DETAILS MODAL
        ================================================= */}

        {detailsPlan && (

          <div
            className="gic-modal-overlay"
            onClick={() =>
              setDetailsPlan(null)
            }
          >

            <div
              className="gic-modal"
              onClick={(e) =>
                e.stopPropagation()
              }
            >


              <div className="gic-modal-head">

                <div className="gic-modal-provider">

                  <div>
                    <i className="bi bi-shield-check"></i>
                  </div>

                  <section>

                    <small>
                      INSURANCE PROVIDER
                    </small>

                    <h3>
                      {detailsPlan.insurerName}
                    </h3>

                    <span>
                      {detailsPlan.productName}
                    </span>

                  </section>

                </div>


                <button
                  type="button"
                  onClick={() =>
                    setDetailsPlan(null)
                  }
                >
                  <i className="bi bi-x-lg"></i>
                </button>

              </div>


              <div className="gic-modal-summary">

                <ModalStat
                  label="SUM INSURED"
                  value={
                    money(
                      detailsPlan.sumInsured
                    )
                  }
                />

                <ModalStat
                  label="ANNUAL PREMIUM"
                  value={
                    money(
                      detailsPlan.premium.total
                    )
                  }
                />

                <ModalStat
                  label="NETWORK"
                  value={
                    detailsPlan.networkHospitals
                  }
                />

              </div>


              <div className="gic-modal-section">

                <h4>
                  Key Benefits
                </h4>

                <div className="gic-modal-benefits">

                  {detailsPlan.features.map(
                    (feature) => (

                      <div key={feature}>

                        <i className="bi bi-check-circle-fill"></i>

                        {feature}

                      </div>

                    )
                  )}

                </div>

              </div>


              <div className="gic-modal-grid">

                <ModalDetail
                  label="Waiting Period"
                  value={
                    detailsPlan.waitingPeriod
                  }
                />

                <ModalDetail
                  label="Room Rent"
                  value={
                    detailsPlan.roomRent
                  }
                />

                <ModalDetail
                  label="Claims Assistance"
                  value={
                    detailsPlan.claimSupport
                  }
                />

              </div>


              <div className="gic-modal-premium">

                <div>

                  <small>
                    Base Premium
                  </small>

                  <strong>
                    {money(
                      detailsPlan.premium.base
                    )}
                  </strong>

                </div>

                <div>

                  <small>
                    Taxes
                  </small>

                  <strong>
                    {money(
                      detailsPlan.premium.tax
                    )}
                  </strong>

                </div>

                <div className="total">

                  <small>
                    Total Premium
                  </small>

                  <strong>
                    {money(
                      detailsPlan.premium.total
                    )}
                  </strong>

                </div>

              </div>


              <div className="gic-modal-actions">

                <button
                  type="button"
                  className="gic-modal-quote"
                  onClick={() =>
                    handleGetQuote(
                      detailsPlan
                    )
                  }
                >

                  <i className="bi bi-file-earmark-text"></i>

                  Get Quote

                </button>


                <button
                  type="button"
                  className="gic-modal-buy"
                  onClick={() =>
                    handleBuyOnline(
                      detailsPlan
                    )
                  }
                >

                  <i className="bi bi-lightning-charge-fill"></i>

                  Buy Online

                  <i className="bi bi-arrow-right"></i>

                </button>

              </div>


              <p className="gic-modal-note">

                <i className="bi bi-lock-fill"></i>

                You will only be redirected
                through an approved insurer /
                partner checkout integration.

              </p>


            </div>

          </div>

        )}


      </main>

      <Footer />


      {/* =================================================
          CSS
      ================================================= */}

      <style>{`

        .gic-page{
          --navy:#05345f;
          --navy2:#075877;
          --blue:#087cf0;
          --green:#00b894;
          --cyan:#00d9c2;
          --yellow:#ffbd00;
          --text:#10243f;
          --muted:#71849a;
          --line:#dfe8f0;

          min-height:100vh;
          color:var(--text);
          background:#f5f8fc;
        }

        .gic-page *{
          box-sizing:border-box;
        }


        /* ================= HERO ================= */

        .gic-hero{
          padding:45px 0 48px;
          color:#fff;

          background:
            radial-gradient(
              circle at 90% 0,
              rgba(0,220,190,.20),
              transparent 30%
            ),
            linear-gradient(
              120deg,
              #043564,
              #075b75 65%,
              #069186
            );
        }


        .gic-breadcrumb{
          margin-bottom:24px;

          display:flex;
          align-items:center;
          gap:8px;

          font-size:9px;
        }

        .gic-breadcrumb a{
          display:flex;
          align-items:center;
          gap:5px;

          color:#c4dae6;

          text-decoration:none;
        }

        .gic-breadcrumb > i{
          color:#779bad;
          font-size:6px;
        }

        .gic-breadcrumb span{
          color:#47e8cf;
          font-weight:800;
        }


        .gic-eyebrow{
          display:flex;
          align-items:center;
          gap:7px;

          color:#43e7cf;

          font-size:8px;
          font-weight:900;

          letter-spacing:1px;
        }


        .gic-hero h1{
          margin:9px 0 10px;

          font-size:45px;
          font-weight:900;

          letter-spacing:-1.5px;
        }

        .gic-hero h1 span{
          margin-left:8px;
          color:var(--yellow);
        }


        .gic-hero p{
          max-width:620px;

          margin:0;

          color:#d0e2eb;

          font-size:11px;
          line-height:1.7;
        }


        .gic-reference{
          padding:17px;

          display:flex;
          align-items:center;
          gap:12px;

          border-radius:16px;

          background:
            rgba(255,255,255,.09);

          border:
            1px solid
            rgba(255,255,255,.14);
        }


        .gic-reference-icon{
          width:47px;
          height:47px;

          flex:0 0 47px;

          display:grid;
          place-items:center;

          border-radius:12px;

          color:#07385d;
          background:#49e4cd;

          font-size:19px;
        }


        .gic-reference > div:last-child{
          display:flex;
          flex-direction:column;
        }


        .gic-reference small{
          color:#a9c9d6;

          font-size:6px;
          font-weight:900;

          letter-spacing:.7px;
        }


        .gic-reference strong{
          margin-top:2px;

          font-size:14px;
          font-weight:900;
        }


        .gic-reference span{
          margin-top:2px;

          color:#55e7d1;

          font-size:8px;
        }


        /* ================= NOTICE ================= */

        .gic-demo-notice{
          margin-top:20px;

          padding:13px 16px;

          display:flex;
          align-items:flex-start;
          gap:10px;

          border-radius:11px;

          color:#735b13;

          background:#fff9e7;

          border:1px solid #efdda1;
        }


        .gic-demo-notice > i{
          margin-top:1px;
        }


        .gic-demo-notice div{
          display:flex;
          flex-direction:column;
          gap:2px;
        }


        .gic-demo-notice strong{
          font-size:9px;
        }


        .gic-demo-notice span{
          font-size:8px;
          line-height:1.5;
        }


        /* ================= CONTENT ================= */

        .gic-content{
          padding:25px 0 85px;
        }


        /* ================= SIDEBAR ================= */

        .gic-sidebar{
          position:sticky;
          top:95px;

          padding:22px;

          border-radius:18px;

          background:#fff;

          border:1px solid var(--line);

          box-shadow:
            0 10px 30px
            rgba(25,55,85,.05);
        }


        .gic-side-head{
          display:flex;
          align-items:flex-start;
          justify-content:space-between;
          gap:10px;
        }


        .gic-side-head span{
          color:#8a99a8;

          font-size:6px;
          font-weight:900;

          letter-spacing:.7px;
        }


        .gic-side-head h3{
          margin:4px 0 0;

          font-size:14px;
          font-weight:900;
        }


        .gic-side-head a{
          color:var(--blue);

          font-size:8px;
          font-weight:850;

          text-decoration:none;
        }


        .gic-line{
          height:1px;

          margin:18px 0;

          background:#e9eef3;
        }


        .gic-side-info{
          margin:12px 0;

          display:flex;
          align-items:center;
          gap:10px;
        }


        .gic-side-info > i{
          width:35px;
          height:35px;

          display:grid;
          place-items:center;

          border-radius:9px;

          color:var(--blue);
          background:#edf6ff;
        }


        .gic-side-info div{
          display:flex;
          flex-direction:column;
        }


        .gic-side-info small{
          color:#8998a7;
          font-size:7px;
        }


        .gic-side-info strong{
          margin-top:2px;
          font-size:9px;
        }


        .gic-sidebar h4{
          margin-bottom:13px;

          font-size:10px;
          font-weight:900;
        }


        .gic-check{
          margin:11px 0;

          display:flex;
          align-items:center;
          gap:8px;

          color:#5f7387;

          font-size:8px;

          cursor:pointer;
        }


        .gic-check input{
          accent-color:var(--blue);
        }


        /* HELP */

        .gic-help{
          margin-top:23px;

          padding:18px;

          border-radius:15px;

          color:#fff;

          background:
            linear-gradient(
              135deg,
              #04345f,
              #076e78
            );
        }


        .gic-help-icon{
          width:39px;
          height:39px;

          margin-bottom:11px;

          display:grid;
          place-items:center;

          border-radius:10px;

          color:#063755;
          background:#ffbd00;

          font-size:16px;
        }


        .gic-help > span{
          color:#45e6cd;

          font-size:6px;
          font-weight:900;

          letter-spacing:.8px;
        }


        .gic-help h3{
          margin:4px 0 6px;

          font-size:14px;
          font-weight:900;
        }


        .gic-help p{
          margin:0 0 11px;

          color:#c3d8e2;

          font-size:8px;
          line-height:1.55;
        }


        .gic-help a{
          display:flex;
          align-items:center;
          gap:6px;

          color:#ffcc35;

          text-decoration:none;

          font-size:8px;
          font-weight:850;
        }


        /* ================= TOOLBAR ================= */

        .gic-toolbar{
          margin-bottom:16px;

          display:flex;
          align-items:center;
          justify-content:space-between;
          gap:20px;
        }


        .gic-toolbar > div:first-child > span{
          color:var(--blue);

          font-size:7px;
          font-weight:900;

          letter-spacing:.8px;
        }


        .gic-toolbar h2{
          margin:4px 0 2px;

          font-size:23px;
          font-weight:900;
        }


        .gic-toolbar p{
          margin:0;

          color:#7c8c9c;

          font-size:8px;
        }


        .gic-sort{
          width:205px;
          height:43px;

          padding:0 11px;

          display:flex;
          align-items:center;
          gap:7px;

          border-radius:10px;

          background:#fff;

          border:1px solid var(--line);
        }


        .gic-sort i{
          color:#7c91a5;
        }


        .gic-sort select{
          width:100%;
          height:100%;

          border:0;
          outline:0;

          background:transparent;

          color:#3c5369;

          font-size:8px;
          font-weight:750;
        }


        /* ================= MESSAGE ================= */

        .gic-message{
          margin-bottom:14px;

          padding:12px 14px;

          display:flex;
          align-items:center;
          gap:9px;

          border-radius:10px;

          color:#12604f;

          background:#eafaf6;

          border:1px solid #b9ebdf;

          font-size:8px;
        }


        .gic-message span{
          flex:1;
        }


        .gic-message button{
          border:0;
          background:transparent;

          color:#54776f;
        }


        /* ================= QUOTE CARD ================= */

        .gic-quote{
          position:relative;

          margin-bottom:14px;

          overflow:hidden;

          border-radius:18px;

          background:#fff;

          border:1px solid #dfe7ef;

          box-shadow:
            0 8px 25px
            rgba(25,55,85,.045);

          transition:.22s;
        }


        .gic-quote:hover{
          transform:translateY(-2px);

          border-color:#acd0f1;

          box-shadow:
            0 15px 38px
            rgba(25,55,85,.08);
        }


        .gic-badge{
          position:absolute;

          right:0;
          top:0;

          padding:6px 12px;

          display:flex;
          align-items:center;
          gap:5px;

          border-radius:
            0 17px 0 10px;

          color:#755500;

          background:#ffcf42;

          font-size:7px;
          font-weight:900;
        }


        .gic-quote-main{
          padding:22px;

          display:grid;

          grid-template-columns:
            2fr 1fr 1fr 1.35fr;

          align-items:center;

          gap:18px;
        }


        .gic-provider{
          display:flex;
          align-items:center;
          gap:11px;
        }


        .gic-provider-logo{
          width:50px;
          height:50px;

          flex:0 0 50px;

          display:grid;
          place-items:center;

          border-radius:13px;

          color:#fff;

          background:
            linear-gradient(
              135deg,
              #087cf0,
              #00b894
            );

          font-size:20px;
        }


        .gic-provider > div:last-child{
          display:flex;
          flex-direction:column;
        }


        .gic-provider small,
        .gic-stat small,
        .gic-premium small{
          color:#8b9aa9;

          font-size:6px;
          font-weight:850;

          letter-spacing:.5px;
        }


        .gic-provider h3{
          margin:3px 0 1px;

          font-size:12px;
          font-weight:900;
        }


        .gic-provider span{
          color:#6d8093;
          font-size:8px;
        }


        .gic-stat{
          display:flex;
          flex-direction:column;
        }


        .gic-stat strong{
          margin-top:4px;
          font-size:12px;
        }


        .gic-premium{
          display:flex;
          flex-wrap:wrap;
          align-items:baseline;
        }


        .gic-premium small{
          width:100%;
        }


        .gic-premium strong{
          margin-top:2px;

          color:#06477f;

          font-size:20px;
          font-weight:900;
        }


        .gic-premium > span{
          margin-left:3px;

          color:#8493a2;

          font-size:7px;
        }


        .gic-premium em{
          width:100%;

          margin-top:2px;

          color:#00a77f;

          font-size:7px;
          font-weight:750;

          font-style:normal;
        }


        /* BENEFITS */

        .gic-benefits{
          padding:12px 22px;

          display:flex;
          flex-wrap:wrap;

          gap:8px 18px;

          background:#f8fbfe;

          border-top:1px solid #edf2f6;
          border-bottom:1px solid #edf2f6;
        }


        .gic-benefits span{
          display:flex;
          align-items:center;
          gap:5px;

          color:#556c81;

          font-size:7px;
        }


        .gic-benefits i{
          color:#00aa81;
        }


        /* PLAN INFO */

        .gic-plan-info{
          padding:13px 22px;

          display:grid;

          grid-template-columns:
            repeat(3,1fr);

          gap:12px;
        }


        .gic-plan-detail{
          display:flex;
          flex-direction:column;
        }


        .gic-plan-detail small{
          color:#8b99a8;
          font-size:6px;
        }


        .gic-plan-detail strong{
          margin-top:2px;

          color:#42596f;

          font-size:8px;
        }


        /* CARD FOOTER */

        .gic-card-footer{
          padding:14px 22px;

          display:flex;
          align-items:center;
          justify-content:space-between;

          gap:15px;

          background:#fcfdff;

          border-top:1px solid #edf1f5;
        }


        .gic-compare-check{
          display:flex;
          align-items:center;
          gap:7px;

          color:#617589;

          font-size:8px;

          cursor:pointer;
        }


        .gic-compare-check input{
          accent-color:var(--blue);
        }


        .gic-card-actions{
          display:flex;
          gap:8px;
        }


        .gic-details,
        .gic-get-quote,
        .gic-view-plans,
        .gic-buy{
          min-height:41px;

          padding:0 14px;

          display:flex;
          align-items:center;
          justify-content:center;
          gap:7px;

          border-radius:9px;

          font-size:8px;
          font-weight:850;

          transition:.2s;
        }


        .gic-details{
          color:#536b80;

          background:#fff;

          border:1px solid #cedae5;
        }


        .gic-get-quote{
          color:var(--blue);

          background:#edf6ff;

          border:1px solid #b9d9f7;
        }


        .gic-view-plans{
          color:#075877;

          background:#e9fbf7;

          border:1px solid #a9e8db;
        }

        .gic-view-plans:disabled{
          opacity:.65;
          cursor:not-allowed;
        }


        .gic-buy{
          color:#fff;

          border:0;

          background:
            linear-gradient(
              135deg,
              #087cf0,
              #155be5
            );

          box-shadow:
            0 7px 17px
            rgba(8,124,240,.16);
        }


        .gic-buy:disabled{
          opacity:.65;
        }


        /* ================= DISCLAIMER ================= */

        .gic-disclaimer{
          margin-top:15px;

          padding:13px 15px;

          display:flex;
          align-items:flex-start;
          gap:9px;

          border-radius:10px;

          color:#748697;

          background:#edf3f7;

          font-size:7px;
          line-height:1.6;
        }


        .gic-disclaimer p{
          margin:0;
        }


        /* ================= EMPTY / ERROR ================= */

        .gic-empty,
        .gic-error{
          padding:55px 20px;

          text-align:center;

          border-radius:17px;

          background:#fff;

          border:1px solid var(--line);
        }


        .gic-empty > i,
        .gic-error > i{
          font-size:28px;
          color:#7aa8d3;
        }


        .gic-empty h3,
        .gic-error h3{
          margin:10px 0 4px;

          font-size:16px;
          font-weight:900;
        }


        .gic-empty p,
        .gic-error p{
          color:#7a8c9d;
          font-size:9px;
        }


        .gic-empty button,
        .gic-error button{
          margin-top:8px;

          padding:10px 15px;

          border:0;

          border-radius:8px;

          color:#fff;

          background:var(--blue);

          font-size:8px;
          font-weight:850;
        }


        /* ================= LOADING ================= */

        .gic-loading{
          padding:30px;

          text-align:center;

          border-radius:17px;

          background:#fff;

          border:1px solid var(--line);
        }


        .gic-spinner{
          width:40px;
          height:40px;

          margin:0 auto 12px;

          border-radius:50%;

          border:4px solid #e4edf5;

          border-top-color:var(--blue);

          animation:
            gicSpin .8s linear infinite;
        }


        .gic-loading strong{
          display:block;

          font-size:11px;
        }


        .gic-loading span{
          display:block;

          margin-top:4px;

          color:#8293a4;

          font-size:8px;
        }


        @keyframes gicSpin{

          to{
            transform:rotate(360deg);
          }

        }


        /* ================= COMPARE BAR ================= */

        .gic-compare-bar{
          position:fixed;

          left:50%;
          bottom:22px;

          z-index:1100;

          width:
            min(
              650px,
              calc(100% - 30px)
            );

          padding:12px 14px;

          display:flex;
          align-items:center;
          justify-content:space-between;

          gap:15px;

          transform:
            translateX(-50%);

          border-radius:15px;

          color:#fff;

          background:#062f58;

          box-shadow:
            0 18px 45px
            rgba(0,20,50,.28);
        }


        .gic-compare-left{
          display:flex;
          align-items:center;
          gap:9px;
        }


        .gic-count{
          width:35px;
          height:35px;

          display:grid;
          place-items:center;

          border-radius:9px;

          color:#063456;
          background:#4be5ce;

          font-size:11px;
          font-weight:900;
        }


        .gic-compare-left > div:last-child{
          display:flex;
          flex-direction:column;
        }


        .gic-compare-left strong{
          font-size:9px;
        }


        .gic-compare-left span{
          color:#b3cbd7;
          font-size:7px;
        }


        .gic-selected-icons{
          display:flex;
          gap:5px;
        }


        .gic-selected-icons div{
          width:29px;
          height:29px;

          display:grid;
          place-items:center;

          border-radius:7px;

          color:#45e3cb;

          background:
            rgba(255,255,255,.08);
        }


        .gic-compare-bar > button{
          min-height:39px;

          padding:0 14px;

          display:flex;
          align-items:center;
          gap:7px;

          border:0;

          border-radius:8px;

          color:#082d48;
          background:#ffbd00;

          font-size:8px;
          font-weight:900;
        }


        .gic-compare-bar > button:disabled{
          opacity:.45;
        }


        /* ================= MODAL ================= */

        .gic-modal-overlay{
          position:fixed;

          inset:0;

          z-index:2000;

          padding:20px;

          display:grid;
          place-items:center;

          background:
            rgba(2,24,47,.68);

          backdrop-filter:blur(5px);
        }


        .gic-modal{
          width:min(600px,100%);

          max-height:90vh;

          overflow:auto;

          padding:25px;

          border-radius:21px;

          background:#fff;

          box-shadow:
            0 25px 70px
            rgba(0,20,45,.32);
        }


        .gic-modal-head{
          display:flex;
          align-items:flex-start;
          justify-content:space-between;
          gap:15px;
        }


        .gic-modal-provider{
          display:flex;
          align-items:center;
          gap:11px;
        }


        .gic-modal-provider > div{
          width:48px;
          height:48px;

          display:grid;
          place-items:center;

          border-radius:12px;

          color:#fff;

          background:
            linear-gradient(
              135deg,
              #087cf0,
              #00b894
            );

          font-size:19px;
        }


        .gic-modal-provider section{
          display:flex;
          flex-direction:column;
        }


        .gic-modal-provider small{
          color:#8898a8;

          font-size:6px;
          font-weight:900;
        }


        .gic-modal-provider h3{
          margin:3px 0 1px;

          font-size:17px;
          font-weight:900;
        }


        .gic-modal-provider span{
          color:#6f8295;
          font-size:8px;
        }


        .gic-modal-head > button{
          width:35px;
          height:35px;

          border:0;

          border-radius:9px;

          color:#50677c;
          background:#f1f5f8;
        }


        .gic-modal-summary{
          margin:20px 0;

          padding:16px;

          display:grid;

          grid-template-columns:
            repeat(3,1fr);

          gap:10px;

          border-radius:13px;

          background:#eef7ff;
        }


        .gic-modal-stat{
          display:flex;
          flex-direction:column;
        }


        .gic-modal-stat small{
          color:#7d8e9e;

          font-size:6px;
          font-weight:850;
        }


        .gic-modal-stat strong{
          margin-top:3px;

          color:#075b9f;

          font-size:13px;
        }


        .gic-modal-section h4{
          margin-bottom:11px;

          font-size:10px;
          font-weight:900;
        }


        .gic-modal-benefits{
          display:grid;

          grid-template-columns:
            repeat(2,1fr);

          gap:9px;
        }


        .gic-modal-benefits div{
          display:flex;
          align-items:center;
          gap:6px;

          color:#566d82;

          font-size:8px;
        }


        .gic-modal-benefits i{
          color:#00aa80;
        }


        .gic-modal-grid{
          margin:20px 0;

          padding:14px;

          display:grid;

          grid-template-columns:
            repeat(3,1fr);

          gap:10px;

          border-radius:11px;

          border:1px solid #e1e9f0;
        }


        .gic-modal-detail{
          display:flex;
          flex-direction:column;
        }


        .gic-modal-detail small{
          color:#8998a7;
          font-size:6px;
        }


        .gic-modal-detail strong{
          margin-top:2px;

          color:#435a70;

          font-size:8px;
        }


        .gic-modal-premium{
          padding:14px;

          display:grid;

          grid-template-columns:
            repeat(3,1fr);

          gap:10px;

          border-radius:11px;

          background:#f7fafc;
        }


        .gic-modal-premium div{
          display:flex;
          flex-direction:column;
        }


        .gic-modal-premium small{
          color:#8595a5;
          font-size:6px;
        }


        .gic-modal-premium strong{
          margin-top:3px;
          font-size:10px;
        }


        .gic-modal-premium .total strong{
          color:#057b63;
          font-size:13px;
        }


        .gic-modal-actions{
          margin-top:18px;

          display:grid;

          grid-template-columns:
            1fr 1.4fr;

          gap:9px;
        }


        .gic-modal-quote,
        .gic-modal-buy{
          min-height:47px;

          display:flex;
          align-items:center;
          justify-content:center;
          gap:8px;

          border-radius:10px;

          font-size:9px;
          font-weight:900;
        }


        .gic-modal-quote{
          color:var(--blue);

          background:#edf6ff;

          border:1px solid #b9d9f7;
        }


        .gic-modal-buy{
          color:#fff;

          border:0;

          background:
            linear-gradient(
              135deg,
              #087cf0,
              #00a88b
            );
        }


        .gic-modal-note{
          margin:11px 0 0;

          display:flex;
          align-items:center;
          justify-content:center;
          gap:5px;

          color:#8796a5;

          font-size:7px;
        }


        .gic-modal-note i{
          color:#00a57d;
        }



        /* =========================================================
           GOSUBSIDY LARGE / PREMIUM DESKTOP SCALE
           The previous design used 6px–12px typography, which made
           the comparison page look unusually small on desktop.
           This override increases the visual hierarchy while
           preserving the existing structure and mobile behavior.
        ========================================================= */

        @media(min-width:992px){

          .gic-content{
            padding:34px 0 90px;
          }

          .gic-breadcrumb{
            font-size:11px;
            gap:10px;
            margin-bottom:28px;
          }

          .gic-breadcrumb > i{
            font-size:8px;
          }

          .gic-eyebrow{
            font-size:10px;
            gap:8px;
          }

          .gic-hero{
            padding:52px 0 56px;
          }

          .gic-hero h1{
            font-size:52px;
            line-height:1.08;
            letter-spacing:-1.8px;
          }

          .gic-hero p{
            font-size:14px;
            line-height:1.65;
          }

          .gic-reference{
            padding:20px;
            border-radius:18px;
          }

          .gic-reference-icon{
            width:54px;
            height:54px;
            flex-basis:54px;
            font-size:22px;
          }

          .gic-reference small{
            font-size:8px;
          }

          .gic-reference strong{
            font-size:17px;
          }

          .gic-reference span{
            font-size:10px;
          }

          .gic-demo-notice{
            padding:16px 18px;
            border-radius:13px;
          }

          .gic-demo-notice strong{
            font-size:11px;
          }

          .gic-demo-notice span{
            font-size:10px;
          }

          .gic-sidebar{
            padding:28px;
            border-radius:20px;
          }

          .gic-sidebar h4{
            font-size:14px;
          }

          .gic-sidebar,
          .gic-sidebar span,
          .gic-sidebar small{
            font-size:10px;
          }

          .gic-quote{
            margin-bottom:18px;
            border-radius:20px;
          }

          .gic-quote-main{
            padding:28px;
            gap:24px;
          }

          .gic-provider{
            gap:14px;
          }

          .gic-provider-logo{
            width:62px;
            height:62px;
            flex-basis:62px;
            border-radius:15px;
            font-size:24px;
          }

          .gic-provider small,
          .gic-stat small,
          .gic-premium small{
            font-size:8px;
          }

          .gic-provider h3{
            font-size:16px;
            margin:4px 0 2px;
          }

          .gic-provider span{
            font-size:10px;
          }

          .gic-stat strong{
            margin-top:5px;
            font-size:15px;
          }

          .gic-premium strong{
            font-size:26px;
          }

          .gic-premium > span{
            font-size:9px;
          }

          .gic-premium em{
            font-size:9px;
          }

          .gic-badge{
            padding:7px 14px;
            font-size:9px;
          }

          .gic-benefits{
            padding:14px 28px;
            gap:10px 24px;
          }

          .gic-benefits span{
            font-size:9px;
            gap:6px;
          }

          .gic-plan-info{
            padding:16px 28px;
            gap:18px;
          }

          .gic-plan-detail small{
            font-size:8px;
          }

          .gic-plan-detail strong{
            font-size:10px;
          }

          .gic-card-footer{
            padding:16px 28px;
            gap:18px;
          }

          .gic-compare-check{
            font-size:10px;
          }

          .gic-card-actions{
            gap:10px;
          }

          .gic-details,
          .gic-get-quote,
          .gic-view-plans,
          .gic-buy{
            min-height:46px;
            padding:0 17px;
            border-radius:10px;
            font-size:10px;
          }

          .gic-loading{
            padding:40px;
          }

          .gic-loading strong{
            font-size:14px;
          }

          .gic-loading span{
            font-size:10px;
          }
        }

        /* =========================================================
           EXTRA-WIDE SCREENS
        ========================================================= */

        @media(min-width:1400px){
          .gic-hero h1{
            font-size:56px;
          }

          .gic-hero p{
            font-size:15px;
          }

          .gic-quote-main{
            padding:30px;
          }

          .gic-provider h3{
            font-size:17px;
          }

          .gic-stat strong{
            font-size:16px;
          }

          .gic-premium strong{
            font-size:28px;
          }
        }

        /* ================= RESPONSIVE ================= */

        @media(max-width:991px){

          .gic-sidebar{
            position:static;
          }

          .gic-quote-main{
            grid-template-columns:
              repeat(2,1fr);
          }

        }


        @media(max-width:767px){

          .gic-hero h1{
            font-size:35px;
          }

          .gic-toolbar{
            align-items:flex-start;
            flex-direction:column;
          }

          .gic-sort{
            width:100%;
          }

          .gic-quote-main{
            grid-template-columns:1fr;
          }

          .gic-plan-info{
            grid-template-columns:1fr;
          }

          .gic-card-footer{
            align-items:flex-start;
            flex-direction:column;
          }

          .gic-card-actions{
            width:100%;
            flex-wrap:wrap;
          }

          .gic-details,
          .gic-get-quote,
          .gic-buy{
            flex:1;
          }

          .gic-selected-icons{
            display:none;
          }

        }


        @media(max-width:575px){

          .gic-hero{
            padding:32px 0 36px;
          }

          .gic-hero h1{
            font-size:30px;
          }

          .gic-hero h1 span{
            display:block;
            margin-left:0;
          }

          .gic-modal-summary,
          .gic-modal-benefits,
          .gic-modal-grid,
          .gic-modal-premium,
          .gic-modal-actions{
            grid-template-columns:1fr;
          }

          .gic-compare-bar{
            bottom:10px;
          }

        }

      `}</style>

    </>
  );
}


/* =========================================================
   QUOTE CARD
========================================================= */

function QuoteCard({
  quote,
  selected,
  onCompare,
  onDetails,
  onGetQuote,
  onViewPlans,
  onBuy,
  providerLoading,
  checkoutLoading,
}) {

  return (

    <article className="gic-quote">


      {quote.badge && (

        <div className="gic-badge">

          <i className="bi bi-star-fill"></i>

          {quote.badge}

        </div>

      )}


      <div className="gic-quote-main">


        {/* PROVIDER */}

        <div className="gic-provider">

          <div className="gic-provider-logo">

            {quote.insurerLogo ? (

              <img
                src={quote.insurerLogo}
                alt={quote.insurerName}
              />

            ) : (

              <i className="bi bi-shield-check"></i>

            )}

          </div>


          <div>

            <small>
              INSURANCE PROVIDER
            </small>

            <h3>
              {quote.insurerName}
            </h3>

            <span>
              {quote.productName}
            </span>

          </div>

        </div>


        {/* COVER */}

        <div className="gic-stat">

          <small>
            SUM INSURED
          </small>

          <strong>
            {money(
              quote.sumInsured
            )}
          </strong>

        </div>


        {/* NETWORK */}

        <div className="gic-stat">

          <small>
            NETWORK
          </small>

          <strong>
            {quote.networkHospitals}
          </strong>

        </div>


        {/* PREMIUM */}

        <div className="gic-premium">

          <small>
            PREMIUM FROM
          </small>

          <strong>
            {money(
              quote.premium.total
            )}
          </strong>

          <span>
            / year
          </span>

          <em>

            Approx.{" "}

            {money(
              quote.monthlyPremium
            )}

            /month

          </em>

        </div>


      </div>


      {/* BENEFITS */}

      <div className="gic-benefits">

        {quote.features
          .slice(0, 4)
          .map((feature) => (

            <span key={feature}>

              <i className="bi bi-check-circle-fill"></i>

              {feature}

            </span>

          ))}

      </div>


      {/* PLAN DETAILS */}

      <div className="gic-plan-info">

        <PlanInfo
          label="Waiting Period"
          value={quote.waitingPeriod}
        />

        <PlanInfo
          label="Room Rent"
          value={quote.roomRent}
        />

        <PlanInfo
          label="Claims Assistance"
          value={quote.claimSupport}
        />

      </div>


      {/* FOOTER */}

      <div className="gic-card-footer">


        <label className="gic-compare-check">

          <input
            type="checkbox"
            checked={selected}
            onChange={onCompare}
          />

          <span>
            Add to Compare
          </span>

        </label>


        <div className="gic-card-actions">


          <button
            type="button"
            className="gic-details"
            onClick={onDetails}
          >
            View Details
          </button>


          <button
            type="button"
            className="gic-get-quote"
            onClick={onGetQuote}
          >

            <i className="bi bi-file-earmark-text"></i>

            Get Quote

          </button>


          <button
            type="button"
            className="gic-view-plans"
            disabled={providerLoading}
            onClick={onViewPlans}
          >

            {providerLoading ? (
              <>
                <span
                  className="spinner-border spinner-border-sm"
                ></span>

                Opening...
              </>
            ) : (
              <>
                <i className="bi bi-box-arrow-up-right"></i>

                View Plans

                <i className="bi bi-arrow-right"></i>
              </>
            )}

          </button>


          <button
            type="button"
            className="gic-buy"
            disabled={checkoutLoading}
            onClick={onBuy}
          >

            {checkoutLoading ? (

              <>
                <span
                  className="spinner-border spinner-border-sm"
                ></span>

                Connecting...
              </>

            ) : (

              <>

                <i className="bi bi-lightning-charge-fill"></i>

                Buy Online

                <i className="bi bi-arrow-right"></i>

              </>

            )}

          </button>


        </div>

      </div>


    </article>

  );
}


/* =========================================================
   SIDEBAR INFO
========================================================= */

function SideInfo({
  icon,
  label,
  value,
}) {

  return (

    <div className="gic-side-info">

      <i className={`bi ${icon}`}></i>

      <div>

        <small>
          {label}
        </small>

        <strong>
          {value}
        </strong>

      </div>

    </div>

  );
}


/* =========================================================
   PLAN INFO
========================================================= */

function PlanInfo({
  label,
  value,
}) {

  return (

    <div className="gic-plan-detail">

      <small>
        {label}
      </small>

      <strong>
        {value}
      </strong>

    </div>

  );
}


/* =========================================================
   MODAL STAT
========================================================= */

function ModalStat({
  label,
  value,
}) {

  return (

    <div className="gic-modal-stat">

      <small>
        {label}
      </small>

      <strong>
        {value}
      </strong>

    </div>

  );
}


/* =========================================================
   MODAL DETAIL
========================================================= */

function ModalDetail({
  label,
  value,
}) {

  return (

    <div className="gic-modal-detail">

      <small>
        {label}
      </small>

      <strong>
        {value}
      </strong>

    </div>

  );
}


/* =========================================================
   LOADING
========================================================= */

function QuoteLoading() {

  return (

    <div className="gic-loading">

      <div className="gic-spinner"></div>

      <strong>
        Finding Insurance Plans
      </strong>

      <span>
        Checking available insurance
        options for your requirement...
      </span>

    </div>

  );
}