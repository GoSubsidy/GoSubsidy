// ============================================================
// GoSubsidy - BLOCK 7
// SCHEME STORAGE SAFETY
// Version: V4.5.6-BLOCK7-STORAGE-SAFETY-1.0
// ============================================================
// Purpose:
// Final independent guard immediately before database storage.
// This module does NOT discover, enrich, verify, or modify schemes.
// It only decides whether an already-processed candidate is safe to
// enter GoSubsidy's employment-generation / enterprise scheme store.
// ============================================================

export const STORAGE_GUARD_VERSION =
  "V4.5.6-BLOCK7-STORAGE-SAFETY-1.0";

const TRUE_VALUES = new Set([true, "true", 1, "1"]);

function isTrue(value) {
  return TRUE_VALUES.has(value);
}

function text(value) {
  return String(value || "").trim();
}

function normalize(value) {
  return text(value)
    .toLowerCase()
    .replace(/&amp;/g, "&")
    .replace(/[^a-z0-9]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function firstNonEmpty(...values) {
  for (const value of values) {
    if (text(value)) return text(value);
  }
  return "";
}

function getCanonicalId(candidate) {
  return firstNonEmpty(
    candidate?.canonicalProgramId,
    candidate?.canonicalProgram?.id
  );
}

function getCanonicalName(candidate) {
  return firstNonEmpty(
    candidate?.canonicalProgramName,
    candidate?.canonicalProgram?.name,
    candidate?.schemeName,
    candidate?.title
  );
}

function hasEmploymentGatePass(candidate) {
  const relevance = candidate?.goSubsidyRelevance;

  if (!relevance) return false;
  if (relevance.eligible !== true) return false;
  if (text(relevance.policy) &&
      relevance.policy !== "EMPLOYMENT_GENERATION_AND_ENTERPRISE_ONLY") {
    return false;
  }

  return true;
}

function hasServiceGatePass(candidate) {
  // The discovery output records accepted candidates by the absence of
  // a service-gate rejection. If an explicit gate object exists, require it.
  const gate = candidate?.goSubsidyServiceGate;

  if (gate && gate.accepted === false) return false;
  if (candidate?.rejectionStage === "GOSUBSIDY_SERVICE_HARD_GATE") return false;
  if (candidate?.serviceGateRejected === true) return false;

  return true;
}

function hasCanonicalIdentity(candidate) {
  return Boolean(getCanonicalId(candidate));
}

function hasVerificationPass(candidate) {
  const status = normalize(
    firstNonEmpty(
      candidate?.verificationStatus,
      candidate?.status
    )
  );

  if (candidate?.verification?.verified === false) return false;
  if (candidate?.verificationPassed === false) return false;
  if (candidate?.smartVerification === false) return false;

  return (
    isTrue(candidate?.verificationPassed) ||
    isTrue(candidate?.verified) ||
    status === "verified" ||
    status === "new" ||
    status === "existing"
  );
}

function hasSufficientEvidence(candidate) {
  // Strong evidence: actual BLOCK 6 page content.
  if (
    candidate?.canonicalProgramEvidenceMatched === true &&
    text(candidate?.canonicalProgramEvidenceSource)
      .toUpperCase()
      .startsWith("BLOCK6_PAGE_CONTENT")
  ) {
    return true;
  }

  // A verified official scheme anchor is acceptable when the verifier has
  // independently confirmed the scheme identity. This does NOT manufacture
  // BLOCK 6 evidence for a failed fetch.
  if (
    candidate?.canonicalProgramMatched === true &&
    normalize(candidate?.canonicalProgramEvidenceSource)
      .includes("official scheme anchor") &&
    candidate?.canonicalProgramEvidenceMatched === false &&
    candidate?.evidenceEnrichment?.fetchFailed === true
  ) {
    return candidate?.verificationPassed === true ||
      normalize(candidate?.verificationStatus) === "verified";
  }

  // Legacy/verified records may carry an evidence score without the newer
  // canonical evidence fields.
  const score = Number(
    candidate?.evidenceEnrichment?.evidenceScore ??
    candidate?.evidenceScore ??
    0
  );

  return score >= 2;
}

function duplicateCanonicalId(candidate, existingSchemes) {
  const id = normalize(getCanonicalId(candidate));
  if (!id) return false;

  return (existingSchemes || []).some(
    (existing) =>
      normalize(
        firstNonEmpty(
          existing?.canonicalProgramId,
          existing?.canonical_program_id
        )
      ) === id
  );
}

function duplicateOfficialUrl(candidate, existingSchemes) {
  const url = normalizeUrl(candidate?.officialWebsite || candidate?.url);
  if (!url) return false;

  return (existingSchemes || []).some(
    (existing) =>
      normalizeUrl(
        existing?.officialWebsite ||
        existing?.official_website ||
        existing?.url
      ) === url
  );
}

function normalizeUrl(value) {
  try {
    const parsed = new URL(text(value));
    parsed.hash = "";
    parsed.search = "";
    return parsed.toString().replace(/\/$/, "").toLowerCase();
  } catch {
    return text(value).replace(/\/$/, "").toLowerCase();
  }
}

function hardScopeRejection(candidate) {
  const relevance = candidate?.goSubsidyRelevance;
  const signals = relevance?.signals || {};

  if (Array.isArray(signals.hardExclusions) && signals.hardExclusions.length) {
    return "EMPLOYMENT_SCOPE_HARD_EXCLUSION";
  }

  const title = normalize(
    firstNonEmpty(candidate?.title, candidate?.schemeName)
  );
  const url = normalize(candidate?.officialWebsite || candidate?.url);

  const servicePath =
    url.includes("/services/") ||
    url.includes("/service/");

  const obviousServiceTitle =
    /^(apply|application|issuance|issue|renew|registration|license|licence|permit|request|download)\b/.test(title);

  const obviousDataOrNews =
    url.includes("data.gov.in/catalog") ||
    url.includes("pib.gov.in/pressrelease") ||
    /\b(open data|press release|news article|brochure)\b/.test(title);

  if (servicePath || obviousServiceTitle || obviousDataOrNews) {
    return "NON_SCHEME_SERVICE_DATA_OR_NEWS";
  }

  return "";
}

export function buildStorageKey(candidate) {
  const canonicalId = getCanonicalId(candidate);
  if (canonicalId) return `CANONICAL_PROGRAM_ID:${normalize(canonicalId)}`;

  const url = normalizeUrl(candidate?.officialWebsite || candidate?.url);
  if (url) return `OFFICIAL_URL:${url}`;

  return "";
}

export function validateSchemeForStorage(
  candidate,
  existingSchemes = []
) {
  const reasons = [];
  const canonicalProgramId = getCanonicalId(candidate);
  const canonicalProgramName = getCanonicalName(candidate);

  if (!candidate || typeof candidate !== "object") {
    return {
      allowed: false,
      version: STORAGE_GUARD_VERSION,
      reasons: ["INVALID_CANDIDATE"],
      storageKey: "",
    };
  }

  const scopeReason = hardScopeRejection(candidate);
  if (scopeReason) reasons.push(scopeReason);

  if (!hasServiceGatePass(candidate)) {
    reasons.push("SERVICE_GATE_FAILED");
  }

  if (!hasEmploymentGatePass(candidate)) {
    reasons.push("EMPLOYMENT_ENTERPRISE_GATE_FAILED");
  }

  if (!hasCanonicalIdentity(candidate)) {
    reasons.push("CANONICAL_ID_REQUIRED");
  }

  if (!hasVerificationPass(candidate)) {
    reasons.push("VERIFICATION_REQUIRED");
  }

  if (!hasSufficientEvidence(candidate)) {
    reasons.push("SUFFICIENT_EVIDENCE_REQUIRED");
  }

  if (duplicateCanonicalId(candidate, existingSchemes)) {
    reasons.push("DUPLICATE_CANONICAL_PROGRAM");
  }

  if (duplicateOfficialUrl(candidate, existingSchemes)) {
    reasons.push("DUPLICATE_OFFICIAL_URL");
  }

  const uniqueReasons = [...new Set(reasons)];

  return {
    allowed: uniqueReasons.length === 0,
    version: STORAGE_GUARD_VERSION,
    storageKey: buildStorageKey(candidate),
    canonicalProgramId: canonicalProgramId || null,
    canonicalProgramName: canonicalProgramName || null,
    reasons: uniqueReasons,
  };
}

export function filterSchemesForStorage(
  candidates,
  existingSchemes = []
) {
  const input = Array.isArray(candidates) ? candidates : [];
  const accepted = [];
  const rejected = [];

  const seenCanonicalIds = new Set();
  const seenUrls = new Set();

  for (const candidate of input) {
    const result = validateSchemeForStorage(
      candidate,
      [
        ...(Array.isArray(existingSchemes) ? existingSchemes : []),
        ...accepted,
      ]
    );

    const canonicalId = normalize(getCanonicalId(candidate));
    const url = normalizeUrl(candidate?.officialWebsite || candidate?.url);

    if (canonicalId && seenCanonicalIds.has(canonicalId)) {
      result.allowed = false;
      result.reasons.push("DUPLICATE_CANONICAL_PROGRAM_IN_BATCH");
    }

    if (url && seenUrls.has(url)) {
      result.allowed = false;
      result.reasons.push("DUPLICATE_OFFICIAL_URL_IN_BATCH");
    }

    result.reasons = [...new Set(result.reasons)];

    if (result.allowed) {
      const storedCandidate = {
        ...candidate,
        storageSafety: {
          guardVersion: STORAGE_GUARD_VERSION,
          approved: true,
          storageKey: result.storageKey,
          canonicalProgramId: result.canonicalProgramId,
          canonicalProgramName: result.canonicalProgramName,
        },
      };

      accepted.push(storedCandidate);
      if (canonicalId) seenCanonicalIds.add(canonicalId);
      if (url) seenUrls.add(url);
    } else {
      rejected.push({
        ...candidate,
        storageSafety: {
          guardVersion: STORAGE_GUARD_VERSION,
          approved: false,
          storageKey: result.storageKey,
          reasons: result.reasons,
        },
        rejectionStage: "BLOCK7_STORAGE_SAFETY",
        rejectionReason: result.reasons.join(" | "),
      });
    }
  }

  return {
    candidates: accepted,
    rejected,
    summary: {
      enabled: true,
      version: STORAGE_GUARD_VERSION,
      input: input.length,
      approved: accepted.length,
      rejected: rejected.length,
      policy: "EMPLOYMENT_GENERATION_AND_ENTERPRISE_ONLY",
    },
  };
}

export function assertSchemeStorageSafe(candidate, existingSchemes = []) {
  const result = validateSchemeForStorage(candidate, existingSchemes);
  if (!result.allowed) {
    const error = new Error(
      `BLOCK7_STORAGE_REJECTED: ${result.reasons.join(" | ")}`
    );
    error.code = "BLOCK7_STORAGE_REJECTED";
    error.details = result;
    throw error;
  }

  return result;
}
