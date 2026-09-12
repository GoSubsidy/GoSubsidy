# GoSubsidy Premium DPR V2

This bundle rebuilds the Premium DPR layer around the supplied reference report.

## Reference structure carried forward

The supplied report is 18 pages and contains:
- Contents
- About Promoter
- Executive Summary
- The Project
- Need / Vision / Mission / Objectives
- Project Proposal / Technical Details
- Other Parameters
- Implementation
- Business Model
- Scheduling
- Feasibility Study
- Detailed Project Cost
- Statement 01 Project at a Glance
- Statement 02 DSCR
- Statement 03 Capital Cost
- Statement 04 Income
- Statement 05 Expenditure
- Statement 06 Profit & Loss
- Statement 07 Balance Sheet
- Statement 08 Cash Flow
- Statement 09 Repayment Schedule
- Statement 10 Depreciation
- Conclusion

The V2 renderer keeps this lender-oriented hierarchy while redesigning the presentation
as a premium GoSubsidy document.

## Files

### Frontend
Replace/add:
- `frontend/src/pages/PremiumDPRPreview.jsx`
- `frontend/src/styles/PremiumDPR.css`

### Backend
Add:
- `backend/src/controllers/dprControllerPremium.js`
- `backend/src/config/dprProfiles.js`

## Route

Add a route using the new controller, for example:

```js
router.post("/generate-premium", generatePremiumDPR);
```

Then import:

```js
import { generatePremiumDPR } from "../controllers/dprControllerPremium.js";
```

The final endpoint becomes:

`POST /api/dpr/generate-premium`

## Frontend generation call

After the existing payment-success callback, send the same authoritative DPR payload:

```js
const response = await fetch(
  "http://localhost:4000/api/dpr/generate-premium",
  {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      project: payload,
    }),
  }
);

const data = await response.json();

if (!response.ok || !data.success) {
  throw new Error(data.message || "Premium DPR generation failed.");
}

const generatedDPR = {
  project: payload,
  report: "",
  ai: data.structuredDPR,
  structuredDPR: data.structuredDPR,
  dprProfile: data.dprProfile,
  calculations: payload.calculations,
  financialSnapshot: data.financialSnapshot,
  provider: data.provider,
  model: data.model,
  generatedAt: new Date().toISOString(),
};

localStorage.setItem(
  "gosubsidy_generated_dpr",
  JSON.stringify(generatedDPR)
);

navigate("/dpr-preview", {
  state: { generatedDPR }
});
```

## Why this is better than the old AI-text-only DPR

The previous flow sends a project to Gemini and receives a report string.
V2 separates:
1. authoritative financial calculations,
2. structured AI narrative,
3. sector/product profile,
4. premium document rendering.

This prevents AI narrative from silently replacing financial calculations.

## All products / services

The renderer is universal. A product can supply:

```js
project.dprProfile = {
  profileName: "My Product DPR",
  sector: "My Sector",
  technicalHeading: "My Technical Configuration",
  requiredInputs: [
    "Capacity",
    "Technology",
    "Premises",
    "Machinery"
  ]
};
```

If no profile is supplied, the universal profile is used.

The included profile resolver also contains starter profiles for:
- Poultry / broiler
- Food processing
- Manufacturing
- Retail / trading
- Services
- Agriculture & allied

Do not create 117 separate DPR components. Use one renderer plus product metadata.

## Important

Keep the existing payment-first flow. Premium DPR generation should begin only after
the successful payment / entitlement callback.

The supplied reference report contains assumptions and figures that are specific to
its poultry project. Those figures should NOT be hard-coded into the GoSubsidy
universal DPR. Only its structure, hierarchy and lender-facing presentation are reused.
