GoSubsidy Premium AI DPR
==========================

Files:
  PremiumDPR.jsx
  PremiumDPR.css

Install:
  1. Copy PremiumDPR.jsx to frontend/src/pages/PremiumDPR.jsx
  2. Copy PremiumDPR.css to frontend/src/pages/PremiumDPR.css

Route example:
  import PremiumDPR from "./pages/PremiumDPR";
  <Route path="/premium-dpr" element={<PremiumDPR />} />

Important:
This component intentionally reads the same DPR payload/localStorage keys used by the
existing GoSubsidy DPRPreview implementation. It does not replace the financial engine.

If you want /dpr-preview to become the premium screen, change the App.jsx route to:
  <Route path="/dpr-preview" element={<PremiumDPR />} />

Do not remove the existing DPR.jsx calculation/payment flow.
