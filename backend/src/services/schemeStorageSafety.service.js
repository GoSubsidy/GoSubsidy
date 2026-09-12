// ============================================================
// GoSubsidy - BLOCK 7
// SCHEME STORAGE SAFETY
// Version: V4.11-CANONICAL-PROGRAM-SOURCE-CONSOLIDATION-1.0
// ============================================================
// Purpose:
// Final independent guard immediately before database storage.
// This module does NOT discover, enrich, verify, or modify schemes.
// It only decides whether an already-processed candidate is safe to
// enter GoSubsidy's employment-generation / enterprise scheme store.
// ============================================================

export const STORAGE_GUARD_VERSION =
  "V5.0-EXCLUSIVE-SCHEMES-ONLY-STORAGE-1.0";

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

function hasGeneralSchemeGatePass(candidate) {
  const relevance = candidate?.goSubsidyRelevance || {};
  if (relevance.eligible === false) return false;

  // Existing metadata repair is allowed only for an already stored row.
  if (candidate?.discoveryType === "EXISTING_METADATA_REPAIR") return true;

  const title = normalize(
    firstNonEmpty(
      candidate?.schemeName,
      candidate?.title,
      candidate?.scheme_name,
      candidate?.canonicalProgramName,
      candidate?.canonical_program_name
    )
  );
  const url = normalize(
    firstNonEmpty(
      candidate?.officialWebsite,
      candidate?.official_website,
      candidate?.sourceUrl,
      candidate?.url
    )
  );

  const administrative = [
    /\bcontact\b/, /\brti\b/, /\bcompassionate appointment\b/,
    /\bformer development commissioners?\b/, /\boffice order\b/,
    /\bsanction order\b/, /\bcircular\b/, /\bminutes\b/,
    /\bnotification\b/, /\brecruitment\b/, /\bvacanc/, /\bemployee\b/,
    /\bcadre\b/, /\bieds\b/, /\bdirectory\b/, /\bofficer list\b/,
    /^scheme guidelines?$/, /^guidelines?$/, /^brochure$/, /^details?$/,
  ];
  if (administrative.some((p) => p.test(title))) return false;

  const badUrl = [
    /\/contact(?:_|-)?(?:hq|us)?(?:[/?#]|$)/,
    /\/rti(?:[/?#]|$)/,
    /\/compassionate[_-]appointment(?:[/?#]|$)/,
    /\/list[_-]?dc(?:[/?#]|$)/,
    /\/ieds(?:[/?#]|$)/,
    /\/(?:orders?|circulars?|notifications?|minutes|recruitment|vacancies|careers)(?:[/?#]|$)/,
    /\/(?:directory|officers?|employees?)(?:[/?#]|$)/,
  ];
  if (badUrl.some((p) => p.test(url))) return false;

  const policy = normalize(relevance.policy);
  if (policy === "exclusive schemes only" || policy === "general government subsidy incentive scheme") {
    const signals = relevance?.signals || {};
    const pillars = signals.evidencePillars || {};
    const pillarCount = Number(
      signals.evidencePillarCount ??
      Object.values(pillars).filter(Boolean).length
    );
    const titleLooksLikeProgramme =
      signals.titleLooksLikeProgramme === true ||
      /\b(scheme|yojana|programme|program|subsidy|grant|incentive|fund|assistance|support|mission)\b/.test(title);
    const financialBenefitPresent =
      signals.financialBenefitPresent === true ||
      /\b(subsidy|grant|incentive|financial assistance|financial support|interest subsidy|capital subsidy|reimbursement|credit guarantee|margin money|concessional loan)\b/.test(
        normalize([
          candidate?.benefits,
          candidate?.description,
          candidate?.eligibility,
          candidate?.beneficiary,
          candidate?.application,
          candidate?.evidenceEnrichment?.mainText,
        ].filter(Boolean).join(" "))
      );

    return titleLooksLikeProgramme && financialBenefitPresent && pillarCount >= 2;
  }

  // Legacy fallback: still require a real programme identity + benefit + evidence.
  const blob = normalize([
    candidate?.schemeName,
    candidate?.title,
    candidate?.canonicalProgramName,
    candidate?.description,
    candidate?.beneficiary,
    candidate?.eligibility,
    candidate?.benefits,
  ].filter(Boolean).join(" "));

  const identity = /\b(scheme|yojana|programme|program|subsidy|grant|incentive|fund)\b/.test(blob);
  const benefit = /\b(subsidy|grant|incentive|financial assistance|financial support|credit guarantee|reimbursement)\b/.test(blob);
  const evidenceCount = [candidate?.eligibility, candidate?.beneficiary, candidate?.benefits, candidate?.application]
    .filter((v) => v && (typeof v !== "string" || v.trim())).length;

  return identity && benefit && evidenceCount >= 2;
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

function isExistingMetadataRepair(candidate) {
  return (
    candidate?.discoveryType === "EXISTING_METADATA_REPAIR" ||
    candidate?.sourceId === "existing-database-repair"
  );
}

function hasSufficientEvidence(candidate) {
  // EXISTING_METADATA_REPAIR is a repair of an already stored scheme.
  // It has already passed canonical matching and smart verification.
  // Requiring a fresh BLOCK 6 fetch here made every legacy repair fail
  // even when verification confidence was 1.0.
  if (isExistingMetadataRepair(candidate)) {
    const hasExistingId = Boolean(
      candidate?.existingSchemeId ?? candidate?.existing_scheme_id
    );
    const verified =
      candidate?.verification?.verified === true ||
      candidate?.verified === true ||
      normalize(candidate?.verificationStatus) === "verified";
    const canonicalId = Boolean(getCanonicalId(candidate));

    return hasExistingId && verified && canonicalId;
  }

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

  const repairId = String(
    candidate?.existingSchemeId ?? candidate?.existing_scheme_id ?? ""
  ).trim();

  return (existingSchemes || []).some((existing) => {
    const existingId = String(existing?.id ?? "").trim();
    if (repairId && existingId && repairId === existingId) return false;

    return (
      normalize(
        firstNonEmpty(
          existing?.canonicalProgramId,
          existing?.canonical_program_id
        )
      ) === id
    );
  });
}

function duplicateOfficialUrl(candidate, existingSchemes) {
  const url = normalizeUrl(candidate?.officialWebsite || candidate?.url);
  if (!url) return false;

  const repairId = String(
    candidate?.existingSchemeId ?? candidate?.existing_scheme_id ?? ""
  ).trim();

  return (existingSchemes || []).some((existing) => {
    const existingId = String(existing?.id ?? "").trim();
    if (repairId && existingId && repairId === existingId) return false;

    return (
      normalizeUrl(
        existing?.officialWebsite ||
        existing?.official_website ||
        existing?.url
      ) === url
    );
  });
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
    return "EXCLUSIVE_SCHEME_HARD_EXCLUSION";
  }

  const title = normalize(
    firstNonEmpty(candidate?.title, candidate?.schemeName, candidate?.scheme_name)
  );
  const url = normalize(
    firstNonEmpty(candidate?.officialWebsite, candidate?.official_website, candidate?.url)
  );

  const nonSchemeTitle = [
    /\bcontact\b/, /\brti\b/, /\bcompassionate appointment\b/,
    /\bformer development commissioners?\b/, /\boffice order\b/,
    /\bsanction order\b/, /\bcircular\b/, /\bminutes\b/,
    /\bnotification\b/, /\brecruitment\b/, /\bvacanc/, /\bemployee\b/,
    /\bcadre\b/, /\bieds\b/, /\bdirectory\b/, /\bofficer list\b/,
    /^scheme guidelines?$/, /^guidelines?$/, /^brochure$/, /^details?$/,
  ];

  if (nonSchemeTitle.some((pattern) => pattern.test(title))) {
    return "NON_SCHEME_ADMINISTRATIVE_TITLE";
  }

  const nonSchemeUrl = [
    /\/contact(?:_|-)?(?:hq|us)?(?:[/?#]|$)/,
    /\/rti(?:[/?#]|$)/,
    /\/compassionate[_-]appointment(?:[/?#]|$)/,
    /\/list[_-]?dc(?:[/?#]|$)/,
    /\/ieds(?:[/?#]|$)/,
    /\/(?:orders?|circulars?|notifications?|minutes|recruitment|vacancies|careers)(?:[/?#]|$)/,
    /\/(?:directory|officers?|employees?)(?:[/?#]|$)/,
    /\/services?(?:[/?#]|$)/,
  ];

  if (nonSchemeUrl.some((pattern) => pattern.test(url))) {
    return "NON_SCHEME_ADMINISTRATIVE_URL";
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

  if (!hasGeneralSchemeGatePass(candidate)) {
    reasons.push("GENERAL_SCHEME_GATE_FAILED");
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

  // V4.11: several official pages can represent ONE programme.
  // Consolidate pages sharing a canonical programme ID before Block 7.
  // This is deliberately limited to NEW/batch candidates. An already
  // stored canonical programme is still a hard duplicate and is never
  // imported again.
  const grouped = new Map();
  const ungrouped = [];

  for (const candidate of input) {
    const canonicalId = normalize(getCanonicalId(candidate));
    if (!canonicalId) {
      ungrouped.push(candidate);
      continue;
    }

    const bucket = grouped.get(canonicalId) || [];
    bucket.push(candidate);
    grouped.set(canonicalId, bucket);
  }

  function evidenceRank(candidate) {
    const e = candidate?.evidenceEnrichment || {};
    const score = Number(e.evidenceScore ?? candidate?.evidenceScore ?? 0);
    const confidence = Number(
      candidate?.verification?.confidence ??
      candidate?.verificationConfidence ?? 0
    );
    const fields = Array.isArray(e.fieldsFound) ? e.fieldsFound.length : 0;
    return score * 100 + confidence * 10 + fields;
  }

  function mergeProgrammeSources(bucket) {
    const ranked = [...bucket].sort((a, b) => evidenceRank(b) - evidenceRank(a));
    const primary = ranked[0];
    const sources = [];
    const seen = new Set();

    for (const item of ranked) {
      const url = normalizeUrl(item?.officialWebsite || item?.url || item?.sourceUrl);
      if (!url || seen.has(url)) continue;
      seen.add(url);
      sources.push({
        url,
        title: text(item?.title || item?.schemeName),
        sourceId: text(item?.sourceId),
        sourceName: text(item?.sourceName),
        documentType: classifySourceDocument(item),
      });
    }

    const mergedEvidence = ranked.reduce((acc, item) => {
      const e = item?.evidenceEnrichment || {};
      for (const key of ["eligibility", "benefits", "application", "documents", "description", "mainText"]) {
        if (!text(acc[key]) && text(item[key] ?? e[key])) {
          acc[key] = text(item[key] ?? e[key]);
        }
      }
      return acc;
    }, {
      eligibility: text(primary?.eligibility),
      benefits: text(primary?.benefits),
      application: text(primary?.application),
      documents: text(primary?.documents),
      description: text(primary?.description),
      mainText: text(primary?.evidenceEnrichment?.mainText),
    });

    return {
      ...primary,
      schemeName: meaningfulSchemeName(primary),
      title: meaningfulSchemeName(primary),
      eligibility: mergedEvidence.eligibility,
      benefits: mergedEvidence.benefits,
      application: mergedEvidence.application,
      documents: mergedEvidence.documents,
      description: mergedEvidence.description,
      evidenceEnrichment: {
        ...(primary?.evidenceEnrichment || {}),
        ...(mergedEvidence.mainText ? { mainText: mergedEvidence.mainText } : {}),
        sourcePagesMerged: sources.length,
        sourcePages: sources,
      },
      canonicalProgramSources: sources,
      canonicalSourceCount: sources.length,
      canonicalIdentityResolution: {
        ...(primary?.canonicalIdentityResolution || {}),
        sourceConsolidation: true,
        version: "1.13.0-V4.11",
      },
    };
  }

  const consolidated = [];
  for (const bucket of grouped.values()) {
    consolidated.push(mergeProgrammeSources(bucket));
  }
  consolidated.push(...ungrouped);

  // Preserve the original deterministic order as much as possible by using
  // the first occurrence's position within each canonical group.
  const firstIndex = new Map();
  input.forEach((candidate, index) => {
    const id = normalize(getCanonicalId(candidate));
    if (id && !firstIndex.has(id)) firstIndex.set(id, index);
  });
  consolidated.sort((a, b) => {
    const ai = firstIndex.get(normalize(getCanonicalId(a))) ?? input.indexOf(a);
    const bi = firstIndex.get(normalize(getCanonicalId(b))) ?? input.indexOf(b);
    return ai - bi;
  });

  const seenCanonicalIds = new Set();
  const seenUrls = new Set();

  for (const candidate of consolidated) {
    const result = validateSchemeForStorage(candidate, existingSchemes);
    const canonicalId = normalize(getCanonicalId(candidate));
    const url = normalizeUrl(candidate?.officialWebsite || candidate?.url);

    // A canonical ID already present in the database is still a duplicate.
    // Consolidation only resolves duplicates among NEW pages in this batch.
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
          sourcePagesMerged: candidate?.canonicalSourceCount || 1,
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
      canonicalGroups: grouped.size,
      approved: accepted.length,
      rejected: rejected.length,
      policy: "EXCLUSIVE_GOVERNMENT_SCHEMES_ONLY_WITH_CANONICAL_SOURCE_CONSOLIDATION",
    },
  };
}

function meaningfulSchemeName(candidate) {
  const candidates = [
    candidate?.canonicalProgramName,
    candidate?.schemeName,
    candidate?.title,
    candidate?.description,
  ];
  for (const value of candidates) {
    const valueText = text(value);
    const normalized = normalize(valueText);
    if (!valueText) continue;
    if (/^(brochure|circular order|scheme guidelines?|list of technologies|sanction order|scheme operation|guidelines?)$/i.test(normalized)) continue;
    if (valueText.length >= 5) return valueText;
  }
  return text(candidate?.canonicalProgramName || candidate?.schemeName || candidate?.title);
}

function classifySourceDocument(candidate) {
  const value = normalize([
    candidate?.title,
    candidate?.schemeName,
    candidate?.officialWebsite,
    candidate?.url,
  ].filter(Boolean).join(" "));
  if (/brochure/.test(value)) return "BROCHURE";
  if (/circular/.test(value)) return "CIRCULAR";
  if (/sanction order/.test(value)) return "SANCTION_ORDER";
  if (/list of technolog/.test(value)) return "TECHNOLOGY_LIST";
  if (/guideline/.test(value)) return "GUIDELINE";
  if (/scheme operation|operation/.test(value)) return "OPERATION_GUIDELINE";
  return "OFFICIAL_SCHEME_PAGE";
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
