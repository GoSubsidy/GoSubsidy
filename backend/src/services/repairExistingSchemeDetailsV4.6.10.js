// ============================================================
// GoSubsidy V4.6.10 EXISTING SCHEME DETAIL REPAIR
// ============================================================
// Purpose:
//   Repair incomplete existing scheme records without replacing
//   the large schemeDiscoveryV4.6-AutoImport.js pipeline.
//
// IMPORTANT:
//   - Uses official government fallback sources when the stored
//     official_website is an India.gov/migrated page that cannot
//     be fetched reliably.
//   - Fetches multiple official pages and merges their evidence.
//   - Does NOT delete schemes.
//   - Does NOT create duplicate schemes.
// ============================================================

import dotenv from "dotenv";
import { createClient } from "@supabase/supabase-js";

dotenv.config();

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

const TIMEOUT_MS = Number(process.env.REPAIR_FETCH_TIMEOUT || 25000);
const RETRIES = Number(process.env.REPAIR_FETCH_RETRIES || 3);

const USER_AGENTS = [
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/142 Safari/537.36",
  "GoSubsidy Government Scheme Repair/4.6.9",
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/141 Safari/537.36",
];

// Official fallback sources for schemes whose stored India.gov
// detail pages are migrated shells or return HTTP errors.
const OFFICIAL_FALLBACKS = {
  "prime minister employment generation programme": [
    "https://www.msme.gov.in/offerings/schemes-and-services/details/prime-minister-employment-generation-programme-and-other-credit-support-schemes-1-MDMzETMtQWa",
    "https://www.msme.gov.in/sites/default/files/Revisedguidelines07.12.2023.pdf",
    "https://kviconline.gov.in/pmegpeportal/jsp/loginPage.jsp",
    "https://kviconline.gov.in/pmegpeportal/jsp/pmegponline.jsp",
  ],

  "pm vishwakarma": [
    "https://www.pib.gov.in/PressReleaseIframePage.aspx?PRID=1959098&lang=1&reg=48",
    "https://suryapet.telangana.gov.in/scheme/pm-vishwakarma/",
    "https://disclaimer.pmvishwakarma.gov.in/",
  ],

  "pm vishwakarma yojana": [
    "https://www.pib.gov.in/PressReleaseIframePage.aspx?PRID=1959098&lang=1&reg=48",
    "https://suryapet.telangana.gov.in/scheme/pm-vishwakarma/",
    "https://disclaimer.pmvishwakarma.gov.in/",
  ],

  "marketing assistance scheme": [
    "https://www.msme.gov.in/offerings/schemes-and-services/details/marketing-promotion-schemes-1-QzMzETMtQWa",
    "https://www.msme.gov.in/special-marketing-assistance-scheme",
    "https://www.msme.gov.in/application-procedure-criteria-availing-assistance-under-marketing-scheme",
    "https://www.msme.gov.in/eligibility-criteria-availing-assistance-under-marketing-scheme-0",
    "https://my.msme.gov.in/MyMsme/COM_Matu.aspx",
  ],
};

function hasValue(value) {
  if (value === null || value === undefined) return false;
  if (typeof value === "string") return value.trim().length > 0;
  if (Array.isArray(value)) return value.some(hasValue);
  if (typeof value === "object") return Object.keys(value).length > 0;
  return true;
}

function cleanText(value) {
  return String(value ?? "")
    .replace(/\u00a0/g, " ")
    .replace(/\r/g, "")
    .replace(/[ \t]+/g, " ")
    .replace(/\n[ \t]+/g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

function stripHtml(html) {
  return cleanText(
    String(html || "")
      .replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, " ")
      .replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, " ")
      .replace(/<noscript\b[^>]*>[\s\S]*?<\/noscript>/gi, " ")
      .replace(/<!--[\s\S]*?-->/g, " ")
      .replace(/<\/(p|div|section|article|li|tr|td|th|h1|h2|h3|h4|h5|h6|br|table)>/gi, "\n")
      .replace(/<[^>]+>/g, " ")
      .replace(/&nbsp;/gi, " ")
      .replace(/&amp;/gi, "&")
      .replace(/&quot;/gi, '"')
      .replace(/&#39;/gi, "'")
      .replace(/&lt;/gi, "<")
      .replace(/&gt;/gi, ">")
  );
}

function decodeHtml(value) {
  return cleanText(
    String(value || "")
      .replace(/<[^>]+>/g, " ")
      .replace(/&nbsp;/gi, " ")
      .replace(/&amp;/gi, "&")
      .replace(/&quot;/gi, '"')
      .replace(/&#39;/gi, "'")
      .replace(/&lt;/gi, "<")
      .replace(/&gt;/gi, ">")
  );
}

function normalizeUrl(url) {
  try {
    const u = new URL(String(url || "").trim());
    if (!["http:", "https:"].includes(u.protocol)) return "";
    return u.toString();
  } catch {
    return "";
  }
}

function sameOrGovernmentDomain(url) {
  try {
    const host = new URL(url).hostname.toLowerCase();
    return host.endsWith(".gov.in") || host === "gov.in";
  } catch {
    return false;
  }
}

async function sleep(ms) {
  await new Promise((resolve) => setTimeout(resolve, ms));
}

async function fetchUrl(url) {
  const normalized = normalizeUrl(url);
  if (!normalized) throw new Error("Invalid URL");

  let lastError = null;

  for (let attempt = 1; attempt <= RETRIES; attempt++) {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);

    try {
      const response = await fetch(normalized, {
        method: "GET",
        redirect: "follow",
        signal: controller.signal,
        headers: {
          Accept:
            "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
          "Accept-Language": "en-IN,en;q=0.9",
          "Cache-Control": "no-cache",
          Pragma: "no-cache",
          "User-Agent": USER_AGENTS[(attempt - 1) % USER_AGENTS.length],
        },
      });

      const contentType = response.headers.get("content-type") || "";
      const body = await response.text();

      if (!response.ok) {
        const err = new Error(`HTTP ${response.status} ${response.statusText}`);
        err.status = response.status;
        throw err;
      }

      return {
        requestedUrl: normalized,
        finalUrl: response.url || normalized,
        status: response.status,
        contentType,
        html: body,
      };
    } catch (error) {
      lastError = error;
      if (attempt < RETRIES) await sleep(700 * attempt);
    } finally {
      clearTimeout(timer);
    }
  }

  throw lastError || new Error("Fetch failed");
}

function sourceText(page) {
  return stripHtml(page.html || "");
}

function extractTitle(html) {
  const m = String(html || "").match(/<title[^>]*>([\s\S]*?)<\/title>/i);
  return decodeHtml(m?.[1] || "");
}

function extractMetaDescription(html) {
  const m = String(html || "").match(
    /<meta[^>]+name=["']description["'][^>]+content=["']([\s\S]*?)["'][^>]*>/i
  );
  return decodeHtml(m?.[1] || "");
}

function extractLabelValue(text, labels) {
  const label = labels
    .map((x) => x.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"))
    .join("|");

  // Table pages often flatten <td>Label</td><td>Value</td> into one line.
  // Therefore the value must NOT depend on a newline after the label.
  const allLabels = [
    ...labels,
    "Description",
    "Nature of assistance",
    "Benefits",
    "Eligibility",
    "Eligibility criteria",
    "Who can apply",
    "Beneficiary",
    "Documents required",
    "Required documents",
    "How to apply",
    "Application process",
    "Application procedure",
    "Whom to contact",
    "Ministry",
    "Department",
  ]
    .map((x) => x.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"));

  const nextLabel = [...new Set(allLabels)].join("|");
  const re = new RegExp(
    `(?:^|\\n|\\|)\\s*(?:${label})\\s*[:\\-|]?\\s*([\\s\\S]{8,5000}?)(?=\\s+(?:${nextLabel})\\s*[:\\-|]?|\\n\\s*(?:${nextLabel})\\s*[:\\-|]?|$)`,
    "im"
  );

  const match = text.match(re);
  return cleanText(match?.[1] || "");
}

function extractSection(text, headings) {
  const heading = headings
    .map((x) => x.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"))
    .join("|");

  const next = [
    "description",
    "background",
    "introduction",
    "benefit",
    "benefits",
    "eligibility",
    "eligibility criteria",
    "who can apply",
    "beneficiary",
    "beneficiaries",
    "documents",
    "documents required",
    "required documents",
    "application",
    "application process",
    "application procedure",
    "how to apply",
    "online application",
    "objective",
    "scope",
    "nature of assistance",
    "whom to contact",
    "department",
    "ministry",
  ]
    .map((x) => x.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"))
    .join("|");

  // Supports both normal headings and flattened government table content.
  const re = new RegExp(
    `(?:^|\\n|\\|)\\s*(?:${heading})\\s*[:\\-|]?\\s*([\\s\\S]{20,5000}?)(?=\\s+(?:${next})\\s*[:\\-|]?|\\n\\s*(?:${next})\\s*[:\\-|]?|$)`,
    "im"
  );

  return cleanText(text.match(re)?.[1] || "");
}

function splitItems(value) {
  if (!value) return [];

  const text = cleanText(value)
    .replace(/\s*\|\s*/g, "\n")
    .replace(/[•\u2022]/g, "\n");

  // Government scheme pages frequently encode benefits/documents as
  // roman-numbered or numeric paragraphs.  Do NOT split those sentences
  // on whitespace: each numbered paragraph is one structured item.
  const numbered = text
    .replace(/\s+(?=\(?(?:i|ii|iii|iv|v|vi|vii|viii|ix|x|xi|xii|xiii|xiv|xv|xvi|xvii|xviii|xix|xx)\)\s+)/gi, "\n")
    .replace(/\s+(?=\(?\d{1,2}[.)]\s+)/g, "\n")
    .replace(/\s+(?=[A-Z][A-Za-z][A-Za-z .&()/'-]{2,60}:\s)/g, "\n");

  const pieces = numbered
    .split(/\n+/)
    .map((item) => cleanText(item)
      .replace(/^\(?[a-z]\)?\s+/i, "")
      .replace(/^\(?\d{1,2}[.)]\s+/, "")
      .replace(/^\(?((?:i|ii|iii|iv|v|vi|vii|viii|ix|x|xi|xii|xiii|xiv|xv|xvi|xvii|xviii|xix|xx))\)?\s+/i, ""))
    .filter((item) => item.length >= 8);

  // Fallback for flattened table/list text where line breaks were lost.
  if (pieces.length <= 1 && numbered.length > 250) {
    const fallback = numbered
      .split(/(?=\(?\d{1,2}[.)]\s+)|(?=\(?[ivxlcdm]+\)\s+)/i)
      .map((item) => cleanText(item)
        .replace(/^\(?\d{1,2}[.)]\s+/, "")
        .replace(/^\(?[ivxlcdm]+\)\s+/i, ""))
      .filter((item) => item.length >= 8);

    if (fallback.length > pieces.length) pieces.push(...fallback);
  }

  return [...new Set(pieces)].slice(0, 60);
}

function extractNumberedItems(text, options = {}) {
  const input = cleanText(text);
  if (!input) return [];

  const starts = [];

  // The generic marker regex above is intentionally supplemented by a
  // simpler scanner because many government pages flatten list items into
  // one long paragraph.
  const itemStart = /(?:^|\s)(\((?:i|ii|iii|iv|v|vi|vii|viii|ix|x|xi|xii|xiii|xiv|xv|xvi|xvii|xviii|xix|xx)\)|\(?\d{1,2}[.)])(\s+)/gi;
  let match;
  while ((match = itemStart.exec(input))) starts.push({ index: match.index, length: match[0].length });

  if (!starts.length) return splitItems(input);

  const items = [];
  for (let i = 0; i < starts.length; i++) {
    const start = starts[i].index;
    const contentStart = start + starts[i].length;
    const end = i + 1 < starts.length ? starts[i + 1].index : input.length;
    const item = cleanText(input.slice(contentStart, end));
    if (item.length >= 8) items.push(item);
  }

  return [...new Set(items)].slice(0, 60);
}

function extractBenefitItems(text) {
  const value = cleanText(text);
  if (!value) return [];

  const items = extractNumberedItems(value);
  if (items.length >= 2) return items;

  return splitItems(value);
}

function cleanAuthority(value) {
  const text = cleanText(value);
  if (!text || text.length > 220) return "";

  // Reject sentence-like pollution.
  if (
    /\b(scheme|programme|program|providing|detailed information|for more information|objective|benefit|assistance|applicant|entrepreneurship)\b/i.test(
      text
    ) &&
    !/^Ministry\s+of\s+/i.test(text) &&
    !/^Department\s+of\s+/i.test(text) &&
    !/^Office\s+of\s+/i.test(text)
  ) {
    return "";
  }

  return text;
}

const SCHEME_SPECIFIC_FALLBACKS = {
  "prime minister employment generation programme": {
    documents: [
      "Caste Certificate (where applicable)",
      "Special Category Certificate (where applicable)",
      "Rural Area Certificate (where applicable)",
      "Project Report",
      "Education / EDP / Skill Development Training Certificate",
      "Any other applicable document"
    ]
  }
};

function authorityForScheme(name) {
  const n = String(name || "").toLowerCase();

  if (n.includes("employment generation") || n.includes("pmegp")) {
    return {
      ministry: "Ministry of Micro, Small & Medium Enterprises",
      department: "Khadi and Village Industries Commission (KVIC)",
    };
  }

  if (n.includes("vishwakarma")) {
    return {
      ministry: "Ministry of Micro, Small & Medium Enterprises",
      department: "Office of the Development Commissioner (MSME)",
    };
  }

  if (n.includes("marketing assistance")) {
    return {
      ministry: "Ministry of Micro, Small & Medium Enterprises",
      department: "Office of the Development Commissioner (MSME)",
    };
  }

  return { ministry: "", department: "" };
}


// ============================================================
// SCHEME-SPECIFIC STRUCTURED EXTRACTION
// ============================================================
// IMPORTANT:
// Generic extraction is useful for discovery, but some official
// government pages flatten headings/list items into one long text
// block. That can incorrectly split a single benefit into fragments.
// PM Vishwakarma is one such page.
//
// This extractor uses ONLY wording found in the fetched official
// evidence. It does not invent missing documents or eligibility.
// ============================================================

function extractPMVishwakarmaStructured(text) {
  const input = cleanText(text);
  if (!input) return null;

  const benefitLabels = [
    "Recognition",
    "Skill Upgradation",
    "Toolkit Incentive",
    "Credit Support",
    "Incentive for Digital Transaction",
    "Marketing Support",
  ];

  const benefits = [];

  for (let i = 0; i < benefitLabels.length; i++) {
    const label = benefitLabels[i];
    const nextLabels = benefitLabels
      .slice(i + 1)
      .map((x) => x.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"))
      .join("|");

    const escaped = label.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

    const stopParts = [];
    if (nextLabels) {
      stopParts.push(`\\(?(?:${nextLabels})\\)?\\s*:`); 
    }
    stopParts.push(
      "In addition to the above-mentioned benefits",
      "Enrolment of beneficiaries",
      "For more information"
    );

    const re = new RegExp(
      `(?:^|\\n|\\s)\\(?(?:i|ii|iii|iv|v|vi)\\)?\\s*${escaped}\\s*:\\s*([\\s\\S]{8,700}?)(?=\\s+(?:${stopParts.join("|")})\\s*|$)`,
      "i"
    );

    const match = input.match(re);
    if (match?.[1]) {
      const value = cleanText(match[1])
        .replace(/\s+\*\*\*+[\s\S]*$/g, "")
        .trim();

      if (value.length >= 8) {
        benefits.push(`${label}: ${value}`);
      }
    }
  }

  // Fallback specifically for the PIB's roman-numbered benefit block.
  // This is still source-derived; it only runs if the six named
  // benefit headings could not all be recovered.
  if (benefits.length < 6) {
    const anchor = input.match(
      /(?:The Scheme envisages provisioning of the following benefits to the artisans and crafts persons:)([\s\S]{0,9000}?)(?=In addition to the above-mentioned benefits|Enrolment of beneficiaries|For more information|$)/i
    );

    if (anchor?.[1]) {
      const numbered = extractNumberedItems(anchor[1]);
      if (numbered.length >= benefits.length) {
        return {
          benefits: numbered.slice(0, 6).map((item) => cleanText(item)),
        };
      }
    }
  }

  const beneficiaryMatch = input.match(
    /(?:^|\n)\s*Beneficiary\s+([\s\S]{20,5000}?)(?=\s+(?:Category\s*\/\s*Sector|Sector)\s*[\s\S]*?\s+(?:State\s*\/\s*UT|State Applicability)\b|$)/i
  );

  const eligibilityText = beneficiaryMatch?.[1]
    ? cleanText(beneficiaryMatch[1])
    : "";

  const applicationMatch = input.match(
    /Enrolment of beneficiaries shall be done through Common Service Centres with Aadhaar-based biometric authentication on PM Vishwakarma portal\.[\s\S]{0,5000}?(?=For more information, the Guidelines|For any queries|$)/i
  );

  const applicationProcess = applicationMatch?.[0]
    ? cleanText(applicationMatch[0])
    : "";

  const steps = [
    "Enrolment of beneficiaries through Common Service Centres with Aadhaar-based biometric authentication on PM Vishwakarma portal.",
    "Verification at Gram Panchayat/ULB level.",
    "Vetting and Recommendation by the District Implementation Committee.",
    "Approval by the Screening Committee.",
  ];

  const hasApplicationEvidence =
    /Enrolment of beneficiaries shall be done through Common Service Centres/i.test(input) &&
    /Verification at Gram Panchayat\/ULB level/i.test(input) &&
    /Vetting and Recommendation by the District Implementation Committee/i.test(input) &&
    /Approval by the Screening Committee/i.test(input);

  return {
    benefits,
    eligibility: eligibilityText ? { description: eligibilityText } : {},
    application: hasApplicationEvidence
      ? {
          process: applicationProcess || steps.join(" "),
          steps,
        }
      : {},
  };
}

function applySchemeSpecificExtraction(evidence, text, schemeName) {
  const key = String(schemeName || "").trim().toLowerCase();

  if (key === "pm vishwakarma" || key === "pm vishwakarma yojana") {
    const structured = extractPMVishwakarmaStructured(text);

    if (structured) {
      if (structured.benefits?.length >= 2) {
        evidence.benefits = structured.benefits;
      }

      if (Object.keys(structured.eligibility || {}).length > 0) {
        evidence.eligibility = structured.eligibility;
      }

      if (Object.keys(structured.application || {}).length > 0) {
        evidence.application = structured.application;
      }

      // The fetched PM Vishwakarma scheme page explicitly says that
      // required-document information is not available. Therefore,
      // never manufacture documents here.
    }
  }

  return evidence;
}

function extractEvidence(text, schemeName) {
  const authority = authorityForScheme(schemeName);

  let ministry =
    authority.ministry ||
    cleanAuthority(
      extractLabelValue(text, ["Ministry", "Ministry of", "Ministry / Department"])
    );

  let department =
    authority.department ||
    cleanAuthority(
      extractLabelValue(text, ["Department", "Department / Agency", "Implementing Agency"])
    );

  const description =
    extractSection(text, ["description", "background", "introduction"]) ||
    text.slice(0, 1800);

  let benefitsText =
    extractLabelValue(text, ["Benefits", "Nature of assistance", "Key Benefit"]) ||
    extractSection(text, ["benefits", "nature of assistance", "key benefit", "assistance"]);

  // Some PIB/MSME pages say "The Scheme envisages provisioning of the
  // following benefits..." without an actual Benefits heading. Capture the
  // numbered block in that case.
  if (!benefitsText || extractBenefitItems(benefitsText).length < 2) {
    const benefitAnchor = text.match(/(?:following|the following) benefits[^\n]*([\s\S]{0,9000})/i);
    if (benefitAnchor?.[1]) benefitsText = cleanText(benefitAnchor[1]);
  }

  const eligibilityText =
    extractLabelValue(text, ["Eligibility", "Eligibility criteria", "Who can apply", "Beneficiary"]) ||
    extractSection(text, ["eligibility", "eligibility criteria", "who can apply", "beneficiary"]);

  const documentsText =
    extractLabelValue(text, ["Documents Required", "Required Documents", "Documents"]) ||
    extractSection(text, ["documents required", "required documents", "documents"]);

  let applicationText =
    extractLabelValue(text, ["How to Apply", "Application Process", "Application Procedure", "Online Application"]) ||
    extractSection(text, ["how to apply", "application process", "application procedure", "online application"]);

  if (!applicationText) {
    const applyAnchor = text.match(/(?:how to apply|application process|application procedure|apply online)[^\n]*([\s\S]{0,7000})/i);
    if (applyAnchor?.[1]) applicationText = cleanText(applyAnchor[1]);
  }

  const beneficiaryText =
    extractLabelValue(text, ["Beneficiary", "Beneficiaries", "Who Can Apply", "Target Group"]) ||
    extractSection(text, ["beneficiary", "beneficiaries", "target beneficiaries", "target group"]);

  // Prefer numbered/roman-numbered government paragraphs for benefits.
  // This fixes flattened PIB/MSME pages where a single benefit section
  // contains (i), (ii), (iii), (iv) items but whitespace splitting breaks
  // them into fragments such as "Artisans and" / "Persons:".
  const benefits = extractBenefitItems(benefitsText);
  const documents = extractNumberedItems(documentsText);

  const eligibility = eligibilityText
    ? { description: cleanText(eligibilityText) }
    : {};

  const applicationItems = extractNumberedItems(applicationText);
  const application = applicationText
    ? {
        process: cleanText(applicationText),
        ...(applicationItems.length > 1 ? { steps: applicationItems } : {}),
      }
    : {};

  const beneficiary = cleanText(beneficiaryText);

  // PMEGP official MSME page is a structured scheme table. Its "Who can apply"
  // field is the authoritative beneficiary statement when available.
  if (!ministry || !department) {
    const authorityFallback = authorityForScheme(schemeName);
    ministry = ministry || authorityFallback.ministry;
    department = department || authorityFallback.department;
  }

  const evidence = {
    ministry,
    department,
    description: cleanText(description),
    benefits,
    eligibility,
    documents,
    application,
    beneficiary,
  };

  // Apply source-specific normalization AFTER generic extraction.
  // This prevents the generic colon/whitespace splitter from
  // corrupting structured PIB/MSME benefit lists.
  return applySchemeSpecificExtraction(evidence, text, schemeName);
}

async function collectEvidence(scheme) {
  const name = scheme.scheme_name;
  const key = String(name || "").trim().toLowerCase();

  const urls = [
    scheme.official_website,
    ...(OFFICIAL_FALLBACKS[key] || []),
  ]
    .map(normalizeUrl)
    .filter(Boolean);

  const uniqueUrls = [...new Set(urls)];
  const pages = [];
  const failures = [];

  for (const url of uniqueUrls) {
    try {
      // PDFs are recorded as official sources but are not fed through
      // HTML extraction. HTML companion pages are used instead.
      const page = await fetchUrl(url);

      if (!sameOrGovernmentDomain(page.finalUrl)) {
        failures.push(`${url} -> redirected outside government domain`);
        continue;
      }

      if (/application\/pdf|\.pdf(?:$|[?#])/i.test(page.contentType) ||
          /\.pdf(?:$|[?#])/i.test(page.finalUrl)) {
        pages.push({
          ...page,
          text: "",
          title: "Official PDF source",
          skippedPdf: true,
        });
        continue;
      }

      pages.push({
        ...page,
        text: sourceText(page),
        title: extractTitle(page.html),
        metaDescription: extractMetaDescription(page.html),
      });
    } catch (error) {
      failures.push(`${url} -> ${error?.message || "fetch failed"}`);
    }
  }

  // Use the longest HTML evidence first, then merge all sources.
  const htmlPages = pages
    .filter((p) => !p.skippedPdf && p.text.length > 0)
    .sort((a, b) => b.text.length - a.text.length);

  let mergedText = "";
  const seen = new Set();

  for (const page of htmlPages) {
    const chunks = page.text.split(/\n{2,}/).map(cleanText).filter(Boolean);

    for (const chunk of chunks) {
      const keyChunk = chunk.toLowerCase().slice(0, 400);
      if (seen.has(keyChunk)) continue;
      seen.add(keyChunk);
      mergedText += `${chunk}\n\n`;

      if (mergedText.length >= 60000) break;
    }

    if (mergedText.length >= 60000) break;
  }

  const evidence = extractEvidence(mergedText, name);

  return {
    evidence,
    pages,
    failures,
    mergedTextLength: mergedText.length,
  };
}

function preserveOrReplace(oldValue, newValue) {
  if (hasValue(newValue)) return newValue;
  return oldValue;
}

function normalizeArray(value) {
  if (!hasValue(value)) return [];
  if (Array.isArray(value)) return value.filter(Boolean);
  if (typeof value === "object") return [value];
  return splitItems(String(value));
}

function normalizeObject(value, fallbackKey) {
  if (!hasValue(value)) return {};
  if (typeof value === "object") return value;
  return { [fallbackKey]: String(value).trim() };
}

async function loadSchemes() {
  const query = supabase
    .from("schemes")
    .select("*")
    .not("official_website", "is", null)
    .order("id");

  if (String(process.env.REPAIR_ALL).toLowerCase() === "true") {
    const { data, error } = await query;
    if (error) throw new Error(error.message);
    return data || [];
  }

  const ids = String(process.env.REPAIR_SCHEME_IDS || "37,38,42")
    .split(",")
    .map((x) => x.trim())
    .filter(Boolean);

  const { data, error } = await query.in("id", ids);
  if (error) throw new Error(error.message);

  return data || [];
}

async function repairScheme(scheme) {
  console.log(`\n🔧 Repairing #${scheme.id}: ${scheme.scheme_name}`);
  console.log(`   Stored official website: ${scheme.official_website || "[empty]"}`);

  const result = await collectEvidence(scheme);
  const e = result.evidence;

  const authority = authorityForScheme(scheme.scheme_name);
  const specificFallback =
    SCHEME_SPECIFIC_FALLBACKS[String(scheme.scheme_name || "").trim().toLowerCase()] || {};

  const update = {
    description: preserveOrReplace(scheme.description, e.description),
    ministry:
      cleanAuthority(e.ministry) ||
      authority.ministry ||
      cleanAuthority(scheme.ministry) ||
      null,
    department:
      cleanAuthority(e.department) ||
      authority.department ||
      cleanAuthority(scheme.department) ||
      null,
    beneficiary: preserveOrReplace(scheme.beneficiary, e.beneficiary) || null,
    benefits:
      e.benefits.length > 0
        ? e.benefits
        : normalizeArray(scheme.benefits),
    eligibility:
      Object.keys(e.eligibility).length > 0
        ? e.eligibility
        : normalizeObject(scheme.eligibility, "description"),
    documents:
      e.documents.length > 0
        ? e.documents
        : (Array.isArray(specificFallback.documents) && specificFallback.documents.length > 0
            ? specificFallback.documents
            : normalizeArray(scheme.documents)),
    application:
      Object.keys(e.application).length > 0
        ? e.application
        : normalizeObject(scheme.application, "process"),
  };

  const { data, error } = await supabase
    .from("schemes")
    .update(update)
    .eq("id", scheme.id)
    .select()
    .single();

  if (error) throw new Error(error.message);

  console.log(`   Sources fetched: ${result.pages.length}`);
  console.log(`   Fetch failures: ${result.failures.length}`);
  console.log(`   Evidence text: ${result.mergedTextLength} chars`);
  console.log(`   Ministry: ${data.ministry || "[empty]"}`);
  console.log(`   Department: ${data.department || "[empty]"}`);
  console.log(`   Benefits: ${Array.isArray(data.benefits) ? data.benefits.length : 0}`);
  console.log(`   Eligibility: ${Object.keys(data.eligibility || {}).length}`);
  console.log(`   Documents: ${Array.isArray(data.documents) ? data.documents.length : 0}`);
  console.log(`   Application: ${Object.keys(data.application || {}).length}`);
  console.log(`   Beneficiary: ${hasValue(data.beneficiary) ? "YES" : "NO"}`);

  if (result.failures.length) {
    console.log("   Fetch diagnostics:");
    for (const failure of result.failures.slice(0, 8)) {
      console.log(`      - ${failure}`);
    }
  }

  return data;
}

async function main() {
  console.log("============================================================");
  console.log("GoSubsidy V4.6.10 EXISTING SCHEME DETAIL REPAIR");
  console.log("============================================================");
  console.log("This repair uses multiple official government sources.");
  console.log("The existing schemeDiscoveryV4.6-AutoImport.js is NOT replaced.");
  console.log("============================================================");

  const schemes = await loadSchemes();
  console.log(`Schemes selected: ${schemes.length}`);

  if (!schemes.length) {
    console.log("No schemes matched the repair selection.");
    return;
  }

  let repaired = 0;
  let failed = 0;

  for (const scheme of schemes) {
    try {
      await repairScheme(scheme);
      repaired++;
    } catch (error) {
      failed++;
      console.error(`❌ FAILED #${scheme.id}: ${error?.message || error}`);
    }
  }

  console.log("\n============================================================");
  console.log(`✅ Repaired: ${repaired}`);
  console.log(`❌ Failed:   ${failed}`);
  console.log("============================================================");
}

main().catch((error) => {
  console.error("Repair process failed:", error);
  process.exitCode = 1;
});
