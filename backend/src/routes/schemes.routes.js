// ============================================================
// GoSubsidy - Schemes Routes
// backend/src/routes/schemes.routes.js
// ============================================================

import express from "express";
import fs from "fs";
import multer from "multer";
import csv from "csv-parser";

import {
  discoverSchemes,
} from "../services/schemeDiscovery.service.js";

import {
  getAllSchemes,
  getSchemeById,
  createScheme,
  updateScheme,
  deleteScheme,
  importDiscoveredSchemes,
  getPublishedSchemes,
  getPublishedSchemeById,
  approveAndPublishScheme,
  rejectScheme,
} from "../services/scheme.service.js";



const router = express.Router();

// ============================================================
// TEMP UPLOAD CONFIG
// ============================================================

const upload = multer({
  dest: "uploads/",
  limits: {
    fileSize: 20 * 1024 * 1024,
  },
});

// ============================================================
// HELPERS
// ============================================================

function clean(value) {
  if (value === null || value === undefined) {
    return "";
  }

  return String(value).trim();
}

function parseJSON(value, fallback) {
  if (!value) {
    return fallback;
  }

  try {
    return JSON.parse(value);
  } catch {
    return fallback;
  }
}

function parseArray(value) {
  if (!value) {
    return [];
  }

  if (Array.isArray(value)) {
    return value;
  }

  const text = String(value).trim();

  if (!text) {
    return [];
  }

  // JSON array
  if (
    text.startsWith("[") &&
    text.endsWith("]")
  ) {
    try {
      const parsed = JSON.parse(text);

      if (Array.isArray(parsed)) {
        return parsed;
      }
    } catch {
      // continue below
    }
  }

  // Support:
  // item1 | item2
  // item1 ; item2
  // item1, item2

  return text
    .split(/\s*(?:\|\||\||;)\s*/)
    .map((item) => item.trim())
    .filter(Boolean);
}

// ============================================================
// MAP CSV ROW → EXISTING GOSUBSIDY SCHEME DATABASE STRUCTURE
// ============================================================
//
// CSV TEMPLATE:
//
// scheme_name
// short_name
// category
// ministry
// department
// sector
// beneficiary
// description
// status
// official_website
// apply_link
// state
// last_verified
//
// IMPORTANT:
// We DO NOT use "...row".
// Only fields supported by the existing scheme system are sent.
// ============================================================

function mapCsvRowToScheme(row) {
  const schemeName = clean(row.scheme_name);

  return {
    // --------------------------------------------------------
    // CORE
    // --------------------------------------------------------

    scheme_name: schemeName,

    category: clean(row.category),

    ministry: clean(row.ministry),

    department: clean(row.department),

    beneficiary: clean(row.beneficiary),

    sector: clean(row.sector),

    description: clean(row.description),

    // --------------------------------------------------------
    // STATE
    // CSV: state
    // DB: state_applicability
    // --------------------------------------------------------

    state_applicability:
      clean(row.state) || "All India",

    // --------------------------------------------------------
    // WEBSITE
    // --------------------------------------------------------

    official_website:
      clean(row.official_website),

    // --------------------------------------------------------
    // APPLICATION LINK
    //
    // CSV: apply_link
    // DB: official_apply_link
    // --------------------------------------------------------

    official_apply_link:
      clean(row.apply_link),

    // --------------------------------------------------------
    // STATUS
    // --------------------------------------------------------

    status:
      clean(row.status) || "Draft",

    // --------------------------------------------------------
    // EXISTING JSONB FIELDS
    // --------------------------------------------------------

    benefits: [],

    eligibility: {},

    documents: [],

    application: {},

    seo: {},
  };
}

// ============================================================
// PUBLIC CATALOGUE — PUBLISHED ONLY
// ============================================================
// IMPORTANT: This is the public API. Pending/rejected/draft schemes
// are never returned here.
// ============================================================

router.get("/", async (req, res) => {
  try {
    const data = await getPublishedSchemes();

    return res.json(data);
  } catch (error) {
    console.error(
      "GET /schemes error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        error?.message ||
        "Unable to load schemes.",
    });
  }
});
// ============================================================
// ADMIN CATALOGUE — ALL SCHEMES FOR REVIEW
// ============================================================

router.get("/admin/all", async (req, res) => {
  try {
    const data = await getAllSchemes();
    return res.json(data);
  } catch (error) {
    console.error("GET /schemes/admin/all error:", error);
    return res.status(500).json({
      success: false,
      message: error?.message || "Unable to load admin schemes.",
    });
  }
});

// ============================================================
// GOVERNMENT SCHEME DISCOVERY
// ============================================================
//
// GET /schemes/discover
//
// IMPORTANT:
// This is DISCOVERY ONLY.
//
// It does NOT:
// - create schemes
// - update schemes
// - delete schemes
// - modify Supabase
//
// It only scans configured official sources and compares
// discovered schemes against the existing GoSubsidy database.
// ============================================================

router.get("/discover", async (req, res) => {
  try {
    console.log(
      "\n🔎 Government Scheme Discovery requested..."
    );

    const result = await discoverSchemes();

    // GET remains strictly discovery-only.
    // Use POST /schemes/discover/import for guarded storage.

    return res.json(result);
  } catch (error) {
    console.error(
      "❌ Scheme discovery failed:",
      error
    );

    return res.status(500).json({
      success: false,
      mode: "DISCOVERY_ONLY",
      message:
        error?.message ||
        "Scheme discovery failed.",
    });
  }
});

// ============================================================
// GOVERNMENT SCHEME DISCOVERY + GUARDED STORAGE
// ============================================================
//
// POST /schemes/discover/import
//
// V4.5 Discovery
//      ↓
// NEW candidates only
//      ↓
// BLOCK 7 storage safety
//      ↓
// Supabase schemes table
//
// Existing matches, possible matches and rejected candidates
// are never sent to the storage layer.
// ============================================================

router.post("/discover/import", async (req, res) => {
  try {
    console.log(
      "\n🚀 Government Scheme Discovery + Guarded Storage requested..."
    );

    // 1. Run existing V4.5 discovery.
    const discoveryResult =
      await discoverSchemes();

    // 2. Only confirmed NEW candidates enter storage.
    const newCandidates =
      Array.isArray(discoveryResult?.newCandidates)
        ? discoveryResult.newCandidates
        : [];

    // 3. BLOCK 7 performs the final storage safety checks.
    let storageResult = {
      success: true,
      total: 0,
      imported: 0,
      approved: 0,
      rejected: 0,
      data: [],
      rejectedRows: [],
      message:
        "No new scheme candidates were produced by discovery.",
    };

    if (newCandidates.length > 0) {
      storageResult =
        await importDiscoveredSchemes(
          newCandidates
        );
    }

    // 4. Return both discovery and storage results.
    return res.json({
      success:
        discoveryResult?.success !== false &&
        storageResult?.success !== false,

      mode:
        "DISCOVERY_AND_GUARDED_STORAGE",

      discovery: discoveryResult,

      storage: storageResult,

      summary: {
        discoveredNewCandidates:
          newCandidates.length,

        imported:
          storageResult?.imported || 0,

        queuedForReview:
          storageResult?.queuedForReview || storageResult?.imported || 0,

        published: 0,

        approved:
          storageResult?.approved || 0,

        rejected:
          storageResult?.rejected || 0,
      },
    });
  } catch (error) {
    console.error(
      "❌ Scheme discovery + guarded storage failed:",
      error
    );

    return res.status(500).json({
      success: false,
      mode:
        "DISCOVERY_AND_GUARDED_STORAGE",
      message:
        error?.message ||
        "Scheme discovery and guarded storage failed.",
    });
  }
});

// ============================================================
// ADMIN GET SCHEME BY ID — FULL REVIEW DATA
// ============================================================

router.get("/admin/:schemeId", async (req, res) => {
  try {
    const data = await getSchemeById(req.params.schemeId);
    if (!data) {
      return res.status(404).json({ success: false, message: "Scheme not found" });
    }
    return res.json(data);
  } catch (error) {
    return res.status(500).json({ success: false, message: error?.message || "Unable to load scheme." });
  }
});

// ============================================================
// ADMIN APPROVE & PUBLISH
// ============================================================

router.post("/admin/:schemeId/approve", async (req, res) => {
  try {
    const data = await approveAndPublishScheme(req.params.schemeId);
    return res.json({
      success: true,
      message: "Scheme approved and published successfully.",
      data,
    });
  } catch (error) {
    console.error("POST /schemes/admin/:schemeId/approve error:", error);
    return res.status(500).json({
      success: false,
      message: error?.message || "Unable to approve scheme.",
    });
  }
});

// ============================================================
// ADMIN REJECT
// ============================================================

router.post("/admin/:schemeId/reject", async (req, res) => {
  try {
    const data = await rejectScheme(req.params.schemeId);
    return res.json({
      success: true,
      message: "Scheme rejected and kept off the public website.",
      data,
    });
  } catch (error) {
    console.error("POST /schemes/admin/:schemeId/reject error:", error);
    return res.status(500).json({
      success: false,
      message: error?.message || "Unable to reject scheme.",
    });
  }
});

// ============================================================
// PUBLIC GET SCHEME BY ID — PUBLISHED ONLY
// ============================================================
// Keep this AFTER /admin and /discover routes.
// ============================================================

router.get("/:schemeId", async (req, res) => {
  try {
    const data = await getPublishedSchemeById(req.params.schemeId);

    if (!data) {
      return res.status(404).json({
        success: false,
        message: "Scheme not found",
      });
    }

    return res.json(data);
  } catch (error) {
    console.error(
      "GET /schemes/:schemeId error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        error?.message ||
        "Unable to load scheme.",
    });
  }
});

// ============================================================
// CREATE SINGLE SCHEME
// ============================================================

router.post("/", async (req, res) => {
  try {
    const scheme =
      await createScheme(req.body);

    return res.status(201).json({
      success: true,
      message:
        "Scheme created successfully",
      data: scheme,
    });
  } catch (error) {
    console.error(
      "POST /schemes error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        error?.message ||
        "Unable to create scheme.",
    });
  }
});

// ============================================================
// IMPORT CSV / EXCEL
// ============================================================
//
// POST /schemes/import
//
// Frontend sends:
// FormData
// field = file
//
// Supports CSV.
// XLS/XLSX support can be added through the same mapping
// without changing the database logic.
// ============================================================

router.post(
  "/import",
  upload.single("file"),
  async (req, res) => {
    let uploadedFile = null;

    try {
      // ------------------------------------------------------
      // CHECK FILE
      // ------------------------------------------------------

      if (!req.file) {
        return res.status(400).json({
          success: false,
          message:
            "Please select a CSV or Excel file.",
        });
      }

      uploadedFile =
        req.file.path;

      // ------------------------------------------------------
      // CURRENT IMPORT RESULT
      // ------------------------------------------------------

      const result = {
        totalRows: 0,
        imported: 0,
        duplicates: 0,
        invalid: 0,
        failed: 0,
        errors: [],
      };

      // ------------------------------------------------------
      // READ CSV
      // ------------------------------------------------------

      const rows = [];

      await new Promise(
        (resolve, reject) => {
          fs.createReadStream(
            uploadedFile
          )
            .pipe(
              csv({
                mapHeaders: ({
                  header,
                }) =>
                  clean(header)
                    .replace(/^\uFEFF/, ""),
              })
            )
            .on("data", (row) => {
              rows.push(row);
            })
            .on("end", resolve)
            .on("error", reject);
        }
      );

      result.totalRows =
        rows.length;

      // ------------------------------------------------------
      // NO DATA
      // ------------------------------------------------------

      if (rows.length === 0) {
        return res.status(400).json({
          success: false,
          message:
            "The uploaded file contains no scheme rows.",
          summary: result,
        });
      }

      // ------------------------------------------------------
      // EXISTING SCHEMES
      // ------------------------------------------------------

      let existingSchemes = [];

      try {
        existingSchemes =
          await getAllSchemes();
      } catch (error) {
        console.warn(
          "Unable to read existing schemes before import:",
          error?.message
        );

        existingSchemes = [];
      }

      if (
        !Array.isArray(
          existingSchemes
        )
      ) {
        existingSchemes = [];
      }

      // ------------------------------------------------------
      // EXISTING NAME SET
      // ------------------------------------------------------

      const existingNames =
        new Set(
          existingSchemes
            .map(
              (scheme) =>
                clean(
                  scheme?.scheme_name
                ).toLowerCase()
            )
            .filter(Boolean)
        );

      // Prevent duplicates inside
      // the same uploaded file.
      const importedNames =
        new Set();

      // ------------------------------------------------------
      // PROCESS EACH ROW
      // ------------------------------------------------------

      for (
        let index = 0;
        index < rows.length;
        index++
      ) {
        const row =
          rows[index];

        // Excel/CSV row number.
        // Header = row 1.
        const rowNumber =
          index + 2;

        try {
          // --------------------------------------------------
          // REQUIRED FIELD
          // --------------------------------------------------

          const schemeName =
            clean(
              row.scheme_name
            );

          if (!schemeName) {
            result.invalid++;

            result.errors.push({
              row: rowNumber,
              scheme_name: "",
              error:
                "Scheme Name is required.",
            });

            continue;
          }

          // --------------------------------------------------
          // DUPLICATE CHECK
          // --------------------------------------------------

          const normalizedName =
            schemeName.toLowerCase();

          if (
            existingNames.has(
              normalizedName
            ) ||
            importedNames.has(
              normalizedName
            )
          ) {
            result.duplicates++;

            result.errors.push({
              row: rowNumber,
              scheme_name:
                schemeName,
              error:
                "Scheme already exists.",
            });

            continue;
          }

          // --------------------------------------------------
          // MAP CSV → DATABASE
          // --------------------------------------------------

          const schemeData =
            mapCsvRowToScheme(row);

          // --------------------------------------------------
          // FINAL SAFETY CHECK
          // --------------------------------------------------

          if (
            !schemeData.scheme_name
          ) {
            result.invalid++;

            result.errors.push({
              row: rowNumber,
              scheme_name:
                schemeName,
              error:
                "Invalid scheme name.",
            });

            continue;
          }

          // --------------------------------------------------
          // CREATE USING EXISTING SERVICE
          // --------------------------------------------------

          await createScheme(
            schemeData
          );

          // --------------------------------------------------
          // SUCCESS
          // --------------------------------------------------

          result.imported++;

          importedNames.add(
            normalizedName
          );
        } catch (error) {
          // --------------------------------------------------
          // INDIVIDUAL ROW FAILURE
          // --------------------------------------------------

          result.failed++;

          console.error(
            `Failed importing row ${rowNumber}:`,
            error
          );

          result.errors.push({
            row: rowNumber,
            scheme_name:
              clean(
                row.scheme_name
              ),
            error:
              error?.message ||
              "Unknown import error.",
          });
        }
      }

      // ------------------------------------------------------
      // FINAL RESPONSE
      // ------------------------------------------------------

      const hasFailures =
        result.invalid > 0 ||
        result.failed > 0;

      return res.status(
        hasFailures
          ? 207
          : 200
      ).json({
        success:
          result.imported > 0 ||
          result.totalRows === 0,

        message:
          hasFailures
            ? "Scheme import completed with some rejected rows."
            : "Scheme import completed.",

        summary: result,

        // Also expose common names in case
        // frontend expects them.
        totalRows:
          result.totalRows,

        imported:
          result.imported,

        duplicates:
          result.duplicates,

        invalid:
          result.invalid,

        failed:
          result.failed,

        errors:
          result.errors,
      });
    } catch (error) {
      // ------------------------------------------------------
      // IMPORT-LEVEL FAILURE
      // ------------------------------------------------------

      console.error(
        "Scheme import error:",
        error
      );

      return res.status(500).json({
        success: false,
        message:
          error?.message ||
          "Unable to import schemes.",
      });
    } finally {
      // ------------------------------------------------------
      // DELETE TEMPORARY UPLOAD
      // ------------------------------------------------------

      if (
        uploadedFile &&
        fs.existsSync(
          uploadedFile
        )
      ) {
        try {
          fs.unlinkSync(
            uploadedFile
          );
        } catch (cleanupError) {
          console.warn(
            "Unable to remove temporary upload:",
            cleanupError?.message
          );
        }
      }
    }
  }
);

// ============================================================
// UPDATE SCHEME
// ============================================================

router.put(
  "/:schemeId",
  async (req, res) => {
    try {
      const requestedStatus = String(req.body?.status || "").trim().toLowerCase();
      if (["published", "active"].includes(requestedStatus)) {
        return res.status(403).json({
          success: false,
          message: "Direct publishing is blocked. Use Admin → Approve & Publish after review.",
        });
      }

      const scheme =
        await updateScheme(
          req.params.schemeId,
          req.body
        );

      return res.json({
        success: true,
        message:
          "Scheme updated successfully",
        data: scheme,
      });
    } catch (error) {
      console.error(
        "PUT /schemes/:schemeId error:",
        error
      );

      return res.status(500).json({
        success: false,
        message:
          error?.message ||
          "Unable to update scheme.",
      });
    }
  }
);

// ============================================================
// DELETE SCHEME
// ============================================================

router.delete(
  "/:schemeId",
  async (req, res) => {
    try {
      await deleteScheme(
        req.params.schemeId
      );

      return res.json({
        success: true,
        message:
          "Scheme deleted successfully",
      });
    } catch (error) {
      console.error(
        "DELETE /schemes/:schemeId error:",
        error
      );

      return res.status(500).json({
        success: false,
        message:
          error?.message ||
          "Unable to delete scheme.",
      });
    }
  }
);

// ============================================================
// EXPORT
// ============================================================

export default router;