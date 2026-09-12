// ======================================================
// GoSubsidy - Intelligent Scheme Matching Service
// ======================================================

import { createClient } from "@supabase/supabase-js";

// ======================================================
// SUPABASE CLIENT
// ======================================================

const supabaseUrl = process.env.SUPABASE_URL;

const supabaseKey =
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
  process.env.SUPABASE_ANON_KEY;

let supabase = null;

if (supabaseUrl && supabaseKey) {
  supabase = createClient(supabaseUrl, supabaseKey);
}

// ======================================================
// NORMALIZE TEXT
// ======================================================

const normalize = (value = "") => {
  return String(value)
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ");
};

// ======================================================
// SAFE TEXT
// ======================================================

const safeText = (value) => {
  if (value === null || value === undefined) {
    return "";
  }

  if (Array.isArray(value)) {
    return value.join(" ");
  }

  if (typeof value === "object") {
    return JSON.stringify(value);
  }

  return String(value);
};

// ======================================================
// BUSINESS KEYWORD MAP
// ======================================================

const BUSINESS_KEYWORDS = {
  agriculture: [
    "agriculture",
    "agricultural",
    "agri",
    "farmer",
    "farmers",
    "farming",
    "farm",
    "horticulture",
    "irrigation",
    "crop",
    "cultivation",
    "agri infrastructure",
    "agriculture infrastructure",
  ],

  poultry: [
    "poultry",
    "broiler",
    "broilers",
    "layer",
    "layers",
    "chicken",
    "poultry farm",
    "poultry farming",
    "animal husbandry",
    "livestock",
    "bird",
    "birds",
    "hatchery",
  ],

  dairy: [
    "dairy",
    "dairy farm",
    "dairy farming",
    "milk",
    "milk processing",
    "cattle",
    "buffalo",
    "cow",
    "animal husbandry",
    "livestock",
    "dairy processing",
    "milk chilling",
  ],

  "food processing": [
    "food processing",
    "food processor",
    "food processors",
    "food industry",
    "food industries",
    "agro processing",
    "agri processing",
    "agro food",
    "value addition",
    "food preservation",
    "food manufacturing",
    "processing unit",
    "processing units",
    "cold chain",
    "integrated cold chain",
    "cold storage",
    "food storage",
    "warehouse",
    "warehousing",
    "packaging",
    "pack house",
    "food infrastructure",
    "processing infrastructure",
    "pmfme",
    "pmksy",
    "pradhan mantri kisan sampada yojana",
    "mofpi",
    "ministry of food processing industries",
  ],

  msme: [
    "msme",
    "micro enterprise",
    "micro enterprises",
    "small enterprise",
    "small enterprises",
    "medium enterprise",
    "medium enterprises",
    "micro small medium enterprises",
    "manufacturing enterprise",
    "service enterprise",
    "entrepreneur",
    "entrepreneurs",
    "udyam",
  ],

  solar: [
    "solar",
    "solar energy",
    "solar power",
    "renewable energy",
    "photovoltaic",
    "solar pv",
    "rooftop solar",
    "solar plant",
    "solar project",
  ],
};

// ======================================================
// BUSINESS ALIASES
// ======================================================

const BUSINESS_ALIASES = {
  "food-processing": "food processing",
  foodprocessing: "food processing",
  "food industry": "food processing",

  agri: "agriculture",
  farming: "agriculture",

  "poultry farming": "poultry",
  "poultry farm": "poultry",

  "dairy farming": "dairy",
  "dairy farm": "dairy",

  "renewable energy": "solar",
};

// ======================================================
// GET BUSINESS KEYWORDS
// ======================================================

const getBusinessKeywords = (business) => {
  let normalizedBusiness = normalize(business);

  if (!normalizedBusiness) {
    return [];
  }

  if (BUSINESS_ALIASES[normalizedBusiness]) {
    normalizedBusiness =
      BUSINESS_ALIASES[normalizedBusiness];
  }

  const keywords =
    BUSINESS_KEYWORDS[normalizedBusiness] || [];

  return [
    normalizedBusiness,
    ...keywords.map((keyword) => normalize(keyword)),
  ].filter(Boolean);
};

// ======================================================
// BUILD SEARCHABLE SCHEME TEXT
// ======================================================

const buildSchemeText = (scheme) => {
  const fields = [
    scheme.scheme_name,
    scheme.name,

    scheme.category,
    scheme.scheme_category,

    scheme.ministry,
    scheme.department,

    scheme.beneficiary,
    scheme.beneficiaries,

    scheme.sector,
    scheme.sub_sector,

    scheme.description,
    scheme.objective,

    scheme.benefits,
    scheme.benefit_amount,

    scheme.eligibility,

    scheme.state_applicability,
    scheme.applicable_states,

    scheme.tags,
    scheme.keywords,
  ];

  return normalize(
    fields
      .map((field) => safeText(field))
      .filter(Boolean)
      .join(" ")
  );
};

// ======================================================
// STATE MATCH
// ======================================================

const checkStateMatch = (scheme, userState) => {
  if (!userState) {
    return {
      matched: true,
      score: 0,
      reason: "No state filter",
    };
  }

  const state = normalize(userState);

  const stateField = normalize(
    [
      safeText(scheme.state_applicability),
      safeText(scheme.applicable_states),
    ].join(" ")
  );

  // --------------------------------------------------
  // No state restriction available
  // --------------------------------------------------

  if (!stateField) {
    return {
      matched: true,
      score: 5,
      reason: "No state restriction specified",
    };
  }

  // --------------------------------------------------
  // Central / National schemes
  // --------------------------------------------------

  const centralTerms = [
    "all india",
    "all states",
    "all state",
    "pan india",
    "pan india scheme",
    "nationwide",
    "national",
    "central government",
    "central sector",
    "centrally sponsored",
    "india",
  ];

  const isCentralScheme = centralTerms.some((term) =>
    stateField.includes(normalize(term))
  );

  if (isCentralScheme) {
    return {
      matched: true,
      score: 15,
      reason: "Central / All India scheme",
    };
  }

  // --------------------------------------------------
  // Exact state
  // --------------------------------------------------

  if (stateField.includes(state)) {
    return {
      matched: true,
      score: 25,
      reason: `Applicable to ${userState}`,
    };
  }

  return {
    matched: false,
    score: 0,
    reason: `Not marked applicable to ${userState}`,
  };
};

// ======================================================
// BUSINESS MATCH
// ======================================================

const checkBusinessMatch = (scheme, business) => {
  const keywords = getBusinessKeywords(business);

  if (!keywords.length) {
    return {
      matched: true,
      score: 0,
      matchedKeywords: [],
    };
  }

  const schemeText = buildSchemeText(scheme);

  const matchedKeywords = [
    ...new Set(
      keywords.filter((keyword) =>
        schemeText.includes(keyword)
      )
    ),
  ];

  if (!matchedKeywords.length) {
    return {
      matched: false,
      score: 0,
      matchedKeywords: [],
    };
  }

  // --------------------------------------------------
  // SCORE BUSINESS RELEVANCE
  // --------------------------------------------------

  let score = 20;

  const exactBusiness = normalize(business);

  if (
    exactBusiness &&
    schemeText.includes(exactBusiness)
  ) {
    score += 25;
  }

  score += Math.min(
    matchedKeywords.length * 7,
    35
  );

  return {
    matched: true,
    score: Math.min(score, 70),
    matchedKeywords,
  };
};

// ======================================================
// STATUS CHECK
// ======================================================

const isActiveScheme = (scheme) => {
  if (!scheme.status) {
    return true;
  }

  const status = normalize(scheme.status);

  // Explicitly reject clearly inactive schemes

  const inactiveTerms = [
    "inactive",
    "closed",
    "expired",
    "discontinued",
    "archived",
  ];

  if (
    inactiveTerms.some((term) =>
      status.includes(term)
    )
  ) {
    return false;
  }

  return true;
};

// ======================================================
// VERIFIED DATA BONUS
// ======================================================

const getVerificationScore = (scheme) => {
  let score = 0;

  if (scheme.official_website) {
    score += 3;
  }

  if (scheme.official_apply_link) {
    score += 3;
  }

  if (scheme.official_guideline_pdf) {
    score += 3;
  }

  if (scheme.last_verified_date) {
    score += 3;
  }

  return score;
};

// ======================================================
// CALCULATE MATCH
// ======================================================

const calculateMatch = (scheme, context) => {
  const businessResult = checkBusinessMatch(
    scheme,
    context.business
  );

  const stateResult = checkStateMatch(
    scheme,
    context.state
  );

  // --------------------------------------------------
  // STATE IS A HARD FILTER
  // --------------------------------------------------

  if (!stateResult.matched) {
    return null;
  }

  // --------------------------------------------------
  // BUSINESS RELEVANCE
  // --------------------------------------------------

  if (!businessResult.matched) {
    return null;
  }

  let score =
    businessResult.score +
    stateResult.score +
    getVerificationScore(scheme);

  return {
    ...scheme,

    match_score: Math.min(score, 100),

    match_reasons: {
      business_keywords:
        businessResult.matchedKeywords,

      state:
        stateResult.reason,

      requested_business:
        context.business || "",

      requested_state:
        context.state || "",
    },
  };
};

// ======================================================
// MAIN MATCHING FUNCTION
// ======================================================

export const findMatchingSchemes = async (
  context = {},
  limit = 10
) => {
  try {
    // --------------------------------------------------
    // CHECK SUPABASE
    // --------------------------------------------------

    if (!supabase) {
      console.error(
        "❌ SUPABASE_URL or Supabase key is missing."
      );

      return [];
    }

    // --------------------------------------------------
    // NORMALIZE USER CONTEXT
    // --------------------------------------------------

    const business =
      context.business ||
      context.category ||
      context.sector ||
      context.businessType ||
      "";

    const state =
      context.state || "";

    const projectCost =
      Number(
        context.projectCost ||
          context.investment ||
          0
      ) || 0;

    console.log("");
    console.log(
      "========================================"
    );

    console.log(
      "🔎 GoSubsidy Intelligent Scheme Matcher"
    );

    console.log(
      "========================================"
    );

    console.log("🏭 Business:", business);
    console.log("📍 State:", state);
    console.log(
      "💰 Project Cost:",
      projectCost
    );

    console.log(
      "========================================"
    );

    // --------------------------------------------------
    // FETCH DATABASE
    // --------------------------------------------------

    console.log(
      "🔵 Searching GoSubsidy Supabase database..."
    );

    const { data, error } = await supabase
      .from("schemes")
      .select("*");

    if (error) {
      console.error(
        "❌ Supabase scheme fetch error:",
        error
      );

      throw error;
    }

    const schemes = data || [];

    console.log(
      `📚 Schemes loaded from Supabase: ${schemes.length}`
    );

    // --------------------------------------------------
    // DEBUG EACH SCHEME
    // --------------------------------------------------

    schemes.forEach((scheme) => {
      const name =
        scheme.scheme_name ||
        scheme.name ||
        "Unnamed Scheme";

      const businessResult =
        checkBusinessMatch(
          scheme,
          business
        );

      const stateResult =
        checkStateMatch(
          scheme,
          state
        );

      console.log("");
      console.log(`📋 Checking: ${name}`);

      console.log(
        "   Business:",
        businessResult.matched
          ? "✅"
          : "❌"
      );

      if (
        businessResult.matchedKeywords.length
      ) {
        console.log(
          "   Keywords:",
          businessResult.matchedKeywords.join(
            ", "
          )
        );
      }

      console.log(
        "   State:",
        stateResult.matched
          ? `✅ ${stateResult.reason}`
          : `❌ ${stateResult.reason}`
      );
    });

    // --------------------------------------------------
    // MATCH
    // --------------------------------------------------

    const matches = schemes
      .filter(isActiveScheme)

      .map((scheme) =>
        calculateMatch(scheme, {
          business,
          state,
          projectCost,
        })
      )

      .filter(Boolean)

      .sort(
        (a, b) =>
          b.match_score -
          a.match_score
      )

      .slice(0, limit);

    console.log("");
    console.log(
      "========================================"
    );

    console.log(
      `✅ Matching schemes found: ${matches.length}`
    );

    matches.forEach(
      (scheme, index) => {
        console.log(
          `${index + 1}. ${
            scheme.scheme_name ||
            scheme.name ||
            "Unnamed Scheme"
          }`
        );

        console.log(
          `   Match Score: ${scheme.match_score}%`
        );

        console.log(
          `   Keywords: ${
            scheme.match_reasons
              ?.business_keywords
              ?.join(", ") || "None"
          }`
        );

        console.log(
          `   State: ${
            scheme.match_reasons
              ?.state || ""
          }`
        );
      }
    );

    console.log(
      "========================================"
    );

    return matches;
  } catch (error) {
    console.error("");
    console.error(
      "❌ GoSubsidy Scheme Matcher Error:"
    );

    console.error(error);

    return [];
  }
};

export default findMatchingSchemes;