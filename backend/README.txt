GOSUBSIDY V5.0 — EXCLUSIVE SCHEME DISCOVERY + HUMAN APPROVAL

REPLACE IN backend/src/services/:
1. schemeDiscovery.service.js
2. schemeStorageSafety.service.js
3. scheme.service.js

WHAT IS FIXED
- Discovery is now scheme-only.
- Contact pages, RTI, compassionate appointment, officer/commissioner lists, IEDS, orders, circulars, minutes, notifications, recruitment, directories and service pages are hard-rejected.
- A page is not accepted merely because it contains the word "scheme".
- Candidate must have programme identity + financial/benefit evidence + at least two independent evidence pillars.
- Final storage repeats the same non-scheme firewall.
- Newly auto-imported discovery rows are PENDING_REVIEW and is_active=false.
- Existing Admin Approve & Publish remains the ONLY publication path.
\IMPORTANT
Keep backups of your current files. Restart backend after replacement.


V5.1 HARDENING
- Added a final exclusive scheme identity gate after verification.
- Rejects generic document/page titles such as Scheme/Guidelines, Guidelines of Scheme, Scheme Details, Scheme Information, Operational Scheme, etc.
- Generic administrative/document pages cannot reach storage or the Admin review queue.
- Existing human approval / pending-review publishing gate remains unchanged.
