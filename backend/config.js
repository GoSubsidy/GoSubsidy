// config.js (ROOT LEVEL)
// Backend base URL (your laptop IP + backend port)
export const API_BASE = "http://192.168.1.5:4000";

// Brand theme color
export const BRAND_COLOR = "#1976D2";

// Toast theme used across app
export const TOAST_THEME = {
  backgroundColor: "#333",
  textColor: "#fff",
  accent: BRAND_COLOR,
};

// Centralized endpoints
export const ENDPOINTS = {
  AI_QUERY: `${API_BASE}/v1/ai/query`,
  SCHEMES: `${API_BASE}/v1/schemes`,
  SUBSIDIES: `${API_BASE}/v1/subsidies`,
  APPLY: `${API_BASE}/v1/apply`,
};

// Default export fallback
export default {
  API_BASE,
  BRAND_COLOR,
  TOAST_THEME,
  ENDPOINTS,
};
