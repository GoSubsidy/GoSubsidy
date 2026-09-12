// mobile_expo/src/api/client.js

// <-- CORRECT relative import from src/screens -> src/config.js
import { BRAND_COLOR } from "../config";

/**
 * Small wrapper helpers for the demo app.
 * Uses fetch so no extra dependency needed.
 */

async function request(path, opts = {}) {
  const url = `${API_BASE}${path}`;
  const headers = Object.assign({ "Content-Type": "application/json" }, opts.headers || {});
  const cfg = Object.assign({}, opts, { headers });
  if (cfg.body && typeof cfg.body !== "string") cfg.body = JSON.stringify(cfg.body);
  const res = await fetch(url, cfg);
  const text = await res.text();
  let json = null;
  try { json = JSON.parse(text); } catch (e) { json = text; }
  if (!res.ok) {
    const err = new Error(`HTTP ${res.status}: ${res.statusText}`);
    err.status = res.status;
    err.body = json;
    throw err;
  }
  return json;
}

/* Example: fetch list of products (loans, cards, insurance etc)
   Your backend /v1/products should return JSON array */
export async function getProducts() {
  return await request("/v1/products");
}

/* Example: fetch a single product by id */
export async function getProduct(id) {
  return await request(`/v1/products/${encodeURIComponent(id)}`);
}

/* Subsidies: list and single */
export async function getSubsidies() {
  return await request("/v1/subsidies");
}
export async function getSubsidy(id) {
  return await request(`/v1/subsidies/${encodeURIComponent(id)}`);
}

/* AI query (if your backend exposes it) */
export async function aiQuery(query) {
  return await request("/v1/ai/query", { method: "POST", body: { query } });
}

/* Post application / lead */
export async function postApplication(payload) {
  // payload should be { scheme_id, subsidy_id, name, phone, email, recommended_loan, ... }
  return await request("/v1/applications", { method: "POST", body: payload });
}

/* Small helper for debugging raw backend response if needed */
export async function raw(path) {
  const url = `${API_BASE}${path}`;
  const r = await fetch(url);
  return { status: r.status, bodyText: await r.text() };
}

export default {
  request,
  getProducts,
  getProduct,
  getSubsidies,
  getSubsidy,
  aiQuery,
  postApplication,
  raw
};
