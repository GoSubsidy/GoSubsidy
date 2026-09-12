# GoSubsidy Premium Access

Files included:
- PremiumGate.jsx
- PaymentModal.jsx
- premiumProducts.js
- entitlementService.js
- Supabase premium_access.sql

Prices:
- CIBIL Intelligence: ₹99 / 30 days
- Subsidy Calculator Pro: ₹49 / 30 days
- DPR Intelligence: ₹499 / 30 days

IMPORTANT:
The included payment action is DEMO MODE. It stores a local entitlement so
you can test the UI immediately. Do not use this as production payment proof.

Production flow:
Browser -> backend/Edge Function -> create Razorpay order -> Razorpay Checkout
-> backend signature verification -> user_entitlements row -> premium access.

Never trust localStorage or a frontend payment flag in production.
