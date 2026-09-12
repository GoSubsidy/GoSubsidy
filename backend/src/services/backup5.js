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
// BLOCK 7 — DISCOVERY STORAGE SAFETY
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

    is_active:
      parseBooleanValue(
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

    status: textValue(candidate?.status, "Draft"),

    benefits: parseJsonField(candidate?.benefits, []),
    eligibility: parseJsonField(candidate?.eligibility, {}),
    documents: parseJsonField(candidate?.documents, []),
    application: parseJsonField(candidate?.application, {}),
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

function findExistingSchemeMatch(payload, existingSchemes = []) {
  const name = normalizeSchemeMatchValue(payload.scheme_name);
  const canonicalId = normalizeSchemeMatchValue(payload.canonical_program_id);
  const officialUrl = normalizeOfficialUrl(payload.official_website);

  return (existingSchemes || []).find((existing) => {
    const existingName = normalizeSchemeMatchValue(existing.scheme_name);
    const existingCanonicalId = normalizeSchemeMatchValue(
      existing.canonical_program_id || existing.canonicalProgramId
    );
    const existingOfficialUrl = normalizeOfficialUrl(
      existing.official_website || existing.officialWebsite
    );

    return (
      (name && existingName === name) ||
      (canonicalId && existingCanonicalId === canonicalId) ||
      (officialUrl && existingOfficialUrl === officialUrl)
    );
  }) || null;
}

function hasMeaningfulValue(value) {
  if (value === null || value === undefined) return false;
  if (typeof value === "string") return value.trim().length > 0;
  if (Array.isArray(value)) return value.length > 0;
  if (typeof value === "object") return Object.keys(value).length > 0;
  return true;
}

function buildExistingSchemeRepairPatch(payload, existing) {
  const patch = {};

  // These fields are safe automatic-normalization fields. They are updated
  // even when the old database row contains a stale/default value.
  patch.is_central = payload.is_central;
  patch.is_active = payload.is_active;
  if (payload.language) patch.language = payload.language;
  if (payload.slug) patch.slug = payload.slug;
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

async function repairExistingDiscoveredScheme(candidate, existingSchemes = []) {
  const payload = mapDiscoveredCandidateToSchemePayload(candidate);
  if (!payload.scheme_name) return null;

  const existing = findExistingSchemeMatch(payload, existingSchemes);
  if (!existing) return null;

  // Keep BLOCK 7 safety active for repair candidates, but remove only the
  // duplicate identity of the exact row being repaired from the comparison
  // set. A candidate with other safety failures must still be rejected.
  const comparisonRows = (existingSchemes || []).filter(
    (row) => String(row.id) !== String(existing.id)
  );
  const safety = assertSchemeStorageSafe(candidate, comparisonRows);
  const patch = buildExistingSchemeRepairPatch(payload, existing);

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

  // Existing schemes are repaired in-place. New schemes continue through the
  // normal BLOCK 7 storage filter unchanged.
  for (const candidate of rows) {
    const payload = mapDiscoveredCandidateToSchemePayload(candidate);
    const existing = findExistingSchemeMatch(payload, existingSchemes || []);

    if (!existing) {
      newCandidates.push(candidate);
      continue;
    }

    try {
      const result = await repairExistingDiscoveredScheme(
        candidate,
        existingSchemes || []
      );
      if (result) repaired.push(result);
    } catch (error) {
      repairRejected.push({
        ...candidate,
        rejectionStage: "BLOCK7_EXISTING_SCHEME_REPAIR",
        rejectionReason: error?.message || "EXISTING_SCHEME_REPAIR_FAILED",
      });
    }
  }

  const storageResult = filterSchemesForStorage(
    newCandidates,
    existingSchemes || []
  );
  const approvedRows = storageResult.candidates;

  const existingNames = new Set(
    (existingSchemes || [])
      .map((scheme) => String(scheme.scheme_name || "").trim().toLowerCase())
      .filter(Boolean)
  );

  const namesSeenInBatch = new Set();
  const insertRows = [];
  const rejectedRows = [
    ...storageResult.rejected,
    ...repairRejected,
  ];

  for (const candidate of approvedRows) {
    const payload = mapDiscoveredCandidateToSchemePayload(candidate);
    const normalizedName = payload.scheme_name.toLowerCase();

    if (!payload.scheme_name) {
      rejectedRows.push({
        ...candidate,
        rejectionStage: "BLOCK7_STORAGE_SAFETY",
        rejectionReason: "SCHEME_NAME_REQUIRED",
      });
      continue;
    }

    if (existingNames.has(normalizedName)) {
      rejectedRows.push({
        ...candidate,
        rejectionStage: "BLOCK7_STORAGE_SAFETY",
        rejectionReason: "DUPLICATE_SCHEME_NAME",
      });
      continue;
    }

    if (namesSeenInBatch.has(normalizedName)) {
      rejectedRows.push({
        ...candidate,
        rejectionStage: "BLOCK7_STORAGE_SAFETY",
        rejectionReason: "DUPLICATE_SCHEME_NAME_IN_BATCH",
      });
      continue;
    }

    namesSeenInBatch.add(normalizedName);
    insertRows.push(payload);
  }

  let inserted = [];
  if (insertRows.length > 0) {
    const { data, error } = await supabase
      .from("schemes")
      .insert(insertRows)
      .select();

    if (error) {
      throw new Error(`Discovered scheme storage failed: ${error.message}`);
    }

    inserted = data || [];
  }

  return {
    success: true,
    storageGuardVersion: STORAGE_GUARD_VERSION,
    total: rows.length,
    approved: approvedRows.length + repaired.length,
    imported: inserted.length,
    repaired: repaired.length,
    rejected: rejectedRows.length,
    data: [...inserted, ...repaired],
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

export async function createScheme(payload) {
  const { data, error } = await supabase
    .from("schemes")
    .insert([payload])
    .select()
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data;
}

// ======================================================
// UPDATE SCHEME
// ======================================================

export async function updateScheme(id, payload) {
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