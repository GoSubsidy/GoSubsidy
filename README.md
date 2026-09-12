# GoSubsidy Premium AI DPR — Complete Visual Rebuild

This is a replacement presentation layer, not a CSS facelift.

## Design principles
1. The attached reference DPR is used as the content/credit structure: promoter, executive/project rationale, technical proposal, implementation, feasibility, project cost, financial statements, DSCR, risk/SWOT, credit view, conditions and conclusion.
2. GoSubsidy uses a new premium visual system: dashboard-first, investment/credit intelligence, compact tables, charts, cards and lender-oriented callouts.
3. Financial calculations remain authoritative in the existing GoSubsidy calculation engine. AI should write narrative from those numbers and must not invent or alter financial values.
4. Product profiles drive the technical blueprint so the same renderer works across all GoSubsidy products.

## Install
Copy:
- frontend/src/pages/PremiumDPR.jsx
- frontend/src/styles/PremiumDPR.css
- frontend/src/config/dprProfiles.js

Then import:
import PremiumDPR from "./pages/PremiumDPR";

Use:
<PremiumDPR data={dprData} />

## Production integration
Map your existing DPR calculation result into:
project, finance, operating, projectNeed, vision, mission, objectives, SWOT and projection.

Do NOT duplicate the financial formulas in the UI.

## Existing flow
Keep your existing entitlement/payment gate before the DPR generation call:
Payment/entitlement -> Generate DPR -> PremiumDPR -> Print/PDF.

## PDF
The CSS includes a print layout. Your existing PDF service can render this page, or the project can use its existing PDF pipeline.
