import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";
import { filterSchemesForStorage, assertSchemeStorageSafe, STORAGE_GUARD_VERSION } from "./schemeStorageSafety.service.js";

dotenv.config();

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// ======================================================
// GET ALL SCHEMES
// ======================================================

export async function getAllSchemes() {
  const { data, error } = await supabase
    .from("schemes")
    .select("*")
    .order("scheme_name");

  if (error) {
    throw new Error(error.message);
  }

  return data;
}

// ======================================================
// GET SCHEME BY ID
// ======================================================

export async function getSchemeById(id) {
  const { data, error } = await supabase
    .from("schemes")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    return null;
  }

  return data;
}

// ======================================================
// PUBLIC CATALOGUE — ONLY PUBLISHED SCHEMES
// ======================================================
// Automatic discovery/import creates PENDING_REVIEW records.
// Only explicitly approved records are exposed publicly.
// Legacy Active records remain public for backward compatibility.
const PUBLIC_SCHEME_STATUSES = [
  "Published",
  "published",
  "Active",
  "active",
];

export async function getPublishedSchemes() {
  const { data, error } = await supabase
    .from("schemes")
    .select("*")
    .in("status", PUBLIC_SCHEME_STATUSES)
    .order("scheme_name");

  if (error) throw new Error(error.message);
  return data || [];
}

export async function getPublishedSchemeById(id) {
  const { data, error } = await supabase
    .from("schemes")
    .select("*")
    .eq("id", id)
    .in("status", PUBLIC_SCHEME_STATUSES)
    .single();

  if (error) return null;
  return data;
}

// ======================================================
// BLOCK 7 — DISCOVERY STORAGE SAFETY + HUMAN APPROVAL GATE
// ======================================================
// Use these functions for candidates produced by the GoSubsidy
// discovery/verification pipeline. Manual/admin CRUD remains separate.

// ======================================================
// BLOCK 7 — DISCOVERY FIELD NORMALIZATION
// ======================================================
// The discovery pipeline can return camelCase, snake_case, or nested
// values. Normalize them here so the database does not silently fall
// back to defaults (for example is_central = true) or lose fields such
// as slug, caste_category, ages, and banner information.

function firstNonEmptyValue(...values) {
  for (const value of values) {
    if (value !== null && value !== undefined) {
      if (typeof value === "object") {
        if (Object.keys(value).length > 0) return value;
      } else if (String(value).trim()) {
        return value;
      }
    }
  }
  return "";
}

function textValue(...values) {
  const value = firstNonEmptyValue(...values);
  return value === "" ? "" : String(value).trim();
}

function nullableText(...values) {
  const value = textValue(...values);
  return value || null;
}

function parseBooleanValue(value, fallback = undefined) {
  if (value === true || value === false) return value;
  const normalized = String(value ?? "").trim().toLowerCase();

  if (["true", "1", "yes", "y"].includes(normalized)) return true;
  if (["false", "0", "no", "n"].includes(normalized)) return false;

  return fallback;
}

function slugifySchemeName(value) {
  return String(value || "")
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .replace(/-{2,}/g, "-");
}

function getSeoObject(candidate) {
  const seo = parseJsonField(candidate?.seo, {});
  return seo && typeof seo === "object" && !Array.isArray(seo) ? seo : {};
}

function getNestedEligibilityText(candidate) {
  const eligibility = parseJsonField(candidate?.eligibility, {});
  if (!eligibility || typeof eligibility !== "object") return "";

  return [
    eligibility.category,
    eligibility.caste,
    eligibility.caste_category,
    eligibility.casteCategory,
    eligibility.beneficiary,
    eligibility.beneficiaries,
    eligibility.target_group,
    eligibility.targetGroup,
    eligibility.description,
    eligibility.criteria,
  ]
    .filter(Boolean)
    .join(" ");
}

function getDocumentsText(candidate) {
  const documents = parseJsonField(candidate?.documents, []);
  if (Array.isArray(documents)) {
    return documents
      .map((item) =>
        typeof item === "string"
          ? item
          : item?.name || item?.document || item?.title || ""
      )
      .filter(Boolean)
      .join(" ");
  }

  return typeof documents === "string"
    ? documents
    : JSON.stringify(documents || {});
}

function deriveCasteCategory(candidate) {
  const explicit = firstNonEmptyValue(
    candidate?.caste_category,
    candidate?.casteCategory,
    candidate?.caste,
    candidate?.social_category,
    candidate?.socialCategory
  );

  if (textValue(explicit)) return textValue(explicit);

  const evidence = [
    candidate?.beneficiary,
    candidate?.eligibility,
    candidate?.target_group,
    candidate?.targetGroup,
    getNestedEligibilityText(candidate),
    getDocumentsText(candidate),
    candidate?.description,
    candidate?.scheme_name,
    candidate?.schemeName,
    candidate?.title,
  ]
    .map((value) => (typeof value === "object" ? JSON.stringify(value) : String(value || "")))
    .join(" ")
    .toLowerCase();

  const categories = [];
  if (/\bsc\b|scheduled caste/.test(evidence)) categories.push("SC");
  if (/\bst\b|scheduled tribe/.test(evidence)) categories.push("ST");
  if (/\bpwd\b|person(?:s)? with disabilit|differently abled/.test(evidence)) {
    categories.push("PwD");
  }
  if (/\bminority\b/.test(evidence)) categories.push("Minority");
  if (/\bwomen\b|\bwoman\b|female entrepreneurs?/.test(evidence)) {
    categories.push("Women");
  }

  return categories.join(", ");
}

function deriveIsCentral(candidate) {
  // Explicit state applicability is stronger than a stale AI boolean.
  const state = textValue(
    candidate?.state_applicability,
    candidate?.stateApplicability,
    candidate?.state,
    candidate?.state_name,
    candidate?.stateName
  );

  const normalizedState = state.toLowerCase();

  if (
    normalizedState &&
    !["all india", "india", "pan india", "nationwide", "national"].includes(normalizedState)
  ) {
    return false;
  }

  // Telangana/state government domains are unambiguously state-level.
  const urls = [
    candidate?.official_website,
    candidate?.officialWebsite,
    candidate?.official_apply_link,
    candidate?.applyLink,
    candidate?.apply_link,
    candidate?.sourceUrl,
    candidate?.url,
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();

  const stateGovernmentDomain =
    /\.(telangana|andhra|karnataka|kerala|tamilnadu|tn|maharashtra|gujarat|rajasthan|odisha|westbengal|wb|up|mp|punjab|haryana|bihar|jharkhand|chhattisgarh|assam|goa|sikkim|tripura|manipur|meghalaya|mizoram|nagaland|arunachalpradesh)\.gov\.in\b/.test(urls) ||
    /\b(?:telangana|andhra pradesh|karnataka|kerala|tamil nadu|maharashtra|gujarat|rajasthan|odisha|west bengal)\.gov\.in\b/.test(urls);

  if (stateGovernmentDomain || /\btelangana\b/.test(urls)) {
    return false;
  }

  const explicit = parseBooleanValue(
    firstNonEmptyValue(candidate?.is_central, candidate?.isCentral),
    undefined
  );

  if (explicit !== undefined) return explicit;

  return true;
}

function normalizeNumber(value) {
  if (value === null || value === undefined || value === "") return null;
  const n = Number(String(value).replace(/,/g, "").replace(/[^\d.-]/g, ""));
  return Number.isFinite(n) ? n : null;
}
// ======================================================
// DISCOVERY STRUCTURED-FIELD NORMALIZATION
// ======================================================

function hasMeaningfulValue(value) {
  if (value === null || value === undefined) return false;

  if (typeof value === "string") {
    return value.trim().length > 0;
  }

  if (Array.isArray(value)) {
    return value.length > 0;
  }

  if (typeof value === "object") {
    return Object.keys(value).length > 0;
  }

  return true;
}

function firstMeaningful(...values) {
  return values.find(hasMeaningfulValue);
}

function normalizeDiscoveryStructuredField(
  value,
  type
) {
  if (!hasMeaningfulValue(value)) {
    if (type === "benefits" || type === "documents") {
      return [];
    }

    return {};
  }

  // Already structured
  if (typeof value === "object") {
    return value;
  }

  const text = String(value).trim();

  if (!text) {
    return type === "benefits" || type === "documents"
      ? []
      : {};
  }

  // Try JSON first
  try {
    const parsed = JSON.parse(text);

    if (parsed !== null && parsed !== undefined) {
      return parsed;
    }
  } catch {
    // Continue with plain-text normalization.
  }

  // Array-style fields
  if (type === "benefits" || type === "documents") {
    return text
      .split(/\s*(?:\|\||\||;|\n|•)\s*/)
      .map((item) => item.trim())
      .filter(Boolean);
  }

  // Object-style fields
  if (type === "eligibility") {
    return {
      description: text,
    };
  }

  if (type === "application") {
    return {
      process: text,
    };
  }

  return {
    description: text,
  };
}
function isExplicitlyApprovedForPublication(candidate) {
  return (
    candidate?.approved === true ||
    candidate?.adminApproved === true ||
    String(candidate?.approvalStatus || candidate?.approval_status || "").trim().toUpperCase() === "APPROVED" ||
    String(candidate?.status || "").trim().toUpperCase() === "PUBLISHED"
  );
}

function isNewDiscoveredCandidate(candidate) {
  const discoveryType = String(
    candidate?.discoveryType ??
    candidate?.discovery_type ??
    candidate?.sourceType ??
    candidate?.source_type ??
    ""
  ).trim().toUpperCase();

  const explicitExistingId = String(
    candidate?.existingSchemeId ??
    candidate?.existing_scheme_id ??
    candidate?.existingSchemeID ??
    ""
  ).trim();

  const status = String(
    candidate?.status ??
    candidate?.matchStatus ??
    candidate?.match_status ??
    ""
  ).trim().toUpperCase();

  return (
    discoveryType !== "EXISTING_METADATA_REPAIR" &&
    discoveryType !== "EXISTING_SCHEME_REPAIR" &&
    discoveryType !== "EXISTING" &&
    status !== "EXISTING" &&
    status !== "EXISTING_METADATA_REPAIR" &&
    status !== "EXISTING_SCHEME_REPAIR" &&
    !explicitExistingId
  );
}

function mapDiscoveredCandidateToSchemePayload(candidate) {
  const seo = getSeoObject(candidate);

  const schemeName = textValue(
    candidate?.scheme_name,
    candidate?.schemeName,
    candidate?.canonical_program_name,
    candidate?.canonicalProgramName,
    candidate?.canonicalProgram?.name,
    candidate?.title
  );

  const generatedSlug = slugifySchemeName(schemeName);
  const slug = textValue(
    candidate?.slug,
    candidate?.seo?.slug,
    seo?.slug,
    generatedSlug
  );

  const normalizedSeo = {
    ...seo,
    slug: seo?.slug || slug,
  };

  return {
    scheme_name: schemeName,

    // ======================================================
    // TARGETING / ELIGIBILITY FILTER FIELDS
    // ======================================================
    target_gender: nullableText(
      candidate?.target_gender,
      candidate?.targetGender,
      candidate?.gender
    ),

    min_age: normalizeNumber(
      firstNonEmptyValue(
        candidate?.min_age,
        candidate?.minAge,
        candidate?.minimum_age,
        candidate?.minimumAge
      )
    ),

    max_age: normalizeNumber(
      firstNonEmptyValue(
        candidate?.max_age,
        candidate?.maxAge,
        candidate?.maximum_age,
        candidate?.maximumAge
      )
    ),

    income_limit: normalizeNumber(
      firstNonEmptyValue(
        candidate?.income_limit,
        candidate?.incomeLimit,
        candidate?.maximum_income,
        candidate?.maxIncome
      )
    ),

    caste_category: nullableText(deriveCasteCategory(candidate)),

    // IMPORTANT: do not allow a missing value to fall through to a
    // database default of true for state-government schemes.
    is_central: deriveIsCentral(candidate),

    // ======================================================
    // HUMAN APPROVAL GATE
    // New discovery imports are NEVER public by default.
    // They remain pending until Admin Approve & Publish is used.
    // ======================================================
    is_active: isNewDiscoveredCandidate(candidate)
      ? isExplicitlyApprovedForPublication(candidate)
      : parseBooleanValue(
          firstNonEmptyValue(candidate?.is_active, candidate?.isActive),
          true
        ),

    language: textValue(
      candidate?.language,
      candidate?.lang,
      "en"
    ),

    slug: slug || null,

    created_by: nullableText(
      candidate?.created_by,
      candidate?.createdBy
    ),

    banner_path: nullableText(
      candidate?.banner_path,
      candidate?.bannerPath
    ),

    banner_url: nullableText(
      candidate?.banner_url,
      candidate?.bannerUrl,
      candidate?.banner
    ),

    // ======================================================
    // CANONICAL PROGRAM IDENTITY
    // BLOCK 6 → BLOCK 7 → SUPABASE
    // ======================================================
    canonical_program_id: nullableText(
      candidate?.canonical_program_id,
      candidate?.canonicalProgramId,
      candidate?.canonicalProgram?.id
    ),

    canonical_program_name: nullableText(
      candidate?.canonical_program_name,
      candidate?.canonicalProgramName,
      candidate?.canonicalProgram?.name,
      schemeName
    ),

    category: textValue(candidate?.category),
    ministry: textValue(candidate?.ministry),
    department: textValue(candidate?.department),
    beneficiary: textValue(candidate?.beneficiary),
    sector: textValue(candidate?.sector),
    description: textValue(candidate?.description),

    state_applicability: textValue(
      candidate?.state_applicability,
      candidate?.stateApplicability,
      candidate?.state,
      "All India"
    ),

    official_website: textValue(
      candidate?.official_website,
      candidate?.officialWebsite
    ),

    official_apply_link: textValue(
      candidate?.official_apply_link,
      candidate?.applyLink,
      candidate?.apply_link
    ),

    guideline_pdf: textValue(
      candidate?.guideline_pdf,
      candidate?.guidelinePdf
    ),

    status: isNewDiscoveredCandidate(candidate)
      ? (isExplicitlyApprovedForPublication(candidate) ? "Published" : "PENDING_REVIEW")
      : textValue(candidate?.status, "Draft"),

    benefits: normalizeDiscoveryStructuredField(
  firstMeaningful(
    candidate?.benefits,
    candidate?.evidenceEnrichment?.benefits
  ),
  "benefits"
),

eligibility: normalizeDiscoveryStructuredField(
  firstMeaningful(
    candidate?.eligibility,
    candidate?.evidenceEnrichment?.eligibility
  ),
  "eligibility"
),

documents: normalizeDiscoveryStructuredField(
  firstMeaningful(
    candidate?.documents,
    candidate?.evidenceEnrichment?.documents
  ),
  "documents"
),

application: normalizeDiscoveryStructuredField(
  firstMeaningful(
    candidate?.application,
    candidate?.evidenceEnrichment?.application
  ),
  "application"
),
    seo: normalizedSeo,
  };
}


function normalizeSchemeMatchValue(value) {
  return String(value ?? "")
    .trim()
    .toLowerCase()
    .replace(/&amp;/g, "&")
    .replace(/[^a-z0-9]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function normalizeOfficialUrl(value) {
  if (!value) return "";
  try {
    const url = new URL(String(value).trim());
    url.hash = "";
    url.search = "";
    return url.toString().replace(/\/$/, "").toLowerCase();
  } catch {
    return String(value).trim().replace(/\/$/, "").toLowerCase();
  }
}

const GENERIC_SOURCE_PAGE_NAMES = new Set([
  "scheme",
  "scheme guidelines",
  "scheme guideline",
  "scheme guidelines details",
  "guidelines",
  "guideline",
  "brochure",
  "circular",
  "circular order",
  "minutes",
  "sanction order",
  "order",
  "notification",
  "document",
  "scheme operation",
  "list of technologies",
  "technology list",
  "details",
]);

function isGenericSourcePageName(value) {
  return GENERIC_SOURCE_PAGE_NAMES.has(normalizeSchemeMatchValue(value));
}

function canonicalIdentityMatchesText(canonicalId, canonicalName, textBlob) {
  const blob = normalizeSchemeMatchValue(textBlob);
  if (!blob) return false;

  const id = normalizeSchemeMatchValue(canonicalId);
  const name = normalizeSchemeMatchValue(canonicalName);

  if (id) {
    const idCompact = id.replace(/\s+/g, "");
    const blobCompact = blob.replace(/\s+/g, "");
    if (idCompact && blobCompact.includes(idCompact)) return true;
  }

  if (name && name.length >= 8 && blob.includes(name)) return true;
  return false;
}

function inferCanonicalIdentity(payload, existingSchemes = []) {
  if (payload?.canonical_program_id) return payload;

  const sourceText = [
    payload?.scheme_name,
    payload?.description,
    payload?.ministry,
    payload?.department,
    payload?.official_website,
    payload?.official_apply_link,
    payload?.guideline_pdf,
  ].filter(Boolean).join(" ");

  let best = null;
  for (const existing of existingSchemes || []) {
    const canonicalId = existing?.canonical_program_id || existing?.canonicalProgramId;
    const canonicalName = existing?.canonical_program_name || existing?.canonicalProgramName || existing?.scheme_name;
    if (!canonicalId) continue;

    if (canonicalIdentityMatchesText(canonicalId, canonicalName, sourceText)) {
      best = existing;
      break;
    }
  }

  if (!best) return payload;

  return {
    ...payload,
    canonical_program_id: best.canonical_program_id || best.canonicalProgramId,
    canonical_program_name: best.canonical_program_name || best.canonicalProgramName || best.scheme_name,
  };
}

function findExistingSchemeMatch(payload, existingSchemes = []) {
  const resolved = inferCanonicalIdentity(payload, existingSchemes);
  const name = normalizeSchemeMatchValue(resolved.scheme_name);
  const canonicalId = normalizeSchemeMatchValue(resolved.canonical_program_id);
  const officialUrl = normalizeOfficialUrl(resolved.official_website);

  // 1. Canonical identity is authoritative.
  if (canonicalId) {
    const canonicalMatch = (existingSchemes || []).find((existing) => {
      const existingCanonicalId = normalizeSchemeMatchValue(
        existing.canonical_program_id || existing.canonicalProgramId
      );
      return existingCanonicalId === canonicalId;
    });
    if (canonicalMatch) return canonicalMatch;
  }

  // 2. Exact official URL. Shared government portals are deliberately NOT
  // treated as identity unless no canonical identity is available.
  if (officialUrl) {
    const urlMatch = (existingSchemes || []).find((existing) => {
      const existingOfficialUrl = normalizeOfficialUrl(
        existing.official_website || existing.officialWebsite
      );
      return existingOfficialUrl === officialUrl;
    });
    if (urlMatch) return urlMatch;
  }

  // 3. Exact name only when the name is a real scheme name. Generic source
  // page labels must never select an arbitrary database row.
  if (name && !isGenericSourcePageName(resolved.scheme_name)) {
    const nameMatch = (existingSchemes || []).find((existing) => {
      const existingName = normalizeSchemeMatchValue(existing.scheme_name);
      return existingName === name && !isGenericSourcePageName(existing.scheme_name);
    });
    if (nameMatch) return nameMatch;
  }

  return null;
}

function buildExistingSchemeRepairPatch(payload, existing) {
  const patch = {};

  // These fields are safe automatic-normalization fields. They are updated
  // even when the old database row contains a stale/default value.
  patch.is_central = payload.is_central;
  patch.is_active = payload.is_active;
  if (payload.language) patch.language = payload.language;
  if (payload.slug) {
    patch.slug = payload.slug;
  }
  if (payload.caste_category) patch.caste_category = payload.caste_category;
  if (payload.target_gender) patch.target_gender = payload.target_gender;
  if (payload.min_age !== null) patch.min_age = payload.min_age;
  if (payload.max_age !== null) patch.max_age = payload.max_age;
  if (payload.income_limit !== null) patch.income_limit = payload.income_limit;
  if (payload.created_by) patch.created_by = payload.created_by;
  if (payload.banner_path) patch.banner_path = payload.banner_path;
  if (payload.banner_url) patch.banner_url = payload.banner_url;
  if (payload.canonical_program_id) {
    patch.canonical_program_id = payload.canonical_program_id;
  }
  if (payload.canonical_program_name) {
    patch.canonical_program_name = payload.canonical_program_name;
  }

  // Fill empty legacy fields without destroying existing curated content.
  const fillOnlyIfEmpty = [
    "scheme_name",
    "category",
    "ministry",
    "department",
    "beneficiary",
    "sector",
    "description",
    "state_applicability",
    "official_website",
    "official_apply_link",
    "guideline_pdf",
    "status",
  ];

  for (const field of fillOnlyIfEmpty) {
    if (!hasMeaningfulValue(existing?.[field]) && hasMeaningfulValue(payload?.[field])) {
      patch[field] = payload[field];
    }
  }

  // JSONB sections are only filled/replaced when the discovery candidate
  // actually contains meaningful information. Empty AI output must never
  // erase existing documents, application, eligibility, benefits or SEO.
  for (const field of ["benefits", "eligibility", "documents", "application", "seo"]) {
    if (hasMeaningfulValue(payload?.[field])) {
      const current = existing?.[field];
      const currentIsEmpty =
        current === null ||
        current === undefined ||
        current === "" ||
        (Array.isArray(current) && current.length === 0) ||
        (typeof current === "object" && !Array.isArray(current) && Object.keys(current).length === 0);

      if (currentIsEmpty) {
        patch[field] = payload[field];
      } else if (field === "seo" && typeof current === "object" && typeof payload[field] === "object") {
        patch[field] = { ...current, ...payload[field] };
      }
    }
  }

  return patch;
}

function resolveUniqueRepairSlug(slug, existingSchemes = [], targetId = null) {
  const base = String(slug || "").trim();
  if (!base) return "";

  const normalizeSlug = (value) => String(value || "").trim().toLowerCase();
  const used = new Set(
    (existingSchemes || [])
      .filter((row) => String(row.id) !== String(targetId))
      .map((row) => normalizeSlug(row.slug || row.seo?.slug))
      .filter(Boolean)
  );

  if (!used.has(normalizeSlug(base))) return base;

  let n = 2;
  let candidate = `${base}-${n}`;
  while (used.has(normalizeSlug(candidate))) {
    n += 1;
    candidate = `${base}-${n}`;
  }
  return candidate;
}

async function repairExistingDiscoveredScheme(candidate, existingSchemes = []) {
  let payload = mapDiscoveredCandidateToSchemePayload(candidate);
  if (!payload.scheme_name) return null;

  payload = inferCanonicalIdentity(payload, existingSchemes);
  const resolvedCandidate = {
    ...candidate,
    canonicalProgramId: payload.canonical_program_id || candidate.canonicalProgramId,
    canonicalProgramName: payload.canonical_program_name || candidate.canonicalProgramName,
  };

  const existing = findExistingSchemeMatch(payload, existingSchemes);
  if (!existing) return null;

  // The exact canonical match is the row being repaired. Its canonical ID and
  // shared government portal URL are not duplicates of a NEW record. Exclude
  // the target row and allow shared portal URLs during an in-place repair.
  const comparisonRows = (existingSchemes || []).filter(
    (row) => String(row.id) !== String(existing.id)
  );
  // The target existing row is intentionally excluded from the comparison
  // set. Other safety failures remain active for an explicit repair.
  const safety = assertSchemeStorageSafe(resolvedCandidate, comparisonRows, {
    mode: "EXISTING_REPAIR",
    existingSchemeId: existing.id,
    canonicalMatch: Boolean(payload.canonical_program_id),
  });
  const patch = buildExistingSchemeRepairPatch(payload, existing);

  if (patch.slug) {
    patch.slug = resolveUniqueRepairSlug(
      patch.slug,
      existingSchemes,
      existing.id
    );
  }

  if (patch.seo?.slug) {
    patch.seo = {
      ...patch.seo,
      slug: patch.slug || patch.seo.slug,
    };
  }

  if (Object.keys(patch).length === 0) {
    return {
      ...existing,
      storageSafety: {
        guardVersion: STORAGE_GUARD_VERSION,
        approved: true,
        repaired: false,
        storageKey: safety.storageKey,
      },
    };
  }

  const { data, error } = await supabase
    .from("schemes")
    .update(patch)
    .eq("id", existing.id)
    .select()
    .single();

  if (error) {
    throw new Error(`Existing scheme repair failed: ${error.message}`);
  }

  return {
    ...data,
    storageSafety: {
      guardVersion: STORAGE_GUARD_VERSION,
      approved: true,
      repaired: true,
      repairedFields: Object.keys(patch),
      storageKey: safety.storageKey,
    },
  };
}

function candidateEvidenceScore(candidate) {
  const verification = Number(candidate?.verification?.confidence ?? candidate?.verificationConfidence ?? candidate?.verification?.verificationConfidence ?? 0);
  const evidence = Number(candidate?.evidenceEnrichment?.evidenceScore ?? candidate?.evidenceScore ?? 0);
  const description = String(candidate?.description || "").length;
  const genericPenalty = isGenericSourcePageName(candidate?.schemeName || candidate?.scheme_name || candidate?.title) ? -1000 : 0;
  return verification * 100 + evidence * 10 + Math.min(description, 2000) / 100 + genericPenalty;
}

function mergeCandidateValues(primary, secondary) {
  const merged = { ...primary };
  const fields = [
    "category", "ministry", "department", "beneficiary", "sector",
    "description", "state", "state_applicability", "officialWebsite",
    "official_website", "officialApplyLink", "official_apply_link",
    "applyLink", "guidelinePdf", "guideline_pdf", "canonicalProgramId",
    "canonical_program_id", "canonicalProgramName", "canonical_program_name",
    "eligibility", "benefits", "documents", "application", "seo", "slug"
  ];

  for (const field of fields) {
    const a = merged[field];
    const b = secondary?.[field];
    const aEmpty = a === undefined || a === null || a === "" || (Array.isArray(a) && a.length === 0) || (typeof a === "object" && !Array.isArray(a) && Object.keys(a || {}).length === 0);
    const bHas = b !== undefined && b !== null && b !== "" && (!Array.isArray(b) || b.length > 0);
    if (aEmpty && bHas) merged[field] = b;
  }

  if (merged.documents && secondary?.documents && Array.isArray(merged.documents) && Array.isArray(secondary.documents)) {
    merged.documents = [...new Set([...merged.documents, ...secondary.documents])];
  }

  if (merged.benefits && secondary?.benefits && Array.isArray(merged.benefits) && Array.isArray(secondary.benefits)) {
    merged.benefits = [...new Set([...merged.benefits, ...secondary.benefits])];
  }

  if (merged.seo && secondary?.seo && typeof merged.seo === "object" && typeof secondary.seo === "object") {
    merged.seo = { ...secondary.seo, ...merged.seo };
  }

  merged.supportingSourceUrls = [
    ...new Set([
      ...(Array.isArray(primary?.supportingSourceUrls) ? primary.supportingSourceUrls : []),
      ...(primary?.officialWebsite || primary?.official_website || primary?.url ? [primary.officialWebsite || primary.official_website || primary.url] : []),
      ...(Array.isArray(secondary?.supportingSourceUrls) ? secondary.supportingSourceUrls : []),
      ...(secondary?.officialWebsite || secondary?.official_website || secondary?.url ? [secondary.officialWebsite || secondary.official_website || secondary.url] : []),
    ].filter(Boolean))
  ];

  return merged;
}

function consolidateNewCandidates(candidates = []) {
  const groups = new Map();
  const passthrough = [];

  for (const candidate of candidates || []) {
    const canonicalId = normalizeSchemeMatchValue(
      candidate?.canonicalProgramId || candidate?.canonical_program_id
    );

    if (!canonicalId) {
      passthrough.push(candidate);
      continue;
    }

    const current = groups.get(canonicalId);
    if (!current) {
      groups.set(canonicalId, candidate);
      continue;
    }

    const firstScore = candidateEvidenceScore(current);
    const secondScore = candidateEvidenceScore(candidate);
    const primary = secondScore > firstScore ? candidate : current;
    const secondary = secondScore > firstScore ? current : candidate;
    groups.set(canonicalId, mergeCandidateValues(primary, secondary));
  }

  return [...groups.values(), ...passthrough];
}

export async function importDiscoveredSchemes(rows = []) {
  if (!Array.isArray(rows) || rows.length === 0) {
    throw new Error("No discovered scheme records were provided.");
  }

  // Load enough columns to repair both legacy rows and newer rows created by
  // the automatic discovery pipeline.
  const { data: existingSchemes, error: existingError } = await supabase
    .from("schemes")
    .select("*");

  if (existingError) {
    throw new Error(`Unable to check existing schemes: ${existingError.message}`);
  }

  const repaired = [];
  const repairRejected = [];
  const newCandidates = [];

  // ======================================================
  // IMPORTANT V4.12 / PRODUCTION RULE
  // ======================================================
  // A discovery candidate is NEW unless the discovery pipeline explicitly
  // marked it as an existing/repair candidate.
  //
  // DO NOT call findExistingSchemeMatch() on every candidate before deciding
  // whether it is NEW. Doing that can silently convert a legitimate NEW
  // discovery into an in-place repair merely because its name, canonical ID,
  // or official URL resembles a row already present in Supabase.
  //
  // This was the cause of the previous:
  //   Approved > 0
  //   Imported = 0
  //
  // Existing/repair candidates still go through the repair path. NEW
  // candidates go through the normal BLOCK 7 storage filter and then the
  // final database duplicate checks.
  // ======================================================

  for (const candidate of rows) {
    const discoveryType = String(
      candidate?.discoveryType ??
      candidate?.discovery_type ??
      candidate?.sourceType ??
      candidate?.source_type ??
      ""
    ).trim().toUpperCase();

    const status = String(
      candidate?.status ??
      candidate?.matchStatus ??
      candidate?.match_status ??
      ""
    ).trim().toUpperCase();

    const explicitExistingId = String(
      candidate?.existingSchemeId ??
      candidate?.existing_scheme_id ??
      candidate?.existingSchemeID ??
      ""
    ).trim();

    const isExplicitRepair =
      discoveryType === "EXISTING_METADATA_REPAIR" ||
      discoveryType === "EXISTING_SCHEME_REPAIR" ||
      discoveryType === "EXISTING" ||
      status === "EXISTING" ||
      status === "EXISTING_METADATA_REPAIR" ||
      status === "EXISTING_SCHEME_REPAIR" ||
      Boolean(explicitExistingId);

    if (!isExplicitRepair) {
      // IMPORTANT: preserve NEW classification.
      newCandidates.push(candidate);
      continue;
    }

    const payload = mapDiscoveredCandidateToSchemePayload(candidate);
    const existing = findExistingSchemeMatch(
      payload,
      existingSchemes || []
    );

    if (!existing) {
      repairRejected.push({
        ...candidate,
        rejectionStage: "BLOCK7_EXISTING_SCHEME_REPAIR",
        rejectionReason:
          "EXISTING_SCHEME_NOT_FOUND_FOR_EXPLICIT_REPAIR",
      });
      continue;
    }

    try {
      const result = await repairExistingDiscoveredScheme(
        candidate,
        existingSchemes || []
      );

      if (result) {
        repaired.push(result);
      } else {
        repairRejected.push({
          ...candidate,
          rejectionStage: "BLOCK7_EXISTING_SCHEME_REPAIR",
          rejectionReason: "EXISTING_SCHEME_REPAIR_RETURNED_NO_RESULT",
        });
      }
    } catch (error) {
      repairRejected.push({
        ...candidate,
        rejectionStage: "BLOCK7_EXISTING_SCHEME_REPAIR",
        rejectionReason:
          error?.message || "EXISTING_SCHEME_REPAIR_FAILED",
      });
    }
  }

  // ======================================================
  // CONSOLIDATE ONLY THE REMAINING NEW CANDIDATES
  // ======================================================
  // Keep the original consolidation logic for genuine NEW candidates.
  // This prevents multiple discovery pages for the same canonical programme
  // from being inserted in one run, while preserving the NEW-vs-EXISTING
  // distinction above.
  const consolidatedNewCandidates =
    consolidateNewCandidates(newCandidates);

  // ======================================================
  // BLOCK 7 — NEW SCHEME STORAGE SAFETY
  // ======================================================
  const storageResult = filterSchemesForStorage(
    consolidatedNewCandidates,
    existingSchemes || []
  );

  const approvedRows = storageResult.candidates;

  const existingNames = new Set(
    (existingSchemes || [])
      .map((scheme) =>
        String(scheme.scheme_name || "").trim().toLowerCase()
      )
      .filter(Boolean)
  );

  const namesSeenInBatch = new Set();
  const slugsSeenInBatch = new Set();
  const existingSlugs = new Set(
    (existingSchemes || [])
      .map((scheme) => String(scheme?.slug || "").trim().toLowerCase())
      .filter(Boolean)
  );
  const insertRows = [];
  const rejectedRows = [
    ...storageResult.rejected,
    ...repairRejected,
  ];

  for (const candidate of approvedRows) {
    const payload = mapDiscoveredCandidateToSchemePayload(candidate);
    const normalizedName = String(
      payload.scheme_name || ""
    ).trim().toLowerCase();

    if (!normalizedName) {
      rejectedRows.push({
        ...candidate,
        rejectionStage: "BLOCK7_STORAGE_SAFETY",
        rejectionReason: "SCHEME_NAME_REQUIRED",
      });
      continue;
    }

    // Generic source-page labels such as "Scheme/Guidelines", "Circular Order",
    // "Minutes", and "Sanction Order" are documents/resources, not scheme names.
    // They must never be auto-imported as government schemes.
    if (isGenericSourcePageName(payload.scheme_name)) {
      rejectedRows.push({
        ...candidate,
        rejectionStage: "BLOCK7_STORAGE_SAFETY",
        rejectionReason: "GENERIC_SOURCE_PAGE_NOT_A_SCHEME",
      });
      continue;
    }

    // Final database duplicate guard.
    if (existingNames.has(normalizedName)) {
      rejectedRows.push({
        ...candidate,
        rejectionStage: "BLOCK7_STORAGE_SAFETY",
        rejectionReason: "DUPLICATE_SCHEME_NAME",
      });
      continue;
    }

    // Final same-run duplicate guard.
    if (namesSeenInBatch.has(normalizedName)) {
      rejectedRows.push({
        ...candidate,
        rejectionStage: "BLOCK7_STORAGE_SAFETY",
        rejectionReason: "DUPLICATE_SCHEME_NAME_IN_BATCH",
      });
      continue;
    }

    // `schemes.slug` is UNIQUE. Multiple official source pages can legitimately
    // produce the same generic/generated slug even when their URLs differ.
    // Resolve the slug before INSERT instead of allowing one collision to abort
    // the entire discovery run.
    const baseSlug = slugifySchemeName(payload.slug || payload.scheme_name);
    let uniqueSlug = baseSlug;
    let slugCounter = 2;
    while (
      uniqueSlug &&
      (existingSlugs.has(uniqueSlug) || slugsSeenInBatch.has(uniqueSlug))
    ) {
      uniqueSlug = `${baseSlug}-${slugCounter}`;
      slugCounter += 1;
    }

    if (uniqueSlug) {
      payload.slug = uniqueSlug;
      if (payload.seo && typeof payload.seo === "object" && !Array.isArray(payload.seo)) {
        payload.seo = { ...payload.seo, slug: uniqueSlug };
      }
      slugsSeenInBatch.add(uniqueSlug);
    }

    // ======================================================
    // MANDATORY HUMAN REVIEW GATE
    // ======================================================
    // Discovery is allowed to collect and store a candidate, but it is NEVER
    // allowed to publish it. Only the explicit admin approval endpoint below
    // may move a pending scheme to Published.
    payload.status = "PENDING_REVIEW";
    payload.is_active = false;

    namesSeenInBatch.add(normalizedName);
    insertRows.push(payload);
  }

  let inserted = [];

  // Insert independently so one unexpected database constraint violation
  // cannot roll back all other valid discoveries.
  for (const payload of insertRows) {
    const { data, error } = await supabase
      .from("schemes")
      .insert([payload])
      .select()
      .single();

    if (error) {
      rejectedRows.push({
        scheme_name: payload.scheme_name,
        slug: payload.slug,
        officialWebsite: payload.official_website,
        rejectionStage: "DATABASE_INSERT",
        rejectionReason: error.message,
      });
      console.warn(
        `⚠️ Skipping discovered scheme "${payload.scheme_name}": ${error.message}`
      );
      continue;
    }

    if (data) inserted.push(data);
  }

  return {
    success: true,
    storageGuardVersion: STORAGE_GUARD_VERSION,
    total: rows.length,

    // "approved" means approved for storage OR successfully repaired.
    approved: approvedRows.length + repaired.length,

    // Imported now means safely queued into the admin review queue.
    // It does NOT mean published.
    imported: inserted.length,
    queuedForReview: inserted.length,
    published: 0,

    repaired: repaired.length,
    rejected: rejectedRows.length,

    // Useful production diagnostics.
    newCandidates: newCandidates.length,
    consolidatedNewCandidates: consolidatedNewCandidates.length,
    approvedNewCandidates: approvedRows.length,

    data: [...inserted, ...repaired],
    insertedRows: inserted,
    repairedRows: repaired,
    rejectedRows,
  };
}

export async function createDiscoveredScheme(candidate) {
  // ======================================================
  // DISCOVERY CREATE / REPAIR
  // ======================================================
  // A discovery candidate can point to an existing legacy row.
  // In that case we MUST repair the existing row instead of
  // sending another INSERT (or rejecting it as a duplicate).
  const { data: existingSchemes, error: existingError } = await supabase
    .from("schemes")
    .select("*");

  if (existingError) {
    throw new Error(`Unable to check existing schemes: ${existingError.message}`);
  }

  const payload = mapDiscoveredCandidateToSchemePayload(candidate);

  if (!payload.scheme_name) {
    throw new Error("BLOCK7_STORAGE_REJECTED: SCHEME_NAME_REQUIRED");
  }

  // First resolve an existing record. This is deliberately BEFORE
  // assertSchemeStorageSafe(), because the exact row being repaired
  // is a valid duplicate identity and must not be rejected as a new insert.
  const existing = findExistingSchemeMatch(
    payload,
    existingSchemes || []
  );

  if (existing) {
    const repaired = await repairExistingDiscoveredScheme(
      candidate,
      existingSchemes || []
    );

    if (repaired) {
      return repaired;
    }
  }

  // No existing row: continue through the normal discovery safety guard
  // and create a genuinely new scheme.
  const storageCheck = assertSchemeStorageSafe(
    candidate,
    existingSchemes || []
  );

  const { data, error } = await supabase
    .from("schemes")
    .insert([payload])
    .select()
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return {
    ...data,
    storageSafety: {
      guardVersion: STORAGE_GUARD_VERSION,
      approved: true,
      repaired: false,
      storageKey: storageCheck.storageKey,
    },
  };
}


// ======================================================
// CREATE SCHEME
// ======================================================

export async function createScheme(payload = {}) {
  const safePayload = { ...payload };
  const requestedStatus = String(safePayload.status || "").trim().toLowerCase();

  // Manual creation is also review-first. It cannot publish directly.
  if (["published", "active"].includes(requestedStatus)) {
    safePayload.status = "DRAFT";
    safePayload.is_active = false;
  } else {
    safePayload.status = safePayload.status || "DRAFT";
  }

  const { data, error } = await supabase
    .from("schemes")
    .insert([safePayload])
    .select()
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data;
}

// ======================================================
// UPDATE SCHEME — PUBLISHING GATE
// ======================================================

export async function updateScheme(id, payload = {}) {
  const { data: current, error: currentError } = await supabase
    .from("schemes")
    .select("id, status, is_active")
    .eq("id", id)
    .single();

  if (currentError || !current) {
    throw new Error("Scheme not found.");
  }

  const requestedStatus = String(payload?.status || "").trim().toLowerCase();
  const currentStatus = String(current.status || "").trim().toLowerCase();
  const currentIsPublic = ["published", "active"].includes(currentStatus) || current.is_active === true;
  const requestsPublish = ["published", "active"].includes(requestedStatus);

  if (requestsPublish && !currentIsPublic) {
    throw new Error("Publishing is blocked. Review the scheme and use the Admin Approve & Publish action.");
  }

  const { data, error } = await supabase
    .from("schemes")
    .update(payload)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data;
}

// ======================================================
// ADMIN — EXPLICIT APPROVAL / PUBLISH
// ======================================================

export async function approveAndPublishScheme(id) {
  const { data: current, error: currentError } = await supabase
    .from("schemes")
    .select("*")
    .eq("id", id)
    .single();

  if (currentError || !current) {
    throw new Error("Scheme not found.");
  }

  const { data, error } = await supabase
    .from("schemes")
    .update({
      status: "Published",
      is_active: true,
    })
    .eq("id", id)
    .select()
    .single();

  if (error) throw new Error(error.message);

  return data;
}

export async function rejectScheme(id) {
  const { data, error } = await supabase
    .from("schemes")
    .update({
      status: "REJECTED",
      is_active: false,
    })
    .eq("id", id)
    .select()
    .single();

  if (error) throw new Error(error.message);
  return data;
}

// ======================================================
// DELETE SCHEME
// ======================================================

export async function deleteScheme(id) {
  const { error } = await supabase
    .from("schemes")
    .delete()
    .eq("id", id);

  if (error) {
    throw new Error(error.message);
  }

  return {
    success: true,
  };
}

// ======================================================
// BULK IMPORT SCHEMES
// ======================================================
//
// Uses the EXISTING `schemes` Supabase table.
//
// Important:
// - Does NOT create another table.
// - Does NOT replace existing schemes.
// - Duplicate scheme names are skipped.
// ======================================================

export async function importSchemes(rows = []) {
  if (!Array.isArray(rows) || rows.length === 0) {
    throw new Error("No scheme records were provided.");
  }

  // ====================================================
  // GET EXISTING SCHEME NAMES
  // ====================================================

  const { data: existingSchemes, error: existingError } =
    await supabase
      .from("schemes")
      .select("id, scheme_name");

  if (existingError) {
    throw new Error(
      `Unable to check existing schemes: ${existingError.message}`
    );
  }

  const existingNames = new Set(
    (existingSchemes || [])
      .map((scheme) =>
        String(scheme.scheme_name || "")
          .trim()
          .toLowerCase()
      )
      .filter(Boolean)
  );

  // ====================================================
  // SEPARATE NEW / DUPLICATE
  // ====================================================

  const newRows = [];
  const duplicateRows = [];
  const invalidRows = [];

  const namesSeenInFile = new Set();

  for (let index = 0; index < rows.length; index++) {
    const row = rows[index];

    const schemeName = String(
      row.scheme_name || ""
    ).trim();

    // -----------------------------------------------
    // REQUIRED FIELD
    // -----------------------------------------------

    if (!schemeName) {
      invalidRows.push({
        row: index + 2,
        reason: "scheme_name is required",
      });

      continue;
    }

    const normalizedName =
      schemeName.toLowerCase();

    // -----------------------------------------------
    // DUPLICATE IN DATABASE
    // -----------------------------------------------

    if (existingNames.has(normalizedName)) {
      duplicateRows.push({
        row: index + 2,
        scheme_name: schemeName,
        reason: "Already exists",
      });

      continue;
    }

    // -----------------------------------------------
    // DUPLICATE INSIDE UPLOADED FILE
    // -----------------------------------------------

    if (namesSeenInFile.has(normalizedName)) {
      duplicateRows.push({
        row: index + 2,
        scheme_name: schemeName,
        reason: "Duplicate in uploaded file",
      });

      continue;
    }

    namesSeenInFile.add(normalizedName);

    // -----------------------------------------------
    // ONLY SEND FIELDS USED BY CURRENT SCHEME SYSTEM
    // -----------------------------------------------

    const payload = {
      scheme_name: schemeName,

      category:
        String(row.category || "").trim(),

      ministry:
        String(row.ministry || "").trim(),

      department:
        String(row.department || "").trim(),

      beneficiary:
        String(row.beneficiary || "").trim(),

      sector:
        String(row.sector || "").trim(),

      description:
        String(row.description || "").trim(),

      state_applicability:
        String(
          row.state_applicability ||
          row.state ||
          "All India"
        ).trim(),

      official_website:
        String(
          row.official_website || ""
        ).trim(),

      official_apply_link:
        String(
          row.official_apply_link ||
          row.apply_link ||
          ""
        ).trim(),

      guideline_pdf:
        String(
          row.guideline_pdf || ""
        ).trim(),

      status:
        String(
          row.status || "Draft"
        ).trim(),

      // ==============================================
      // JSONB FIELDS
      // ==============================================

      benefits: parseJsonField(
        row.benefits,
        []
      ),

      eligibility: parseJsonField(
        row.eligibility,
        {}
      ),

      documents: parseJsonField(
        row.documents,
        []
      ),

      application: parseJsonField(
        row.application,
        {}
      ),

      seo: parseJsonField(
        row.seo,
        {}
      ),
    };

    newRows.push(payload);
  }

  // ====================================================
  // INSERT NEW RECORDS
  // ====================================================

  let inserted = [];

  if (newRows.length > 0) {
    const { data, error } = await supabase
      .from("schemes")
      .insert(newRows)
      .select();

    if (error) {
      throw new Error(
        `Bulk scheme import failed: ${error.message}`
      );
    }

    inserted = data || [];
  }

  // ====================================================
  // RESULT
  // ====================================================

  return {
    success: true,

    total: rows.length,

    imported: inserted.length,

    duplicates: duplicateRows.length,

    invalid: invalidRows.length,

    data: inserted,

    duplicateRows,

    invalidRows,
  };
}

// ======================================================
// JSON FIELD HELPER
// ======================================================

function parseJsonField(value, fallback) {
  if (
    value === null ||
    value === undefined ||
    value === ""
  ) {
    return fallback;
  }

  // Already an object/array
  if (
    typeof value === "object"
  ) {
    return value;
  }

  const text = String(value).trim();

  if (!text) {
    return fallback;
  }

  try {
    return JSON.parse(text);
  } catch {
    // -----------------------------------------------
    // Allow simple comma-separated arrays
    // -----------------------------------------------

    if (Array.isArray(fallback)) {
      return text
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean);
    }

    // -----------------------------------------------
    // Invalid JSON object
    // -----------------------------------------------

    return fallback;
  }
}