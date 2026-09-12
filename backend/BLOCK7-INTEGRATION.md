# BLOCK 7 — Scheme Storage Safety

Version: V4.5.6-BLOCK7-STORAGE-SAFETY-1.0

## Placement

Run this guard immediately before the database insert/upsert.

```js
import { filterSchemesForStorage } from "./schemeStorageSafety.service.js";

const storageResult = filterSchemesForStorage(
  verifiedCandidates,
  existingGoSubsidySchemes
);

// Only storageResult.candidates may reach the DB write.
// storageResult.rejected must never be inserted.
```

## Required conditions

A candidate must pass all of these:

1. Government-service hard gate has passed.
2. Employment / enterprise gate is eligible.
3. Canonical programme ID exists.
4. Verification has passed.
5. Sufficient evidence exists.
6. Canonical ID is not already stored.
7. Official URL is not already stored.
8. No duplicate canonical ID or URL exists inside the current batch.

## Important

BLOCK 7 does not change discovery, BLOCK 6, canonical resolution, verification, or employment-gate logic. It is an independent final storage barrier.

A 403 official anchor may remain a valid verified identity when the upstream verifier explicitly approved it, but BLOCK 7 never fabricates BLOCK 6 page evidence.
