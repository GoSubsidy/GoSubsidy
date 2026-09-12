// backend/routes/applications.js
const express = require("express");
const router = express.Router();
const fs = require("fs");
const DATA = "./data/applications.json";
const SCHEMES_FILE = "./data/schemes.json";
const PRODUCTS_FILE = "./data/products.json";
const { Parser } = require("json2csv"); // add small helper (we'll avoid installing by simple fallback if missing)

// helper read/write
function readData() {
  if (!fs.existsSync(DATA)) fs.writeFileSync(DATA, "[]");
  return JSON.parse(fs.readFileSync(DATA, "utf8"));
}
function writeData(arr) {
  fs.writeFileSync(DATA, JSON.stringify(arr, null, 2));
}

router.get("/", (req, res) => {
  const adminKey = req.query.admin_key || "";
  if (adminKey !== "letmein") return res.status(401).json({ error: "Unauthorized (admin_key required)"});
  const list = readData();
  res.json(list);
});

// CSV export grouped by scheme/subsidy
router.get("/export", (req, res) => {
  const adminKey = req.query.admin_key || "";
  if (adminKey !== "letmein") return res.status(401).json({ error: "Unauthorized (admin_key required)"});
  const list = readData();

  // enrich apps with scheme/subsidy titles from schemes.json
  let schemes = [];
  if (fs.existsSync(SCHEMES_FILE)) {
    try { schemes = JSON.parse(fs.readFileSync(SCHEMES_FILE,"utf8")); } catch(e){ schemes = []; }
  }
  const getSchemeTitle = id => {
    const s = schemes.find(x => x.id === id); return s ? s.title : "";
  };
  const getSubsidy = (schemeId, subsidyId) => {
    const s = schemes.find(x => x.id === schemeId);
    if (!s || !s.subsidies) return null;
    return s.subsidies.find(x => x.id === subsidyId) || null;
  };

  // convert to CSV rows
  const rows = list.map(app => {
    const subsidyObj = getSubsidy(app.scheme_id, app.subsidy_id);
    return {
      application_id: app.id,
      created_at: app.created_at,
      type: app.type,
      scheme_id: app.scheme_id || "",
      scheme_title: getSchemeTitle(app.scheme_id) || "",
      subsidy_id: app.subsidy_id || "",
      subsidy_name: subsidyObj ? subsidyObj.name : "",
      name: app.name || "",
      phone: app.phone || "",
      email: app.email || "",
      loan_amount: app.loan_amount || app.recommended_loan || "",
      status: app.status || "",
      notes: app.notes || ""
    };
  });

  // Build CSV manually to avoid extra dependency
  const fields = Object.keys(rows[0] || {
    application_id: "", created_at: "", type: "", scheme_id: "", scheme_title: "", subsidy_id: "", subsidy_name: "",
    name: "", phone: "", email: "", loan_amount: "", status: "", notes: ""
  });

  const csvLines = [];
  csvLines.push(fields.join(","));
  for (const r of rows) {
    const line = fields.map(f => {
      let v = r[f] === null || r[f] === undefined ? "" : String(r[f]);
      // escape quotes and commas
      v = v.replace(/"/g, '""');
      if (v.includes(",") || v.includes("\n")) v = `"${v}"`;
      return v;
    }).join(",");
    csvLines.push(line);
  }
  const csv = csvLines.join("\n");

  // Return CSV with headers so browser will download it
  const filename = `applications_export_${Date.now()}.csv`;
  res.setHeader("Content-Disposition", `attachment; filename="${filename}"`);
  res.setHeader("Content-Type", "text/csv");
  res.send(csv);
});

router.post("/", (req, res) => {
  const payload = req.body || {};
  const list = readData();
  const id = "app_" + Date.now();
  const entry = {
    id,
    type: payload.type || "subsidy",
    product_id: payload.product_id || null,
    scheme_id: payload.scheme_id || null,
    subsidy_id: payload.subsidy_id || null,
    name: payload.name || null,
    phone: payload.phone || null,
    email: payload.email || null,
    address: payload.address || null,
    income: payload.income || null,
    loan_amount: payload.loan_amount || payload.recommended_loan || null,
    recommended_loan: payload.recommended_loan || null,
    documents: payload.documents || [],
    status: "new",
    created_at: new Date().toISOString(),
    notes: payload.notes || ""
  };
  list.push(entry);
  writeData(list);
  res.json({ id: entry.id, status: entry.status });
});

module.exports = router;
