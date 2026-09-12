import assert from "node:assert/strict";
import {
  STORAGE_GUARD_VERSION,
  validateSchemeForStorage,
  filterSchemesForStorage,
} from "./schemeStorageSafety.service.js";

const base = {
  title: "PMEGP",
  schemeName: "Prime Minister's Employment Generation Programme",
  officialWebsite: "https://example.gov/pmegptest",
  canonicalProgramId: "PMEGP",
  canonicalProgramName: "Prime Minister's Employment Generation Programme",
  canonicalProgramMatched: true,
  canonicalProgramEvidenceMatched: true,
  canonicalProgramEvidenceSource: "BLOCK6_PAGE_CONTENT",
  goSubsidyRelevance: {
    eligible: true,
    policy: "EMPLOYMENT_GENERATION_AND_ENTERPRISE_ONLY",
    score: 5,
    signals: { enterprise: ["employment", "enterprise"] },
  },
  verificationStatus: "VERIFIED",
  verificationPassed: true,
  evidenceEnrichment: { evidenceScore: 4, fetchFailed: false },
};

assert.equal(STORAGE_GUARD_VERSION, "V4.5.6-BLOCK7-STORAGE-SAFETY-1.0");
assert.equal(validateSchemeForStorage(base).allowed, true);

const ujjwala = {
  ...base,
  title: "Apply for New Ujjwala 2.0 Connection",
  schemeName: "Apply for New Ujjwala 2.0 Connection",
  canonicalProgramId: "UJJWALA",
  goSubsidyRelevance: {
    eligible: false,
    policy: "EMPLOYMENT_GENERATION_AND_ENTERPRISE_ONLY",
    score: 0,
    signals: { hardExclusions: ["SERVICE"] },
  },
  verificationStatus: "VERIFIED",
};
assert.equal(validateSchemeForStorage(ujjwala).allowed, false);
assert.match(validateSchemeForStorage(ujjwala).reasons.join(" "), /EMPLOYMENT_ENTERPRISE_GATE_FAILED/);

const ncs = {
  ...base,
  title: "National Career Service for Job Seekers and Employers",
  canonicalProgramId: "NCS",
  officialWebsite: "https://www.ncs.gov.in/pages/default.aspx",
  goSubsidyRelevance: {
    eligible: false,
    policy: "EMPLOYMENT_GENERATION_AND_ENTERPRISE_ONLY",
    score: 0,
    signals: { hardExclusions: ["GOVERNMENT_SERVICE"] },
  },
};
assert.equal(validateSchemeForStorage(ncs).allowed, false);

const missingCanonical = { ...base, canonicalProgramId: "" };
assert.equal(validateSchemeForStorage(missingCanonical).allowed, false);
assert.ok(validateSchemeForStorage(missingCanonical).reasons.includes("CANONICAL_ID_REQUIRED"));

const unverified = { ...base, verificationPassed: false, verificationStatus: "UNVERIFIED" };
assert.equal(validateSchemeForStorage(unverified).allowed, false);

const duplicate = { ...base, officialWebsite: "https://example.gov/another-url" };
assert.equal(validateSchemeForStorage(duplicate, [{ canonicalProgramId: "PMEGP" }]).allowed, false);
assert.ok(validateSchemeForStorage(duplicate, [{ canonicalProgramId: "PMEGP" }]).reasons.includes("DUPLICATE_CANONICAL_PROGRAM"));

const news = {
  ...base,
  title: "Government Press Release on Employment",
  canonicalProgramId: "NEWS1",
  officialWebsite: "https://pib.gov.in/pressreleasepage.aspx?prid=123",
};
assert.equal(validateSchemeForStorage(news).allowed, false);

const batch = filterSchemesForStorage([
  base,
  { ...base, officialWebsite: "https://example.gov/second", title: "PMEGP duplicate" },
  { ...base, canonicalProgramId: "MUDRA", officialWebsite: "https://example.gov/mudra", schemeName: "MUDRA" },
]);
assert.equal(batch.summary.input, 3);
assert.equal(batch.summary.approved, 2);
assert.equal(batch.summary.rejected, 1);
assert.ok(batch.rejected[0].storageSafety.reasons.includes("DUPLICATE_CANONICAL_PROGRAM_IN_BATCH"));

console.log("BLOCK 7 STORAGE SAFETY TESTS: PASS");
console.log(JSON.stringify(batch.summary, null, 2));
