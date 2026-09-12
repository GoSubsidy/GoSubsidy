// ==========================================================================
//  config.js  (mobile_expo/src/config.js)
// ==========================================================================

// Change ONLY this when backend IP/port changes
const DEV_API_BASE = "http://192.168.1.5:4000";
const PROD_API_BASE = "https://api.yourdomain.com"; // future use

export const API_BASE = __DEV__ ? DEV_API_BASE : PROD_API_BASE;

// Brand theme color
export const BRAND_COLOR = "#1976D2";

// Centralized API endpoints
export const ENDPOINTS = {
  AI_QUERY: `${API_BASE}/v1/ai/query`,
  SCHEMES: `${API_BASE}/v1/schemes`,
  SUBSIDIES: `${API_BASE}/v1/subsidies`,
  SUBSIDY_DETAIL: (id) => `${API_BASE}/v1/subsidies/${id}`,
  APPLY: `${API_BASE}/v1/apply`,
};

// App-wide toast theme
export const TOAST_THEME = {
  backgroundColor: "#333",
  textColor: "#fff",
  accent: BRAND_COLOR,
};

// Default export (optional but safe)
export default {
  API_BASE,
  BRAND_COLOR,
  ENDPOINTS,
  TOAST_THEME,
};
