GoSubsidy - HUMAN APPROVAL / PUBLISHING GATE
============================================

PURPOSE
-------
Automatic scheme discovery can NEVER publish a scheme.
Every newly discovered scheme is stored with:
    status = PENDING_REVIEW
    is_active = false

Only the Admin "Approve & Publish" action changes it to:
    status = Published
    is_active = true

PUBLIC API SAFETY
-----------------
GET /schemes
GET /schemes/:schemeId

Both public endpoints return ONLY Published/Active schemes.
Pending, Draft and Rejected schemes are hidden from the public website.

ADMIN REVIEW API
----------------
GET  /schemes/admin/all
GET  /schemes/admin/:schemeId
POST /schemes/admin/:schemeId/approve
POST /schemes/admin/:schemeId/reject

DIRECT PUBLISHING BLOCK
-----------------------
PUT /schemes/:schemeId cannot change a non-public scheme to Published/Active.
It returns HTTP 403 and instructs the admin to use Approve & Publish.

FILES IN THIS PACKAGE
---------------------
1. backend/src/services/scheme.service.js
2. backend/src/routes/schemes.routes.js
3. frontend/src/pages/admin/Schemes.jsx
4. frontend/src/api.js
5. frontend/src/SchemeDetails.jsx
6. frontend/src/EditScheme.jsx

IMPORTANT
---------
This package does NOT require a new database table or new database column.
It uses the existing schemes.status and schemes.is_active fields.

BACKUP
------
Before replacing files, copy your current files to a backup folder.

INSTALL
-------
Replace the matching files in your project using the paths above.
Then restart the backend and frontend.

EXPECTED WORKFLOW
-----------------
Discovery -> Verification -> Duplicate/Safety Gate -> PENDING_REVIEW
                                              |
                                              v
                                      Admin Review Screen
                                        /          \
                                     Reject      Approve & Publish
                                       |               |
                                   REJECTED        PUBLISHED
                                       |               |
                                  Public hidden     Public visible
