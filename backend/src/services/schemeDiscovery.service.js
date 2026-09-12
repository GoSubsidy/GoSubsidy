// ============================================================
// GoSubsidy - Scheme Discovery V4.3
// BLOCK 1
// SMART PAGE VERIFICATION ENGINE
// ============================================================
//
// Purpose:
// ------------------------------------------------------------
// V4.2 correctly removed many false positives.
//
// V4.3 adds a second layer:
//     TITLE / URL
//          ↓
//     FETCH REAL PAGE
//          ↓
//     READ PAGE CONTENT
//          ↓
//     VERIFY WHETHER IT IS ACTUALLY A SCHEME
//
// IMPORTANT:
// ------------------------------------------------------------
// This block DOES NOT:
//   - create schemes
//   - update schemes
//   - delete schemes
//   - write to Supabase
//   - replace V4.2 yet
//
// It only provides the verification engine that Block 2,
// Block 3 and Block 4 will use.
//
// ============================================================


// ============================================================
// VERIFICATION CONFIGURATION
// ============================================================

const VERIFICATION_TIMEOUT =
  Number(
    process.env.SCHEME_VERIFICATION_TIMEOUT ||
      15000
  );

const MAX_PAGE_TEXT_LENGTH =
  Number(
    process.env.SCHEME_VERIFICATION_MAX_TEXT ||
      120000
  );

const VERIFICATION_USER_AGENT =
  process.env.SCHEME_DISCOVERY_USER_AGENT ||
  "GoSubsidy Government Scheme Verification/4.3";


// ============================================================
// FETCH PAGE FOR VERIFICATION
// ============================================================

async function fetchVerificationPage(
  url
) {
  const controller =
    new AbortController();

  const timeout =
    setTimeout(
      () =>
        controller.abort(),
      VERIFICATION_TIMEOUT
    );

  try {
    const response =
      await fetch(
        url,
        {
          method:
            "GET",

          headers: {
            Accept:
              "text/html,application/xhtml+xml",

            "User-Agent":
              VERIFICATION_USER_AGENT,
          },

          redirect:
            "follow",

          signal:
            controller.signal,
        }
      );

    if (
      !response.ok
    ) {
      const error =
        new Error(
          `HTTP ${response.status} ${response.statusText}`
        );

      error.status =
        response.status;

      throw error;
    }

    const html =
      await response.text();

    return {
      html,

      finalUrl:
        response.url ||
        url,

      status:
        response.status,
    };
  } finally {
    clearTimeout(
      timeout
    );
  }
}


// ============================================================
// CLEAN PAGE TEXT
// ============================================================

function cleanPageText(
  value
) {
  if (
    value === null ||
    value === undefined
  ) {
    return "";
  }

  return String(
    value
  )
    // Remove scripts
    .replace(
      /<script\b[^>]*>[\s\S]*?<\/script>/gi,
      " "
    )

    // Remove styles
    .replace(
      /<style\b[^>]*>[\s\S]*?<\/style>/gi,
      " "
    )

    // Remove noscript
    .replace(
      /<noscript\b[^>]*>[\s\S]*?<\/noscript>/gi,
      " "
    )

    // Remove SVG
    .replace(
      /<svg\b[^>]*>[\s\S]*?<\/svg>/gi,
      " "
    )

    // Remove comments
    .replace(
      /<!--[\s\S]*?-->/g,
      " "
    )

    // Remove HTML tags
    .replace(
      /<[^>]*>/g,
      " "
    )

    // Decode common HTML entities
    .replace(
      /&nbsp;/gi,
      " "
    )

    .replace(
      /&amp;/gi,
      "&"
    )

    .replace(
      /&quot;/gi,
      '"'
    )

    .replace(
      /&#39;/gi,
      "'"
    )

    .replace(
      /&#x27;/gi,
      "'"
    )

    .replace(
      /&lt;/gi,
      "<"
    )

    .replace(
      /&gt;/gi,
      ">"
    )

    // Normalize whitespace
    .replace(
      /\s+/g,
      " "
    )

    .trim();
}


// ============================================================
// EXTRACT HTML TITLE
// ============================================================

function extractPageTitle(
  html
) {
  if (!html) {
    return "";
  }

  const match =
    html.match(
      /<title\b[^>]*>([\s\S]*?)<\/title>/i
    );

  if (!match) {
    return "";
  }

  return cleanPageText(
    match[1]
  );
}


// ============================================================
// EXTRACT META DESCRIPTION
// ============================================================

function extractMetaDescription(
  html
) {
  if (!html) {
    return "";
  }

  const patterns = [
    /<meta\b[^>]*name=["']description["'][^>]*content=["']([^"']*)["'][^>]*>/i,

    /<meta\b[^>]*content=["']([^"']*)["'][^>]*name=["']description["'][^>]*>/i,

    /<meta\b[^>]*property=["']og:description["'][^>]*content=["']([^"']*)["'][^>]*>/i,

    /<meta\b[^>]*content=["']([^"']*)["'][^>]*property=["']og:description["'][^>]*>/i,
  ];

  for (
    const pattern of
    patterns
  ) {
    const match =
      html.match(
        pattern
      );

    if (
      match &&
      match[1]
    ) {
      return cleanPageText(
        match[1]
      );
    }
  }

  return "";
}


// ============================================================
// EXTRACT META KEYWORDS
// ============================================================

function extractMetaKeywords(
  html
) {
  if (!html) {
    return "";
  }

  const patterns = [
    /<meta\b[^>]*name=["']keywords["'][^>]*content=["']([^"']*)["'][^>]*>/i,

    /<meta\b[^>]*content=["']([^"']*)["'][^>]*name=["']keywords["'][^>]*>/i,
  ];

  for (
    const pattern of
    patterns
  ) {
    const match =
      html.match(
        pattern
      );

    if (
      match &&
      match[1]
    ) {
      return cleanPageText(
        match[1]
      );
    }
  }

  return "";
}


// ============================================================
// EXTRACT MAIN PAGE TEXT
// ============================================================
//
// We prefer:
//   <main>
//   <article>
//   <body>
//
// This prevents navigation/footer text from dominating
// the verification score.
// ============================================================

function extractMainPageText(
  html
) {
  if (!html) {
    return "";
  }

  const containers = [
    /<main\b[^>]*>([\s\S]*?)<\/main>/i,

    /<article\b[^>]*>([\s\S]*?)<\/article>/i,

    /<body\b[^>]*>([\s\S]*?)<\/body>/i,
  ];

  for (
    const pattern of
    containers
  ) {
    const match =
      html.match(
        pattern
      );

    if (
      match &&
      match[1]
    ) {
      const text =
        cleanPageText(
          match[1]
        );

      if (
        text.length >
        100
      ) {
        return text.slice(
          0,
          MAX_PAGE_TEXT_LENGTH
        );
      }
    }
  }

  return cleanPageText(
    html
  ).slice(
    0,
    MAX_PAGE_TEXT_LENGTH
  );
}


// ============================================================
// EXTRACT PAGE SIGNALS
// ============================================================
//
// These are individual evidence signals.
// They are deliberately kept separate so V4.3 can explain
// WHY a candidate was accepted or rejected.
// ============================================================

const SCHEME_PAGE_SIGNALS = [
  {
    id:
      "scheme",

    weight:
      5,

    patterns: [
      /\bgovernment scheme\b/i,

      /\bgovernment schemes\b/i,

      /\bscheme details\b/i,

      /\bscheme information\b/i,

      /\bscheme benefits\b/i,

      /\bscheme guidelines\b/i,

      /\bscheme eligibility\b/i,

      /\bscheme objective\b/i,

      /\bscheme objectives\b/i,
    ],
  },

  {
    id:
      "yojana",

    weight:
      5,

    patterns: [
      /\byojana\b/i,

      /\byojna\b/i,
    ],
  },

  {
    id:
      "programme",

    weight:
      4,

    patterns: [
      /\bgovernment programme\b/i,

      /\bgovernment program\b/i,

      /\bcentral government programme\b/i,

      /\bcentral government program\b/i,

      /\bgovernment initiative\b/i,

      /\bgovernment mission\b/i,
    ],
  },

  {
    id:
      "beneficiary",

    weight:
      4,

    patterns: [
      /\bbeneficiar(?:y|ies)\b/i,

      /\btarget beneficiaries\b/i,

      /\btarget group\b/i,

      /\beligible beneficiaries\b/i,

      /\bwho can benefit\b/i,

      /\bwho can apply\b/i,

      /\btargeted beneficiaries\b/i,
    ],
  },

  {
    id:
      "eligibility",

    weight:
      4,

    patterns: [
      /\beligibility\b/i,

      /\beligible\b/i,

      /\beligible applicants\b/i,

      /\beligible beneficiaries\b/i,

      /\beligibility criteria\b/i,

      /\bcriteria for eligibility\b/i,

      /\bwho is eligible\b/i,
    ],
  },

  {
    id:
      "benefits",

    weight:
      4,

    patterns: [
      /\bbenefits?\b/i,

      /\bfinancial benefit\b/i,

      /\bfinancial assistance\b/i,

      /\bfinancial support\b/i,

      /\bmonetary benefit\b/i,

      /\bsubsid(?:y|ies)\b/i,

      /\bgrant assistance\b/i,

      /\bincentive\b/i,

      /\binterest subsidy\b/i,

      /\bcapital subsidy\b/i,

      /\bcredit linked subsidy\b/i,
    ],
  },

  {
    id:
      "application",

    weight:
      3,

    patterns: [
      /\bhow to apply\b/i,

      /\bapply online\b/i,

      /\bapplication process\b/i,

      /\bapplication procedure\b/i,

      /\bapply for\b/i,

      /\bonline application\b/i,

      /\bapplication form\b/i,
    ],
  },

  {
    id:
      "documents",

    weight:
      2,

    patterns: [
      /\bdocuments required\b/i,

      /\brequired documents\b/i,

      /\bdocument checklist\b/i,

      /\bdocuments needed\b/i,
    ],
  },

  {
    id:
      "ministry",

    weight:
      2,

    patterns: [
      /\bministry of\b/i,

      /\bdepartment of\b/i,

      /\bnodal ministry\b/i,

      /\bimplementing agency\b/i,

      /\bimplementing department\b/i,
    ],
  },

  {
    id:
      "objective",

    weight:
      3,

    patterns: [
      /\bobjective of the scheme\b/i,

      /\bscheme objective\b/i,

      /\bobjective of the programme\b/i,

      /\bobjective of the program\b/i,

      /\bpurpose of the scheme\b/i,

      /\baim of the scheme\b/i,

      /\babout the scheme\b/i,
    ],
  },
];


// ============================================================
// NON-SCHEME PAGE SIGNALS
// ============================================================
//
// These are strong negative signals.
// ============================================================

const NON_SCHEME_PAGE_SIGNALS = [
  {
    id:
      "tracking",

    weight:
      8,

    patterns: [
      /\btracking system\b/i,

      /\bpayment tracking\b/i,

      /\bapplication tracking\b/i,

      /\bstatus tracking\b/i,

      /\btrack application\b/i,

      /\btrack your application\b/i,

      /\btrack payment\b/i,
    ],
  },

  {
    id:
      "portal",

    weight:
      6,

    patterns: [
      /\bservice portal\b/i,

      /\bgovernment portal\b/i,

      /\bemployee portal\b/i,

      /\bbeneficiary portal\b/i,

      /\buser portal\b/i,

      /\blogin portal\b/i,

      /\bportal login\b/i,
    ],
  },

  {
    id:
      "accessibility",

    weight:
      10,

    patterns: [
      /\bscreen reader\b/i,

      /\baccessibility statement\b/i,

      /\baccessibility options\b/i,

      /\baccessible website\b/i,
    ],
  },

  {
    id:
      "navigation",

    weight:
      8,

    patterns: [
      /\bsite map\b/i,

      /\bsitemap\b/i,

      /\bcontact us\b/i,

      /\babout us\b/i,

      /\bprivacy policy\b/i,

      /\bterms and conditions\b/i,

      /\bdisclaimer\b/i,

      /\bfrequently asked questions\b/i,

      /\bfrequently asked question\b/i,
    ],
  },

  {
    id:
      "directory",

    weight:
      7,

    patterns: [
      /\bdirectory\b/i,

      /\bdirectory of\b/i,

      /\bsearch directory\b/i,

      /\bdepartment directory\b/i,
    ],
  },

  {
    id:
      "calendar",

    weight:
      7,

    patterns: [
      /\bcalendar\b/i,

      /\bevent calendar\b/i,

      /\bholiday calendar\b/i,
    ],
  },

  {
    id:
      "calculator",

    weight:
      7,

    patterns: [
      /\bcalculator\b/i,

      /\bcalculate your\b/i,

      /\bcalculate eligibility\b/i,
    ],
  },
];


// ============================================================
// FIND SIGNAL MATCHES
// ============================================================

function findPageSignals(
  text,
  signalDefinitions
) {
  const value =
    cleanPageText(
      text
    );

  const matches =
    [];

  for (
    const signal of
    signalDefinitions
  ) {
    const matchedPatterns =
      [];

    for (
      const pattern of
      signal.patterns
    ) {
      if (
        pattern.test(
          value
        )
      ) {
        matchedPatterns.push(
          pattern.source
        );
      }
    }

    if (
      matchedPatterns.length >
      0
    ) {
      matches.push({
        id:
          signal.id,

        weight:
          signal.weight,

        matches:
          matchedPatterns.length,
      });
    }
  }

  return matches;
}


// ============================================================
// SCORE PAGE SIGNALS
// ============================================================

function scorePageSignals(
  page
) {
  const combinedText =
    [
      page.title,

      page.metaDescription,

      page.metaKeywords,

      page.mainText,
    ]
      .filter(Boolean)
      .join(
        " "
      );

  const positive =
    findPageSignals(
      combinedText,
      SCHEME_PAGE_SIGNALS
    );

  const negative =
    findPageSignals(
      combinedText,
      NON_SCHEME_PAGE_SIGNALS
    );

  const positiveScore =
    positive.reduce(
      (
        total,
        item
      ) =>
        total +
        item.weight,
      0
    );

  const negativeScore =
    negative.reduce(
      (
        total,
        item
      ) =>
        total +
        item.weight,
      0
    );

  return {
    positive,

    negative,

    positiveScore,

    negativeScore,

    netScore:
      positiveScore -
      negativeScore,
  };
}


// ============================================================
// PAGE CONTENT QUALITY
// ============================================================

function pageContentQuality(
  page
) {
  const text =
    page.mainText ||
    "";

  if (
    text.length <
    100
  ) {
    return {
      sufficient:
        false,

      score:
        0,

      reason:
        "Insufficient page content",
    };
  }

  if (
    text.length <
    500
  ) {
    return {
      sufficient:
        true,

      score:
        1,

      reason:
        "Limited page content",
    };
  }

  if (
    text.length <
    1500
  ) {
    return {
      sufficient:
        true,

      score:
        2,

      reason:
        "Moderate page content",
    };
  }

  return {
    sufficient:
      true,

    score:
      3,

    reason:
      "Good page content",
  };
}


// ============================================================
// PAGE VERIFICATION
// ============================================================
//
// This function does NOT yet fetch the page.
// It receives extracted page content.
//
// Block 2 will build the fetch + verification wrapper.
// ============================================================


// ============================================================
// V4.5.2 — DYNAMIC INDIA.GOV STRUCTURED VERIFICATION
// ============================================================
//
// India.gov.in service-detail pages can return the generic portal
// shell to a server-side fetch even though the discovery crawler
// already found the real detail URL/title. The old verifier then
// scored navigation text (accessibility, directory, calendar, etc.)
// as if it were the scheme itself.
//
// This layer does NOT blindly trust every /services/details page.
// It only uses structured candidate evidence when ALL of these are
// true:
//   1. source is the official India.gov scheme directory
//   2. fetched page is detected as the generic portal shell
//   3. candidate title is strongly scheme-like
//   4. candidate title is NOT a government-service/listing title
//
// NGSP service candidates remain services and are never promoted to
// schemes by this fallback.
// ============================================================

function isIndiaGovSchemeDirectoryCandidate(candidate = {}) {
  return String(candidate?.sourceId || "").toLowerCase() ===
    "india-gov-schemes";
}

function isIndiaGovNgspServiceCandidate(candidate = {}) {
  return String(candidate?.sourceId || "").toLowerCase() ===
    "national-government-services";
}

function isIndiaGovDynamicDetailUrl(url = "") {
  const value = String(url || "").toLowerCase();
  return value.includes("india.gov.in/services/details/") ||
    value.includes("www.india.gov.in/services/details/");
}

function isIndiaGovGenericPortalShell(page = {}) {
  const title = cleanPageText(page?.title || "").toLowerCase();
  const description = cleanPageText(page?.metaDescription || "").toLowerCase();
  const text = cleanPageText(page?.mainText || "").toLowerCase();

  const genericDescription =
    description.includes("single-window access to information and services") &&
    description.includes("national portal of india");

  const genericTitle =
    title === "national portal of india" ||
    title === "national portal of india | national portal of india";

  const genericText =
    text.includes("single-window access to information and services") &&
    text.includes("accessibility") &&
    text.includes("calendar") &&
    text.includes("directory");

  return genericDescription || genericTitle || genericText;
}

function isIndiaGovSchemeLikeTitle(title = "") {
  const value = cleanPageText(title).toLowerCase();

  if (!value) return false;

  const hardServicePatterns = [
    /\bapplicant applies\b/i,
    /\bapply for\b/i,
    /\bapply online\b/i,
    /\bapplication\b/i,
    /\bregistration\b/i,
    /\bregister\b/i,
    /\bcheck\b/i,
    /\bstatus\b/i,
    /\btracking\b/i,
    /\btrack\b/i,
    /\bdownload\b/i,
    /\blogin\b/i,
    /\bportal\b/i,
    /\bservice\b/i,
    /\bconsent to\b/i,
    /\b\bnoc\b/i,
    /\bissue of\b/i,
    /\bkiosk\b/i,
    /\bdirectory\b/i,
    /\bcertificate\b/i,
    /\bform\b/i,
    /\brequest\b/i,
    /\bsearch\b/i,
  ];

  if (hardServicePatterns.some((pattern) => pattern.test(value))) {
    return false;
  }

  // Listing/index pages are not individual schemes.
  if (/^major schemes for\b/i.test(value)) return false;
  if (/^schemes for\b/i.test(value)) return false;
  if (/\bgovernment schemes directory\b/i.test(value)) return false;

  const schemePatterns = [
    /\bscheme\b/i,
    /\byojana\b/i,
    /\byojna\b/i,
    /\bmission\b/i,
    /\bprogramme\b/i,
    /\bprogram\b/i,
    /\bsubsid(?:y|ies)\b/i,
    /\bgrant\b/i,
    /\bincentive\b/i,
    /\bfund\b/i,
    /\bpension\b/i,
    /\bsupport\b/i,
    /\bfinancial assistance\b/i,
    /\bpm[- ]?[a-z0-9]+\b/i,
  ];

  return schemePatterns.some((pattern) => pattern.test(value));
}

function buildIndiaGovStructuredFallback(candidate = {}, page = {}) {
  const url =
    candidate?.officialWebsite ||
    candidate?.sourceUrl ||
    candidate?.applyLink ||
    "";

  const title =
    cleanPageText(
      candidate?.schemeName ||
      candidate?.title ||
      page?.title ||
      ""
    );

  const eligible =
    isIndiaGovSchemeDirectoryCandidate(candidate) &&
    isIndiaGovDynamicDetailUrl(url) &&
    isIndiaGovGenericPortalShell(page) &&
    isIndiaGovSchemeLikeTitle(title);

  return {
    eligible,
    source: isIndiaGovSchemeDirectoryCandidate(candidate)
      ? "india-gov-schemes"
      : String(candidate?.sourceId || ""),
    title,
    url,
    reason: eligible
      ? "Generic India.gov portal shell detected; official scheme-directory candidate metadata is being used as structured fallback evidence."
      : "Structured India.gov fallback requirements were not satisfied.",
  };
}

function verifyPageContent(
  page,
  candidate = {}
) {
  const title =
    cleanPageText(
      page?.title ||
        candidate.title ||
        ""
    );

  const description =
    cleanPageText(
      page?.metaDescription ||
        ""
    );

  const mainText =
    cleanPageText(
      page?.mainText ||
        ""
    );

  const keywords =
    cleanPageText(
      page?.metaKeywords ||
        ""
    );

  const pageData = {
    title,
    metaDescription: description,
    metaKeywords: keywords,
    mainText,
  };

  const structuredFallback =
    buildIndiaGovStructuredFallback(
      candidate,
      pageData
    );

  const signals =
    scorePageSignals(
      pageData
    );

  const content =
    pageContentQuality(
      pageData
    );

  const hasEligibility =
    signals.positive.some(
      (item) =>
        item.id ===
        "eligibility"
    );

  const hasBenefits =
    signals.positive.some(
      (item) =>
        item.id ===
        "benefits"
    );

  const hasBeneficiary =
    signals.positive.some(
      (item) =>
        item.id ===
        "beneficiary"
    );

  const hasApplication =
    signals.positive.some(
      (item) =>
        item.id ===
        "application"
    );

  const hasSchemeIdentity =
    signals.positive.some(
      (item) =>
        [
          "scheme",
          "yojana",
          "programme",
          "objective",
        ].includes(
          item.id
        )
    );

  const evidencePillarCount = [
    hasEligibility,
    hasBenefits,
    hasBeneficiary,
    hasApplication,
  ].filter(Boolean).length;

  const hasCoreEvidence =
    hasSchemeIdentity &&
    evidencePillarCount >= 2 &&
    (hasBenefits || hasEligibility || hasBeneficiary);

  const strongNegativeSignals =
    signals.negative.filter(
      (item) =>
        item.weight >= 8
    );

  const hasStrongNegative =
    strongNegativeSignals.length >
    0;

  const hasHardRejectSignal =
    signals.negative.some(
      (item) =>
        [
          "accessibility",
          "tracking",
          "payment_tracking",
          "application_tracking",
          "status_tracking",
        ].includes(
          item.id
        )
    );

  const schemeEvidenceStrength =
    signals.positiveScore;

  const navigationPenalty =
    signals.negativeScore;

  const netScore =
    schemeEvidenceStrength -
    navigationPenalty;

  let verified = false;
  let verificationStatus =
    "REJECTED";
  let confidence = 0;
  let reason = "";

  if (
    hasHardRejectSignal &&
    !hasCoreEvidence
  ) {
    verificationStatus =
      "REJECTED";
    confidence = 0.05;
    reason =
      "Page contains strong government service/navigation evidence without sufficient scheme evidence.";
  } else if (
    hasCoreEvidence &&
    content.sufficient &&
    netScore >= 5
  ) {
    verified = true;
    verificationStatus =
      "VERIFIED";
    confidence =
      Math.min(
        0.98,
        0.70 +
          Math.max(
            0,
            netScore
          ) /
            100
      );
    reason =
      "Government page contains strong independent scheme evidence.";
  } else if (
    hasCoreEvidence &&
    content.sufficient &&
    schemeEvidenceStrength >= 10
  ) {
    verified = true;
    verificationStatus =
      "VERIFIED";
    confidence =
      Math.min(
        0.94,
        0.65 +
          schemeEvidenceStrength /
            100
      );
    reason =
      "Government page contains multiple scheme-specific signals despite normal navigation content.";
  } else if (
    !content.sufficient
  ) {
    verificationStatus =
      "UNVERIFIED";
    confidence = 0.10;
    reason =
      "Page content is insufficient for reliable scheme verification.";
  } else if (
    hasCoreEvidence
  ) {
    verificationStatus =
      "UNVERIFIED";
    confidence =
      Math.min(
        0.50,
        Math.max(
          0.20,
          schemeEvidenceStrength /
            40
        )
      );
    reason =
      "Page contains some scheme evidence but not enough independent evidence for automatic verification.";
  } else if (
    structuredFallback.eligible
  ) {
    // The HTML fetch returned the generic India.gov shell. The
    // candidate itself came from the official scheme directory,
    // has a scheme-like title, and is not a service/listing title.
    // Keep this as an explicit structured fallback rather than
    // pretending the shell contained scheme-specific content.
    verified = true;
    verificationStatus =
      "VERIFIED";
    confidence = 0.78;
    reason =
      structuredFallback.reason;
  } else {
    verificationStatus =
      "REJECTED";
    confidence =
      Math.min(
        0.20,
        Math.max(
          0.02,
          netScore / 20
        )
      );
    reason =
      "Page does not contain enough independent evidence to verify a government scheme.";
  }

  return {
    verified,
    verificationStatus,
    confidence:
      Number(
        confidence.toFixed(3)
      ),
    reason,
    contentQuality: content,
    positiveSignals:
      signals.positive,
    negativeSignals:
      signals.negative,
    positiveScore:
      signals.positiveScore,
    negativeScore:
      signals.negativeScore,
    netScore,
    evidence: {
      hasSchemeIdentity,
      hasEligibility,
      hasBenefits,
      hasBeneficiary,
      hasApplication,
      evidencePillarCount,
      hasCoreEvidence,
      hasStrongNegative,
      hasHardRejectSignal,
      structuredIndiaGovFallback: structuredFallback.eligible,
    },
    structuredFallback,
  };
}

// ============================================================
// PAGE DATA EXTRACTION
// ============================================================
//
// Converts raw HTML into the smaller object used by
// verifyPageContent().
// ============================================================


// ============================================================
// V4.5.6-EMPLOYMENT-ONLY
// DOM-LEVEL EVIDENCE SECTION EXTRACTION
// ============================================================
// Extract scheme sections from the original HTML before the
// page is flattened into mainText. This prevents menu/footer
// text from being mistaken for scheme evidence.
// No external parser dependency is required.
// ============================================================

const BLOCK64_SECTION_ALIASES = Object.freeze({
  description: [
    "about", "overview", "description", "objective", "objectives",
    "introduction", "about the scheme", "scheme overview",
    "scheme description"
  ],
  eligibility: [
    "eligibility", "eligibility criteria", "who can apply",
    "eligibility conditions", "eligible applicants"
  ],
  benefits: [
    "benefits", "benefit", "scheme benefits", "assistance",
    "financial assistance", "financial support", "features", "nature of assistance",
    "assistance provided", "key benefits"
  ],
  application: [
    "how to apply", "application", "application process",
    "apply", "application procedure", "how can i apply"
  ],
  beneficiary: [
    "beneficiary", "beneficiaries", "target beneficiaries",
    "target group", "who can benefit"
  ],
  documents: [
    "documents required", "documents", "required documents",
    "documents needed", "list of documents", "kyc documents"
  ],
  ministry: [
    "ministry", "department", "nodal ministry", "implementing agency",
    "implementing authority", "concerned department"
  ],
});

function block64NormalizeHeading(value) {
  return String(value || "")
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&#39;|&#x27;/gi, "'")
    .replace(/&quot;/gi, '"')
    .replace(/<[^>]*>/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .toLowerCase();
}

function block64ClassifyHeading(value) {
  const heading = block64NormalizeHeading(value);
  if (!heading) return "";

  for (const [field, aliases] of Object.entries(BLOCK64_SECTION_ALIASES)) {
    if (
      aliases.some((alias) =>
        heading === alias ||
        heading.includes(alias) ||
        alias.includes(heading)
      )
    ) {
      return field;
    }
  }

  return "";
}

function block64HtmlToText(value) {
  return String(value || "")
    .replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, " ")
    .replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, " ")
    .replace(/<noscript\b[^>]*>[\s\S]*?<\/noscript>/gi, " ")
    .replace(/<svg\b[^>]*>[\s\S]*?<\/svg>/gi, " ")
    .replace(/<img\b[^>]*>/gi, " ")
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<\/(?:p|div|li|ul|ol|table|tr|td|section|article)>/gi, "\n")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&quot;/gi, '"')
    .replace(/&#39;|&#x27;/gi, "'")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">")
    .replace(/\r/g, "")
    .replace(/[ \t]+/g, " ")
    .replace(/\n[ \t]+/g, "\n")
    .replace(/[ \t]*\n[ \t]*/g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

function block64CleanDomSection(value, max = 1800) {
  return block64HtmlToText(value)
    .replace(/\b(?:click here|click to (?:apply|know|view|read|download))\b/gi, " ")
    .replace(/\b(?:read more|learn more|know more|view details|view more|view all)\b/gi, " ")
    .replace(/\b(?:screen reader|accessibility statement|terms & conditions|privacy policy)\b/gi, " ")
    .replace(/(?:^|\s)(?:home|contact us|dashboard)(?=\s|$)/gi, " ")
    .replace(/\b(?:to\s+apply\s*){2,}/gi, "to apply ")
    .replace(/\b(?:apply\s+to\s+apply\s*){2,}/gi, "apply ")
    .replace(/\s{2,}/g, " ")
    .trim()
    .slice(0, max);
}

function block64CleanFieldForType(field, value, max = 1800) {
  let text = block64CleanDomSection(value, max);
  if (!text) return "";

  if (field === "application") {
    // Navigation buttons are not application instructions. Keep actual
    // application wording and remove repeated link labels introduced by
    // multiple OMC buttons on the PMUY page.
    text = text
      .replace(/(?:to\s+)?apply(?:\s+to\s+apply)+/gi, "apply")
      .replace(/(?:click\s+here\s+to\s+apply\s*)+/gi, " ")
      .replace(/\b(?:online application)\b/gi, " ")
      .replace(/\s{2,}/g, " ")
      .trim();
  }

  if (field === "documents") {
    text = text
      .replace(/\b(?:click here|click to download)\b/gi, " ")
      .replace(/\s{2,}/g, " ")
      .trim();
  }

  return text.slice(0, max);
}

function extractDomEvidenceSections(html) {
  if (!html) return {};

  // Remove global UI containers before looking for headings. We deliberately
  // keep the actual content area, including footer-adjacent application links,
  // but remove the footer itself so contact/helpline text cannot leak into a
  // scheme field.
  const source = String(html)
    .replace(/<header\b[^>]*>[\s\S]*?<\/header>/gi, " ")
    .replace(/<nav\b[^>]*>[\s\S]*?<\/nav>/gi, " ")
    .replace(/<footer\b[^>]*>[\s\S]*?<\/footer>/gi, " ")
    .replace(/<aside\b[^>]*>[\s\S]*?<\/aside>/gi, " ")
    .replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, " ")
    .replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, " ")
    .replace(/<noscript\b[^>]*>[\s\S]*?<\/noscript>/gi, " ");

  const headingRe = /<h([1-6])\b[^>]*>([\s\S]*?)<\/h\1>/gi;
  const matches = [];
  let match;

  while ((match = headingRe.exec(source)) !== null) {
    const heading = block64HtmlToText(match[2]);
    const field = block64ClassifyHeading(heading);
    matches.push({ index: match.index, end: headingRe.lastIndex, heading, field });
  }

  if (!matches.length) return {};

  const sections = {};
  for (let i = 0; i < matches.length; i++) {
    const current = matches[i];
    if (!current.field) continue;

    const next = matches[i + 1];
    const end = next ? next.index : source.length;
    const body = source.slice(current.end, end);
    const cleaned = block64CleanFieldForType(current.field, body);
    if (!cleaned) continue;

    if (!sections[current.field]) {
      sections[current.field] = cleaned;
    } else if (!sections[current.field].toLowerCase().includes(cleaned.toLowerCase().slice(0, 120))) {
      sections[current.field] = `${sections[current.field]} ${cleaned}`.slice(0, 2200);
    }
  }

  return sections;
}

function extractOfficialRelatedLinks(html, baseUrl) {
  if (!html || !baseUrl) return [];

  const links = [];
  const seen = new Set();
  const anchorRe = /<a\b[^>]*href\s*=\s*["']([^"']+)["'][^>]*>([\s\S]*?)<\/a>/gi;
  const keywords = /(?:more information|detailed information|for more information|view details|scheme details|scheme guidelines|guidelines|official website|implementation procedure|scale of assistance|who can apply|how to apply|application process|click here)/i;

  let match;
  while ((match = anchorRe.exec(html)) !== null) {
    const href = String(match[1] || '').trim();
    const text = String(match[2] || '')
      .replace(/<[^>]*>/g, ' ')
      .replace(/&nbsp;/gi, ' ')
      .replace(/&amp;/gi, '&')
      .replace(/\s+/g, ' ')
      .trim();

    if (!href || !text || !keywords.test(text)) continue;

    let absolute = '';
    try {
      absolute = new URL(href, baseUrl).toString();
    } catch {
      continue;
    }

    absolute = normalizeVerificationUrl(absolute);
    if (!absolute || seen.has(absolute)) continue;
    if (!isOfficialSchemeDomain(absolute)) continue;
    if (/\.(?:pdf|docx?|xlsx?)$/i.test(absolute)) continue;

    seen.add(absolute);
    links.push({ url: absolute, text });
    if (links.length >= 8) break;
  }

  return links;
}

function extractAuthorityFieldsFromText(text) {
  const source = block6CleanEvidenceText(text || '');
  if (!source) return { ministry: '', department: '' };

  const ministryMatch = source.match(/\b(Ministry\s+of\s+[A-Z][^.;|]{4,180}?)(?=\s+(?:inter-alia|through|under|has been|is|,)|[.;|]|$)/i);
  const ministry = ministryMatch?.[1] ? block6CleanEvidenceText(ministryMatch[1]).slice(0, 220) : '';

  const departmentMatch = source.match(/\b((?:Office\s+of|O\/o|Department\s+of|Directorate\s+of)\s+[A-Z][^.;|]{4,180}?)(?=\s+(?:under|through|has been|is|,)|[.;|]|$)/i);
  const department = departmentMatch?.[1] ? block6CleanEvidenceText(departmentMatch[1]).slice(0, 220) : '';

  return { ministry, department };
}

function isUsableAuthorityValue(value) {
  const text = block6CleanEvidenceText(value || '');
  if (!text) return false;
  if (text.length > 220) return false;
  if (/\b(?:scheme|programme|program|providing|marketing support|detailed information|for more information|objective|benefit|assistance|applicant|entrepreneurship)\b/i.test(text) && !/^Ministry\s+of\s+/i.test(text) && !/^(?:Office|O\/o|Department|Directorate)\s+of\s+/i.test(text)) return false;
  return /^(?:Ministry\s+of\s+|Office\s+of\s+|O\/o\s+|Department\s+of\s+|Directorate\s+of\s+)/i.test(text);
}

function mergeBestEvidenceField(currentValue, nextValue) {
  const current = block6CleanSpecificField(currentValue, { max: 1800, rejectGeneric: true });
  const next = block6CleanSpecificField(nextValue, { max: 1800, rejectGeneric: true });
  if (!current) return next;
  if (!next) return current;
  if (next.length > current.length + 20) return next;
  return current;
}

function extractVerificationPageData(
  html,
  baseUrl = ''
) {
  return {
    title:
      extractPageTitle(
        html
      ),

    metaDescription:
      extractMetaDescription(
        html
      ),

    metaKeywords:
      extractMetaKeywords(
        html
      ),

    mainText:
      extractMainPageText(
        html
      ),

    domSections:
      extractDomEvidenceSections(
        html
      ),

    relatedLinks:
      extractOfficialRelatedLinks(
        html,
        baseUrl
      ),
  };
}


// ============================================================
// EXPORT BLOCK 1 FUNCTIONS
// ============================================================
//
// Block 2 will import/use these functions inside the same
// V4.3 service.
// ============================================================

export {
  fetchVerificationPage,

  cleanPageText,

  extractPageTitle,

  extractMetaDescription,

  extractMetaKeywords,

  extractMainPageText,

  extractVerificationPageData,

  findPageSignals,

  scorePageSignals,

  pageContentQuality,

  verifyPageContent,
  isIndiaGovGenericPortalShell,
  isIndiaGovSchemeLikeTitle,
  buildIndiaGovStructuredFallback,
};
// ============================================================
// V4.3 — BLOCK 2
// CANDIDATE PAGE VERIFICATION
// ============================================================
//
// This block takes a discovered candidate:
//
//     title + URL
//
// then:
//
//     1. Fetches the actual page
//     2. Extracts page content
//     3. Runs the V4.3 verification engine
//     4. Combines title/URL evidence with page evidence
//     5. Returns VERIFIED / REJECTED / UNVERIFIED
//
// IMPORTANT:
// ------------------------------------------------------------
// Still DISCOVERY ONLY.
// No database writes.
// No scheme creation.
// No updates.
// ============================================================


// ============================================================
// NORMALIZE URL
// ============================================================

function normalizeVerificationUrl(
  value
) {
  if (!value) {
    return "";
  }

  try {
    const url =
      new URL(
        value
      );

    url.hash = "";

    return url.href
      .replace(
        /\/+$/,
        ""
      )
      .toLowerCase();
  } catch {
    return "";
  }
}


// ============================================================
// GET HOSTNAME
// ============================================================

function getVerificationHostname(
  url
) {
  try {
    return new URL(
      url
    ).hostname.toLowerCase();
  } catch {
    return "";
  }
}


// ============================================================
// GOVERNMENT DOMAIN CHECK
// ============================================================
//
// V4.3 intentionally accepts official Indian government
// domains only.
//
// Existing V4.2 discovery already performs government-domain
// filtering before candidates reach this layer.
//
// This function provides a second safety check.
// ============================================================

function isVerificationGovernmentDomain(
  url
) {
  const hostname =
    getVerificationHostname(
      url
    );

  if (!hostname) {
    return false;
  }

  return (
    hostname ===
      "india.gov.in" ||

    hostname.endsWith(
      ".india.gov.in"
    ) ||

    hostname ===
      "myscheme.gov.in" ||

    hostname.endsWith(
      ".myscheme.gov.in"
    ) ||

    hostname.endsWith(
      ".gov.in"
    ) ||

    hostname.endsWith(
      ".nic.in"
    )
  );
}


// ============================================================
// OFFICIAL GOVERNMENT-OWNED SCHEME DOMAINS
// ============================================================
// Some Government of India enterprises publish scheme details on
// official domains that are not .gov.in/.nic.in. Keep this list
// explicit instead of broadly accepting arbitrary .co.in/.org sites.

const OFFICIAL_SCHEME_DOMAIN_ALLOWLIST = new Set([
  "nsic.co.in",
]);

function isOfficialSchemeDomain(url) {
  if (isVerificationGovernmentDomain(url)) return true;

  const hostname = getVerificationHostname(url);
  if (!hostname) return false;

  return Array.from(OFFICIAL_SCHEME_DOMAIN_ALLOWLIST).some(
    (domain) => hostname === domain || hostname.endsWith(`.${domain}`)
  );
}


// ============================================================
// CANDIDATE URL SELECTION
// ============================================================
//
// Prefer:
//
//     officialWebsite
//
// then:
//
//     applyLink
//
// then:
//
//     sourceUrl
// ============================================================

function getCandidateVerificationUrl(
  candidate
) {
  if (!candidate) {
    return "";
  }

  return (
    normalizeVerificationUrl(
      candidate.officialWebsite
    ) ||

    normalizeVerificationUrl(
      candidate.applyLink
    ) ||

    normalizeVerificationUrl(
      candidate.sourceUrl
    )
  );
}


// ============================================================
// CANDIDATE TITLE
// ============================================================

function getCandidateVerificationTitle(
  candidate
) {
  if (!candidate) {
    return "";
  }

  return cleanPageText(
    candidate.schemeName ||
      candidate.title ||
      ""
  );
}


// ============================================================
// TITLE-LEVEL SCHEME SIGNALS
// ============================================================
//
// These are intentionally weaker than page-content signals.
//
// A title such as:
//
//     "Apply for New Ujjwala 2.0 Connection"
//
// may not contain the word "scheme".
//
// Therefore title evidence alone cannot reject it.
// ============================================================

const TITLE_SCHEME_PATTERNS = [
  /\bscheme\b/i,

  /\byojana\b/i,

  /\byojna\b/i,

  /\bsubsidy\b/i,

  /\bgrant\b/i,

  /\bassistance\b/i,

  /\bincentive\b/i,

  /\bscholarship\b/i,

  /\bpension\b/i,

  /\bprogramme\b/i,

  /\bprogram\b/i,

  /\bmission\b/i,

  /\bfinancial support\b/i,

  /\bfinancial assistance\b/i,

  /\bbenefit\b/i,
];


// ============================================================
// TITLE-LEVEL NON-SCHEME PATTERNS
// ============================================================

const TITLE_NON_SCHEME_PATTERNS = [
  /\bscreen reader\b/i,

  /\baccessibility\b/i,

  /\btracking system\b/i,

  /\bpayment tracking\b/i,

  /\bapplication tracking\b/i,

  /\bstatus tracking\b/i,

  /\btrack application\b/i,

  /\bportal login\b/i,

  /\blogin portal\b/i,

  /\bdirectory\b/i,

  /\bcalculator\b/i,

  /\bcalendar\b/i,

  /\bsitemap\b/i,

  /\bsite map\b/i,

  /\bprivacy policy\b/i,

  /\bterms and conditions\b/i,

  /\bdisclaimer\b/i,

  /\bcontact us\b/i,

  /\babout us\b/i,
];


// ============================================================
// TITLE SIGNAL ANALYSIS
// ============================================================

function analyseCandidateTitle(
  title
) {
  const value =
    cleanPageText(
      title
    );

  const positive =
    [];

  const negative =
    [];

  for (
    const pattern of
    TITLE_SCHEME_PATTERNS
  ) {
    if (
      pattern.test(
        value
      )
    ) {
      positive.push(
        pattern.source
      );
    }
  }

  for (
    const pattern of
    TITLE_NON_SCHEME_PATTERNS
  ) {
    if (
      pattern.test(
        value
      )
    ) {
      negative.push(
        pattern.source
      );
    }
  }

  return {
    positive,

    negative,

    positiveCount:
      positive.length,

    negativeCount:
      negative.length,
  };
}


// ============================================================
// CANDIDATE PAGE CACHE
// ============================================================
//
// During one discovery run, the same URL can sometimes be
// discovered more than once.
//
// Avoid downloading the same government page repeatedly.
// ============================================================

const verificationPageCache =
  new Map();


// ============================================================
// FETCH CANDIDATE PAGE
// ============================================================

async function fetchCandidatePage(
  url
) {
  const normalizedUrl =
    normalizeVerificationUrl(
      url
    );

  if (!normalizedUrl) {
    throw new Error(
      "Invalid candidate URL."
    );
  }

  // ----------------------------------------------------------
  // CACHE HIT
  // ----------------------------------------------------------

  if (
    verificationPageCache.has(
      normalizedUrl
    )
  ) {
    return verificationPageCache.get(
      normalizedUrl
    );
  }

  // ----------------------------------------------------------
  // FETCH
  // ----------------------------------------------------------

  const fetched =
    await fetchVerificationPage(
      normalizedUrl
    );

  const pageData =
    extractVerificationPageData(
      fetched.html
    );

  const result = {
    requestedUrl:
      normalizedUrl,

    finalUrl:
      normalizeVerificationUrl(
        fetched.finalUrl
      ) ||
      normalizedUrl,

    httpStatus:
      fetched.status,

    title:
      pageData.title,

    metaDescription:
      pageData.metaDescription,

    metaKeywords:
      pageData.metaKeywords,

    mainText:
      pageData.mainText,

    domSections:
      pageData.domSections || {},

    relatedLinks:
      pageData.relatedLinks || [],

    fetched:
      true,
  };

  verificationPageCache.set(
    normalizedUrl,
    result
  );

  return result;
}


// ============================================================
// PAGE FETCH FAILURE RESULT
// ============================================================

function buildFetchFailureResult(
  candidate,
  error
) {
  const title =
    getCandidateVerificationTitle(
      candidate
    );

  const url =
    getCandidateVerificationUrl(
      candidate
    );

  return {
    verified:
      false,

    verificationStatus:
      "UNVERIFIED",

    confidence:
      0,

    reason:
      "Candidate page could not be fetched for verification.",

    candidate: {
      title,

      url,
    },

    fetchError:
      error?.message ||
      "Unknown fetch error",

    page:
      null,

    signals:
      null,
  };
}


// ============================================================
// BUILD VERIFICATION RESULT
// ============================================================

function buildCandidateVerificationResult(
  candidate,
  page,
  pageVerification,
  titleAnalysis
) {
  // ----------------------------------------------------------
  // PAGE URL AFTER REDIRECT
  // ----------------------------------------------------------

  const finalUrl =
    normalizeVerificationUrl(
      page?.finalUrl
    ) ||
    getCandidateVerificationUrl(
      candidate
    );

  // ----------------------------------------------------------
  // REDIRECT SAFETY
  // ----------------------------------------------------------

  const redirectedOutsideGovernment =
    finalUrl &&
    !isVerificationGovernmentDomain(
      finalUrl
    );

  if (
    redirectedOutsideGovernment
  ) {
    return {
      verified:
        false,

      verificationStatus:
        "REJECTED",

      confidence:
        0,

      reason:
        "Candidate page redirected outside an official government domain.",

      candidate: {
        title:
          getCandidateVerificationTitle(
            candidate
          ),

        url:
          getCandidateVerificationUrl(
            candidate
          ),
      },

      page: {
        finalUrl,
      },

      signals:
        pageVerification,

      titleSignals:
        titleAnalysis,
    };
  }

  // ----------------------------------------------------------
  // STRONG TITLE-LEVEL NEGATIVE
  // ----------------------------------------------------------

  if (
    titleAnalysis.negativeCount >
    0
  ) {
    return {
      verified:
        false,

      verificationStatus:
        "REJECTED",

      confidence:
        0.05,

      reason:
        "Candidate title identifies a service, navigation or non-scheme page.",

      candidate: {
        title:
          getCandidateVerificationTitle(
            candidate
          ),

        url:
          getCandidateVerificationUrl(
            candidate
          ),
      },

      page: {
        finalUrl,

        title:
          page?.title ||
          "",
      },

      signals:
        pageVerification,

      titleSignals:
        titleAnalysis,
    };
  }

  // ----------------------------------------------------------
  // PAGE VERIFICATION
  // ----------------------------------------------------------

  if (
    pageVerification.verified
  ) {
    return {
      verified:
        true,

      verificationStatus:
        "VERIFIED",

      confidence:
        pageVerification.confidence,

      reason:
        pageVerification.reason,

      candidate: {
        title:
          getCandidateVerificationTitle(
            candidate
          ),

        url:
          getCandidateVerificationUrl(
            candidate
          ),
      },

      page: {
        finalUrl,

        title:
          page?.title ||
          "",

        metaDescription:
          page?.metaDescription ||
          "",
      },

      signals:
        pageVerification,

      titleSignals:
        titleAnalysis,
    };
  }

  // ----------------------------------------------------------
  // NOT VERIFIED
  // ----------------------------------------------------------

  const normalizedVerificationStatus =
    pageVerification?.verificationStatus ===
    "UNVERIFIED"
      ? "UNVERIFIED"
      : "REJECTED";

  return {
    verified:
      false,

    verificationStatus:
      normalizedVerificationStatus,

    confidence:
      pageVerification.confidence,

    reason:
      pageVerification.reason,

    candidate: {
      title:
        getCandidateVerificationTitle(
          candidate
        ),

      url:
        getCandidateVerificationUrl(
          candidate
        ),
    },

    page: {
      finalUrl,

      title:
        page?.title ||
        "",

      metaDescription:
        page?.metaDescription ||
        "",
    },

    signals:
      pageVerification,

    titleSignals:
      titleAnalysis,
  };
}


// ============================================================
// VERIFY ONE CANDIDATE
// ============================================================
//
// This is the main function Block 3 will call.
//
// Example:
//
//     const result =
//       await verifySchemeCandidate(candidate);
//
// ============================================================

async function verifySchemeCandidate(
  candidate
) {
  // ----------------------------------------------------------
  // BASIC VALIDATION
  // ----------------------------------------------------------

  if (!candidate) {
    return {
      verified:
        false,

      verificationStatus:
        "REJECTED",

      confidence:
        0,

      reason:
        "Empty scheme candidate.",
    };
  }

  const title =
    getCandidateVerificationTitle(
      candidate
    );

  const url =
    getCandidateVerificationUrl(
      candidate
    );

  // ----------------------------------------------------------
  // TITLE REQUIRED
  // ----------------------------------------------------------

  if (!title) {
    return {
      verified:
        false,

      verificationStatus:
        "REJECTED",

      confidence:
        0,

      reason:
        "Candidate has no usable title.",

      candidate: {
        title:
          "",

        url,
      },
    };
  }

  // ----------------------------------------------------------
  // URL REQUIRED
  // ----------------------------------------------------------

  if (!url) {
    return {
      verified:
        false,

      verificationStatus:
        "REJECTED",

      confidence:
        0,

      reason:
        "Candidate has no usable official URL.",

      candidate: {
        title,

        url:
          "",
      },
    };
  }

  // ----------------------------------------------------------
  // GOVERNMENT DOMAIN
  // ----------------------------------------------------------

  if (
    !isVerificationGovernmentDomain(
      url
    )
  ) {
    return {
      verified:
        false,

      verificationStatus:
        "REJECTED",

      confidence:
        0,

      reason:
        "Candidate is not hosted on an official Indian government domain.",

      candidate: {
        title,

        url,
      },
    };
  }

  // ----------------------------------------------------------
  // V5.0 EXCLUSIVE SCHEME-ONLY ADMINISTRATIVE PAGE CHECK
  // ----------------------------------------------------------
  const exclusiveRejection = exclusiveSchemeIdentityRejection({
    ...candidate,
    schemeName: title,
    officialWebsite: url,
  });

  if (exclusiveRejection) {
    return {
      verified: false,
      verificationStatus: "REJECTED",
      confidence: 0.01,
      reason: exclusiveRejection,
      candidate: { title, url },
    };
  }

  // ----------------------------------------------------------
  // HARD NAVIGATION / INFORMATION PAGE CHECK
  // ----------------------------------------------------------
  //
  // myScheme pages such as /faqs and /about contain genuine
  // scheme terminology because they describe the platform.
  // They must never become scheme candidates themselves.
  //
  const navigation =
    isDiscoveryNavigation(
      title,
      url
    );

  if (
    navigation.rejected
  ) {
    return {
      verified:
        false,

      verificationStatus:
        "REJECTED",

      confidence:
        0.01,

      reason:
        navigation.reason ||
        "Navigation/information page",

      candidate: {
        title,
        url,
      },
    };
  }

  // ----------------------------------------------------------
  // TITLE ANALYSIS
  // ----------------------------------------------------------

  const titleAnalysis =
    analyseCandidateTitle(
      title
    );

  // ----------------------------------------------------------
  // FETCH PAGE
  // ----------------------------------------------------------

  let page;

  try {
    page =
      await fetchCandidatePage(
        url
      );
  } catch (error) {
    return buildFetchFailureResult(
      candidate,
      error
    );
  }

  // ----------------------------------------------------------
  // V4.5.2 NGSP SERVICE SAFETY
  // ----------------------------------------------------------
  // NGSP is a government SERVICES portal. Its detail pages are
  // useful discovery context but are not automatically schemes.
  // Do not let generic service-shell text promote them.
  // ----------------------------------------------------------

  if (
    isIndiaGovNgspServiceCandidate(candidate) &&
    isIndiaGovDynamicDetailUrl(url)
  ) {
    return {
      verified: false,
      verificationStatus: "REJECTED",
      confidence: 0.02,
      reason: "National Government Services Portal service page; not treated as a government scheme.",
      candidate: {
        title,
        url,
      },
      page: {
        finalUrl: page?.finalUrl || url,
        title: page?.title || "",
      },
      signals: null,
      titleSignals: titleAnalysis,
    };
  }

  // ----------------------------------------------------------
  // VERIFY PAGE CONTENT
  // ----------------------------------------------------------

  const pageVerification =
    verifyPageContent(
      page,
      candidate
    );

  // ----------------------------------------------------------
  // BUILD FINAL RESULT
  // ----------------------------------------------------------

  return buildCandidateVerificationResult(
    candidate,
    page,
    pageVerification,
    titleAnalysis
  );
}


// ============================================================
// VERIFY MULTIPLE CANDIDATES
// ============================================================
//
// Sequential verification is intentional.
//
// Government websites can be slow and we don't want to
// generate dozens of simultaneous requests.
//
// Block 3 can later add a controlled concurrency limit
// if required.
// ============================================================

async function verifySchemeCandidates(
  candidates
) {
  const results =
    [];

  const verified =
    [];

  const rejected =
    [];

  const unverified =
    [];

  if (
    !Array.isArray(
      candidates
    )
  ) {
    return {
      results: [],

      verified: [],

      rejected: [],

      unverified: [],
    };
  }

  for (
    const candidate of
    candidates
  ) {
    const result =
      await verifySchemeCandidate(
        candidate
      );

    results.push({
      ...candidate,

      verification:
        result,
    });

    if (
      result.verificationStatus ===
      "VERIFIED"
    ) {
      verified.push({
        ...candidate,

        verification:
          result,
      });

      continue;
    }

    if (
      result.verificationStatus ===
      "UNVERIFIED"
    ) {
      unverified.push({
        ...candidate,

        verification:
          result,
      });

      continue;
    }

    rejected.push({
      ...candidate,

      verification:
        result,
    });
  }

  return {
    results,

    verified,

    rejected,

    unverified,
  };
}


// ============================================================
// VERIFICATION SUMMARY
// ============================================================

function buildVerificationSummary(
  verificationResult
) {
  const results =
    verificationResult
      ?.results ||
    [];

  const summary = {
    total:
      results.length,

    verified:
      0,

    rejected:
      0,

    unverified:
      0,

    averageConfidence:
      0,

    reasons: {},
  };

  let confidenceTotal =
    0;

  let confidenceCount =
    0;

  for (
    const item of
    results
  ) {
    const verification =
      item?.verification;

    if (!verification) {
      continue;
    }

    if (
      verification.verificationStatus ===
      "VERIFIED"
    ) {
      summary.verified++;
    }

    if (
      verification.verificationStatus ===
      "REJECTED"
    ) {
      summary.rejected++;
    }

    if (
      verification.verificationStatus ===
      "UNVERIFIED"
    ) {
      summary.unverified++;
    }

    if (
      Number.isFinite(
        Number(
          verification.confidence
        )
      )
    ) {
      confidenceTotal +=
        Number(
          verification.confidence
        );

      confidenceCount++;
    }

    const reason =
      verification.reason ||
      "Unknown";

    summary.reasons[
      reason
    ] =
      (
        summary.reasons[
          reason
        ] ||
        0
      ) + 1;
  }

  if (
    confidenceCount >
    0
  ) {
    summary.averageConfidence =
      Number(
        (
          confidenceTotal /
          confidenceCount
        ).toFixed(
          3
        )
      );
  }

  return summary;
}


// ============================================================
// CLEAR VERIFICATION CACHE
// ============================================================
//
// Useful between development/test runs.
// Block 4 can call this at the beginning/end of discovery.
// ============================================================

function clearVerificationCache() {
  verificationPageCache.clear();
}


// ============================================================
// BLOCK 2 EXPORTS
// ============================================================

export {
  normalizeVerificationUrl,

  getVerificationHostname,

  isVerificationGovernmentDomain,

  getCandidateVerificationUrl,

  getCandidateVerificationTitle,

  analyseCandidateTitle,

  fetchCandidatePage,

  verifySchemeCandidate,

  verifySchemeCandidates,

  buildVerificationSummary,

  clearVerificationCache,
};
// ============================================================
// V4.3 — BLOCK 3
// DISCOVERY INTEGRATION
// ============================================================
//
// This block connects:
//
//     V4.2 candidate discovery
//             ↓
//     V4.3 page verification
//             ↓
//     verified / rejected / unverified
//
// IMPORTANT:
// ------------------------------------------------------------
// This block does NOT write to the database.
//
// V4.3 remains:
//
//     DISCOVERY_ONLY
//
// ============================================================


// ============================================================
// V4.2 DISCOVERY CONFIGURATION
// ============================================================

const V42_DISCOVERY_TIMEOUT =
  Number(
    process.env.SCHEME_DISCOVERY_TIMEOUT ||
      20000
  );

const V42_USER_AGENT =
  process.env.SCHEME_DISCOVERY_USER_AGENT ||
  "GoSubsidy Government Scheme Discovery/4.4";


// ============================================================
// V4.2 OFFICIAL SOURCES
// ============================================================

const V42_DISCOVERY_SOURCES = [
  {
    id:
      "india-gov-schemes",

    name:
      "National Portal of India - Government Schemes",

    url:
      "https://www.india.gov.in/my-government/schemes",

    domain:
      "india.gov.in",

    type:
      "html",
  },

  {
    id:
      "myscheme",

    name:
      "myScheme - Government Scheme Discovery",

    url:
      "https://www.myscheme.gov.in/",

    domain:
      "myscheme.gov.in",

    type:
      "html",
  },

  // ----------------------------------------------------------
  // V4.9 OFFICIAL MINISTRY CATALOGUE SOURCES
  //
  // These are deliberately first-party scheme catalogues.
  // They supplement India.gov/myScheme because those portals
  // are currently JS/API-backed and can expose very few raw
  // detail links to a server-side HTML crawler.
  //
  // Each discovered detail page still passes the existing
  // General Scheme Gate + Smart Verification + Storage Safety.
  // ----------------------------------------------------------
  {
    id:
      "msme-offerings",

    name:
      "Ministry of MSME - Schemes and Services",

    url:
      "https://www.msme.gov.in/offerings",

    domain:
      "msme.gov.in",

    type:
      "html",
  },

  {
    id:
      "dcmsme-schemes",

    name:
      "Development Commissioner MSME - Scheme Resources",

    url:
      "https://dcmsme.gov.in/Beneficiaries.aspx",

    domain:
      "dcmsme.gov.in",

    type:
      "html",
  },

  {
    id:
      "fisheries-offerings",

    name:
      "Department of Fisheries - Schemes and Services",

    url:
      "https://www.dof.gov.in/offerings",

    domain:
      "dof.gov.in",

    type:
      "html",
  },
];


// ============================================================
// V4.2 FETCH HTML
// ============================================================

async function fetchDiscoveryHtml(
  url,
  options = {}
) {
  const attempts =
    Number(
      options.attempts ||
        process.env.SCHEME_DISCOVERY_RETRY_ATTEMPTS ||
        3
    );

  const delayMs =
    Number(
      options.delayMs ||
        process.env.SCHEME_DISCOVERY_RETRY_DELAY_MS ||
        800
    );

  const headersList = [
    {
      Accept:
        "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
      "User-Agent":
        V42_USER_AGENT,
      "Accept-Language":
        "en-IN,en;q=0.9",
      "Cache-Control":
        "no-cache",
    },
    {
      Accept:
        "text/html,application/xhtml+xml,*/*;q=0.8",
      "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/142 Safari/537.36",
      "Accept-Language":
        "en-IN,en;q=0.9",
    },
    {
      Accept:
        "text/html,*/*;q=0.8",
      "User-Agent":
        V42_USER_AGENT,
    },
  ];

  let lastError =
    null;

  for (
    let attempt = 1;
    attempt <= attempts;
    attempt++
  ) {
    const controller =
      new AbortController();

    const timeout =
      setTimeout(
        () =>
          controller.abort(),
        V42_DISCOVERY_TIMEOUT
      );

    try {
      const response =
        await fetch(
          url,
          {
            method:
              "GET",
            headers:
              headersList[
                Math.min(
                  attempt - 1,
                  headersList.length - 1
                )
              ],
            redirect:
              "follow",
            signal:
              controller.signal,
          }
        );

      if (!response.ok) {
        throw new Error(
          `HTTP ${response.status} ${response.statusText}`
        );
      }

      const html =
        await response.text();

      if (!html || html.trim().length < 50) {
        throw new Error(
          "Empty or unusable HTML response"
        );
      }

      return {
        html,
        finalUrl:
          response.url || url,
        status:
          response.status,
        attemptsUsed:
          attempt,
      };
    } catch (error) {
      lastError =
        error;

      if (attempt < attempts) {
        await new Promise(
          (resolve) =>
            setTimeout(
              resolve,
              delayMs * attempt
            )
        );
      }
    } finally {
      clearTimeout(
        timeout
      );
    }
  }

  throw lastError ||
    new Error(
      "Failed to fetch discovery page"
    );
}

// ============================================================
// V4.2 TEXT CLEANER
// ============================================================

function discoveryCleanText(
  value
) {
  if (
    value === null ||
    value === undefined
  ) {
    return "";
  }

  return String(
    value
  )
    .replace(
      /<script\b[^>]*>[\s\S]*?<\/script>/gi,
      " "
    )
    .replace(
      /<style\b[^>]*>[\s\S]*?<\/style>/gi,
      " "
    )
    .replace(
      /<noscript\b[^>]*>[\s\S]*?<\/noscript>/gi,
      " "
    )
    .replace(
      /<[^>]*>/g,
      " "
    )
    .replace(
      /&nbsp;/gi,
      " "
    )
    .replace(
      /&amp;/gi,
      "&"
    )
    .replace(
      /&quot;/gi,
      '"'
    )
    .replace(
      /&#39;/gi,
      "'"
    )
    .replace(
      /\s+/g,
      " "
    )
    .trim();
}


// ============================================================
// ABSOLUTE DISCOVERY URL
// ============================================================

function discoveryAbsoluteUrl(
  href,
  baseUrl
) {
  try {
    return new URL(
      href,
      baseUrl
    ).href;
  } catch {
    return "";
  }
}


// ============================================================
// EXTRACT DISCOVERY LINKS
// ============================================================

function extractDiscoveryLinks(
  html,
  baseUrl
) {
  const links =
    [];

  if (!html) {
    return links;
  }

  const regex =
    /<a\b([^>]*?)href=["']([^"']+)["']([^>]*)>([\s\S]*?)<\/a>/gi;

  const genericLabels = new Set([
    "apply",
    "apply now",
    "click here",
    "read more",
    "learn more",
    "view more",
    "view details",
    "details",
    "more",
    "know more",
    "visit",
    "visit website",
  ]);

  let match;

  while (
    (match =
      regex.exec(html)) !==
    null
  ) {
    const beforeAttrs =
      match[1] || "";
    const href =
      discoveryCleanText(
        match[2]
      );
    const afterAttrs =
      match[3] || "";
    const body =
      discoveryCleanText(
        match[4]
      );

    if (!href) {
      continue;
    }

    const url =
      discoveryAbsoluteUrl(
        href,
        baseUrl
      );

    if (!url) {
      continue;
    }

    const attributes =
      `${beforeAttrs} ${afterAttrs}`;

    const titleMatch =
      attributes.match(
        /\btitle=["']([^"']+)["']/i
      );

    const ariaMatch =
      attributes.match(
        /\baria-label=["']([^"']+)["']/i
      );

    let title =
      discoveryCleanText(
        titleMatch?.[1] ||
          ariaMatch?.[1] ||
          body
      );

    const normalizedTitle =
      title
        .toLowerCase()
        .trim();

    // Generic anchor text is not useful as a scheme title.
    // Derive a readable title from the URL instead.
    if (
      !title ||
      genericLabels.has(
        normalizedTitle
      )
    ) {
      try {
        const parsed =
          new URL(url);

        const slug =
          parsed.pathname
            .split("/")
            .filter(Boolean)
            .pop() ||
          "";

        title = slug
          .replace(
            /[-_]+/g,
            " "
          )
          .replace(
            /\b\w/g,
            (char) =>
              char.toUpperCase()
          )
          .trim();
      } catch {
        title = "";
      }
    }

    if (!title) {
      continue;
    }

    links.push({
      title,
      url,
    });
  }

  return links;
}

// ============================================================
// DISCOVERY URL NORMALIZATION
// ============================================================

function discoveryNormalizeUrl(
  value
) {
  if (!value) {
    return "";
  }

  try {
    const url =
      new URL(
        value
      );

    url.hash = "";

    return url.href
      .replace(
        /\/+$/,
        ""
      )
      .toLowerCase();
  } catch {
    return "";
  }
}


// ============================================================
// DISCOVERY HOSTNAME
// ============================================================

function discoveryHostname(
  url
) {
  try {
    return new URL(
      url
    ).hostname.toLowerCase();
  } catch {
    return "";
  }
}


// ============================================================
// GOVERNMENT DOMAIN
// ============================================================

function isDiscoveryGovernmentDomain(
  url
) {
  const hostname =
    discoveryHostname(
      url
    );

  if (!hostname) {
    return false;
  }

  return (
    hostname ===
      "india.gov.in" ||

    hostname.endsWith(
      ".india.gov.in"
    ) ||

    hostname ===
      "myscheme.gov.in" ||

    hostname.endsWith(
      ".myscheme.gov.in"
    ) ||

    hostname.endsWith(
      ".gov.in"
    ) ||

    hostname.endsWith(
      ".nic.in"
    )
  );
}


// ============================================================
// V4.2 NAVIGATION REJECTION
// ============================================================

const DISCOVERY_REJECT_PATTERNS = [
  /screen reader/i,

  /accessibility/i,

  /tracking system/i,

  /payment tracking/i,

  /application tracking/i,

  /status tracking/i,

  /track application/i,

  /government portal/i,

  /service portal/i,

  /portal login/i,

  /login portal/i,

  /directory/i,

  /calculator/i,

  /calendar/i,

  /sitemap/i,

  /site map/i,

  /privacy policy/i,

  /terms and conditions/i,

  /disclaimer/i,

  /contact us/i,

  /about us/i,

  /^about$/i,

  /^contact$/i,

  /^home$/i,

  /^search$/i,

  /^dashboard$/i,

  /^login$/i,

  /^register$/i,

  /^faq$/i,

  /^faqs$/i,

  /^frequently asked questions$/i,

  /^view more$/i,

  /^view all$/i,

  /^read more$/i,

  /^learn more$/i,

  /^more$/i,

  /^terms(?: and)? conditions$/i,

  /^disclaimer$/i,

  /^accessibility statement$/i,
];


// ============================================================
// DISCOVERY URL REJECTION
// ============================================================

const DISCOVERY_REJECT_URL_PATTERNS = [
  /\/search(?:[/?#]|$)/i,

  /[?&]search=/i,

  /[?&]query=/i,

  /[?&]q=/i,

  /[?&]schemeCategory=/i,

  /[?&]schemeCategoryName=/i,

  /[?&]nodalMinistryName=/i,

  /[?&]pagenumber=/i,

  /[?&]page_no=/i,

  /\/login(?:[/?#]|$)/i,

  /\/register(?:[/?#]|$)/i,

  /\/dashboard(?:[/?#]|$)/i,

  /\/accessibility(?:[/?#]|$)/i,

  /\/screen-reader(?:[/?#]|$)/i,

  /\/screenreader(?:[/?#]|$)/i,

  /\/sitemap(?:[/?#]|$)/i,

  /\/calculator(?:[/?#]|$)/i,

  /\/directory(?:[/?#]|$)/i,

  /\/grievance(?:[/?#]|$)/i,

  /\/status(?:[/?#]|$)/i,

  /\/tracking(?:[/?#]|$)/i,

  /\/faq(?:s)?(?:[/?#]|$)/i,

  /\/frequently-asked-questions(?:[/?#]|$)/i,

  /\/about(?:-us)?(?:[/?#]|$)/i,

  /\/contact(?:-us)?(?:[/?#]|$)/i,

  /\/disclaimer(?:[/?#]|$)/i,

  /\/terms(?:-and-conditions|-conditions)?(?:[/?#]|$)/i,

  /\/privacy(?:-policy)?(?:[/?#]|$)/i,
];


// ============================================================
// IS DISCOVERY NAVIGATION
// ============================================================

function isDiscoveryNavigation(
  title,
  url
) {
  const titleText =
    discoveryCleanText(
      title
    );

  const normalizedUrl =
    discoveryNormalizeUrl(
      url
    );

  // V4.4.1: official portal roots are information/navigation pages,
  // not individual government schemes. Generic portal text can contain
  // words such as scheme, yojana, eligibility, application and ministry,
  // so the root URL must be rejected before content scoring.
  try {
    const parsed = new URL(normalizedUrl);
    const hostname = parsed.hostname.toLowerCase();
    const pathname =
      parsed.pathname.replace(/\/+$/, "") || "/";

    // India.gov scheme-directory listing/filter URLs are discovery
    // seeds only. They must never become scheme candidates.
    const normalizedHost =
      hostname.replace(/^www\./, "");

    if (
      normalizedHost ===
      "india.gov.in"
    ) {
      const isSchemeDirectory =
        pathname ===
          "/my-government/schemes" ||
        pathname ===
          "/my-government/schemes/search";

      const hasDirectoryFilter =
        parsed.searchParams.has("schemeCategory") ||
        parsed.searchParams.has("schemeCategoryName") ||
        parsed.searchParams.has("nodalMinistryName") ||
        parsed.searchParams.has("pagenumber");

      if (
        isSchemeDirectory &&
        hasDirectoryFilter
      ) {
        return {
          rejected: true,
          reason: "Navigation/filter URL",
        };
      }
    }

    const isPortalRoot =
      (hostname === 'india.gov.in' && pathname === '/') ||
      (hostname === 'www.india.gov.in' && pathname === '/') ||
      (hostname === 'myscheme.gov.in' && pathname === '/') ||
      (hostname === 'www.myscheme.gov.in' && pathname === '/');

    if (isPortalRoot) {
      return {
        rejected: true,
        reason: 'Official portal home page',
      };
    }
  } catch {
    // URL validation is handled elsewhere. Continue to normal filters.
  }

  if (
    DISCOVERY_REJECT_PATTERNS.some(
      (
        pattern
      ) =>
        pattern.test(
          titleText
        )
    )
  ) {
    return {
      rejected:
        true,

      reason:
        "Navigation/service page",
    };
  }

  if (
    DISCOVERY_REJECT_URL_PATTERNS.some(
      (
        pattern
      ) =>
        pattern.test(
          normalizedUrl
        )
    )
  ) {
    const genericNavigationTitles = new Set([
    "loading...",
    "loading",
    "view more",
    "view all",
    "details",
    "view details",
    "go to home",
    "home",
  ]);

  if (
    genericNavigationTitles.has(
      titleText.toLowerCase()
    )
  ) {
    return {
      rejected: true,
      reason: "Navigation/service page",
    };
  }

  return {
      rejected:
        true,

      reason:
        "Navigation/filter URL",
    };
  }

  return {
    rejected:
      false,

    reason:
      null,
  };
}


// ============================================================
// CANDIDATE TITLE CLEANING
// ============================================================

function cleanDiscoveryCandidateTitle(
  title
) {
  return discoveryCleanText(
    title
  )
    .replace(
      /^loading\.\.\./i,
      ""
    )
    .replace(
      /\s+/g,
      " "
    )
    .trim();
}


// ============================================================
// V4.2 INITIAL CANDIDATE FILTER
// ============================================================
//
// IMPORTANT:
//
// This is only the FIRST filter.
//
// V4.3 page verification happens AFTER this.
// ============================================================

function initialDiscoveryFilter(
  link
) {
  if (!link) {
    return {
      valid:
        false,

      reason:
        "Empty candidate",
    };
  }

  const title =
    cleanDiscoveryCandidateTitle(
      link.title
    );

  const url =
    discoveryNormalizeUrl(
      link.url
    );

  if (!title) {
    return {
      valid:
        false,

      reason:
        "Empty title",
    };
  }

  if (!url) {
    return {
      valid:
        false,

      reason:
        "Invalid URL",
    };
  }

  if (
    !isDiscoveryGovernmentDomain(
      url
    )
  ) {
    return {
      valid:
        false,

      reason:
        "Non-government domain",
    };
  }

  const navigation =
    isDiscoveryNavigation(
      title,
      url
    );

  if (
    navigation.rejected
  ) {
    return {
      valid:
        false,

      reason:
        navigation.reason,
    };
  }

  return {
    valid:
      true,

    title,

    url,
  };
}


// ============================================================
// BUILD RAW DISCOVERY CANDIDATE
// ============================================================

function buildDiscoveryCandidate(
  link,
  source
) {
  return {
    title:
      cleanDiscoveryCandidateTitle(
        link.title
      ),

    schemeName:
      cleanDiscoveryCandidateTitle(
        link.title
      ),

    officialWebsite:
      discoveryNormalizeUrl(
        link.url
      ),

    applyLink:
      "",

    category:
      "",

    ministry:
      "",

    department:
      "",

    sector:
      "",

    beneficiary:
      "",

    state:
      "All India",

    description:
      "",

    status:
      "Discovered",

    sourceId:
      source.id,

    sourceName:
      source.name,

    sourceUrl:
      discoveryNormalizeUrl(
        link.url
      ),

    discoveredAt:
      new Date().toISOString(),
  };
}


// ============================================================
// V4.4.2 DISCOVERY EXPANSION
// ============================================================

const V44_MAX_LISTING_PAGES =
  Number(
    process.env.SCHEME_DISCOVERY_MAX_PAGES ||
      6
  );

const V44_MAX_LINKS_PER_SOURCE =
  Number(
    process.env.SCHEME_DISCOVERY_MAX_LINKS ||
      500
  );

const V44_MAX_RETRY_CANDIDATES =
  Number(
    process.env.SCHEME_DISCOVERY_MAX_RETRIES ||
      2
  );
  // ============================================================
// V4.5 — BLOCK 1
// OFFICIAL DISCOVERY SEED EXPANSION
// ============================================================
//
// IMPORTANT:
//
// Category / ministry / scheme-search URLs are DISCOVERY SEEDS.
// They are NOT scheme candidates.
//
// Flow:
//
// Official listing page
//       ↓
// Category / Ministry / Search URL
//       ↓
// Discovery seed
//       ↓
// Crawl seed page
//       ↓
// Extract actual scheme/detail URLs
//       ↓
// V4.4.4 verification
//
// V4.4.4 verification rules remain untouched.
// ============================================================

const V45_DISCOVERY_VERSION =
  "4.9.0-GENERAL-SCHEMES-MULTI-SOURCE-1.0";

const V45_MAX_SEED_PAGES =
  Number(
    process.env.SCHEME_DISCOVERY_MAX_SEED_PAGES ||
      20
  );

const V45_MAX_CATEGORY_SEEDS =
  Number(
    process.env.SCHEME_DISCOVERY_MAX_CATEGORY_SEEDS ||
      30
  );

const V45_MAX_MINISTRY_SEEDS =
  Number(
    process.env.SCHEME_DISCOVERY_MAX_MINISTRY_SEEDS ||
      30
  );


// ============================================================
// V4.5 SEED TYPES
// ============================================================

const V45_SEED_TYPES = Object.freeze({
  CATEGORY:
    "CATEGORY",

  MINISTRY:
    "MINISTRY",

  SEARCH:
    "SEARCH",

  PAGINATION:
    "PAGINATION",
});


// ============================================================
// V4.5 INDIA.GOV CATEGORY URL DETECTOR
// ============================================================

function isIndiaGovCategorySeed(
  url
) {
  if (!url) {
    return false;
  }

  try {
    const parsed =
      new URL(url);

    const hostname =
      parsed.hostname.toLowerCase();

    if (
      hostname !==
        "india.gov.in" &&
      !hostname.endsWith(
        ".india.gov.in"
      )
    ) {
      return false;
    }

    const pathname =
      parsed.pathname
        .replace(/\/+$/, "")
        .toLowerCase();

    if (
      pathname !==
      "/my-government/schemes/search"
    ) {
      return false;
    }

    const params =
      parsed.searchParams;

    return (
      params.has(
        "schemecategory"
      ) ||
      params.has(
        "schemecategoryname"
      )
    );
  } catch {
    return false;
  }
}


// ============================================================
// V4.5 INDIA.GOV MINISTRY URL DETECTOR
// ============================================================

function isIndiaGovMinistrySeed(
  url
) {
  if (!url) {
    return false;
  }

  try {
    const parsed =
      new URL(url);

    const hostname =
      parsed.hostname.toLowerCase();

    if (
      hostname !==
        "india.gov.in" &&
      !hostname.endsWith(
        ".india.gov.in"
      )
    ) {
      return false;
    }

    const pathname =
      parsed.pathname
        .replace(/\/+$/, "")
        .toLowerCase();

    if (
      pathname !==
      "/my-government/schemes/search"
    ) {
      return false;
    }

    const params =
      parsed.searchParams;

    return (
      params.has(
        "nodalministryname"
      ) ||
      params.has(
        "ministry"
      ) ||
      params.has(
        "ministryname"
      )
    );
  } catch {
    return false;
  }
}


// ============================================================
// V4.5 GENERIC SCHEME SEARCH SEED DETECTOR
// ============================================================

function isIndiaGovSchemeSearchSeed(
  url
) {
  if (!url) {
    return false;
  }

  try {
    const parsed =
      new URL(url);

    const hostname =
      parsed.hostname.toLowerCase();

    if (
      hostname !==
        "india.gov.in" &&
      !hostname.endsWith(
        ".india.gov.in"
      )
    ) {
      return false;
    }

    const pathname =
      parsed.pathname
        .replace(/\/+$/, "")
        .toLowerCase();

    return (
      pathname ===
        "/my-government/schemes/search"
    );
  } catch {
    return false;
  }
}


// ============================================================
// V4.5 CLASSIFY DISCOVERY SEED
// ============================================================

function classifyV45DiscoverySeed(
  url,
  title = ""
) {
  if (!url) {
    return null;
  }

  if (
    isIndiaGovCategorySeed(
      url
    )
  ) {
    return {
      type:
        V45_SEED_TYPES.CATEGORY,

      url:
        discoveryNormalizeUrl(
          url
        ),

      title:
        cleanDiscoveryCandidateTitle(
          title
        ),
    };
  }

  if (
    isIndiaGovMinistrySeed(
      url
    )
  ) {
    return {
      type:
        V45_SEED_TYPES.MINISTRY,

      url:
        discoveryNormalizeUrl(
          url
        ),

      title:
        cleanDiscoveryCandidateTitle(
          title
        ),
    };
  }

  if (
    isIndiaGovSchemeSearchSeed(
      url
    )
  ) {
    return {
      type:
        V45_SEED_TYPES.SEARCH,

      url:
        discoveryNormalizeUrl(
          url
        ),

      title:
        cleanDiscoveryCandidateTitle(
          title
        ),
    };
  }

  return null;
}


// ============================================================
// V4.5 COLLECT OFFICIAL DISCOVERY SEEDS
// ============================================================

function collectV45DiscoverySeeds(
  links
) {
  const seeds = [];

  const seen =
    new Set();

  let categoryCount =
    0;

  let ministryCount =
    0;

  for (
    const link of
    links || []
  ) {
    if (
      !link ||
      !link.url
    ) {
      continue;
    }

    const seed =
      classifyV45DiscoverySeed(
        link.url,
        link.title
      );

    if (!seed) {
      continue;
    }

    if (
      !seed.url ||
      seen.has(
        seed.url
      )
    ) {
      continue;
    }

    if (
      seed.type ===
        V45_SEED_TYPES.CATEGORY &&
      categoryCount >=
        V45_MAX_CATEGORY_SEEDS
    ) {
      continue;
    }

    if (
      seed.type ===
        V45_SEED_TYPES.MINISTRY &&
      ministryCount >=
        V45_MAX_MINISTRY_SEEDS
    ) {
      continue;
    }

    seen.add(
      seed.url
    );

    if (
      seed.type ===
      V45_SEED_TYPES.CATEGORY
    ) {
      categoryCount++;
    }

    if (
      seed.type ===
      V45_SEED_TYPES.MINISTRY
    ) {
      ministryCount++;
    }

    seeds.push(
      seed
    );

    if (
      seeds.length >=
      V45_MAX_SEED_PAGES
    ) {
      break;
    }
  }

  return {
    seeds,

    counts: {
      total:
        seeds.length,

      category:
        categoryCount,

      ministry:
        ministryCount,

      search:
        seeds.filter(
          (seed) =>
            seed.type ===
            V45_SEED_TYPES.SEARCH
        ).length,
    },
  };
}


// ============================================================
// V4.5 DISCOVERY SEED SAFETY CHECK
// ============================================================
//
// A seed is allowed to be crawled only when:
//
// 1. It belongs to india.gov.in
// 2. It is a scheme-search URL
// 3. It is a category/ministry/search filter
//
// The seed itself must NEVER become a scheme candidate.
// ============================================================

function isV45SafeDiscoverySeed(
  url
) {
  const seed =
    classifyV45DiscoverySeed(
      url
    );

  return Boolean(
    seed &&
    seed.url
  );
}
// ============================================================
// V4.5 — BLOCK 2
// OFFICIAL DISCOVERY SEED CRAWLER
// ============================================================
//
// Purpose:
//
// BLOCK 1 identifies official India.gov.in scheme-search URLs
// as DISCOVERY SEEDS.
//
// BLOCK 2 actually crawls those seeds.
//
// IMPORTANT:
//
// A seed page is NEVER itself treated as a scheme candidate.
//
// Only links extracted from the seed page are returned for the
// next V4.5 discovery stage.
//
// Flow:
//
// CATEGORY / MINISTRY SEED
//          ↓
//      FETCH PAGE
//          ↓
//    EXTRACT LINKS
//          ↓
//    DISCOVER NEXT PAGE
//          ↓
//      FETCH NEXT
//          ↓
//    RETURN LINKS
//
// V4.4.4 verification remains untouched.
// ============================================================


// ============================================================
// V4.5 SEED FETCH RESULT
// ============================================================

function createV45SeedPageResult(
  seed
) {
  return {
    seed,
    pagesScanned: 0,
    linksScanned: 0,
    fetchFailures: 0,
    pages: [],
    links: [],
    errors: [],
  };
}


// ============================================================
// V4.5 SEED PAGE NORMALIZATION
// ============================================================

function normalizeV45SeedPageUrl(
  url
) {
  if (!url) {
    return "";
  }

  try {
    const parsed =
      new URL(url);

    parsed.hash = "";

    return parsed.toString();
  } catch {
    return String(
      url
    ).trim();
  }
}


// ============================================================
// V4.5 SEED PAGINATION URL
// ============================================================
//
// India.gov currently exposes pagination through pagenumber.
//
// We preserve every existing query parameter.
//
// Example:
//
// ?schemecategory=12
//
// becomes:
//
// ?schemecategory=12&pagenumber=2
// ============================================================

function buildV45SeedPageUrl(
  seedUrl,
  pageNumber
) {
  if (
    !seedUrl ||
    !Number.isFinite(
      pageNumber
    )
  ) {
    return "";
  }

  try {
    const parsed =
      new URL(
        seedUrl
      );

    parsed.searchParams.set(
      "pagenumber",
      String(
        pageNumber
      )
    );

    parsed.hash = "";

    return parsed.toString();
  } catch {
    return "";
  }
}


// ============================================================
// V4.5 DISCOVER PAGINATION FROM SEED PAGE
// ============================================================

function discoverV45SeedPagination(
  links,
  currentUrl
) {
  const candidates =
    [];

  const seen =
    new Set();

  const add =
    (url) => {
      const normalized =
        normalizeV45SeedPageUrl(
          url
        );

      if (
        !normalized ||
        seen.has(
          normalized
        )
      ) {
        return;
      }

      if (
        !isV45SafeDiscoverySeed(
          normalized
        )
      ) {
        return;
      }

      seen.add(
        normalized
      );

      candidates.push(
        normalized
      );
    };

  for (
    const link of
    links || []
  ) {
    if (
      !link ||
      !link.url
    ) {
      continue;
    }

    const normalized =
      normalizeV45SeedPageUrl(
        link.url
      );

    if (
      !normalized
    ) {
      continue;
    }

    try {
      const current =
        new URL(
          currentUrl
        );

      const next =
        new URL(
          normalized
        );

      if (
        next.hostname !==
        current.hostname
      ) {
        continue;
      }

      const currentPath =
        current.pathname
          .replace(
            /\/+$/,
            ""
          )
          .toLowerCase();

      const nextPath =
        next.pathname
          .replace(
            /\/+$/,
            ""
          )
          .toLowerCase();

      if (
        currentPath !==
        nextPath
      ) {
        continue;
      }

      const nextParams =
        next.searchParams;

      if (
        nextParams.has(
          "pagenumber"
        )
      ) {
        add(
          normalized
        );
        continue;
      }

      if (
        nextParams.has(
          "page"
        ) ||
        nextParams.has(
          "page_number"
        )
      ) {
        add(
          normalized
        );
      }
    } catch {
      // Ignore malformed pagination URLs.
    }
  }

  return candidates;
}


// ============================================================
// V4.5 FETCH SEED PAGE
// ============================================================
//
// Uses the existing V4.4 fetch helper when available.
//
// This deliberately avoids creating a second HTTP engine.
// ============================================================

async function fetchV45SeedPage(
  url
) {
  if (
    typeof fetchDiscoveryHtml ===
    "function"
  ) {
    return fetchDiscoveryHtml(
      url
    );
  }

  if (
    typeof fetchHtmlWithRetry ===
    "function"
  ) {
    return fetchHtmlWithRetry(
      url
    );
  }

  if (
    typeof fetchHtml ===
    "function"
  ) {
    return fetchHtml(
      url
    );
  }

  throw new Error(
    "No discovery HTML fetch helper is available."
  );
}


// ============================================================
// V4.5 EXTRACT LINKS FROM SEED PAGE
// ============================================================

function extractV45SeedLinks(
  html,
  pageUrl
) {
  if (
    !html ||
    !pageUrl
  ) {
    return [];
  }

  try {
    const links =
      extractDiscoveryLinks(
        html,
        pageUrl
      );

    if (
      Array.isArray(
        links
      )
    ) {
      return links;
    }

    return [];
  } catch {
    return [];
  }
}


// ============================================================
// V4.5 CRAWL ONE SEED
// ============================================================

async function crawlV45DiscoverySeed(
  seed
) {
  const result =
    createV45SeedPageResult(
      seed
    );

  if (
    !seed ||
    !seed.url
  ) {
    return result;
  }

  const queue =
    [
      normalizeV45SeedPageUrl(
        seed.url
      ),
    ];

  const visited =
    new Set();

  const discoveredLinks =
    new Map();

  let pageNumber =
    0;

  while (
    queue.length > 0 &&
    pageNumber <
      V45_MAX_SEED_PAGES
  ) {
    const pageUrl =
      queue.shift();

    const normalized =
      normalizeV45SeedPageUrl(
        pageUrl
      );

    if (
      !normalized ||
      visited.has(
        normalized
      )
    ) {
      continue;
    }

    if (
      !isV45SafeDiscoverySeed(
        normalized
      )
    ) {
      continue;
    }

    visited.add(
      normalized
    );

    pageNumber++;

    try {
      const response =
        await fetchV45SeedPage(
          normalized
        );

      const html =
        response?.html ||
        response?.body ||
        response?.content ||
        "";

      if (
        !html ||
        html.length <
          100
      ) {
        result.fetchFailures++;

        result.errors.push({
          url:
            normalized,

          reason:
            "Insufficient HTML content",
        });

        continue;
      }

      result.pagesScanned++;

      result.pages.push({
        url:
          normalized,

        pageNumber,

        seedType:
          seed.type,
      });

      const links =
        extractV45SeedLinks(
          html,
          normalized
        );

      result.linksScanned +=
        links.length;

      for (
        const link of
        links
      ) {
        if (
          !link ||
          !link.url
        ) {
          continue;
        }

        let linkUrl =
          "";

        try {
          linkUrl =
            normalizeV45SeedPageUrl(
              new URL(
                link.url,
                normalized
              ).toString()
            );
        } catch {
          continue;
        }

        if (
          !linkUrl
        ) {
          continue;
        }

        if (
          !discoveredLinks.has(
            linkUrl
          )
        ) {
          discoveredLinks.set(
            linkUrl,
            {
              url:
                linkUrl,

              title:
                cleanDiscoveryCandidateTitle(
                  link.title ||
                    ""
                ),

              sourceSeed:
                seed.url,

              seedType:
                seed.type,

              discoverySeedTitle:
                seed.title || "",

              seedCategory:
                /schemecategory=16/i.test(seed.url) || /business[- ]self[- ]employed/i.test(seed.title || "")
                  ? "Business & Self-employed"
                  : /schemecategory=2(?:&|%26|$)/i.test(seed.url) || /\bjobs\b/i.test(seed.title || "")
                    ? "Jobs"
                    : "",

              sourcePage:
                normalized,
            }
          );
        }
      }

      // ------------------------------------------------------
      // Discover next pagination pages.
      // ------------------------------------------------------

      const pagination =
        discoverV45SeedPagination(
          links,
          normalized
        );

      for (
        const nextUrl of
        pagination
      ) {
        if (
          !visited.has(
            nextUrl
          ) &&
          !queue.includes(
            nextUrl
          )
        ) {
          queue.push(
            nextUrl
          );
        }
      }

      // ------------------------------------------------------
      // Explicit India.gov pagenumber fallback.
      //
      // This allows category/ministry pages to continue even
      // when the HTML does not expose a conventional "next"
      // anchor.
      // ------------------------------------------------------

      if (
        pageNumber <
        V45_MAX_SEED_PAGES
      ) {
        const nextPage =
          pageNumber + 1;

        const nextUrl =
          buildV45SeedPageUrl(
            normalized,
            nextPage
          );

        if (
          nextUrl &&
          !visited.has(
            nextUrl
          ) &&
          !queue.includes(
            nextUrl
          )
        ) {
          queue.push(
            nextUrl
          );
        }
      }
    } catch (
      error
    ) {
      result.fetchFailures++;

      result.errors.push({
        url:
          normalized,

        reason:
          error?.message ||
          "Seed page fetch failed",
      });
    }
  }

  result.links =
    Array.from(
      discoveredLinks.values()
    );

  return result;
}


// ============================================================
// V4.5 CRAWL ALL DISCOVERY SEEDS
// ============================================================

async function crawlV45DiscoverySeeds(
  seeds
) {
  const safeSeeds =
    Array.isArray(
      seeds
    )
      ? seeds.filter(
          (seed) =>
            seed &&
            seed.url &&
            isV45SafeDiscoverySeed(
              seed.url
            )
        )
      : [];

  const results =
    [];

  const allLinks =
    new Map();

  let pagesScanned =
    0;

  let linksScanned =
    0;

  let fetchFailures =
    0;

  for (
    const seed of
    safeSeeds
  ) {
    const result =
      await crawlV45DiscoverySeed(
        seed
      );

    results.push(
      result
    );

    pagesScanned +=
      result.pagesScanned;

    linksScanned +=
      result.linksScanned;

    fetchFailures +=
      result.fetchFailures;

    for (
      const link of
      result.links || []
    ) {
      if (
        !link ||
        !link.url
      ) {
        continue;
      }

      if (
        !allLinks.has(
          link.url
        )
      ) {
        allLinks.set(
          link.url,
          link
        );
      }
    }
  }

  return {
    seedsScanned:
      safeSeeds.length,

    pagesScanned,

    linksScanned,

    fetchFailures,

    links:
      Array.from(
        allLinks.values()
      ),

    results,
  };
}


// ============================================================
// V4.5 SEED CRAWL SAFETY FILTER
// ============================================================
//
// These URLs were crawled to DISCOVER schemes.
//
// They must not be returned as actual scheme candidates.
// ============================================================

function removeV45SeedUrlsFromCandidates(
  links
) {
  return (
    links || []
  ).filter(
    (link) => {
      if (
        !link ||
        !link.url
      ) {
        return false;
      }

      return !isV45SafeDiscoverySeed(
        link.url
      );
    }
  );
}
// ============================================================
// V4.5 — BLOCK 3
// DEEP SCHEME-LINK EXTRACTION
// ============================================================
//
// Purpose:
//
// Convert links discovered from category/ministry/search pages
// into likely scheme-detail candidates.
//
// IMPORTANT:
//
// This block DOES NOT verify schemes.
//
// It only improves candidate discovery.
//
// Final verification remains:
//
//     V4.4.4 Smart Verification
//
// ============================================================


// ============================================================
// V4.5 SCHEME DETAIL PATH SIGNALS
// ============================================================

const V45_SCHEME_DETAIL_PATH_SIGNALS =
  Object.freeze([
    "/scheme/",
    "/schemes/",
    "/scheme-details/",
    "/scheme-detail/",
    "/schemedetail/",
    "/schemedetails/",
    "/government-scheme/",
    "/government-schemes/",
    "/yojana/",
    "/yojanas/",
    "/program/",
    "/programs/",
    "/programme/",
    "/programmes/",
    "/initiative/",
    "/initiatives/",
    "/benefit/",
    "/benefits/",
    "/subsidy/",
    "/subsidies/",
  ]);


// ============================================================
// V4.5 SCHEME DETAIL TITLE SIGNALS
// ============================================================

const V45_SCHEME_DETAIL_TITLE_SIGNALS =
  Object.freeze([
    "scheme",
    "yojana",
    "subsidy",
    "programme",
    "program",
    "initiative",
    "benefit",
    "assistance",
    "grant",
    "pension",
    "loan",
    "financial assistance",
    "government scheme",
  ]);


// ============================================================
// V4.5 NON-SCHEME PATH SIGNALS
// ============================================================

const V45_NON_SCHEME_PATH_SIGNALS =
  Object.freeze([
    "/about",
    "/about-us",
    "/contact",
    "/contact-us",
    "/faq",
    "/faqs",
    "/help",
    "/support",
    "/login",
    "/logout",
    "/register",
    "/signup",
    "/sign-in",
    "/sign-up",
    "/dashboard",
    "/profile",
    "/privacy",
    "/privacy-policy",
    "/terms",
    "/terms-conditions",
    "/disclaimer",
    "/accessibility",
    "/accessibility-statement",
    "/calendar",
    "/search",
    "/filter",
    "/filters",
    "/category",
    "/categories",
    "/ministry",
    "/ministries",
    "/sitemap",
    "/feedback",
    "/grievance",
  ]);


// ============================================================
// V4.5 NON-SCHEME FILE EXTENSIONS
// ============================================================

const V45_NON_SCHEME_EXTENSIONS =
  Object.freeze([
    ".pdf",
    ".doc",
    ".docx",
    ".xls",
    ".xlsx",
    ".ppt",
    ".pptx",
    ".zip",
    ".jpg",
    ".jpeg",
    ".png",
    ".gif",
    ".svg",
    ".mp4",
    ".mp3",
  ]);


// ============================================================
// V4.5 NORMALIZE DISCOVERED LINK
// ============================================================

function normalizeV45DiscoveredLink(
  link,
  sourcePage
) {
  if (!link) {
    return null;
  }

  const rawUrl =
    typeof link ===
    "string"
      ? link
      : link.url;

  if (!rawUrl) {
    return null;
  }

  try {
    const parsed =
      new URL(
        rawUrl,
        sourcePage
      );

    parsed.hash = "";

    return {
      url:
        parsed.toString(),

      title:
        cleanDiscoveryCandidateTitle(
          typeof link ===
            "string"
            ? ""
            : link.title ||
                ""
        ),

      sourcePage:
        sourcePage || "",
    };
  } catch {
    return null;
  }
}


// ============================================================
// V4.5 SAME OFFICIAL DOMAIN CHECK
// ============================================================

function isV45SameOfficialDomain(
  url,
  sourceUrl
) {
  if (
    !url ||
    !sourceUrl
  ) {
    return false;
  }

  try {
    const target =
      new URL(url);

    const source =
      new URL(sourceUrl);

    const targetHost =
      target.hostname
        .toLowerCase()
        .replace(
          /^www\./,
          ""
        );

    const sourceHost =
      source.hostname
        .toLowerCase()
        .replace(
          /^www\./,
          ""
        );

    return (
      targetHost ===
      sourceHost
    );
  } catch {
    return false;
  }
}


// ============================================================
// V4.5 GOVERNMENT DOMAIN CHECK
// ============================================================

function isV45GovernmentDomain(
  url
) {
  if (!url) {
    return false;
  }

  try {
    const parsed =
      new URL(url);

    const hostname =
      parsed.hostname
        .toLowerCase()
        .replace(
          /^www\./,
          ""
        );

    return (
      hostname ===
        "india.gov.in" ||
      hostname.endsWith(
        ".gov.in"
      ) ||
      hostname.endsWith(
        ".nic.in"
      ) ||
      hostname.endsWith(
        ".gov"
      ) ||
      hostname.endsWith(
        ".ac.in"
      ) ||
      hostname.endsWith(
        ".edu.in"
      )
    );
  } catch {
    return false;
  }
}


// ============================================================
// V4.5 NON-SCHEME URL CHECK
// ============================================================

function isV45NonSchemeUrl(
  url
) {
  if (!url) {
    return true;
  }

  try {
    const parsed =
      new URL(url);

    const pathname =
      parsed.pathname
        .toLowerCase()
        .replace(
          /\/+/g,
          "/"
        );

    // --------------------------------------------------------
    // Official portal home/root pages are never deep scheme
    // candidates, even though they are government domains.
    // --------------------------------------------------------

    if (
      pathname === "/" ||
      pathname === "" ||
      (
        parsed.hostname
          .toLowerCase()
          .replace(/^www\./, "") ===
        "india.gov.in" &&
        pathname === "/my-government"
      )
    ) {
      return true;
    }

    // --------------------------------------------------------
    // Known navigation/service paths
    // --------------------------------------------------------

    for (
      const signal of
      V45_NON_SCHEME_PATH_SIGNALS
    ) {
      if (
        pathname ===
          signal ||
        pathname.startsWith(
          `${signal}/`
        )
      ) {
        return true;
      }
    }

    // --------------------------------------------------------
    // File downloads
    // --------------------------------------------------------

    for (
      const extension of
      V45_NON_SCHEME_EXTENSIONS
    ) {
      if (
        pathname.endsWith(
          extension
        )
      ) {
        return true;
      }
    }

    // --------------------------------------------------------
    // Social / external service URLs
    // --------------------------------------------------------

    const hostname =
      parsed.hostname
        .toLowerCase();

    if (
      hostname.includes(
        "facebook.com"
      ) ||
      hostname.includes(
        "twitter.com"
      ) ||
      hostname ===
        "x.com" ||
      hostname.includes(
        "youtube.com"
      ) ||
      hostname.includes(
        "instagram.com"
      ) ||
      hostname.includes(
        "linkedin.com"
      )
    ) {
      return true;
    }

    return false;
  } catch {
    return true;
  }
}


// ============================================================
// V4.5 URL DETAIL SCORE
// ============================================================

function scoreV45SchemeDetailUrl(
  url,
  title = ""
) {
  if (!url) {
    return {
      score: 0,
      signals: [],
    };
  }

  let score =
    0;

  const signals =
    [];

  let parsed;

  try {
    parsed =
      new URL(url);
  } catch {
    return {
      score: 0,
      signals: [],
    };
  }

  const pathname =
    parsed.pathname
      .toLowerCase();

  const normalizedTitle =
    String(
      title || ""
    )
      .toLowerCase();

  // --------------------------------------------------------
  // Detail-path signals
  // --------------------------------------------------------

  for (
    const signal of
    V45_SCHEME_DETAIL_PATH_SIGNALS
  ) {
    if (
      pathname.includes(
        signal
      )
    ) {
      score += 5;

      signals.push({
        type:
          "PATH",

        signal,

        weight: 5,
      });

      break;
    }
  }

  // --------------------------------------------------------
  // Title signals
  // --------------------------------------------------------

  for (
    const signal of
    V45_SCHEME_DETAIL_TITLE_SIGNALS
  ) {
    if (
      normalizedTitle.includes(
        signal
      )
    ) {
      score += 3;

      signals.push({
        type:
          "TITLE",

        signal,

        weight: 3,
      });

      break;
    }
  }

  // --------------------------------------------------------
  // Government domain
  // --------------------------------------------------------

  if (
    isV45GovernmentDomain(
      url
    )
  ) {
    score += 2;

    signals.push({
      type:
        "GOVERNMENT_DOMAIN",

      weight: 2,
    });
  }

  // --------------------------------------------------------
  // Query-based detail identifiers
  // --------------------------------------------------------

  const detailParameters =
    [
      "schemeid",
      "scheme_id",
      "schemeId",
      "schemeid",
      "slug",
      "scheme",
      "schemeName",
    ];

  for (
    const parameter of
    detailParameters
  ) {
    if (
      parsed.searchParams.has(
        parameter
      )
    ) {
      score += 3;

      signals.push({
        type:
          "DETAIL_PARAMETER",

        parameter,

        weight: 3,
      });

      break;
    }
  }

  return {
    score,
    signals,
  };
}


// ============================================================
// V4.5 EXTRACT SCHEME DETAIL CANDIDATE
// ============================================================

function extractV45SchemeDetailCandidate(
  link
) {
  if (
    !link ||
    !link.url
  ) {
    return null;
  }

  const normalized =
    normalizeV45DiscoveredLink(
      link,
      link.sourcePage
    );

  if (!normalized) {
    return null;
  }

  const url =
    normalized.url;

  // --------------------------------------------------------
  // Discovery seeds are never candidates.
  // --------------------------------------------------------

  if (
    isV45SafeDiscoverySeed(
      url
    )
  ) {
    return null;
  }

  // --------------------------------------------------------
  // Known non-scheme URLs are discarded.
  // --------------------------------------------------------

  if (
    isV45NonSchemeUrl(
      url
    )
  ) {
    return null;
  }

  // --------------------------------------------------------
  // Only official domains are considered at this stage.
  //
  // Existing V4.4.4 verification still performs the final
  // domain validation.
  // --------------------------------------------------------

  if (
    !isV45GovernmentDomain(
      url
    )
  ) {
    return null;
  }

  const detail =
    scoreV45SchemeDetailUrl(
      url,
      normalized.title
    );

  // --------------------------------------------------------
  // V4.5.4 DEEP-LINK GATE
  //
  // Government domain alone is NEVER enough.
  // The previous V4.5.3 rule accepted the India.gov home page
  // because GOVERNMENT_DOMAIN contributed +2 points.
  //
  // A deep candidate must now contain at least one actual
  // scheme-detail signal:
  //   PATH              -> scheme/yojana/benefit/etc.
  //   TITLE             -> scheme/yojana/subsidy/pension/etc.
  //   DETAIL_PARAMETER  -> schemeId/slug/schemeName/etc.
  //
  // The existing V4.4.4 Smart Verification remains the final
  // acceptance gate.
  // --------------------------------------------------------

  const hasDeepDetailSignal =
    detail.signals.some(
      (signal) =>
        signal.type ===
          "PATH" ||
        signal.type ===
          "TITLE" ||
        signal.type ===
          "DETAIL_PARAMETER"
    );

  // --------------------------------------------------------
  // V4.5.5 LISTING-LINK FALLBACK
  //
  // India.gov currently exposes many real scheme links from
  // /my-government/schemes/search pages without a predictable
  // /scheme/... URL pattern. Those links can point directly to
  // an official .gov.in/.nic.in service/site and their anchor
  // title is often the only scheme identity available during
  // discovery.
  //
  // We therefore allow a second, tightly controlled path:
  //   * link came from an India.gov scheme-search seed page
  //   * target is an official government domain
  //   * target is not a known navigation/service/filter URL
  //   * anchor title is meaningful (not generic navigation)
  //
  // Smart Verification remains the final acceptance gate.
  // --------------------------------------------------------

  const sourcePage =
    String(
      normalized.sourcePage ||
        ""
    );

  const fromIndiaGovSchemeSearch =
    isIndiaGovSchemeSearchSeed(
      sourcePage
    );

  const title =
    cleanDiscoveryCandidateTitle(
      normalized.title ||
        ""
    );

  const normalizedTitle =
    title
      .toLowerCase()
      .replace(/\s+/g, " ")
      .trim();

  const genericLinkTitles =
    new Set([
      "home",
      "go to home",
      "calendar",
      "help",
      "screen reader",
      "contact",
      "contact us",
      "about",
      "about us",
      "faq",
      "faqs",
      "details",
      "view details",
      "read more",
      "learn more",
      "more",
      "visit",
      "visit website",
      "apply",
      "apply now",
      "login",
      "dashboard",
      "privacy policy",
      "terms and conditions",
      "terms & conditions",
    ]);

  const meaningfulTitle =
    normalizedTitle.length >= 4 &&
    !genericLinkTitles.has(
      normalizedTitle
    ) &&
    !/^(next|previous|page \d+|\d+)$/.test(
      normalizedTitle
    );

  let targetPath =
    "";

  try {
    targetPath =
      new URL(url)
        .pathname
        .toLowerCase()
        .replace(/\/+$/, "");
  } catch {
    targetPath = "";
  }

  const hasRealTargetPath =
    targetPath.length > 1 &&
    targetPath !==
      "/my-government/schemes" &&
    targetPath !==
      "/my-government";

  const listingLinkFallback =
    fromIndiaGovSchemeSearch &&
    isV45GovernmentDomain(url) &&
    meaningfulTitle &&
    hasRealTargetPath;

  if (
    !hasDeepDetailSignal &&
    !listingLinkFallback
  ) {
    return null;
  }

  const discoverySignals =
    hasDeepDetailSignal
      ? detail.signals
      : [
          ...detail.signals,
          {
            type:
              "SCHEME_SEARCH_LISTING_LINK",
            weight: 2,
          },
        ];

  const discoveryScore =
    Math.max(
      detail.score,
      listingLinkFallback
        ? 4
        : 0
    );

  return {
    url,

    title:
      normalized.title,

    sourcePage:
      normalized.sourcePage,

    discoveryType:
      "V4.5_DEEP_SCHEME_LINK",

    discoveryScore:
      discoveryScore,

    discoverySignals:
      discoverySignals,
  };
}


// ============================================================
// V4.5 EXTRACT SCHEME CANDIDATES FROM CRAWLED LINKS
// ============================================================

function extractV45SchemeCandidates(
  links
) {
  const candidates =
    [];

  const seen =
    new Set();

  for (
    const link of
    links || []
  ) {
    const candidate =
      extractV45SchemeDetailCandidate(
        link
      );

    if (
      !candidate ||
      !candidate.url
    ) {
      continue;
    }

    const normalizedUrl =
      discoveryNormalizeUrl(
        candidate.url
      );

    if (
      !normalizedUrl ||
      seen.has(
        normalizedUrl
      )
    ) {
      continue;
    }

    seen.add(
      normalizedUrl
    );

    candidates.push({
      ...candidate,

      url:
        normalizedUrl,
    });
  }

  // Highest discovery evidence first.
  candidates.sort(
    (
      a,
      b
    ) =>
      (
        b.discoveryScore ||
        0
      ) -
      (
        a.discoveryScore ||
        0
      )
  );

  return candidates;
}


// ============================================================
// V4.5 DEEP EXTRACTION SUMMARY
// ============================================================

function buildV45DeepExtractionSummary(
  links,
  candidates
) {
  return {
    linksReceived:
      Array.isArray(
        links
      )
        ? links.length
        : 0,

    candidatesExtracted:
      Array.isArray(
        candidates
      )
        ? candidates.length
        : 0,

    rejectedAtDiscovery:
      Math.max(
        0,
        (
          Array.isArray(
            links
          )
            ? links.length
            : 0
        ) -
          (
            Array.isArray(
              candidates
            )
              ? candidates.length
              : 0
          )
      ),
  };
}


// ============================================================
// V4.5 MERGE DEEP CANDIDATES WITH EXISTING DISCOVERY
// ============================================================
//
// Existing V4.4.4 candidates are preserved.
// V4.5 candidates are added only when their normalized URL
// does not already exist.
// ============================================================

function mergeV45Candidates(
  existingCandidates,
  deepCandidates
) {
  const merged =
    [];

  const seen =
    new Set();

  for (
    const candidate of
    [
      ...(existingCandidates ||
        []),
      ...(deepCandidates ||
        []),
    ]
  ) {
    if (
      !candidate
    ) {
      continue;
    }

    // V4.4.4 candidates use officialWebsite/applyLink/sourceUrl,
    // while V4.5 deep candidates use url. Resolve both shapes.
    const candidateUrl =
      candidate.url ||
      candidate.officialWebsite ||
      candidate.applyLink ||
      candidate.sourceUrl ||
      candidate.website ||
      "";

    const normalizedUrl =
      discoveryNormalizeUrl(
        candidateUrl
      );

    if (
      !normalizedUrl ||
      seen.has(
        normalizedUrl
      )
    ) {
      continue;
    }

    seen.add(
      normalizedUrl
    );

    merged.push({
      ...candidate,

      url:
        normalizedUrl,
    });
  }

  return merged;
}
// ============================================================
// V4.5 — BLOCK 4
// FINAL DISCOVERY PIPELINE INTEGRATION
// ============================================================
//
// V4.5 flow:
//
// V4.4.4 SOURCE DISCOVERY
//          ↓
// V4.5 CATEGORY / MINISTRY SEEDS
//          ↓
// V4.5 SEED CRAWLER
//          ↓
// V4.5 DEEP SCHEME-LINK EXTRACTION
//          ↓
// MERGE + DEDUPLICATE
//          ↓
// EXISTING V4.4.4 SMART VERIFICATION
//          ↓
// VERIFIED / REJECTED / UNVERIFIED
//          ↓
// CONFIDENCE FILTER
//          ↓
// EXISTING / POSSIBLE / NEW MATCHING
//
// IMPORTANT:
//
// This block does NOT modify the Smart Verification Engine.
// ============================================================


// ============================================================
// ============================================================
// V4.5 — BLOCK 5.1
// NGSP MIGRATION-AWARE SERVICE-LINK EXTRACTION
// ============================================================
//
// IMPORTANT:
// The National Government Services Portal (NGSP) was migrated
// into the current National Portal of India in May 2026.
//
// Therefore V4.5 must NOT depend only on the retired:
//   services.india.gov.in/service/listing
//
// Current service detail pages use:
//   https://www.india.gov.in/services/details/...
//
// We still support legacy NGSP links:
//   https://services.india.gov.in/service/detail/...
//
// BLOCK 5 extracts SERVICE LINKS only.
// V4.4.4 Smart Verification remains the final scheme gate.
// ============================================================

const V45_NGSP_SOURCE = Object.freeze({
  id:
    "national-government-services",

  name:
    "National Government Services Portal — Migrated Services",

  url:
    "https://www.india.gov.in/services",

  type:
    "html",

  category:
    "Government Services",

  official:
    true,

  governmentDomain:
    true,

  migrationStatus:
    "NGSP_MIGRATED_TO_INDIA_PORTAL",
});


// ------------------------------------------------------------
// Current India Portal pages used for migrated NGSP discovery.
// These are deliberately limited to high-value service/scheme
// areas instead of crawling the entire portal.
// ------------------------------------------------------------

const V45_NGSP_MIGRATED_SOURCES = Object.freeze([
  Object.freeze({
    id:
      "india-portal-services",

    name:
      "India Portal — Services",

    url:
      "https://www.india.gov.in/services",

    category:
      "Government Services",
  }),

  Object.freeze({
    id:
      "india-portal-business-services",

    name:
      "India Portal — Business & Self-employed Services",

    url:
      "https://www.india.gov.in/category/business-self-employed",

    category:
      "Business & Self-employed",
  }),

  Object.freeze({
    id:
      "india-portal-benefits-services",

    name:
      "India Portal — Benefits & Social development Services",

    url:
      "https://www.india.gov.in/category/benefits-social-development",

    category:
      "Benefits & Social development",
  }),

  Object.freeze({
    id:
      "india-portal-agriculture-services",

    name:
      "India Portal — Agriculture, Rural & Environment Services",

    url:
      "https://www.india.gov.in/category/agriculture-rural-environment",

    category:
      "Agriculture, Rural & Environment",
  }),
]);


function isV45NGSPUrl(
  url
) {
  if (!url) {
    return false;
  }

  try {
    const parsed =
      new URL(url);

    const hostname =
      parsed.hostname
        .toLowerCase()
        .replace(/^www\./, "");

    return (
      hostname ===
        "india.gov.in" ||
      hostname ===
        "services.india.gov.in"
    );
  } catch {
    return false;
  }
}


function isV45NGSPServiceDetailUrl(
  url
) {
  if (!isV45NGSPUrl(url)) {
    return false;
  }

  try {
    const parsed =
      new URL(url);

    const pathname =
      parsed.pathname
        .toLowerCase()
        .replace(/\/+$/, "");

    return (
      pathname.startsWith(
        "/services/details/"
      ) ||
      pathname.startsWith(
        "/service/detail/"
      )
    );
  } catch {
    return false;
  }
}


function isV45NGSPNonServiceUrl(
  url
) {
  if (!url) {
    return true;
  }

  if (
    isV45NGSPServiceDetailUrl(
      url
    )
  ) {
    return false;
  }

  try {
    const parsed =
      new URL(url);

    const pathname =
      parsed.pathname
        .toLowerCase()
        .replace(/\/+$/, "");

    if (
      pathname === "" ||
      pathname === "/" ||
      pathname === "/services" ||
      pathname === "/service" ||
      pathname === "/service/listing" ||
      pathname === "/service/search" ||
      pathname === "/service/category" ||
      pathname === "/feed/index"
    ) {
      return true;
    }

    if (
      pathname.startsWith("/about") ||
      pathname.startsWith("/contact") ||
      pathname.startsWith("/help") ||
      pathname.startsWith("/privacy") ||
      pathname.startsWith("/terms") ||
      pathname.startsWith("/sitemap") ||
      pathname.startsWith("/login") ||
      pathname.startsWith("/dashboard") ||
      pathname.startsWith("/calendar")
    ) {
      return true;
    }

    return false;
  } catch {
    return true;
  }
}


// ============================================================
// EXTRACT MIGRATED NGSP SERVICE LINKS FROM RAW HTML
// ============================================================
//
// extractDiscoveryLinks() remains the primary parser.
// This second pass catches service-detail URLs embedded in
// scripts/data attributes that a normal anchor parser may miss.
// ============================================================

function extractV45NGSPServiceLinksFromHtml(
  html,
  pageUrl
) {
  const links = [];
  const seen = new Set();

  if (!html || !pageUrl) {
    return links;
  }

  const addLink = (
    rawUrl,
    rawTitle = ""
  ) => {
    if (!rawUrl) {
      return;
    }

    let resolved = "";

    try {
      resolved =
        new URL(
          String(rawUrl)
            .replace(/\\//g, "/"),
          pageUrl
        ).toString();
    } catch {
      return;
    }

    if (
      !isV45NGSPServiceDetailUrl(
        resolved
      )
    ) {
      return;
    }

    const normalized =
      discoveryNormalizeUrl(
        resolved
      );

    if (
      !normalized ||
      seen.has(normalized)
    ) {
      return;
    }

    seen.add(normalized);

    links.push({
      url:
        normalized,

      title:
        cleanDiscoveryCandidateTitle(
          rawTitle
        ),

      sourcePage:
        pageUrl,
    });
  };

  // Standard anchors.
  const anchorRegex =
    /<a\b[^>]*\bhref\s*=\s*["']([^"']+)["'][^>]*>([\s\\S]*?)<\/a>/gi;

  let match;

  while (
    (match =
      anchorRegex.exec(html)) !==
    null
  ) {
    const title =
      String(match[2] || "")
        .replace(/<[^>]+>/g, " ");

    addLink(
      match[1],
      title
    );
  }

  // Absolute URLs embedded in scripts/JSON.
  const absoluteRegex =
    /https?:\/\/(?:www\.)?(?:india\.gov\.in|services\.india\.gov\.in)\/(?:services\/details|service\/detail)\/[^"'<>\s\\]+/gi;

  while (
    (match =
      absoluteRegex.exec(html)) !==
    null
  ) {
    addLink(
      match[0],
      ""
    );
  }

  // Relative URLs embedded in scripts/JSON.
  const relativeRegex =
    /(?:\/services\/details\/|\/service\/detail\/)[A-Za-z0-9%._~:/?#\[\]@!$&()*+,;=-]+/gi;

  while (
    (match =
      relativeRegex.exec(html)) !==
    null
  ) {
    addLink(
      match[0],
      ""
    );
  }

  return links;
}


function scoreV45NGSPService(
  title,
  description,
  url
) {
  const text =
    `${title || ""} ${description || ""} ${url || ""}`
      .toLowerCase();

  let score = 0;
  const signals = [];

  if (
    isV45NGSPServiceDetailUrl(
      url
    )
  ) {
    score += 4;

    signals.push({
      type:
        "SERVICE_DETAIL_PATH",
      weight:
        4,
    });
  }

  const benefitTerms = [
    "scheme",
    "yojana",
    "subsidy",
    "financial assistance",
    "grant",
    "incentive",
    "benefit",
    "pension",
    "loan",
    "scholarship",
    "assistance",
    "seed fund",
    "credit",
  ];

  for (
    const term of
      benefitTerms
  ) {
    if (
      text.includes(term)
    ) {
      score += 3;

      signals.push({
        type:
          "BENEFIT_TERM",
        term,
        weight:
          3,
      });

      break;
    }
  }

  if (
    isV45NGSPUrl(url)
  ) {
    score += 1;

    signals.push({
      type:
        "OFFICIAL_INDIA_PORTAL",
      weight:
        1,
    });
  }

  return {
    score,
    signals,
  };
}


function extractV45NGSPCandidates(
  links
) {
  const candidates = [];
  const seen = new Set();

  for (
    const link of
      links || []
  ) {
    if (
      !link ||
      !link.url
    ) {
      continue;
    }

    let url = "";

    try {
      url =
        new URL(
          link.url
        ).toString();
    } catch {
      continue;
    }

    if (
      !isV45NGSPServiceDetailUrl(
        url
      ) ||
      isV45NGSPNonServiceUrl(
        url
      )
    ) {
      continue;
    }

    const normalizedUrl =
      discoveryNormalizeUrl(
        url
      );

    if (
      !normalizedUrl ||
      seen.has(normalizedUrl)
    ) {
      continue;
    }

    seen.add(
      normalizedUrl
    );

    const title =
      cleanDiscoveryCandidateTitle(
        link.title || ""
      );

    const description =
      cleanDiscoveryCandidateTitle(
        link.description || ""
      );

    const score =
      scoreV45NGSPService(
        title,
        description,
        normalizedUrl
      );

    candidates.push({
      url:
        normalizedUrl,

      title,

      schemeName:
        title,

      description,

      officialWebsite:
        normalizedUrl,

      applyLink:
        "",

      category:
        link.category ||
        V45_NGSP_SOURCE.category,

      ministry:
        link.ministry ||
        "",

      department:
        link.department ||
        "",

      sector:
        link.sector ||
        "",

      beneficiary:
        link.beneficiary ||
        "",

      state:
        link.state ||
        "All India",

      sourceId:
        V45_NGSP_SOURCE.id,

      sourceName:
        V45_NGSP_SOURCE.name,

      sourceUrl:
        link.sourcePage ||
        V45_NGSP_SOURCE.url,

      discoveryType:
        "V4.5_NGSP_SERVICE_LINK",

      discoveryScore:
        score.score,

      discoverySignals:
        score.signals,

      status:
        "Discovered",

      discoveredAt:
        new Date().toISOString(),
    });
  }

  candidates.sort(
    (a, b) =>
      (b.discoveryScore || 0) -
      (a.discoveryScore || 0)
  );

  return candidates;
}


async function crawlV45NGSP() {
  const candidates = [];
  const seenCandidates =
    new Set();

  let pagesScanned = 0;
  let linksScanned = 0;
  let fetchFailures = 0;

  const pageResults = [];

  for (
    const sourcePage of
      V45_NGSP_MIGRATED_SOURCES
  ) {
    try {
      const response =
        await fetchV45SeedPage(
          sourcePage.url
        );

      const html =
        response?.html ||
        response?.body ||
        response?.content ||
        "";

      if (
        !html ||
        html.length < 100
      ) {
        fetchFailures++;

        pageResults.push({
          ...sourcePage,
          pagesScanned: 0,
          linksScanned: 0,
          candidates: 0,
          error:
            "Empty or unusable HTML response",
        });

        continue;
      }

      pagesScanned++;

      const parsedLinks =
        extractV45SeedLinks(
          html,
          response?.finalUrl ||
            sourcePage.url
        );

      const embeddedLinks =
        extractV45NGSPServiceLinksFromHtml(
          html,
          response?.finalUrl ||
            sourcePage.url
        );

      const combinedLinks = [
        ...parsedLinks,
        ...embeddedLinks,
      ];

      linksScanned +=
        combinedLinks.length;

      const enrichedLinks =
        combinedLinks.map(
          (link) => ({
            ...link,
            category:
              sourcePage.category,
          })
        );

      const pageCandidates =
        extractV45NGSPCandidates(
          enrichedLinks
        );

      for (
        const candidate of
          pageCandidates
      ) {
        const normalizedUrl =
          discoveryNormalizeUrl(
            candidate.url ||
              candidate.officialWebsite ||
              ""
          );

        if (
          !normalizedUrl ||
          seenCandidates.has(
            normalizedUrl
          )
        ) {
          continue;
        }

        seenCandidates.add(
          normalizedUrl
        );

        candidates.push({
          ...candidate,

          url:
            normalizedUrl,

          officialWebsite:
            candidate.officialWebsite ||
            normalizedUrl,
        });
      }

      pageResults.push({
        ...sourcePage,
        pagesScanned: 1,
        linksScanned:
          combinedLinks.length,
        candidates:
          pageCandidates.length,
        finalUrl:
          response?.finalUrl ||
          sourcePage.url,
      });
    } catch (error) {
      fetchFailures++;

      pageResults.push({
        ...sourcePage,
        pagesScanned: 0,
        linksScanned: 0,
        candidates: 0,
        error:
          error?.message ||
          "NGSP migrated source fetch failed",
      });

      console.warn(
        `⚠️ NGSP migrated source failed: ${sourcePage.url} — ${error?.message || "Unknown error"}`
      );
    }
  }

  return {
    source:
      V45_NGSP_SOURCE,

    migrationStatus:
      "NGSP_MIGRATED_TO_INDIA_PORTAL",

    pagesScanned,

    linksScanned,

    fetchFailures,

    candidates,

    pageResults,
  };
}



// V4.5 SOURCE DISCOVERY
// ============================================================

async function runV45SourceDiscovery() {
  const baseDiscovery =
    await runV43SourceDiscovery();

  const allDeepCandidates =
    [];

  const seedSummary =
    [];

  let totalSeedPages =
    0;

  let totalSeedLinks =
    0;

  let totalSeedFetchFailures =
    0;

  // ----------------------------------------------------------
  // Process each source independently.
  // ----------------------------------------------------------

  for (
    const sourceSummary of
    baseDiscovery.sourceSummary ||
    []
  ) {
    const source =
      V42_DISCOVERY_SOURCES.find(
        (item) =>
          item.id ===
          sourceSummary.id
      );

    if (!source) {
      continue;
    }

    console.log("");

    console.log(
      `🌱 V4.5 seed expansion: ${source.name}`
    );

    // --------------------------------------------------------
    // Re-discover the source pages so we can inspect the links
    // specifically for category/ministry/search seeds.
    //
    // The existing V4.4.4 source discovery remains the primary
    // candidate source.
    // --------------------------------------------------------

    let sourceResult;

    try {
      sourceResult =
        await discoverRawHtmlCandidates(
          source
        );
    } catch (
      error
    ) {
      seedSummary.push({
        id:
          source.id,

        name:
          source.name,

        seedsScanned:
          0,

        pagesScanned:
          0,

        linksScanned:
          0,

        fetchFailures:
          1,

        error:
          error?.message ||
          "Source rediscovery failed",
      });

      totalSeedFetchFailures++;

      continue;
    }

    // --------------------------------------------------------
    // Convert the links from the existing source discovery
    // into V4.5 discovery seeds.
    // --------------------------------------------------------

    const sourceLinks =
      Array.isArray(
        sourceResult?.links
      )
        ? sourceResult.links
        : [];

    const seedCollection =
      collectV45DiscoverySeeds(
        sourceLinks
      );

    // GoSubsidy general-schemes targeted seeds. These are official
    // India.gov scheme-search pages for the two categories most
    // directly aligned with the product policy. They are discovery
    // seeds only; every detail page still passes the relevance gate.
    if (source.id === "india-gov-schemes") {
      const targetedSeeds = [
        {
          type: V45_SEED_TYPES.SEARCH,
          url: "https://www.india.gov.in/my-government/schemes/search?schemecategory=16&schemecategoryname=business%20%26%20self-employed",
          title: "Business & Self-employed",
        },
        {
          type: V45_SEED_TYPES.SEARCH,
          url: "https://www.india.gov.in/my-government/schemes/search?schemecategory=2&schemecategoryname=jobs",
          title: "Jobs",
        },
      ];

      const existingSeedUrls = new Set(
        seedCollection.seeds.map((seed) => discoveryNormalizeUrl(seed.url))
      );

      for (const targetedSeed of targetedSeeds) {
        const normalizedTarget = discoveryNormalizeUrl(targetedSeed.url);
        if (!existingSeedUrls.has(normalizedTarget)) {
          seedCollection.seeds.push(targetedSeed);
          existingSeedUrls.add(normalizedTarget);
        }
      }

      seedCollection.counts.total = seedCollection.seeds.length;
      seedCollection.counts.search = seedCollection.seeds.filter(
        (seed) => seed.type === V45_SEED_TYPES.SEARCH
      ).length;
    }

    // --------------------------------------------------------
    // If the existing discovery result does not expose raw
    // links, use the source URL itself as a safe fallback.
    //
    // This keeps V4.5 compatible with the existing V4.4.4
    // source-discovery implementation.
    // --------------------------------------------------------

    if (
      seedCollection.seeds
        .length === 0
    ) {
      console.log(
        `   ℹ️ No V4.5 category/ministry seeds found for ${source.name}`
      );

      seedSummary.push({
        id:
          source.id,

        name:
          source.name,

        seedsScanned:
          0,

        pagesScanned:
          0,

        linksScanned:
          0,

        fetchFailures:
          0,

        seedCounts:
          seedCollection.counts,
      });

      continue;
    }

    console.log(
      `   🌱 Seeds found: ${seedCollection.seeds.length}`
    );

    console.log(
      `      Categories: ${seedCollection.counts.category}`
    );

    console.log(
      `      Ministries: ${seedCollection.counts.ministry}`
    );

    console.log(
      `      Search: ${seedCollection.counts.search}`
    );

    // --------------------------------------------------------
    // Crawl the seeds.
    // --------------------------------------------------------

    const crawlResult =
      await crawlV45DiscoverySeeds(
        seedCollection.seeds
      );

    totalSeedPages +=
      crawlResult.pagesScanned;

    totalSeedLinks +=
      crawlResult.linksScanned;

    totalSeedFetchFailures +=
      crawlResult.fetchFailures;

    // --------------------------------------------------------
    // Extract likely scheme-detail links.
    // --------------------------------------------------------

    const deepCandidates =
      extractV45SchemeCandidates(
        crawlResult.links
      );

    console.log(
      `   🔎 Deep scheme links: ${deepCandidates.length}`
    );

    allDeepCandidates.push(
      ...deepCandidates.map(
        (candidate) => ({
          ...candidate,

          sourceId:
            source.id,

          sourceName:
            source.name,

          sourceUrl:
            source.url,

          schemeName:
            candidate.title ||
            candidate.schemeName ||
            "",

          officialWebsite:
            candidate.url,

          applyLink:
            "",

          category:
            candidate.category ||
            candidate.seedCategory ||
            "",

          seedCategory:
            candidate.seedCategory ||
            "",

          discoverySeedTitle:
            candidate.discoverySeedTitle ||
            "",

          ministry:
            "",

          department:
            "",

          sector:
            "",

          beneficiary:
            "",

          state:
            "All India",

          description:
            "",

          status:
            "Discovered",

          discoveredAt:
            new Date().toISOString(),
        })
      )
    );

    seedSummary.push({
      id:
        source.id,

      name:
        source.name,

      seedsScanned:
        crawlResult.seedsScanned,

      pagesScanned:
        crawlResult.pagesScanned,

      linksScanned:
        crawlResult.linksScanned,

      fetchFailures:
        crawlResult.fetchFailures,

      deepCandidates:
        deepCandidates.length,

      seedCounts:
        seedCollection.counts,
    });
  }

  // ----------------------------------------------------------
  // BLOCK 5 — NATIONAL GOVERNMENT SERVICES PORTAL
  // ----------------------------------------------------------

  console.log("");

  console.log(
    "🌐 V4.5 BLOCK 5: National Government Services Portal"
  );

  let ngspResult = {
    source:
      V45_NGSP_SOURCE,
    pagesScanned: 0,
    linksScanned: 0,
    fetchFailures: 0,
    candidates: [],
  };

  try {
    ngspResult =
      await crawlV45NGSP();
  } catch (error) {
    ngspResult = {
      source:
        V45_NGSP_SOURCE,
      pagesScanned: 0,
      linksScanned: 0,
      fetchFailures: 1,
      candidates: [],
      error:
        error?.message ||
        "NGSP discovery failed",
    };
  }

  console.log(
    `   📄 Pages scanned: ${ngspResult.pagesScanned}`
  );

  console.log(
    `   🔗 Links scanned: ${ngspResult.linksScanned}`
  );

  console.log(
    `   🎯 Service candidates: ${ngspResult.candidates.length}`
  );

  allDeepCandidates.push(
    ...ngspResult.candidates
  );

  // ----------------------------------------------------------
  // Merge existing V4.4.4 candidates with V4.5 candidates.
  // ----------------------------------------------------------

  const mergedCandidates =
    mergeV45Candidates(
      baseDiscovery.candidates,
      allDeepCandidates
    );

  // ----------------------------------------------------------
  // Keep initial rejection information from V4.4.4.
  // ----------------------------------------------------------

  return {
    candidates:
      mergedCandidates,

    rejected:
      baseDiscovery.rejected,

    sourceSummary:
      baseDiscovery.sourceSummary,

    v45: {
      enabled:
        true,

      seeds:
        seedSummary,

      totalSeeds:
        seedSummary.reduce(
          (
            total,
            item
          ) =>
            total +
            (
              item.seedsScanned ||
              0
            ),
          0
        ),

      pagesScanned:
        totalSeedPages,

      linksScanned:
        totalSeedLinks,

      fetchFailures:
        totalSeedFetchFailures +
        (ngspResult.fetchFailures || 0),

      deepCandidates:
        allDeepCandidates.length,

      ngsp: {
        source:
          V45_NGSP_SOURCE,

        pagesScanned:
          ngspResult.pagesScanned,

        linksScanned:
          ngspResult.linksScanned,

        fetchFailures:
          ngspResult.fetchFailures,

        candidates:
          ngspResult.candidates.length,
      },

      baseCandidates:
        baseDiscovery.candidates
          .length,

      mergedCandidates:
        mergedCandidates.length,
    },
  };
}


// ============================================================
// V4.5 FINAL DISCOVERY
// ============================================================


// ============================================================
// V4.6 BLOCK 6 — CANDIDATE EVIDENCE ENRICHMENT
// ============================================================
// Controlled enrichment only.
// This block NEVER verifies, matches, creates, updates, or deletes
// schemes. It only adds structured evidence to candidates before
// the existing V4.4.4 verification gate.
// ============================================================

function block6CleanEvidenceText(value) {
  return String(value || "")
    .replace(/\u00a0/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

// ============================================================
// BLOCK 6.2 — CONTENT BOUNDARY / UI NOISE FILTER
// ============================================================
// The verification layer receives mainText extracted from <main>,
// <article>, or <body>. Many government pages still put menus,
// breadcrumbs, accessibility controls and footer text inside that
// container. BLOCK 6.2 cleans that text WITHOUT changing the
// existing verification rules.
// ============================================================

const BLOCK62_UI_NOISE_PATTERNS = [
  /\bskip to main content\b/gi,
  /\bskip to navigation\b/gi,
  /\bsearch area\/?\s*\/\s*topics\b/gi,
  /\bclose search\b/gi,
  /\bsearch all categories\b/gi,
  /\bsearch all\b/gi,
  /\bloading\.\.\.\b/gi,
  /\bsays okay cancel close\b/gi,
  /\bhome\s+about\s+contact us\b/gi,
  /\bcontact us\s+screen reader\b/gi,
  /\bscreen reader\s+accessibility statement\b/gi,
  /\bprivacy policy\s+terms(?: and)? conditions\b/gi,
  /\bterms(?: and)? conditions\s+disclaimer\b/gi,
  /\bfacebook\s+x\s+instagram\s+youtube\b/gi,
];

const BLOCK62_NAV_RUN_PATTERN = /(?:^|\s)(?:home|about|contact us|faqs?|screen reader|accessibility statement|disclaimer|terms(?: and)? conditions|site map|sitemap|login|dashboard|view more|view all|follow us on|find us on facebook|find us on x)(?:\s+(?:home|about|contact us|faqs?|screen reader|accessibility statement|disclaimer|terms(?: and)? conditions|site map|sitemap|login|dashboard|view more|view all|follow us on|find us on facebook|find us on x)){2,}(?:\s|$)/gi;

function block62RemoveUiNoise(value) {
  let text = block6CleanEvidenceText(value);
  if (!text) return "";

  for (const pattern of BLOCK62_UI_NOISE_PATTERNS) {
    text = text.replace(pattern, " ");
  }

  text = text.replace(BLOCK62_NAV_RUN_PATTERN, " ");

  // Remove obvious repeated India Portal shell fragments.
  text = text.replace(
    /(?:all acts|citizen engagements|directory|explore india|government datasets|helplines|news|public utilities|schemes|services|others)(?:\s+all acts|\s+citizen engagements|\s+directory|\s+explore india|\s+government datasets|\s+helplines|\s+news|\s+public utilities|\s+schemes|\s+services|\s+others){2,}/gi,
    " "
  );

  return block6CleanEvidenceText(text);
}

function block62SplitEvidenceUnits(value) {
  const text = block62RemoveUiNoise(value);
  if (!text) return [];

  return text
    .split(/(?<=[.!?])\s+|\s*\|\s*|\s*•\s*|\s*\u2022\s*/)
    .map(block6CleanEvidenceText)
    .filter((unit) => unit.length >= 25 && unit.length <= 1800);
}

function block62LooksLikeUi(unit) {
  const text = block6CleanEvidenceText(unit).toLowerCase();
  if (!text) return true;

  const uiHits = [
    /\bhome\b/, /\bcontact us\b/, /\bscreen reader\b/, /\baccessibility\b/, /\bdisclaimer\b/,
    /\bterms(?: and)? conditions\b/, /\bsite map\b/, /\bsitemap\b/, /\bdashboard\b/, /\bview more\b/,
    /\bsearch all categories\b/, /\bfind us on\b/, /\bfollow us on\b/, /\bskip to\b/,
  ];

  const hits = uiHits.filter((pattern) => pattern.test(text)).length;
  const wordCount = text.split(/\s+/).length;
  return hits >= 2 || (hits >= 1 && wordCount < 14);
}

function block62BuildContentText(mainText, title) {
  const units = block62SplitEvidenceUnits(mainText).filter((unit) => !block62LooksLikeUi(unit));
  if (!units.length) return "";

  const titleWords = String(title || "")
    .toLowerCase()
    .split(/\W+/)
    .filter((word) => word.length >= 4);

  const scored = units.map((unit, index) => {
    const lower = unit.toLowerCase();
    let score = 0;
    if (/\b(eligib|benefit|apply|application|beneficiar|scheme|yojana|programme|program|subsid|grant|pension|assistance|objective|purpose|aims?)\b/i.test(unit)) score += 3;
    if (/\b(applicant|household|woman|farmer|student|entrepreneur|citizen|beneficiary)\b/i.test(unit)) score += 1;
    if (titleWords.some((word) => lower.includes(word))) score += 2;
    if (/\b(about|overview|objective|purpose|aim|provides|offers|supports)\b/i.test(unit)) score += 2;
    return { unit, index, score };
  });

  scored.sort((a, b) => b.score - a.score || a.index - b.index);

  // Keep a bounded amount of clean content, preserving original order.
  const selected = scored.slice(0, 80).sort((a, b) => a.index - b.index).map((item) => item.unit);
  return selected.join(" ").slice(0, MAX_PAGE_TEXT_LENGTH);
}

function block6ExtractEvidenceSection(text, patterns) {
  const value = block6CleanEvidenceText(text);
  if (!value) return "";

  for (const pattern of patterns) {
    const match = value.match(pattern);
    if (match && match[1]) {
      return block6CleanEvidenceText(match[1]).slice(0, 1600);
    }
  }

  return "";
}

function block6IsGenericPortalDescription(value) {
  const text = block6CleanEvidenceText(value).toLowerCase();
  if (!text) return true;
  const genericPatterns = [
    /single-window access to information and services offered by the government/i,
    /national portal of india provides single-window access/i,
    /content available on india portal is owned and managed/i,
    /user-friendly, multilingual, accessible, and contemporary interface/i,
    /site map|screen reader|accessibility statement|terms & conditions/i,
    /provides information and services offered by the government/i,
    /national portal of india/i,
  ];
  return genericPatterns.some((pattern) => pattern.test(text));
}

function block6CleanSpecificField(value, options = {}) {
  const text = block62RemoveUiNoise(value);
  if (!text) return '';
  if (block6IsGenericPortalDescription(text) && options.rejectGeneric !== false) return '';
  return text.slice(0, options.max || 1200);
}

function block6ExtractSpecificDescription(mainText, title) {
  const text = block62BuildContentText(mainText, title);
  if (!text) return '';

  const patterns = [
    /(?:about the scheme|about the programme|about the program|scheme overview|programme overview|program overview|objective|objectives|description)\s*[:\-]?\s*(.{80,1600})/i,
    /(?:the scheme|this scheme|the programme|this programme|the initiative|this initiative)\s+(?:aims|provides|offers|supports|seeks|is intended)\s+(.{80,1200})/i,
  ];

  for (const pattern of patterns) {
    const match = text.match(pattern);
    if (match && match[1]) {
      const candidate = block6CleanSpecificField(match[1], { max: 1000 });
      if (candidate && !block62LooksLikeUi(candidate)) return candidate;
    }
  }

  const titleWords = String(title || '').toLowerCase().split(/\W+/).filter((word) => word.length >= 4);
  const sentences = block62SplitEvidenceUnits(text)
    .filter((sentence) => sentence.length >= 70 && sentence.length <= 900)
    .filter((sentence) => !block62LooksLikeUi(sentence));

  if (titleWords.length) {
    const matching = sentences.find((sentence) => {
      const lower = sentence.toLowerCase();
      return titleWords.filter((word) => lower.includes(word)).length >= Math.min(2, titleWords.length);
    });
    if (matching) return matching;
  }

  return sentences[0] || '';
}

// ============================================================
// BLOCK 6.3 — STRUCTURED SCHEME SECTION EXTRACTION
// ============================================================
// Extract evidence by section instead of treating the entire cleaned
// page as one text blob. This is deliberately conservative: if a
// section heading is not present, we do not manufacture the field.
// ============================================================

const BLOCK63_SECTION_HEADINGS = {
  eligibility: [
    'eligibility', 'eligibility criteria', 'eligibility requirements',
    'who can apply', 'who is eligible', 'eligible beneficiaries'
  ],
  benefits: [
    'benefits', 'benefit', 'financial assistance', 'financial support',
    'assistance provided', 'key benefits', 'subsidy', 'assistance'
  ],
  application: [
    'how to apply', 'application process', 'application procedure',
    'how can i apply', 'apply online', 'application', 'procedure to apply'
  ],
  beneficiary: [
    'beneficiary', 'beneficiaries', 'target group', 'target beneficiaries',
    'eligible persons', 'who will benefit'
  ],
  documents: [
    'documents required', 'documents', 'required documents',
    'documents needed', 'supporting documents'
  ],
  description: [
    'about the scheme', 'about the programme', 'about the program',
    'scheme overview', 'programme overview', 'program overview',
    'overview', 'objective', 'objectives', 'purpose', 'about'
  ],
  ministry: [
    'nodal ministry', 'implementing ministry', 'ministry',
    'department', 'implementing agency', 'implementing authority'
  ]
};

const BLOCK63_NEXT_SECTION_HEADINGS = Object.values(BLOCK63_SECTION_HEADINGS)
  .flat()
  .map((value) => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'))
  .join('|');

function block63NormalizeHeading(value) {
  return block6CleanEvidenceText(value)
    .replace(/\s*[:\-–—]\s*$/g, '')
    .toLowerCase();
}

function block63CleanSection(value, max = 1400) {
  let text = block62RemoveUiNoise(value);
  if (!text) return '';

  text = text
    .replace(/\bclick\s+here\b/gi, ' ')
    .replace(/\bclick\s+to\s+(?:apply|know|view|read|download)\b/gi, ' ')
    .replace(/\b(?:read more|learn more|know more|view details|view more|view all)\b/gi, ' ')
    .replace(/\b(?:home|about|contact us|screen reader|accessibility statement|disclaimer|dashboard)\b/gi, ' ')
    .replace(/\s{2,}/g, ' ')
    .trim();

  return text.slice(0, max);
}

function block63ExtractHeadingSection(text, headings, max = 1400) {
  const source = block6CleanEvidenceText(text);
  if (!source) return '';

  const escaped = headings
    .slice()
    .sort((a, b) => b.length - a.length)
    .map((h) => h.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'))
    .join('|');

  const next = BLOCK63_NEXT_SECTION_HEADINGS;
  const pattern = new RegExp(
    `(?:^|[.!?;|])\\s*(?:${escaped})\\s*[:\\-]?\\s+(.{25,${max * 2}}?)(?=(?:[.!?;|])\\s*(?:${next})\\s*[:\\-]?\\s|$)`,
    'i'
  );

  const match = source.match(pattern);
  return match?.[1] ? block63CleanSection(match[1], max) : '';
}

function block63ExtractLabelledLine(text, labels, max = 500) {
  const source = block6CleanEvidenceText(text);
  if (!source) return '';

  const escaped = labels
    .slice()
    .sort((a, b) => b.length - a.length)
    .map((h) => h.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'))
    .join('|');

  const match = source.match(new RegExp(`(?:^|[|.!?])\\s*(?:${escaped})\\s*[:\\-]\\s*([^|.!?]{20,${max}})`, 'i'));
  return match?.[1] ? block63CleanSection(match[1], max) : '';
}

function block63FirstDescriptiveSentence(text, title) {
  const units = block62SplitEvidenceUnits(text)
    .filter((unit) => unit.length >= 60 && unit.length <= 700)
    .filter((unit) => !block62LooksLikeUi(unit))
    .filter((unit) => !/^(?:eligibility|benefits?|how to apply|application|documents required|beneficiary|department|ministry)\b/i.test(unit));

  const titleWords = String(title || '').toLowerCase().split(/\W+/).filter((w) => w.length >= 4);
  const ranked = units.map((unit, index) => {
    const lower = unit.toLowerCase();
    let score = 0;
    if (/\b(?:provides|aims|supports|assists|offers|enables|is intended|was launched|helps)\b/i.test(unit)) score += 4;
    if (/\b(?:scheme|yojana|programme|program|initiative|mission|subsidy|grant|pension)\b/i.test(unit)) score += 2;
    if (titleWords.length && titleWords.filter((w) => lower.includes(w)).length >= 1) score += 2;
    return { unit, score, index };
  }).sort((a, b) => b.score - a.score || a.index - b.index);

  return ranked[0]?.unit || '';
}

function block6ExtractEvidenceFields(page, candidate) {
  const rawMainText = block6CleanEvidenceText(page?.mainText || '');
  const title = block6CleanEvidenceText(page?.title || candidate?.title || candidate?.schemeName || '');
  const mainText = block62BuildContentText(rawMainText, title);
  const rawMetaDescription = block6CleanEvidenceText(page?.metaDescription || '');
  const metaDescription = block6IsGenericPortalDescription(rawMetaDescription) ? '' : block62RemoveUiNoise(rawMetaDescription);
  const dom = page?.domSections || {};
  const combined = `${title} ${metaDescription} ${mainText}`.trim();

  // BLOCK 6.4: use actual HTML heading sections first.
  const eligibility = block6CleanSpecificField(
    dom.eligibility ||
    block63ExtractHeadingSection(mainText, BLOCK63_SECTION_HEADINGS.eligibility, 1400) ||
    block63ExtractLabelledLine(mainText, BLOCK63_SECTION_HEADINGS.eligibility, 900) ||
    block6ExtractEvidenceSection(combined, [
      /(?:applicant must|applicants must|eligible applicants? must)\s+(.{60,1200})/i,
      /(?:who can apply|eligibility)\s*[:\-]?\s*(.{40,1400}?)(?=\b(?:how to apply|application process|documents|required documents|benefits?|nature of assistance)\b|$)/i,
    ]),
    { max: 1400 }
  );

  const benefits = block6CleanSpecificField(
    dom.benefits ||
    block63ExtractHeadingSection(mainText, BLOCK63_SECTION_HEADINGS.benefits, 1400) ||
    block63ExtractLabelledLine(mainText, BLOCK63_SECTION_HEADINGS.benefits, 900) ||
    block6ExtractEvidenceSection(combined, [
      /(?:nature of assistance|assistance provided|key benefits)\s*[:\-]?\s*(.{40,1400}?)(?=\b(?:who can apply|eligibility|how to apply|application process|documents|required documents|beneficiary)\b|$)/i,
    ]),
    { max: 1400 }
  );

  const application = block6CleanSpecificField(
    block64CleanFieldForType("application", dom.application || "") ||
    block6ExtractEvidenceSection(combined, [
      /((?:applicants may apply|apply to any distributor)[^.]{40,900}\.)/i,
      /((?:submit(?:ting)? application)[^.]{40,900}\.)/i,
    ]) ||
    block63ExtractHeadingSection(mainText, BLOCK63_SECTION_HEADINGS.application, 1400) ||
    block63ExtractLabelledLine(mainText, BLOCK63_SECTION_HEADINGS.application, 900),
    { max: 1400 }
  );

  const beneficiary = block6CleanSpecificField(
    dom.beneficiary ||
    block63ExtractHeadingSection(mainText, BLOCK63_SECTION_HEADINGS.beneficiary, 1000) ||
    block63ExtractLabelledLine(mainText, BLOCK63_SECTION_HEADINGS.beneficiary, 700) ||
    block6ExtractEvidenceSection(combined, [
      /(?:intended beneficiaries|target beneficiaries|target group)\s*[:\-]?\s*(.{40,1000}?)(?=\b(?:benefits?|eligibility|how to apply|documents|required documents)\b|$)/i,
    ]),
    { max: 1000 }
  );

  const documents = block6CleanSpecificField(
    dom.documents ||
    block63ExtractHeadingSection(mainText, BLOCK63_SECTION_HEADINGS.documents, 1200) ||
    block63ExtractLabelledLine(mainText, BLOCK63_SECTION_HEADINGS.documents, 800) ||
    block6ExtractEvidenceSection(combined, [
      /(?:documents required|documents needed|supporting documents)\s*[:\-]?\s*(.{40,1200}?)(?=\b(?:how to apply|application process|benefits?|eligibility|beneficiary)\b|$)/i,
    ]),
    { max: 1200 }
  );

  const ministry = block6CleanSpecificField(
    dom.ministry ||
    block63ExtractLabelledLine(mainText, BLOCK63_SECTION_HEADINGS.ministry, 300) ||
    block6ExtractEvidenceSection(combined, [
      /(?:ministry|department)\s+(?:of|for)\s+([A-Z][^.;|]{10,220})/,
    ]),
    { max: 300 }
  );

  const sectionDescription = block6CleanSpecificField(
    dom.description ||
    block63ExtractHeadingSection(mainText, BLOCK63_SECTION_HEADINGS.description, 1000),
    { max: 1000 }
  );

  // Never use an eligibility sentence as the description.
  const descriptiveFallback = block63FirstDescriptiveSentence(mainText, title);
  const fallbackDescription = block6ExtractSpecificDescription(mainText, title);
  const rawDescription =
    metaDescription ||
    sectionDescription ||
    descriptiveFallback ||
    fallbackDescription;

  const description =
    rawDescription &&
    !/^(?:there should be no other|the applicant must|applicant must)\b/i.test(rawDescription)
      ? rawDescription
      : '';

  const schemeIdentity =
    /\b(?:government scheme|scheme|yojana|programme|program|initiative|mission|subsidy|grant|pension|financial assistance)\b/i.test(combined);

  const hasEligibility =
    Boolean(eligibility) || /\beligib(?:le|ility)\b/i.test(mainText);

  const hasBenefits =
    Boolean(benefits) || /\b(?:benefit|subsidy|grant|financial assistance|financial support)\b/i.test(mainText);

  const hasApplication =
    Boolean(application) || /\b(?:how to apply|apply online|application process|applicants may apply)\b/i.test(mainText);

  const hasBeneficiary =
    Boolean(beneficiary) || /\b(?:beneficiary|beneficiaries|target group)\b/i.test(mainText);

  const fieldsFound = [];
  if (title) fieldsFound.push('title');
  if (description) fieldsFound.push('description');
  if (metaDescription) fieldsFound.push('metaDescription');
  if (mainText) fieldsFound.push('mainText');
  if (eligibility) fieldsFound.push('eligibility');
  if (benefits) fieldsFound.push('benefits');
  if (application) fieldsFound.push('application');
  if (beneficiary) fieldsFound.push('beneficiary');
  if (documents) fieldsFound.push('documents');
  if (ministry) fieldsFound.push('ministryOrDepartment');

  const evidenceScore =
    (schemeIdentity ? 3 : 0) +
    (hasEligibility ? 2 : 0) +
    (hasBenefits ? 2 : 0) +
    (hasApplication ? 1 : 0) +
    (hasBeneficiary ? 1 : 0) +
    (ministry ? 1 : 0) +
    (description ? 1 : 0) +
    (mainText.length >= 500 ? 1 : 0);

  return {
    title,
    description,
    eligibility,
    benefits,
    application,
    beneficiary,
    documents,
    ministryOrDepartment: ministry,
    evidenceScore,
    fieldsFound,
    signals: {
      hasSchemeIdentity: schemeIdentity,
      hasEligibility,
      hasBenefits,
      hasApplication,
      hasBeneficiary,
      hasDocuments: Boolean(documents),
      hasAuthority: Boolean(ministry),
      usedSpecificDescription: Boolean(description),
      rejectedGenericMetaDescription: Boolean(rawMetaDescription && !metaDescription),
      contentBoundaryApplied: true,
      domSectionExtractionApplied: Object.keys(dom).length > 0,
      structuredSectionsFound: Object.keys(dom),
      structuredSectionLengths: Object.fromEntries(
        Object.entries(dom).map(([key, value]) => [key, String(value || "").length])
      ),
      rawMainTextLength: rawMainText.length,
      cleanMainTextLength: mainText.length,
    },
  };
}

async function enrichCandidateWithBlock6(candidate) {
  const startedAt = Date.now();

  const base = {
    attempted: true,
    fetched: false,
    fetchFailed: false,
    contentQuality: "UNKNOWN",
    evidenceScore: 0,
    fieldsFound: [],
    signals: {},
    fetchMs: 0,
  };

  if (!candidate?.url) {
    return {
      ...candidate,
      evidenceEnrichment: {
        ...base,
        fetchFailed: true,
        contentQuality: "INVALID_URL",
        reason: "Candidate URL is missing.",
        fetchMs: Date.now() - startedAt,
      },
    };
  }

  try {
    const page = await fetchCandidatePage(candidate.url);
    const pageEvidence = block6ExtractEvidenceFields(page, candidate);

    const relatedEvidence = [];
    for (const related of (page?.relatedLinks || []).slice(0, 6)) {
      try {
        const relatedPage = await fetchCandidatePage(related.url);
        const relatedItem = block6ExtractEvidenceFields(relatedPage, candidate);
        relatedEvidence.push({
          ...relatedItem,
          relatedUrl: relatedPage?.finalUrl || related.url,
          relatedTitle: relatedPage?.title || related.text || '',
        });
      } catch (relatedError) {
        // One related official page failing must not discard the main page.
      }
    }

    const evidencePool = [pageEvidence, ...relatedEvidence];
    const firstMeaningfulEvidence = (field) => {
      for (const item of evidencePool) {
        const value = item?.[field];
        if (field === 'benefits' || field === 'documents') {
          if (Array.isArray(value) && value.length) return value;
          if (typeof value === 'string' && value.trim()) return value;
        } else if (value && String(value).trim()) {
          return value;
        }
      }
      return '';
    };

    const combinedText = evidencePool
      .map((item) => [item?.title, item?.description, item?.ministryOrDepartment, item?.eligibility, item?.benefits, item?.application, item?.beneficiary, item?.documents].filter(Boolean).join(' '))
      .join(' ');

    const authorities = extractAuthorityFieldsFromText(combinedText);
    const existingMinistry = isUsableAuthorityValue(candidate?.ministry) ? String(candidate.ministry).trim() : '';
    const existingDepartment = isUsableAuthorityValue(candidate?.department) ? String(candidate.department).trim() : '';

    const ministry = authorities.ministry || existingMinistry;
    const department = authorities.department || existingDepartment;

    const description = firstMeaningfulEvidence('description') || candidate.description || '';
    const eligibility = firstMeaningfulEvidence('eligibility') || candidate.eligibility || '';
    const benefits = firstMeaningfulEvidence('benefits') || candidate.benefits || '';
    const application = firstMeaningfulEvidence('application') || candidate.application || '';
    const beneficiary = firstMeaningfulEvidence('beneficiary') || candidate.beneficiary || '';
    const documents = firstMeaningfulEvidence('documents') || candidate.documents || '';

    const contentLength = Math.max(
      String(page?.mainText || '').length,
      ...relatedEvidence.map((item) => String(item?.description || item?.mainText || '').length)
    );

    const mergedEvidence = {
      ...pageEvidence,
      description,
      eligibility,
      benefits,
      application,
      beneficiary,
      documents,
      ministryOrDepartment: ministry,
      relatedSources: relatedEvidence.map((item) => ({
        url: item.relatedUrl,
        title: item.relatedTitle,
      })),
      relatedEvidenceCount: relatedEvidence.length,
    };

    return {
      ...candidate,
      description,
      eligibility,
      benefits,
      application,
      beneficiary,
      documents,
      ministry,
      department,
      evidenceEnrichment: {
        ...base,
        fetched: true,
        contentQuality:
          contentLength >= 1000 ? "GOOD" :
          contentLength >= 300 ? "LIMITED" :
          "INSUFFICIENT",
        ...mergedEvidence,
        finalUrl: page?.finalUrl || candidate.url,
        pageTitle: page?.title || "",
        fetchMs: Date.now() - startedAt,
      },
    };
  } catch (error) {
    return {
      ...candidate,
      evidenceEnrichment: {
        ...base,
        fetchFailed: true,
        contentQuality: "FETCH_FAILED",
        reason: error?.message || "Evidence enrichment fetch failed.",
        fetchMs: Date.now() - startedAt,
      },
    };
  }
}

async function enrichCandidatesWithBlock6(candidates) {
  const input = Array.isArray(candidates) ? candidates : [];
  const enriched = [];
  const summary = {
    enabled: true,
    attempted: 0,
    fetched: 0,
    fetchFailures: 0,
    enriched: 0,
    insufficientContent: 0,
    fieldsExtracted: 0,
    averageEvidenceScore: 0,
  };

  let totalEvidenceScore = 0;

  for (const candidate of input) {
    summary.attempted++;
    const item = await enrichCandidateWithBlock6(candidate);
    const evidence = item.evidenceEnrichment || {};

    if (evidence.fetched) summary.fetched++;
    if (evidence.fetchFailed) summary.fetchFailures++;
    if (evidence.fetched && evidence.fieldsFound?.length) summary.enriched++;
    if (evidence.contentQuality === "INSUFFICIENT") summary.insufficientContent++;
    summary.fieldsExtracted += evidence.fieldsFound?.length || 0;
    totalEvidenceScore += Number(evidence.evidenceScore || 0);
    enriched.push(item);
  }

  summary.averageEvidenceScore = input.length
    ? Number((totalEvidenceScore / input.length).toFixed(2))
    : 0;

  return { candidates: enriched, summary };
}


// ============================================================
// GoSubsidy GENERAL SCHEME RELEVANCE GATE
// ============================================================
// GoSubsidy is intentionally NOT a general government-scheme
// directory. Only employment-generation, self-employment,
// entrepreneurship, enterprise-creation, enterprise-expansion,
// or employment-linked livelihood programmes may proceed.
//
// IMPORTANT:
// - A generic word such as "loan", "subsidy", "skill", "farmer",
//   or "employment" alone is NOT enough.
// - The gate prefers explicit enterprise/employment evidence.
// - Out-of-scope welfare/service candidates are rejected before
//   Smart Verification and can never enter matching/storage.
// ============================================================

const GOSUBSIDY_GENERAL_SCHEME_GATE_VERSION = "2.0-EXCLUSIVE-SCHEMES-ONLY";

const GOSUBSIDY_HARD_EXCLUDE_PATTERNS = Object.freeze([
  /\bpension\b/i, /\bration\b/i, /\blpg\b/i, /\bujjwala\b/i,
  /\bhealth\b/i, /\bhealthcare\b/i, /\bvaccin/i, /\bhospital\b/i,
  /\bgrievance\b/i, /\bcpgrams\b/i, /\baadhaar\b/i, /\bpassport\b/i,
  /\bbirth certificate\b/i, /\bdeath certificate\b/i, /\bmarriage certificate\b/i,
  /\bscholarship\b/i, /\bmid[- ]day meal\b/i, /\bfood security\b/i,
  /\bpublic distribution\b/i, /\brtps\b/i, /\bcitizen service\b/i,
  /\bgovernment service portal\b/i,
]);

// ============================================================
// V5.1 — EXCLUSIVE SCHEME-ONLY DISCOVERY
// ============================================================
// A government website is NOT automatically a scheme page.
// These are hard exclusions even when the page contains words such as
// "scheme", "benefit" or "application" in navigation/footer content.
// ============================================================
const EXCLUSIVE_SCHEME_TITLE_REJECT_PATTERNS = Object.freeze([
  /\bcontact(?:s)?(?: of)?\b/i,
  /\bcontact us\b/i,
  /\brti\b/i,
  /\bright to information\b/i,
  /\bcompassionate appointment\b/i,
  /\bformer development commissioners?\b/i,
  /\bdevelopment commissioners?\b/i,
  /\bcommissioners? list\b/i,
  /\boffice order\b/i,
  /\bother important order\b/i,
  /\btraining sanction order\b/i,
  /\bsanction order\b/i,
  /\bcircular(?: order)?\b/i,
  /\bnotification\b/i,
  /\bminutes\b/i,
  /\bmemorandum\b/i,
  /\bpress release\b/i,
  /\brecruitment\b/i,
  /\bvacanc(?:y|ies)\b/i,
  /\bjob\b/i,
  /\bcareer\b/i,
  /\bemployee\b/i,
  /\bservice book\b/i,
  /\bcadre\b/i,
  /\bieds\b/i,
  /\borganisation chart\b/i,
  /\borg(?:anization)? chart\b/i,
  /\bdepartment directory\b/i,
  /\bofficer directory\b/i,
  /\bdirectory\b/i,
  /\blist of technologies\b/i,
  /^scheme(?:s)?(?: guidelines?| details?)?$/i,
  /^guidelines?$/i,
  /^brochure$/i,
  /^details?$/i,
  /^document$/i,
  /^order$/i,
  /\bpolicy consultation\b/i,

  // Generic document/page titles are never scheme identities.
  /^scheme(?:s)?[\s\-/:]*(?:guidelines?|details?|information|document|operation|operations)?$/i,
  /^guidelines?(?:[\s\-/:]+of[\s\-/:]+scheme)?$/i,
  /^scheme[\s\-/:]+guidelines?$/i,
  /^guidelines?[\s\-/:]+scheme$/i,
  /^scheme[\s\-/:]+details?$/i,
  /^scheme[\s\-/:]+information$/i,
  /^scheme[\s\-/:]+document$/i,
  /^guidelines?[\s\-/:]+document$/i,
  /^scheme[\s\-/:]+operation(?:s)?$/i,
  /^operational[\s\-/:]+scheme(?:s)?$/i,
  /^scheme[\s\-/:]+brochure$/i,
  /^brochure[\s\-/:]+(?:of|for)[\s\-/:]+scheme$/i,
]);

const EXCLUSIVE_SCHEME_URL_REJECT_PATTERNS = Object.freeze([
  /\/contact(?:_|-)?(?:hq|us)?(?:[/?#]|$)/i,
  /\/rti(?:[/?#]|$)/i,
  /\/compassionate[_-]appointment(?:[/?#]|$)/i,
  /\/list[_-]?dc(?:[/?#]|$)/i,
  /\/ieds(?:[/?#]|$)/i,
  /\/(?:orders?|circulars?|notifications?|minutes|recruitment|vacancies|careers)(?:[/?#]|$)/i,
  /\/(?:sanction[_-]?order|office[_-]?order|training[_-]?sanction)(?:[/?#]|$)/i,
  /\/(?:directory|officers?|employees?)(?:[/?#]|$)/i,
]);

function resolveExclusiveSchemeIdentity(candidate = {}) {
  const currentTitle = String(candidate?.schemeName || candidate?.title || candidate?.name || "").trim();
  const generic = !currentTitle || /^(?:scheme(?:s)?|guidelines?|scheme\s*[/\-]\s*guidelines?|guidelines?\s+(?:of\s+)?scheme|scheme\s+(?:details?|information|document|operation(?:s)?|brochure)|operational\s+scheme(?:s)?)$/i.test(currentTitle.replace(/[\u2013\u2014|_]+/g," ").replace(/\s*[/\\]+\s*/g," / ").replace(/\s+/g," ").trim());
  if (!generic) return candidate;

  const known = [
    /Prime Minister'?s Employment Generation Programme/i,
    /Pradhan Mantri Mudra Yojana/i,
    /PM\s*Vishwakarma/i,
    /Stand[- ]Up India/i,
    /Startup India/i,
    /Credit Guarantee Scheme for Micro and Small Enterprises/i,
    /Credit Linked Capital Subsidy Scheme/i,
    /Agriculture Infrastructure Fund/i,
    /Pradhan Mantri Kisan Samman Nidhi/i,
    /PM[- ]KISAN/i,
  ];

  const blobs = [
    candidate?.canonicalProgramName,
    candidate?.canonical_program_name,
    candidate?.discoverySeedTitle,
    candidate?.sourceSeed,
    candidate?.evidenceEnrichment?.pageTitle,
    candidate?.evidenceEnrichment?.mainText,
    candidate?.evidenceEnrichment?.cleanMainText,
    candidate?.description,
  ].filter(Boolean).map(v => typeof v === "object" ? JSON.stringify(v) : String(v));
  const text = blobs.join(" ");

  for (const pattern of known) {
    const match = text.match(pattern);
    if (match?.[0]) return { ...candidate, schemeName: match[0].trim(), title: match[0].trim(), derivedSchemeIdentity: true };
  }

  const suffixPattern = /\b((?:[A-Z][A-Za-z0-9&().,'’'\-]+(?:\s+|$)){1,10}(?:Scheme|Yojana|Programme|Program|Mission|Fund|Initiative|Assistance|Incentive))\b/g;
  const candidates = [];
  for (const blob of blobs) {
    for (const match of blob.matchAll(suffixPattern)) {
      const value = String(match[1] || "").replace(/\s+/g," ").trim();
      if (value.split(/\s+/).length >= 2 && !/^scheme|^guidelines/i.test(value) && !/^(?:government|official)\s+(?:scheme|programme)$/i.test(value)) candidates.push(value);
    }
  }
  if (candidates.length) {
    candidates.sort((a,b) => b.length-a.length);
    return { ...candidate, schemeName: candidates[0], title: candidates[0], derivedSchemeIdentity: true };
  }
  return candidate;
}

function exclusiveSchemeIdentityRejection(candidate = {}) {
  const title = String(candidate?.schemeName || candidate?.title || candidate?.name || "").trim();
  const url = String(candidate?.officialWebsite || candidate?.sourceUrl || candidate?.url || "").trim();

  // Normalize punctuation so Scheme/Guidelines, Scheme - Guidelines,
  // and Guidelines of Scheme are treated as generic document titles.
  const normalizedTitle = title
    .replace(/&amp;/gi, "&")
    .replace(/<[^>]*>/g, " ")
    .replace(/[\u2013\u2014|_]+/g, " ")
    .replace(/\s*[/\\]+\s*/g, " / ")
    .replace(/\s*-\s*/g, " - ")
    .replace(/\s+/g, " ")
    .trim();

  const genericDocumentTitle = /^(?:scheme(?:s)?|guidelines?|scheme\s*[/\-]\s*guidelines?|guidelines?\s+(?:of\s+)?scheme|scheme\s+(?:details?|information|document|operation(?:s)?|brochure)|operational\s+scheme(?:s)?)$/i.test(normalizedTitle);

  if (genericDocumentTitle) {
    return "GENERIC_SCHEME_DOCUMENT_TITLE";
  }

  if (EXCLUSIVE_SCHEME_TITLE_REJECT_PATTERNS.some((p) => p.test(title) || p.test(normalizedTitle))) {
    return "NON_SCHEME_ADMINISTRATIVE_TITLE";
  }
  if (EXCLUSIVE_SCHEME_URL_REJECT_PATTERNS.some((p) => p.test(url))) {
    return "NON_SCHEME_ADMINISTRATIVE_URL";
  }
  return "";
}

function countExclusiveEvidence(candidate = {}) {
  const blob = [
    candidate?.eligibility,
    candidate?.benefits,
    candidate?.beneficiary,
    candidate?.application,
    candidate?.documents,
    candidate?.description,
    candidate?.evidenceEnrichment?.eligibility,
    candidate?.evidenceEnrichment?.benefits,
    candidate?.evidenceEnrichment?.application,
    candidate?.evidenceEnrichment?.mainText,
  ].filter(Boolean).map((v) => typeof v === "object" ? JSON.stringify(v) : String(v)).join(" ");

  const pillars = {
    eligibility: /\beligib(?:ility|le)\b|\bcriteria\b|\bwho can apply\b/i.test(blob),
    benefits: /\bbenefits?\b|\bsubsid(?:y|ies)\b|\bincentive\b|\bgrant\b|\bfinancial (?:assistance|support|benefit)\b|\binterest subsidy\b|\breimbursement\b|\bcredit guarantee\b/i.test(blob),
    beneficiary: /\bbeneficiar(?:y|ies)\b|\btarget group\b|\btarget beneficiaries\b|\bentrepreneurs?\b|\bmsmes?\b|\bfarmers?\b|\bartisans?\b|\bself[- ]employed\b/i.test(blob),
    application: /\bhow to apply\b|\bapplication process\b|\bapplication procedure\b|\bapply online\b|\bapplication form\b/i.test(blob),
    objective: /\bobjective(?:s)?\b|\bpurpose of the scheme\b|\baim of the scheme\b/i.test(blob),
  };
  return { pillars, count: Object.values(pillars).filter(Boolean).length };
}


// GoSubsidy is a subsidy/incentive/enterprise discovery platform, not an
// general-schemes catalogue. Keep the hard service/welfare exclusions above,
// but allow legitimate business, MSME, agriculture, infrastructure and other
// government financial-support programmes through to verification.
const GOSUBSIDY_SCHEME_PATTERNS = Object.freeze([
  /\bsubsid(y|ies)\b/i,
  /\bincentive(s)?\b/i,
  /\bgrant(s)?\b/i,
  /\bfinancial assistance\b/i,
  /\bcapital subsidy\b/i,
  /\binvestment subsidy\b/i,
  /\bmargin money\b/i,
  /\binterest subsidy\b/i,
  /\bcredit[- ]linked\b/i,
  /\breimbursement\b/i,
  /\bloan assistance\b/i,
  /\bconcessional loan\b/i,
  /\bentrepreneur(ship)?\b/i,
  /\bself[- ]employment\b/i,
  /\benterprise\b/i,
  /\bmsme\b/i,
  /\bstartup\b/i,
  /\bmanufacturing unit\b/i,
  /\bservice enterprise\b/i,
  /\bcommercial unit\b/i,
  /\bfarmer(s)?\b/i,
  /\bagriculture\b/i,
  /\bagri(culture)?[- ]enterprise\b/i,
  /\bdairy\b/i,
  /\bfisher(y|ies)\b/i,
  /\bpoultry\b/i,
  /\bhandloom\b/i,
  /\bhandicraft\b/i,
  /\bartisan\b/i,
  /\bfood processing\b/i,
  /\bexport promotion\b/i,
  /\bindustrial development\b/i,
]);

const GOSUBSIDY_RELEVANT_CATEGORY_PATTERNS = Object.freeze([
  /\bbusiness\s*&\s*self[- ]employed\b/i,
  /\bbusiness\s+and\s+self[- ]employed\b/i,
  /\bmsme\b/i,
  /\bentrepreneur/i,
  /\bagriculture\b/i,
  /\bfarmer/i,
  /\bindustry\b/i,
  /\brural development\b/i,
]);

const GOSUBSIDY_KNOWN_PROGRAM_PATTERNS = Object.freeze([
  /\bpm\s*egp\b/i,
  /\bprime minister'?s employment generation programme\b/i,
  /\bmudra\b/i,
  /\bpradhan mantri mudra\b/i,
  /\bstand[- ]up india\b/i,
  /\bpm vishwakarma\b/i,
  /\bstartup india\b/i,
  /\bcredit guarantee scheme for micro and small enterprises\b/i,
  /\bcg[tm]se\b/i,
  /\bt[- ]pride\b/i,
  /\bt[- ]idea\b/i,
  /\btelangana msme policy\b/i,
]);

function getGoSubsidyCandidateText(candidate = {}) {
  return [
    candidate.schemeName, candidate.title, candidate.name,
    candidate.description, candidate.eligibility, candidate.benefits,
    candidate.application, candidate.beneficiary, candidate.documents,
    candidate.ministry, candidate.department, candidate.officialWebsite,
    candidate.applyLink, candidate.sourceUrl, candidate.url,
    candidate.category, candidate.seedCategory, candidate.discoverySeedTitle,
    candidate.sourceSeed, candidate.evidenceEnrichment?.pageTitle,
    candidate.evidenceEnrichment?.mainText, candidate.evidenceEnrichment?.cleanMainText,
  ].filter(Boolean).join(" ");
}

function evaluateGoSubsidyGeneralSchemeRelevance(candidate = {}) {
  const resolvedCandidate = resolveExclusiveSchemeIdentity(candidate);
  const text = getGoSubsidyCandidateText(resolvedCandidate);
  const exclusions = [];
  const schemeSignals = [];
  const knownPrograms = [];
  const categories = [];

  const identityRejection = exclusiveSchemeIdentityRejection(resolvedCandidate);
  if (identityRejection) {
    return {
      eligible: false,
      score: 0,
      reason: identityRejection,
      signals: { hardExclusions: [identityRejection], schemeSignals: [], knownPrograms: [], relevantCategories: [] },
    };
  }

  for (const pattern of GOSUBSIDY_HARD_EXCLUDE_PATTERNS) {
    const match = text.match(pattern);
    if (match) exclusions.push(match[0]);
  }
  for (const pattern of GOSUBSIDY_SCHEME_PATTERNS) {
    const match = text.match(pattern);
    if (match) schemeSignals.push(match[0]);
  }
  for (const pattern of GOSUBSIDY_KNOWN_PROGRAM_PATTERNS) {
    const match = text.match(pattern);
    if (match) knownPrograms.push(match[0]);
  }
  for (const pattern of GOSUBSIDY_RELEVANT_CATEGORY_PATTERNS) {
    const match = text.match(pattern);
    if (match) categories.push(match[0]);
  }

  const uniqueExclusions = [...new Set(exclusions.map(String))];
  const uniqueSchemeSignals = [...new Set(schemeSignals.map(String))];
  const uniqueKnown = [...new Set(knownPrograms.map(String))];
  const uniqueCategories = [...new Set(categories.map(String))];

  if (uniqueExclusions.length) {
    return {
      eligible: false,
      score: 0,
      reason: "OUT_OF_SCOPE_NON_SCHEME_CONTENT",
      signals: { hardExclusions: uniqueExclusions, schemeSignals: uniqueSchemeSignals, knownPrograms: uniqueKnown, relevantCategories: uniqueCategories },
    };
  }

  const title = String(resolvedCandidate?.schemeName || resolvedCandidate?.title || "").trim();
  const canonicalName = String(resolvedCandidate?.canonicalProgramName || resolvedCandidate?.canonical_program_name || "").trim();
  const identityBlob = `${title} ${canonicalName}`;
  const titleLooksLikeProgramme =
    /\b(scheme|yojana|yojna|programme|program|subsidy|grant|incentive|fund|assistance|support|mission)\b/i.test(identityBlob) ||
    uniqueKnown.length > 0;

  const evidence = countExclusiveEvidence(resolvedCandidate);
  const financialBenefitPresent =
    evidence.pillars.benefits ||
    /\b(subsid(?:y|ies)|grant|incentive|financial assistance|financial support|interest subsidy|capital subsidy|reimbursement|credit guarantee|margin money|concessional loan)\b/i.test(text);

  // Government domain + the word "scheme" is NOT enough.
  // Require programme identity + a real financial/benefit signal + two independent evidence pillars.
  const eligible = titleLooksLikeProgramme && financialBenefitPresent && evidence.count >= 2;

  return {
    eligible,
    score: eligible ? Math.min(10, 3 + evidence.count + uniqueKnown.length) : 0,
    reason: eligible
      ? "EXCLUSIVE_SCHEME_ONLY_PASS"
      : "EXCLUSIVE_SCHEME_ONLY_REJECT: missing programme identity, financial benefit, or independent eligibility/beneficiary/application evidence.",
    signals: {
      hardExclusions: [],
      schemeSignals: uniqueSchemeSignals,
      knownPrograms: uniqueKnown,
      relevantCategories: uniqueCategories,
      titleLooksLikeProgramme,
      financialBenefitPresent,
      evidencePillars: evidence.pillars,
      evidencePillarCount: evidence.count,
    },
  };
}

async function applyGoSubsidyGeneralSchemeGate(candidates) {
  const input = Array.isArray(candidates) ? candidates : [];
  const accepted = [];
  const rejected = [];

  for (const candidate of input) {
    const resolvedCandidate = resolveExclusiveSchemeIdentity(candidate);
    const evaluation = evaluateGoSubsidyGeneralSchemeRelevance(resolvedCandidate);
    const enrichedCandidate = {
      ...resolvedCandidate,
      goSubsidyRelevance: {
        gateVersion: GOSUBSIDY_GENERAL_SCHEME_GATE_VERSION,
        ...evaluation,
      },
    };

    if (evaluation.eligible) accepted.push(enrichedCandidate);
    else rejected.push({ ...enrichedCandidate, reason: evaluation.reason, rejectionStage: "GOSUBSIDY_GENERAL_SCHEME_RELEVANCE_GATE" });
  }

  return {
    candidates: accepted,
    rejected,
    summary: {
      enabled: true,
      version: GOSUBSIDY_GENERAL_SCHEME_GATE_VERSION,
      input: input.length,
      accepted: accepted.length,
      rejected: rejected.length,
      policy: "EXCLUSIVE_GOVERNMENT_SCHEMES_ONLY",
    },
  };
}

// Existing database rows can be repaired even when the upstream discovery
// source did not rediscover the same scheme on this run. This is essential for
// legacy rows such as Telangana T-PRIDE/T-IDEA that already contain strong
// scheme identity/eligibility data but were created before metadata mapping.
function buildExistingMetadataRepairCandidates(existingSchemes = []) {
  return (Array.isArray(existingSchemes) ? existingSchemes : [])
    .filter((row) => row && row.id !== undefined && row.scheme_name)
    .filter((row) => {
      const state = String(row.state_applicability || row.state || "").toLowerCase();
      const slug = String(row.slug || "").trim();
      const canonical = String(row.canonical_program_id || "").trim();
      const caste = String(row.caste_category || "").trim();
      const isState = state && !/all india|india|central/i.test(state);
      return isState || !slug || !canonical || !caste;
    })
    .map((row) => {
      const name = String(row.scheme_name || "").trim();
      const lower = name.toLowerCase();
      let canonicalProgramId = row.canonical_program_id || null;
      if (!canonicalProgramId) {
        if (/t[- ]pride/.test(lower)) canonicalProgramId = "T_PRIDE";
        else if (/t[- ]idea/.test(lower)) canonicalProgramId = "T_IDEA";
        else canonicalProgramId = name.toLowerCase().replace(/[^a-z0-9]+/g, "_").replace(/^_|_$/g, "").slice(0, 80).toUpperCase();
      }

      return {
        ...row,
        id: row.id,
        status: "EXISTING",
        existingSchemeId: row.id,
        schemeName: name,
        title: name,
        canonicalProgramId,
        canonicalProgramName: row.canonical_program_name || name,
        officialWebsite: row.official_website || row.application?.website || "",
        applyLink: row.official_apply_link || row.application?.applyLink || "",
        state: row.state_applicability || "",
        sourceId: "existing-database-repair",
        discoveryType: "EXISTING_METADATA_REPAIR",
        verification: { verified: true, verificationStatus: "VERIFIED", confidence: 1 },
      };
    });
}

async function discoverSchemesV45() {
  const startedAt =
    new Date();

  console.log("");

  console.log(
    "=========================================================="
  );

  console.log(
    "🚀 GoSubsidy Scheme Discovery V5.2-EXCLUSIVE-SCHEMES-HUMAN-APPROVAL"
  );

  console.log(
    "🔎 EXPANDED OFFICIAL DISCOVERY"
  );

  console.log(
    "🛡️ V4.4.4 SMART VERIFICATION GATE"
  );

  console.log(
    `🧩 Runtime version: ${V45_DISCOVERY_VERSION}`
  );

  console.log(
    "=========================================================="
  );

  // ==========================================================
  // 1. LOAD EXISTING DATABASE
  // ==========================================================

  const existingSchemes =
    await loadExistingGoSubsidySchemes();

  console.log(
    `📊 Existing GoSubsidy schemes: ${existingSchemes.length}`
  );

  // ==========================================================
  // 2. V4.5 DISCOVERY
  // ==========================================================

  const sourceDiscovery =
    await runV45SourceDiscovery();

  console.log("");

  console.log(
    `🔗 V4.5 merged candidates: ${sourceDiscovery.candidates.length}`
  );

  console.log(
    `🌱 V4.5 deep candidates: ${sourceDiscovery.v45.deepCandidates}`
  );

  // ==========================================================
  // 3. FINAL DEDUPLICATION
  // ==========================================================

  const uniqueRawCandidates =
    finalDeduplicateCandidates(
      sourceDiscovery.candidates
    );

  console.log(
    `🧹 Unique candidates before verification: ${uniqueRawCandidates.length}`
  );

  // ==========================================================
  // 4. BLOCK 6 — CANDIDATE EVIDENCE ENRICHMENT
  // ==========================================================

  const block6Result =
    await enrichCandidatesWithBlock6(
      uniqueRawCandidates
    );

  console.log("");
  console.log("🔎 BLOCK 6 — Candidate Evidence Enrichment");
  console.log(`   Attempted: ${block6Result.summary.attempted}`);
  console.log(`   Fetched: ${block6Result.summary.fetched}`);
  console.log(`   Enriched: ${block6Result.summary.enriched}`);
  console.log(`   Fetch failures: ${block6Result.summary.fetchFailures}`);
  console.log(`   Insufficient content: ${block6Result.summary.insufficientContent}`);
  console.log(`   Fields extracted: ${block6Result.summary.fieldsExtracted}`);
  console.log(`   Average evidence score: ${block6Result.summary.averageEvidenceScore}`);

  // ==========================================================
  // 5. GoSubsidy GENERAL SCHEME RELEVANCE GATE
  // ==========================================================

  const employmentGateResult =
    await applyGoSubsidyGeneralSchemeGate(
      block6Result.candidates
    );

  console.log("");
  console.log("🎯 GoSubsidy General Scheme Relevance Gate");
  console.log(`   Input: ${employmentGateResult.summary.input}`);
  console.log(`   Accepted: ${employmentGateResult.summary.accepted}`);
  console.log(`   Rejected: ${employmentGateResult.summary.rejected}`);
  console.log("   Policy: GENERAL_GOVERNMENT_SUBSIDY_INCENTIVE_SCHEME");

  // ==========================================================
  // 6. EXISTING V4.4.4 SMART VERIFICATION
  // ==========================================================

  const verificationResult =
    await verifyDiscoveredCandidates(
      employmentGateResult.candidates
    );

  console.log("");

  console.log(
    "=========================================================="
  );

  console.log(
    `🔍 Verification attempted: ${verificationResult.results.length}`
  );

  console.log(
    `✅ Verified: ${verificationResult.verified.length}`
  );

  console.log(
    `❌ Rejected: ${verificationResult.rejected.length}`
  );

  console.log(
    `⚪ Unverified: ${verificationResult.unverified.length}`
  );

  console.log(
    "=========================================================="
  );

  // ==========================================================
  // 5. CONFIDENCE FILTER
  // ==========================================================

  const verifiedFilter =
    filterVerifiedCandidates(
      verificationResult
    );

  console.log(
    `🎯 High-confidence verified: ${verifiedFilter.accepted.length}`
  );

  console.log(
    `⚠️ Low-confidence verified: ${verifiedFilter.lowConfidence.length}`
  );

  // ==========================================================
  // 6. EXISTING / POSSIBLE / NEW MATCHING
  // ==========================================================

  const matchingResult =
    analyseVerifiedCandidates(
      verifiedFilter.accepted,
      existingSchemes
    );

  const analysed =
    Array.isArray(
      matchingResult
    )
      ? matchingResult
      : (
          Array.isArray(
            matchingResult?.analysed
          )
            ? matchingResult.analysed
            : []
        );

  // ==========================================================
  // 7. FINAL STATUS ARRAYS
  // ==========================================================

  const newCandidates =
    analysed.filter(
      (item) =>
        item.status ===
        "NEW"
    );

  const existingMatches =
    analysed.filter(
      (item) =>
        item.status ===
        "EXISTING"
    );

  const legacyRepairCandidates =
    buildExistingMetadataRepairCandidates(existingSchemes);

  const existingMatchIds = new Set(
    existingMatches.map((item) => String(item.existingSchemeId || item.id || ""))
  );

  for (const repairCandidate of legacyRepairCandidates) {
    if (!existingMatchIds.has(String(repairCandidate.id))) {
      existingMatches.push(repairCandidate);
    }
  }

  const possibleMatches =
    analysed.filter(
      (item) =>
        item.status ===
        "POSSIBLE_MATCH"
    );

  // ==========================================================
  // 8. AUTOMATIC SCHEME STORAGE
  // ==========================================================
  //
  // V4.6 production bridge:
  // High-confidence NEW candidates are now handed to the existing
  // BLOCK 7 storage pipeline instead of stopping at discovery.
  //
  // POSSIBLE_MATCH is NEVER auto-inserted. The existing storage
  // service remains responsible for final safety and duplicate checks.
  // Auto import can be disabled with GOSUBSIDY_AUTO_IMPORT=false.
  //
  // ==========================================================

  const autoImportEnabled =
    String(
      process.env.GOSUBSIDY_AUTO_IMPORT ??
        "true"
    ).trim().toLowerCase() !== "false";

  let automaticStorage = {
    enabled: autoImportEnabled,
    attempted: false,
    success: true,
    totalCandidates: newCandidates.length,
    imported: 0,
    repaired: 0,
    rejected: 0,
    data: [],
    repairedRows: [],
    rejectedRows: [],
    error: null,
  };

  if (
    autoImportEnabled &&
    newCandidates.length > 0
  ) {
    automaticStorage.attempted = true;

    try {
      const storageResult =
        await importDiscoveredSchemes(
          newCandidates
        );

      automaticStorage = {
        ...automaticStorage,
        success: Boolean(
          storageResult?.success
        ),
        imported: Number(
          storageResult?.imported ||
            0
        ),
        repaired: Number(
          storageResult?.repaired ||
            0
        ),
        rejected: Number(
          storageResult?.rejected ||
            0
        ),
        data: Array.isArray(
          storageResult?.data
        )
          ? storageResult.data
          : [],
        repairedRows: Array.isArray(
          storageResult?.repairedRows
        )
          ? storageResult.repairedRows
          : [],
        rejectedRows: Array.isArray(
          storageResult?.rejectedRows
        )
          ? storageResult.rejectedRows
          : [],
      };
    } catch (error) {
      automaticStorage = {
        ...automaticStorage,
        success: false,
        error:
          error?.message ||
          "AUTOMATIC_SCHEME_STORAGE_FAILED",
      };
    }
  }

  // ==========================================================
  // 9. STATUS COUNTS
  // ==========================================================

  const statusCounts =
    countStatuses(
      analysed
    );

  // ==========================================================
  // 9. REJECTION COUNTS
  // ==========================================================

  const rejectionReasons =
    countRejections(
      verificationResult.rejected
    );

  // ==========================================================
  // 10. FINAL SUMMARY
  // ==========================================================

  const completedAt =
    new Date();

  const summary = {
    existingGoSubsidySchemes:
      existingSchemes.length,

    sources:
      V42_DISCOVERY_SOURCES.length,

    htmlLinksScanned:
      sourceDiscovery.sourceSummary
        .reduce(
          (
            total,
            source
          ) =>
            total +
            (
              source.linksScanned ||
              0
            ),
          0
        ) +
        (
          sourceDiscovery.v45
            ?.linksScanned ||
          0
        ) +
        (
          sourceDiscovery.v45
            ?.ngsp?.linksScanned ||
          0
        ),

    listingPagesScanned:
      sourceDiscovery.sourceSummary
        .reduce(
          (
            total,
            source
          ) =>
            total +
            (
              source.pagesScanned ||
              0
            ),
          0
        ) +
        (
          sourceDiscovery.v45
            ?.pagesScanned ||
          0
        ) +
        (
          sourceDiscovery.v45
            ?.ngsp?.pagesScanned ||
          0
        ),

    sourceFetchFailures:
      sourceDiscovery.sourceSummary
        .reduce(
          (
            total,
            source
          ) =>
            total +
            (
              source.fetchFailures ||
              0
            ),
          0
        ) +
        (
          sourceDiscovery.v45
            ?.fetchFailures ||
          0
        ),

    rawCandidates:
      sourceDiscovery.candidates
        .length,

    uniqueCandidates:
      uniqueRawCandidates
        .length,

    goSubsidyGeneralSchemeGate:
      employmentGateResult.summary,

    rejectedByGoSubsidyGeneralSchemeGate:
      employmentGateResult.rejected
        .length,

    verified:
      verificationResult.verified
        .length,

    rejectedByVerification:
      verificationResult.rejected
        .length,

    unverified:
      verificationResult.unverified
        .length,

    lowConfidence:
      verifiedFilter.lowConfidence
        .length,

    acceptedForMatching:
      verifiedFilter.accepted
        .length,

    totalDiscovered:
      analysed.length,

    newSchemes:
      statusCounts.newSchemes,

    existingMatches:
      existingMatches.length,

    legacyMetadataRepairCandidates:
      legacyRepairCandidates.length,

    possibleMatches:
      statusCounts.possibleMatches,

    totalRejected:
      sourceDiscovery.rejected
        .length +
      employmentGateResult.rejected
        .length +
      verificationResult.rejected
        .length,

    rejectionReasons,

    minimumVerificationConfidence:
      MIN_VERIFICATION_CONFIDENCE,

    automaticStorage: {
      enabled: automaticStorage.enabled,
      attempted: automaticStorage.attempted,
      success: automaticStorage.success,
      totalCandidates: automaticStorage.totalCandidates,
      imported: automaticStorage.imported,
      repaired: automaticStorage.repaired,
      rejected: automaticStorage.rejected,
      error: automaticStorage.error,
    },

    v45: {
      enabled:
        true,

      totalSeeds:
        sourceDiscovery.v45
          ?.totalSeeds ||
        0,

      seedPagesScanned:
        sourceDiscovery.v45
          ?.pagesScanned ||
        0,

      seedLinksScanned:
        sourceDiscovery.v45
          ?.linksScanned ||
        0,

      deepCandidates:
        sourceDiscovery.v45
          ?.deepCandidates ||
        0,
    },
  };

  // ==========================================================
  // 11. FINAL RESPONSE
  // ==========================================================

  return {
    success:
      automaticStorage.success,

    mode:
      autoImportEnabled
        ? "DISCOVERY_AND_AUTO_IMPORT"
        : DISCOVERY_MODE,

    version:
      V45_DISCOVERY_VERSION,

    smartVerification:
      true,

    cleanDiscovery:
      true,

    scannedAt:
      completedAt.toISOString(),

    sources:
      V42_DISCOVERY_SOURCES.map(
        (
          source
        ) => ({
          id:
            source.id,

          name:
            source.name,

          url:
            source.url,

          type:
            source.type,
        })
      ),

    sourceSummary:
      sourceDiscovery.sourceSummary,

    v45:
      {
        ...sourceDiscovery.v45,
        block6: block6Result.summary,
      },

    summary,

    verification: {
      attempted:
        verificationResult.results
          .length,

      verified:
        verificationResult.verified
          .length,

      rejected:
        verificationResult.rejected
          .length,

      unverified:
        verificationResult.unverified
          .length,

      lowConfidence:
        verifiedFilter.lowConfidence
          .length,

      minimumConfidence:
        MIN_VERIFICATION_CONFIDENCE,
    },

    results:
      analysed,

    newCandidates,

    existingMatches,

    possibleMatches,

    automaticStorage,

    rejected:
      [
        ...sourceDiscovery.rejected,
        ...verificationResult.rejected,
      ],

    unverified:
      verificationResult.unverified,

    rejectionReasons,

    api: {
      configured:
        false,

      candidates:
        0,

      reason:
        "V4.5.6 general scheme relevance gate + BLOCK6 evidence enrichment + V4.5.6-FINAL-CORRECTED discovery/verification pipeline. myScheme API integration remains disabled until authorised API configuration is provided.",
    },
  };
}


// ============================================================
// V4.5 PUBLIC ALIAS
// ============================================================

async function discoverSchemes() {
  return discoverSchemesV45();
}

function isLikelyPaginationLink(
  url,
  title
) {
  const value =
    `${url || ""} ${title || ""}`.toLowerCase();

  return (
    /(?:[?&](?:page|p|page_no|page_number|offset|start)=\d+)/i.test(value) ||
    /\/page\/?\d+/i.test(value) ||
    /\b(?:next|next page|older|load more)\b/i.test(value)
  );
}

function buildSourcePaginationSeeds(
  source,
  baseUrl
) {
  const seeds = [];

  if (!source || !baseUrl) {
    return seeds;
  }

  // ==========================================================
  // V4.4.2 OFFICIAL PAGINATION SEEDS
  // ==========================================================
  // The National Portal scheme directory currently uses the
  // `pagenumber` query parameter on its /search route. Some
  // pagination controls are rendered dynamically, so they may
  // not appear in the anchor list extracted from HTML.
  // Seed the official pages explicitly while retaining the
  // normal same-host, visited, and maximum-page protections.
  // ==========================================================

  if (
    source.id ===
      "msme-offerings" ||
    source.id ===
      "fisheries-offerings"
  ) {
    try {
      const parsed =
        new URL(baseUrl);

      // Current ministry catalogue pages are usually server-rendered
      // listing pages. Keep pagination conservative to avoid broad
      // crawling while still reaching later scheme cards.
      for (let page = 1; page <= 5; page++) {
        const pageUrl =
          new URL(parsed.toString());
        pageUrl.searchParams.set(
          "page",
          String(page)
        );

        seeds.push(
          pageUrl.toString()
        );
      }
    } catch {
      // Ignore malformed source URLs.
    }
  }

  if (
    source.id ===
      "india-gov-schemes"
  ) {
    try {
      const parsed =
        new URL(baseUrl);

      const pathname =
        parsed.pathname
          .replace(/\/+$/, "");

      const isSchemeDirectory =
        pathname ===
          "/my-government/schemes" ||
        pathname ===
          "/my-government/schemes/search";

      if (isSchemeDirectory) {
        const maxSeeds =
          Math.max(
            0,
            V44_MAX_LISTING_PAGES - 1
          );

        for (
          let page = 1;
          page <= maxSeeds;
          page++
        ) {
          const pageUrl =
            new URL(
              "/my-government/schemes/search",
              parsed.origin
            );

          pageUrl.searchParams.set(
            "pagenumber",
            String(page)
          );

          seeds.push(
            pageUrl.toString()
          );
        }
      }
    } catch {
      // Ignore malformed source URLs.
    }
  }

  return seeds;
}


function collectPaginationLinks(
  links,
  baseUrl
) {
  const result = [];
  const seen = new Set();

  for (
    const link of links
  ) {
    if (
      !isLikelyPaginationLink(
        link.url,
        link.title
      )
    ) {
      continue;
    }

    const normalized =
      discoveryNormalizeUrl(
        link.url
      );

    if (!normalized) {
      continue;
    }

    try {
      const sourceHost =
        new URL(baseUrl).hostname;
      const candidateHost =
        new URL(normalized).hostname;

      if (
        sourceHost !==
        candidateHost
      ) {
        continue;
      }
    } catch {
      continue;
    }

    if (
      seen.has(normalized)
    ) {
      continue;
    }

    seen.add(normalized);
    result.push(normalized);
  }

  return result;
}

async function discoverSourcePages(
  source
) {
  const pages = [];
  const queue = [
    source.url,
  ];
  const visited = new Set();

  // ==========================================================
  // V4.4.2 SOURCE-SPECIFIC PAGE SEEDS
  // ==========================================================

  const seededPages =
    buildSourcePaginationSeeds(
      source,
      source.url
    );

  for (
    const seed of seededPages
  ) {
    if (
      queue.length >=
      V44_MAX_LISTING_PAGES
    ) {
      break;
    }

    if (
      !queue.includes(seed)
    ) {
      queue.push(seed);
    }
  }

  while (
    queue.length > 0 &&
    pages.length < V44_MAX_LISTING_PAGES
  ) {
    const pageUrl =
      queue.shift();
    const normalized =
      discoveryNormalizeUrl(
        pageUrl
      );

    if (
      !normalized ||
      visited.has(normalized)
    ) {
      continue;
    }

    visited.add(normalized);

    try {
      const fetched =
        await fetchDiscoveryHtml(
          normalized,
          {
            attempts: 3,
          }
        );

      const links =
        extractDiscoveryLinks(
          fetched.html,
          fetched.finalUrl ||
            normalized
        );

      pages.push({
        url: normalized,
        finalUrl:
          fetched.finalUrl ||
          normalized,
        html:
          fetched.html,
        links,
        attemptsUsed:
          fetched.attemptsUsed ||
          1,
      });

      const paginationLinks =
        collectPaginationLinks(
          links,
          normalized
        );

      for (
        const nextUrl of
        paginationLinks
      ) {
        if (
          !visited.has(nextUrl) &&
          !queue.includes(nextUrl) &&
          pages.length + queue.length <
            V44_MAX_LISTING_PAGES
        ) {
          queue.push(
            nextUrl
          );
        }
      }
    } catch (error) {
      pages.push({
        url: normalized,
        finalUrl: normalized,
        html: "",
        links: [],
        attemptsUsed:
          V44_MAX_RETRY_CANDIDATES,
        error:
          error.message,
      });
    }
  }

  return pages;
}

function buildCandidateFromLink(
  link,
  source
) {
  return buildDiscoveryCandidate(
    link,
    source
  );
}

// ============================================================
// DISCOVER RAW HTML CANDIDATES
// ============================================================

async function discoverRawHtmlCandidates(
  source
) {
  const result = {
    source,
    candidates: [],
    rejected: [],
    totalLinks: 0,
    pagesScanned: 0,
    fetchFailures: 0,
    links: [],
    error: null,
  };

  try {
    const pages =
      await discoverSourcePages(
        source
      );

    result.pagesScanned =
      pages.length;

    const seenLinks =
      new Set();

    for (
      const page of pages
    ) {
      if (
        page.error
      ) {
        result.fetchFailures++;
        result.rejected.push({
          title: "",
          url: page.url,
          reason:
            "Source page fetch failed after retries",
          sourceId:
            source.id,
          sourceName:
            source.name,
          error:
            page.error,
        });
        continue;
      }

      for (
        const link of
        page.links
      ) {
        // Preserve raw source links for V4.5 seed discovery.
        // The original V4.4 result only exposed candidates, which
        // caused V4.5 seed collection to see zero links.
        if (
          link &&
          link.url
        ) {
          result.links.push({
            ...link,
            sourcePage:
              page.finalUrl ||
              page.url ||
              source.url,
          });
        }

        result.totalLinks++;

        if (
          result.totalLinks >
          V44_MAX_LINKS_PER_SOURCE
        ) {
          break;
        }

        const normalizedUrl =
          discoveryNormalizeUrl(
            link.url
          );

        if (
          !normalizedUrl ||
          seenLinks.has(
            normalizedUrl
          )
        ) {
          continue;
        }

        seenLinks.add(
          normalizedUrl
        );

        const validation =
          initialDiscoveryFilter(
            link
          );

        if (
          !validation.valid
        ) {
          result.rejected.push({
            title:
              cleanDiscoveryCandidateTitle(
                link.title
              ),
            url:
              normalizedUrl,
            reason:
              validation.reason,
            sourceId:
              source.id,
            sourceName:
              source.name,
          });
          continue;
        }

        result.candidates.push(
          buildCandidateFromLink(
            {
              ...link,
              url:
                normalizedUrl,
            },
            source
          )
        );
      }
    }

    return result;
  } catch (error) {
    result.error =
      error.message;
    return result;
  }
}

// ============================================================
// DEDUPLICATE RAW CANDIDATES
// ============================================================

function deduplicateDiscoveryCandidates(
  candidates
) {
  const map =
    new Map();

  for (
    const candidate of
    candidates
  ) {
    const name =
      cleanDiscoveryCandidateTitle(
        candidate.schemeName ||
          candidate.title
      )
        .toLowerCase();

    const url =
      discoveryNormalizeUrl(
        candidate.officialWebsite ||
          candidate.applyLink ||
          candidate.sourceUrl
      );

    const key =
      url ||
      name;

    if (!key) {
      continue;
    }

    if (
      !map.has(
        key
      )
    ) {
      map.set(
        key,
        candidate
      );
    }
  }

  return Array.from(
    map.values()
  );
}


// ============================================================
// V4.3 CANDIDATE VERIFICATION
// ============================================================
//
// This function is the actual bridge between V4.2 discovery
// and the V4.3 Smart Page Verification Engine.
//
// ============================================================

async function verifyDiscoveredCandidates(
  candidates
) {
  console.log("");

  console.log(
    "=================================================="
  );

  console.log(
    "🔍 V4.3 SMART PAGE VERIFICATION"
  );

  console.log(
    "=================================================="
  );

  const verified =
    [];

  const rejected =
    [];

  const unverified =
    [];

  const results =
    [];

  let index =
    0;

  for (
    const candidate of
    candidates
  ) {
    index++;

    console.log(
      `🔎 Verifying ${index}/${candidates.length}: ${candidate.schemeName}`
    );

    let result;

    try {
      result =
        await verifySchemeCandidate(
          candidate
        );
    } catch (error) {
      result = {
        verified:
          false,

        verificationStatus:
          "UNVERIFIED",

        confidence:
          0,

        reason:
          "Verification engine error.",

        error:
          error.message,
      };
    }

    const enriched = {
      ...candidate,

      verification:
        result,

      verificationStatus:
        result.verificationStatus,

      verificationConfidence:
        result.confidence,

      verificationReason:
        result.reason,
    };

    results.push(
      enriched
    );

    if (
      result.verificationStatus ===
      "VERIFIED"
    ) {
      console.log(
        `   ✅ VERIFIED (${result.confidence})`
      );

      verified.push(
        enriched
      );

      continue;
    }

    if (
      result.verificationStatus ===
      "UNVERIFIED"
    ) {
      console.log(
        `   ⚪ UNVERIFIED: ${result.reason}`
      );

      unverified.push(
        enriched
      );

      continue;
    }

    console.log(
      `   ❌ REJECTED: ${result.reason}`
    );

    rejected.push(
      enriched
    );
  }

  return {
    results,

    verified,

    rejected,

    unverified,
  };
}


// ============================================================
// VERIFICATION CONFIDENCE THRESHOLD
// ============================================================
//
// We only allow high-confidence verified candidates into
// the NEW / EXISTING matching stage.
//
// Lower-confidence candidates remain visible under
// "unverified" for inspection.
//
// ============================================================

const MIN_VERIFICATION_CONFIDENCE =
  Number(
    process.env.SCHEME_MIN_VERIFICATION_CONFIDENCE ||
      0.55
  );


// ============================================================
// FILTER VERIFIED CANDIDATES
// ============================================================

function filterVerifiedCandidates(
  verificationResult
) {
  const accepted =
    [];

  const lowConfidence =
    [];

  for (
    const candidate of
    verificationResult.verified ||
    []
  ) {
    const confidence =
      Number(
        candidate
          ?.verificationConfidence ||
        0
      );

    if (
      confidence >=
      MIN_VERIFICATION_CONFIDENCE
    ) {
      accepted.push(
        candidate
      );
    } else {
      lowConfidence.push({
        ...candidate,

        verificationReason:
          "Verification confidence below automatic acceptance threshold.",
      });
    }
  }

  return {
    accepted,

    lowConfidence,
  };
}


// ============================================================
// BUILD V4.3 DISCOVERY REJECTION
// ============================================================

function buildDiscoveryRejection(
  candidate,
  reason,
  extra = {}
) {
  return {
    title:
      candidate?.schemeName ||
      candidate?.title ||
      "",

    url:
      candidate?.officialWebsite ||
      candidate?.applyLink ||
      candidate?.sourceUrl ||
      "",

    reason,

    sourceId:
      candidate?.sourceId ||
      null,

    sourceName:
      candidate?.sourceName ||
      null,

    ...extra,
  };
}


// ============================================================
// COMBINE V4.2 + V4.3 REJECTIONS
// ============================================================

function combineDiscoveryRejections(
  initialRejected,
  verificationResult,
  lowConfidence
) {
  const rejected =
    [];

  for (
    const item of
    initialRejected ||
    []
  ) {
    rejected.push(
      item
    );
  }

  for (
    const item of
    verificationResult.rejected ||
    []
  ) {
    rejected.push(
      buildDiscoveryRejection(
        item,
        item.verificationReason ||
          item
            ?.verification
            ?.reason ||
          "Failed page verification",
        {
          verification:
            item.verification ||
            null,
        }
      )
    );
  }

  for (
    const item of
    lowConfidence ||
    []
  ) {
    rejected.push(
      buildDiscoveryRejection(
        item,
        item.verificationReason ||
          "Low verification confidence",
        {
          verification:
            item.verification ||
            null,
        }
      )
    );
  }

  return rejected;
}


// ============================================================
// V4.3 VERIFICATION SUMMARY
// ============================================================

function buildDiscoveryVerificationSummary(
  verificationResult,
  lowConfidence
) {
  const results =
    verificationResult?.results ||
    [];

  let verified =
    0;

  let rejected =
    0;

  let unverified =
    0;

  for (
    const item of
    results
  ) {
    const status =
      item
        ?.verification
        ?.verificationStatus;

    if (
      status ===
      "VERIFIED"
    ) {
      verified++;
    }

    if (
      status ===
      "REJECTED"
    ) {
      rejected++;
    }

    if (
      status ===
      "UNVERIFIED"
    ) {
      unverified++;
    }
  }

  return {
    attempted:
      results.length,

    verified,

    rejected,

    unverified,

    lowConfidence:
      lowConfidence?.length ||
      0,

    acceptedForMatching:
      verificationResult
        ?.verified
        ?.length -
        (
          lowConfidence?.length ||
          0
        ) ||
      0,

    minimumConfidence:
      MIN_VERIFICATION_CONFIDENCE,
  };
}


// ============================================================
// EXPORTS — BLOCK 3
// ============================================================

export {
  V42_DISCOVERY_SOURCES,

  extractDiscoveryLinks,

  initialDiscoveryFilter,

  buildDiscoveryCandidate,

  discoverRawHtmlCandidates,

  deduplicateDiscoveryCandidates,

  verifyDiscoveredCandidates,

  filterVerifiedCandidates,

  combineDiscoveryRejections,

  buildDiscoveryVerificationSummary,
};
// ============================================================
// V4.3 — BLOCK 4
// FINAL DISCOVERY PIPELINE
// ============================================================
//
// FINAL FLOW:
//
// Existing GoSubsidy schemes
//          ↓
// Official source discovery
//          ↓
// V4.2 initial filtering
//          ↓
// V4.3 actual-page verification
//          ↓
// Confidence filtering
//          ↓
// Deduplication
//          ↓
// Existing scheme comparison
//          ↓
// NEW / EXISTING / POSSIBLE_MATCH
//
// IMPORTANT:
// ------------------------------------------------------------
// DISCOVERY ONLY
//
// This function NEVER:
//   - inserts schemes
//   - updates schemes
//   - deletes schemes
//   - modifies Supabase
//
// ============================================================


// ============================================================
// IMPORT EXISTING SCHEME SERVICE
// ============================================================
//
// If your V4.3 file is using ES modules, keep this import.
//
// ============================================================

import {
  getAllSchemes,
  importDiscoveredSchemes,
} from "./scheme.service.js";


// ============================================================
// V4.3 VERSION
// ============================================================

const DISCOVERY_VERSION =
  "4.4.4";


// ============================================================
// DISCOVERY MODE
// ============================================================

const DISCOVERY_MODE =
  "DISCOVERY_ONLY";


// ============================================================
// LOAD EXISTING GOSUBSIDY SCHEMES
// ============================================================

async function loadExistingGoSubsidySchemes() {
  try {
    const result =
      await getAllSchemes();

    if (
      Array.isArray(
        result
      )
    ) {
      return result;
    }

    if (
      Array.isArray(
        result?.data
      )
    ) {
      return result.data;
    }

    if (
      Array.isArray(
        result?.schemes
      )
    ) {
      return result.schemes;
    }

    return [];
  } catch (error) {
    console.error(
      "❌ Failed to load existing GoSubsidy schemes:",
      error.message
    );

    throw error;
  }
}


// ============================================================
// NORMALIZE SCHEME NAME
// ============================================================

function finalNormalizeSchemeName(
  value
) {
  if (
    value === null ||
    value === undefined
  ) {
    return "";
  }

  return String(
    value
  )
    .toLowerCase()
    .replace(
      /&/g,
      "and"
    )
    .replace(
      /[^\p{L}\p{N}\s]/gu,
      " "
    )
    .replace(
      /\s+/g,
      " "
    )
    .trim();
}


// ============================================================
// GET EXISTING SCHEME NAME
// ============================================================

function finalExistingSchemeName(
  scheme
) {
  if (!scheme) {
    return "";
  }

  return (
    scheme.scheme_name ||
    scheme.schemeName ||
    scheme.name ||
    scheme.title ||
    scheme.scheme ||
    ""
  );
}


// ============================================================
// GET EXISTING SCHEME URL
// ============================================================

function finalExistingSchemeUrl(
  scheme
) {
  if (!scheme) {
    return "";
  }

  return (
    scheme.official_website ||
    scheme.officialWebsite ||
    scheme.website ||
    scheme.official_url ||
    scheme.officialUrl ||
    scheme.apply_link ||
    scheme.applyLink ||
    scheme.apply_url ||
    scheme.applyUrl ||
    ""
  );
}


// ============================================================
// FINAL URL NORMALIZER
// ============================================================

function finalNormalizeUrl(
  value
) {
  if (!value) {
    return "";
  }

  try {
    const url =
      new URL(
        value
      );

    url.hash = "";

    return url.href
      .replace(
        /\/+$/,
        ""
      )
      .toLowerCase();
  } catch {
    return "";
  }
}


// ============================================================
// TOKENIZE SCHEME NAME
// ============================================================

function finalTokenizeName(
  value
) {
  return finalNormalizeSchemeName(
    value
  )
    .split(
      " "
    )
    .filter(
      (word) =>
        word.length >=
        3
    );
}


// ============================================================
// NAME SIMILARITY
// ============================================================

function finalNameSimilarity(
  first,
  second
) {
  const a =
    finalNormalizeSchemeName(
      first
    );

  const b =
    finalNormalizeSchemeName(
      second
    );

  if (
    !a ||
    !b
  ) {
    return 0;
  }

  if (
    a === b
  ) {
    return 1;
  }

  if (
    a.includes(b) ||
    b.includes(a)
  ) {
    return 0.92;
  }

  const aWords =
    new Set(
      finalTokenizeName(
        a
      )
    );

  const bWords =
    new Set(
      finalTokenizeName(
        b
      )
    );

  if (
    !aWords.size ||
    !bWords.size
  ) {
    return 0;
  }

  let intersection =
    0;

  for (
    const word of
    aWords
  ) {
    if (
      bWords.has(
        word
      )
    ) {
      intersection++;
    }
  }

  const union =
    new Set([
      ...aWords,
      ...bWords,
    ]).size;

  if (!union) {
    return 0;
  }

  return (
    intersection /
    union
  );
}


// ============================================================
// URL SIMILARITY
// ============================================================

function finalUrlSimilarity(
  first,
  second
) {
  const a =
    finalNormalizeUrl(
      first
    );

  const b =
    finalNormalizeUrl(
      second
    );

  if (
    !a ||
    !b
  ) {
    return 0;
  }

  if (
    a === b
  ) {
    return 1;
  }

  try {
    const firstUrl =
      new URL(
        a
      );

    const secondUrl =
      new URL(
        b
      );

    if (
      firstUrl.hostname ===
        secondUrl.hostname &&
      firstUrl.pathname ===
        secondUrl.pathname
    ) {
      return 0.98;
    }

    if (
      firstUrl.hostname ===
      secondUrl.hostname
    ) {
      return 0.70;
    }
  } catch {
    return 0;
  }

  return 0;
}


// ============================================================
// MATCH CANDIDATE AGAINST EXISTING SCHEMES
// ============================================================

function matchCandidateAgainstExisting(
  candidate,
  existingSchemes
) {
  const candidateName =
    candidate.schemeName ||
    candidate.title ||
    "";

  const candidateUrl =
    finalNormalizeUrl(
      candidate.officialWebsite ||
        candidate.applyLink ||
        candidate.sourceUrl
    );

  const normalizedCandidateName =
    finalNormalizeSchemeName(
      candidateName
    );

  let bestMatch =
    null;

  let bestScore =
    0;

  let bestType =
    "NONE";

  for (
    const existing of
    existingSchemes
  ) {
    const existingName =
      finalExistingSchemeName(
        existing
      );

    const existingUrl =
      finalNormalizeUrl(
        finalExistingSchemeUrl(
          existing
        )
      );

    const normalizedExistingName =
      finalNormalizeSchemeName(
        existingName
      );

    // --------------------------------------------------------
    // EXACT URL
    // --------------------------------------------------------

    if (
      candidateUrl &&
      existingUrl &&
      candidateUrl ===
        existingUrl
    ) {
      return {
        status:
          "EXISTING",

        score:
          1,

        matchType:
          "EXACT_URL",

        existingScheme:
          existing,
      };
    }

    // --------------------------------------------------------
    // EXACT NAME
    // --------------------------------------------------------

    if (
      normalizedCandidateName &&
      normalizedExistingName &&
      normalizedCandidateName ===
        normalizedExistingName
    ) {
      return {
        status:
          "EXISTING",

        score:
          1,

        matchType:
          "EXACT_NAME",

        existingScheme:
          existing,
      };
    }

    // --------------------------------------------------------
    // SIMILARITY
    // --------------------------------------------------------

    const nameScore =
      finalNameSimilarity(
        candidateName,
        existingName
      );

    const urlScore =
      finalUrlSimilarity(
        candidateUrl,
        existingUrl
      );

    let combinedScore =
      nameScore;

    if (
      urlScore >
      0
    ) {
      combinedScore =
        Math.max(
          nameScore,
          (
            nameScore *
            0.70
          ) +
          (
            urlScore *
            0.30
          )
        );
    }

    if (
      combinedScore >
      bestScore
    ) {
      bestScore =
        combinedScore;

      bestMatch =
        existing;

      bestType =
        urlScore >=
          0.98
          ? "URL_MATCH"
          : "NAME_SIMILARITY";
    }
  }

  // ----------------------------------------------------------
  // EXISTING
  // ----------------------------------------------------------

  if (
    bestScore >=
    0.90
  ) {
    return {
      status:
        "EXISTING",

      score:
        bestScore,

      matchType:
        bestType,

      existingScheme:
        bestMatch,
    };
  }

  // ----------------------------------------------------------
  // POSSIBLE MATCH
  // ----------------------------------------------------------

  if (
    bestScore >=
    0.65
  ) {
    return {
      status:
        "POSSIBLE_MATCH",

      score:
        bestScore,

      matchType:
        bestType,

      existingScheme:
        bestMatch,
    };
  }

  // ----------------------------------------------------------
  // NEW
  // ----------------------------------------------------------

  return {
    status:
      "NEW",

    score:
      bestScore,

    matchType:
      "NONE",

    existingScheme:
      null,
  };
}


// ============================================================
// DEDUPLICATE VERIFIED CANDIDATES
// ============================================================

function finalDeduplicateCandidates(
  candidates
) {
  const map =
    new Map();

  for (
    const candidate of
    candidates
  ) {
    if (!candidate) {
      continue;
    }

    const name =
      finalNormalizeSchemeName(
        candidate.schemeName ||
          candidate.title
      );

    const url =
      finalNormalizeUrl(
        candidate.officialWebsite ||
          candidate.applyLink ||
          candidate.sourceUrl
      );

    const key =
      url ||
      name;

    if (!key) {
      continue;
    }

    const existing =
      map.get(
        key
      );

    if (!existing) {
      map.set(
        key,
        candidate
      );

      continue;
    }

    // Keep candidate with higher verification confidence.
    const currentConfidence =
      Number(
        candidate
          ?.verification
          ?.confidence ||
        candidate
          ?.verificationConfidence ||
        0
      );

    const existingConfidence =
      Number(
        existing
          ?.verification
          ?.confidence ||
        existing
          ?.verificationConfidence ||
        0
      );

    if (
      currentConfidence >
      existingConfidence
    ) {
      map.set(
        key,
        candidate
      );
    }
  }

  return Array.from(
    map.values()
  );
}


// ============================================================
// BUILD NEW CANDIDATE
// ============================================================

function buildFinalNewCandidate(
  candidate,
  match
) {
  return {
    ...candidate,

    status:
      "NEW",

    similarityScore:
      Number(
        (
          match.score ||
          0
        ).toFixed(
          3
        )
      ),

    matchType:
      match.matchType ||
      "NONE",

    existingSchemeId:
      null,

    existingSchemeName:
      null,
  };
}


// ============================================================
// BUILD EXISTING MATCH
// ============================================================

function buildFinalExistingCandidate(
  candidate,
  match
) {
  return {
    ...candidate,

    status:
      "EXISTING",

    similarityScore:
      Number(
        (
          match.score ||
          0
        ).toFixed(
          3
        )
      ),

    matchType:
      match.matchType ||
      "NONE",

    existingSchemeId:
      match
        ?.existingScheme
        ?.id ||
      null,

    existingSchemeName:
      finalExistingSchemeName(
        match.existingScheme
      ) ||
      null,
  };
}


// ============================================================
// BUILD POSSIBLE MATCH
// ============================================================

function buildFinalPossibleCandidate(
  candidate,
  match
) {
  return {
    ...candidate,

    status:
      "POSSIBLE_MATCH",

    similarityScore:
      Number(
        (
          match.score ||
          0
        ).toFixed(
          3
        )
      ),

    matchType:
      match.matchType ||
      "NONE",

    existingSchemeId:
      match
        ?.existingScheme
        ?.id ||
      null,

    existingSchemeName:
      finalExistingSchemeName(
        match.existingScheme
      ) ||
      null,
  };
}


// ============================================================
// V4.10 — NEW CANDIDATE CANONICAL PROGRAM RESOLUTION
// ============================================================
// A discovery URL may be a brochure, guideline, circular, sanction
// order or technology list rather than the programme landing page.
// Storage must receive the PROGRAM identity, not the document title.
// ============================================================

const CANONICAL_PROGRAM_ALIASES_V410 = [
  { id: "MSME_GIFT", name: "MSME Green Investment and Financing for Transformation (GIFT)", patterns: [/\bmsme\s+gift\b/i, /green investment.*financing.*transformation/i, /\bgift\s+scheme\b/i, /\/gift\//i] },
  { id: "MSME_ZED", name: "MSME Sustainable (ZED) Certification Scheme", patterns: [/\bzed\s+certification\b/i, /\bmsme\s+sustainable\s*\(?zed\)?/i, /\/zed[_-]?scheme\//i] },
  { id: "CLCS", name: "Credit Linked Capital Subsidy Scheme (CLCSS)", patterns: [/credit\s+linked\s+capital\s+subsidy/i, /\bclcs\b/i, /\bclcss\b/i, /\/clcs\//i] },
  { id: "MSME_SPICE", name: "MSME SPICE Scheme", patterns: [/\bmsme\s+spice\b/i, /\bspice\s+scheme\b/i, /\/spice\//i] },
  { id: "PMEGP", name: "Prime Minister's Employment Generation Programme (PMEGP)", patterns: [/\bpmegp\b/i, /prime\s+minister.?s\s+employment\s+generation/i] },
  { id: "CGTMSE", name: "Credit Guarantee Scheme for Micro and Small Enterprises (CGTMSE)", patterns: [/\bcgtmse\b/i, /credit\s+guarantee.*micro\s+and\s+small/i] },
  { id: "MSE_CDP", name: "Micro & Small Enterprises Cluster Development Programme (MSE-CDP)", patterns: [/\bmse[- ]?cdp\b/i, /cluster\s+development\s+programme/i] },
  { id: "PM_VISHWAKARMA", name: "PM Vishwakarma", patterns: [/\bpm\s+vishwakarma\b/i] },
  { id: "PMMSY", name: "Pradhan Mantri Matsya Sampada Yojana (PMMSY)", patterns: [/\bpmmsy\b/i, /matsya\s+sampada/i] },
  { id: "FIDF", name: "Fisheries and Aquaculture Infrastructure Development Fund (FIDF)", patterns: [/\bfidf\b/i, /fisheries.*infrastructure.*development\s+fund/i] },
  { id: "PM_MKSSY", name: "Pradhan Mantri Matsya Kisan Samridhi Sah-Yojana (PM-MKSSY)", patterns: [/\bpm[- ]?mkssy\b/i, /matsya\s+kisan\s+samridhi/i] },
];

function canonicalSlugIdV410(value) {
  return String(value || "")
    .toUpperCase()
    .replace(/&/g, " AND ")
    .replace(/[^A-Z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "")
    .slice(0, 80);
}

function resolveCanonicalProgramIdentityV410(candidate) {
  if (!candidate || typeof candidate !== "object") return candidate;

  if (candidate.canonicalProgramId || candidate.canonical_program_id) {
    return {
      ...candidate,
      canonicalProgramId: candidate.canonicalProgramId || candidate.canonical_program_id,
      canonicalProgramName: candidate.canonicalProgramName || candidate.canonical_program_name || candidate.schemeName || candidate.title,
    };
  }

  const haystack = [
    candidate.schemeName,
    candidate.title,
    candidate.description,
    candidate.url,
    candidate.officialWebsite,
    candidate.sourceUrl,
    candidate.evidenceEnrichment?.description,
    candidate.evidenceEnrichment?.mainText,
    candidate.evidenceEnrichment?.eligibility,
    candidate.evidenceEnrichment?.benefits,
    candidate.evidenceEnrichment?.application,
  ].filter(Boolean).join(" ");

  for (const alias of CANONICAL_PROGRAM_ALIASES_V410) {
    if (alias.patterns.some((pattern) => pattern.test(haystack))) {
      return {
        ...candidate,
        canonicalProgramId: alias.id,
        canonicalProgramName: alias.name,
        canonicalIdentityResolution: {
          enabled: true,
          version: "1.12.0-V4.10",
          method: "KNOWN_PROGRAM_ALIAS",
        },
      };
    }
  }

  // Extract a meaningful programme name from common government wording.
  const textParts = [candidate.description, candidate.evidenceEnrichment?.description, candidate.evidenceEnrichment?.mainText].filter(Boolean);
  const textBlob = textParts.join(" ");
  const extracted = textBlob.match(/(?:launched|implemented|introduced|named|called)\s+(?:the\s+)?(?:sub\s+)?scheme\s+(?:named\s+|called\s+)?[“\"']?([^“\"'\.]{8,120}?(?:scheme|yojana|programme|program))[”\"']?/i);
  if (extracted?.[1]) {
    const name = extracted[1].trim().replace(/\s+/g, " ");
    const id = canonicalSlugIdV410(name);
    if (id.length >= 6 && !/^(SCHEME|PROGRAM|PROGRAMME|BROCHURE|CIRCULAR|GUIDELINES?)$/.test(id)) {
      return {
        ...candidate,
        canonicalProgramId: id,
        canonicalProgramName: name,
        canonicalIdentityResolution: {
          enabled: true,
          version: "1.12.0-V4.10",
          method: "CONTENT_PROGRAM_NAME_EXTRACTION",
        },
      };
    }
  }

  return candidate;
}

// ============================================================
// ANALYSE VERIFIED CANDIDATES
// ============================================================

function analyseVerifiedCandidates(
  candidates,
  existingSchemes
) {
  const analysed =
    [];

  for (
    const rawCandidate of
    candidates
  ) {
    const candidate =
      resolveCanonicalProgramIdentityV410(
        rawCandidate
      );

    const match =
      matchCandidateAgainstExisting(
        candidate,
        existingSchemes
      );

    if (
      match.status ===
      "EXISTING"
    ) {
      analysed.push(
        buildFinalExistingCandidate(
          candidate,
          match
        )
      );

      continue;
    }

    if (
      match.status ===
      "POSSIBLE_MATCH"
    ) {
      analysed.push(
        buildFinalPossibleCandidate(
          candidate,
          match
        )
      );

      continue;
    }

    analysed.push(
      buildFinalNewCandidate(
        candidate,
        match
      )
    );
  }

  return analysed;
}


// ============================================================
// DISCOVERY COUNTERS
// ============================================================

function countStatuses(
  analysed
) {
  const counts = {
    total:
      analysed.length,

    newSchemes:
      0,

    existingMatches:
      0,

    possibleMatches:
      0,
  };

  for (
    const item of
    analysed
  ) {
    if (
      item.status ===
      "NEW"
    ) {
      counts.newSchemes++;
    }

    if (
      item.status ===
      "EXISTING"
    ) {
      counts.existingMatches++;
    }

    if (
      item.status ===
      "POSSIBLE_MATCH"
    ) {
      counts.possibleMatches++;
    }
  }

  return counts;
}


// ============================================================
// REJECTION COUNTERS
// ============================================================

function countRejections(
  rejected
) {
  const reasons =
    {};

  for (
    const item of
    rejected
  ) {
    const reason =
      item?.reason ||
      item
        ?.verification
        ?.reason ||
      "Unknown";

    reasons[
      reason
    ] =
      (
        reasons[
          reason
        ] ||
        0
      ) + 1;
  }

  return reasons;
}


// ============================================================
// SOURCE DISCOVERY
// ============================================================

async function runV43SourceDiscovery() {
  const candidates =
    [];

  const rejected =
    [];

  const sourceSummary =
    [];

  for (
    const source of
    V42_DISCOVERY_SOURCES
  ) {
    console.log("");

    console.log(
      `🌐 Source: ${source.name}`
    );

    const result =
      await discoverRawHtmlCandidates(
        source
      );

    candidates.push(
      ...result.candidates
    );

    rejected.push(
      ...result.rejected
    );

    sourceSummary.push({
      id:
        source.id,

      name:
        source.name,

      url:
        source.url,

      linksScanned:
        result.totalLinks,

      pagesScanned:
        result.pagesScanned ||
        0,

      fetchFailures:
        result.fetchFailures ||
        0,

      initialCandidates:
        result.candidates
          .length,

      initialRejected:
        result.rejected
          .length,

      error:
        result.error ||
        null,
    });
  }

  return {
    candidates,

    rejected,

    sourceSummary,
  };
}


// ============================================================
// FINAL V4.3 DISCOVERY
// ============================================================

async function discoverSchemesV43() {
  const startedAt =
    new Date();

  console.log("");

  console.log(
    "=========================================================="
  );

  console.log(
    "🚀 GoSubsidy Scheme Discovery V4.4.2"
  );

  console.log(
    "🔍 SMART PAGE VERIFICATION"
  );

  console.log(
    "🛡️ DISCOVERY ONLY"
  );

  console.log(
    "=========================================================="
  );

  // ==========================================================
  // 1. LOAD EXISTING DATABASE
  // ==========================================================

  const existingSchemes =
    await loadExistingGoSubsidySchemes();

  console.log(
    `📊 Existing GoSubsidy schemes: ${existingSchemes.length}`
  );

  // ==========================================================
  // 2. DISCOVER RAW CANDIDATES
  // ==========================================================

  const sourceDiscovery =
    await runV43SourceDiscovery();

  console.log("");

  console.log(
    `🔗 Raw candidates: ${sourceDiscovery.candidates.length}`
  );

  console.log(
    `🚫 Initial rejected: ${sourceDiscovery.rejected.length}`
  );

  // ==========================================================
  // 3. DEDUPLICATE BEFORE FETCHING
  // ==========================================================
  //
  // This is important.
  //
  // If India.gov.in and myScheme expose the same scheme,
  // we should not fetch the same page multiple times.
  //
  // ==========================================================

  const uniqueRawCandidates =
    finalDeduplicateCandidates(
      sourceDiscovery.candidates
    );

  console.log(
    `🧹 Unique candidates before verification: ${uniqueRawCandidates.length}`
  );

  // ==========================================================
  // 4. SMART PAGE VERIFICATION
  // ==========================================================

  const verificationResult =
    await verifyDiscoveredCandidates(
      uniqueRawCandidates
    );

  console.log("");

  console.log(
    "=========================================================="
  );

  console.log(
    `🔍 Verification attempted: ${verificationResult.results.length}`
  );

  console.log(
    `✅ Verified: ${verificationResult.verified.length}`
  );

  console.log(
    `❌ Rejected: ${verificationResult.rejected.length}`
  );

  console.log(
    `⚪ Unverified: ${verificationResult.unverified.length}`
  );

  console.log(
    "=========================================================="
  );

  // ==========================================================
  // 5. CONFIDENCE FILTER
  // ==========================================================

  const verifiedFilter =
    filterVerifiedCandidates(
      verificationResult
    );

  console.log(
    `🎯 High-confidence verified: ${verifiedFilter.accepted.length}`
  );

  console.log(
    `⚠️ Low-confidence verified: ${verifiedFilter.lowConfidence.length}`
  );

  // ==========================================================
  // 6. FINAL EXCLUSIVE SCHEME IDENTITY GATE
  // ==========================================================
  // Re-check after verification because the verifier may replace the
  // candidate title with a generic page/document title.
  const finalIdentityRejected = [];
  const finalIdentityAccepted = [];

  for (const candidate of verifiedFilter.accepted) {
    const resolvedCandidate = resolveExclusiveSchemeIdentity(candidate);
    const identityReason = exclusiveSchemeIdentityRejection(resolvedCandidate);
    if (identityReason) {
      finalIdentityRejected.push({
        ...resolvedCandidate,
        rejectionReason: identityReason,
        rejectionStage: "FINAL_EXCLUSIVE_SCHEME_IDENTITY_GATE",
      });
    } else {
      finalIdentityAccepted.push(resolvedCandidate);
    }
  }

  console.log(`\n🛡️ FINAL EXCLUSIVE SCHEME IDENTITY GATE`);
  console.log(`   Input: ${verifiedFilter.accepted.length}`);
  console.log(`   Accepted: ${finalIdentityAccepted.length}`);
  console.log(`   Rejected generic/non-scheme titles: ${finalIdentityRejected.length}`);

  // ==========================================================
  // 7. FINAL DEDUPLICATION
  // ==========================================================

  const finalVerifiedCandidates =
    finalDeduplicateCandidates(
      finalIdentityAccepted
    );

  // ==========================================================
  // 7. MATCH AGAINST EXISTING GOSUBSIDY
  // ==========================================================

  const analysed =
    analyseVerifiedCandidates(
      finalVerifiedCandidates,
      existingSchemes
    );

  // ==========================================================
  // 8. STATUS COUNTS
  // ==========================================================

  const statusCounts =
    countStatuses(
      analysed
    );

  // ==========================================================
  // 9. FINAL REJECTION LIST
  // ==========================================================

  // V4.4.4: keep REJECTED and UNVERIFIED strictly separate.
  // Source-level rejected items are already hard-rejected before
  // verification. Verification results are normalized by their
  // explicit verificationStatus so an UNVERIFIED page can never
  // leak into the final rejected[] array.
  const sourceRejected =
    Array.isArray(sourceDiscovery.rejected)
      ? sourceDiscovery.rejected
      : [];

  const verificationRejected =
    Array.isArray(verificationResult.rejected)
      ? verificationResult.rejected.filter(
          (item) =>
            item?.verificationStatus ===
              "REJECTED" ||
            item?.verification?.verificationStatus ===
              "REJECTED"
        )
      : [];

  const lowConfidenceRejected =
    Array.isArray(verifiedFilter.lowConfidence)
      ? verifiedFilter.lowConfidence
      : [];

  const rejected =
    [
      ...sourceRejected,
      ...verificationRejected,
      ...lowConfidenceRejected,
      ...finalIdentityRejected,
    ];

  const unverified =
    Array.isArray(verificationResult.unverified)
      ? verificationResult.unverified.filter(
          (item) =>
            item?.verificationStatus ===
              "UNVERIFIED" ||
            item?.verification?.verificationStatus ===
              "UNVERIFIED"
        )
      : [];

  const rejectionReasons =
    countRejections(
      rejected
    );

  // ==========================================================
  // 10. SPLIT RESULTS
  // ==========================================================

  const newCandidates =
    analysed.filter(
      (
        item
      ) =>
        item.status ===
        "NEW"
    );

  const existingMatches =
    analysed.filter(
      (
        item
      ) =>
        item.status ===
        "EXISTING"
    );

  const possibleMatches =
    analysed.filter(
      (
        item
      ) =>
        item.status ===
        "POSSIBLE_MATCH"
    );

  // ==========================================================
  // 11. SOURCE SUMMARY
  // ==========================================================

  const verificationSummary =
    buildVerificationSummary(
      verificationResult
    );

  // ==========================================================
  // 12. FINAL SUMMARY
  // ==========================================================

  const summary = {
    existingGoSubsidySchemes:
      existingSchemes.length,

    sources:
      V42_DISCOVERY_SOURCES.length,

    htmlLinksScanned:
      sourceDiscovery.sourceSummary.reduce(
        (
          total,
          source
        ) =>
          total +
          (
            source.linksScanned ||
            0
          ),
        0
      ),

    listingPagesScanned:
      sourceDiscovery.sourceSummary.reduce(
        (
          total,
          source
        ) =>
          total +
          (
            source.pagesScanned ||
            0
          ),
        0
      ),

    sourceFetchFailures:
      sourceDiscovery.sourceSummary.reduce(
        (
          total,
          source
        ) =>
          total +
          (
            source.fetchFailures ||
            0
          ),
        0
      ),

    rawCandidates:
      sourceDiscovery
        .candidates
        .length,

    uniqueCandidates:
      uniqueRawCandidates.length,

    verificationAttempted:
      verificationSummary.attempted,

    verified:
      verificationSummary.verified,

    rejectedByVerification:
      verificationSummary.rejected,

    unverified:
      verificationSummary.unverified,

    lowConfidence:
      verifiedFilter.lowConfidence.length,

    acceptedForMatching:
      finalVerifiedCandidates.length,

    totalDiscovered:
      statusCounts.total,

    newSchemes:
      statusCounts.newSchemes,

    existingMatches:
      existingMatches.length,

    legacyMetadataRepairCandidates:
      legacyRepairCandidates.length,

    possibleMatches:
      statusCounts.possibleMatches,

    totalRejected:
      rejected.length,

    rejectionReasons,

    minimumVerificationConfidence:
      MIN_VERIFICATION_CONFIDENCE,
  };

  // ==========================================================
  // 13. CONSOLE OUTPUT
  // ==========================================================

  console.log("");

  console.log(
    "=========================================================="
  );

  console.log(
    "📊 GoSubsidy V4.5.2 DISCOVERY SUMMARY"
  );

  console.log(
    "=========================================================="
  );

  console.log(
    `Existing schemes       : ${summary.existingGoSubsidySchemes}`
  );

  console.log(
    `Listing pages scanned  : ${summary.listingPagesScanned}`
  );

  console.log(
    `HTML links scanned     : ${summary.htmlLinksScanned}`
  );

  console.log(
    `Source fetch failures  : ${summary.sourceFetchFailures}`
  );

  console.log(
    `Raw candidates         : ${summary.rawCandidates}`
  );

  console.log(
    `Unique candidates      : ${summary.uniqueCandidates}`
  );

  console.log(
    `Verification attempted : ${summary.verificationAttempted}`
  );

  console.log(
    `Verified               : ${summary.verified}`
  );

  console.log(
    `Verification rejected  : ${summary.rejectedByVerification}`
  );

  console.log(
    `Unverified             : ${summary.unverified}`
  );

  console.log(
    `Low confidence         : ${summary.lowConfidence}`
  );

  console.log(
    `Accepted for matching  : ${summary.acceptedForMatching}`
  );

  console.log(
    `NEW                    : ${summary.newSchemes}`
  );

  console.log(
    `EXISTING               : ${summary.existingMatches}`
  );

  console.log(
    `POSSIBLE MATCH         : ${summary.possibleMatches}`
  );

  console.log(
    `TOTAL REJECTED         : ${summary.totalRejected}`
  );

  console.log(
    "=========================================================="
  );

  // ==========================================================
  // 14. PRINT NEW SCHEMES
  // ==========================================================

  if (
    newCandidates.length >
    0
  ) {
    console.log("");

    console.log(
      "🆕 NEW SCHEME CANDIDATES"
    );

    for (
      const scheme of
      newCandidates
    ) {
      console.log(
        `   • ${scheme.schemeName}`
      );

      console.log(
        `     ${scheme.officialWebsite || scheme.sourceUrl}`
      );

      console.log(
        `     Verification: ${scheme.verificationConfidence}`
      );

      console.log(
        `     Similarity: ${scheme.similarityScore}`
      );
    }
  }

  // ==========================================================
  // 15. PRINT POSSIBLE MATCHES
  // ==========================================================

  if (
    possibleMatches.length >
    0
  ) {
    console.log("");

    console.log(
      "⚠️ POSSIBLE MATCHES"
    );

    for (
      const scheme of
      possibleMatches
    ) {
      console.log(
        `   • ${scheme.schemeName}`
      );

      console.log(
        `     Existing: ${scheme.existingSchemeName || "Unknown"}`
      );

      console.log(
        `     Similarity: ${scheme.similarityScore}`
      );
    }
  }

  // ==========================================================
  // 16. DISCOVERY FINISHED
  // ==========================================================

  const completedAt =
    new Date();

  console.log("");

  console.log(
    `⏱️ Started : ${startedAt.toISOString()}`
  );

  console.log(
    `⏱️ Finished: ${completedAt.toISOString()}`
  );

  console.log(
    "=========================================================="
  );

  console.log(
    "✅ V4.4.1 DISCOVERY COMPLETE"
  );

  console.log(
    "🛡️ NO DATABASE CHANGES WERE MADE"
  );

  console.log(
    "=========================================================="
  );

  // ==========================================================
  // 17. FINAL RESPONSE
  // ==========================================================

  return {
    success:
      true,

    mode:
      DISCOVERY_MODE,

    version:
      DISCOVERY_VERSION,

    smartVerification:
      true,

    cleanDiscovery:
      true,

    scannedAt:
      completedAt.toISOString(),

    sources:
      V42_DISCOVERY_SOURCES.map(
        (
          source
        ) => ({
          id:
            source.id,

          name:
            source.name,

          url:
            source.url,

          type:
            source.type,
        })
      ),

    sourceSummary:
      sourceDiscovery.sourceSummary,

    summary,

    verification: {
      attempted:
        verificationResult
          .results
          .length,

      verified:
        verificationResult
          .verified
          .length,

      rejected:
        verificationResult
          .rejected
          .length,

      unverified:
        verificationResult
          .unverified
          .length,

      lowConfidence:
        verifiedFilter
          .lowConfidence
          .length,

      minimumConfidence:
        MIN_VERIFICATION_CONFIDENCE,
    },

    results:
      analysed,

    newCandidates,

    existingMatches,

    possibleMatches,

    rejected,

    unverified,

    rejectionReasons,

    api: {
      configured:
        false,

      candidates:
        0,

      reason:
        "V4.4.1 HTML discovery + V4.3 smart verification pipeline. myScheme API integration remains disabled until authorised API configuration is provided.",
    },
  };
}


// ============================================================
// V4.5 FINAL EXPORTS
// ============================================================
//
// V4.5 is the public discovery pipeline.
//
// V4.3 remains exported for backward compatibility/testing,
// but discoverSchemes() now points only to V4.5.
// ============================================================

export {
  discoverSchemes,

  discoverSchemesV45,

  discoverSchemesV43,

  runV45SourceDiscovery,

  loadExistingGoSubsidySchemes,

  matchCandidateAgainstExisting,

  finalDeduplicateCandidates,

  analyseVerifiedCandidates,

  countStatuses,

  countRejections,

  runV43SourceDiscovery,

  discoverSourcePages,

  collectPaginationLinks,

  fetchDiscoveryHtml,

  V44_MAX_LISTING_PAGES,

  V44_MAX_LINKS_PER_SOURCE,

  MIN_VERIFICATION_CONFIDENCE,

  V45_DISCOVERY_VERSION,

  V45_MAX_SEED_PAGES,

  V45_MAX_CATEGORY_SEEDS,

  V45_MAX_MINISTRY_SEEDS,

  extractV45SchemeCandidates,

  mergeV45Candidates,

  collectV45DiscoverySeeds,

  crawlV45DiscoverySeed,

  crawlV45DiscoverySeeds,

  V45_NGSP_SOURCE,

  V45_NGSP_MIGRATED_SOURCES,

  crawlV45NGSP,

  extractV45NGSPCandidates,

  extractV45NGSPServiceLinksFromHtml,

  resolveCanonicalProgramIdentityV410,

  CANONICAL_PROGRAM_ALIASES_V410,

  // V4.6.5 full-field recovery helpers
  block6ExtractEvidenceFields,
  enrichCandidateWithBlock6,
  extractOfficialRelatedLinks,
  resolveExclusiveSchemeIdentity,
};
