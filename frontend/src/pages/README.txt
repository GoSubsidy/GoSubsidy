GoSubsidy DPR — LATEST STATUS / INTEGRATED UPDATE
Updated: 05-Sep-2026

INCLUDED
1. PremiumDPR.jsx — single customer-selected DPR Projection Horizon (loanTenure), 1–15 years; no separate projectionYears input; payment entitlement callback retained.
2. PremiumDPRPreview.jsx — free key-points + ₹999 Premium paywall; premium full 30-page renderer; project.loanTenure is authoritative for projection horizon; financial pages >5 years use landscape class; sector theme applied.
3. DPRPreview.css — merged sector themes, readable financial layout, A4 landscape print rules for 6–15 years, light transparent footer, moderate sector-colored action bar.
4. dprController_UPDATED_LATEST.js — business-specific AI safeguards; selected Business/Sector is primary context; no unsupported project-specific facts.

LATEST PDF REVIEW
- Supplied 30-page PDF: 9-year projection and 9-year tenure are aligned, but financial pages 16–24 are still portrait/squeezed rather than landscape.
- Page 4 still shows “LOAN REPAYMENT PERIOD”; page 6 still shows “LOAN REPAYMENT TENURE”. These are corrected in the integrated renderer to “DPR Projection Horizon”.
- Pages 8–13 still contain unsupported assumptions for a project where only “Manufacturing” was supplied (fabrication, B2B contracts, industrial infrastructure, local suppliers/utilities). Controller safeguards are included to stop this in new generations.
- Financial values in the supplied PDF remain controlled by the GoSubsidy calculation payload; no financial engine rewrite is included.

EXPECTED AFTER INSTALL
- One customer field: DPR Projection Horizon (1–15 years), backed by project.loanTenure.
- 1–5 year financial pages: portrait.
- 6–15 year financial pages: landscape.
- Sector theme changes with Business/Sector.
- Free preview remains free; Premium 30-page report remains gated by ₹999 entitlement.
- Financial engine remains authoritative/intact.

INSTALL
Frontend: copy PremiumDPR.jsx, PremiumDPRPreview.jsx and DPRPreview.css into frontend/src/pages/.
Backend: replace the DPR controller with dprController_UPDATED_LATEST.js according to existing controller path/imports.
Do not mix these files with older DPRPreview/PremiumDPR variants.
