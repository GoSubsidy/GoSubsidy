// ==========================================================================
//  config.js  (place inside: mobile_expo/src/config.js)
// ==========================================================================

// Your backend base URL (your laptop's IPv4 address + port)
export const API_BASE = "http://192.168.1.5:4000";

// Brand theme color used in UI
export const BRAND_COLOR = "#1976D2";

// Centralized API endpoints used across the app
export const ENDPOINTS = {
  AI_QUERY: `${API_BASE}/v1/ai/query`,          // AI assistant endpoint
  SCHEMES: `${API_BASE}/v1/schemes`,            // Scheme list
  SUBSIDIES: `${API_BASE}/v1/subsidies`,        // Subsidy list
  SUBSIDY_DETAIL: `${API_BASE}/v1/subsidies/`,  // Append subsidy_id when needed
  APPLY: `${API_BASE}/v1/apply`,                // Application form submit
};

// App-wide toast theme
export const TOAST_THEME = {
  backgroundColor: "#333",
  textColor: "#fff",
  accent: BRAND_COLOR,
};

// Default export safety fallback
export default {
  API_BASE,
  BRAND_COLOR,
  ENDPOINTS,
  TOAST_THEME,
};
