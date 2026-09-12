// ============================================
// GoSubsidy API Service
// ============================================

const API_BASE_URL = "http://localhost:4000";

// ============================================
// Generic Request Helper
// ============================================

async function request(endpoint, options = {}) {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
    ...options,
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Request failed");
  }

  return data;
}

// ============================================
// GET ALL SCHEMES
// ============================================

export async function fetchSchemes() {
  return request("/schemes");
}

// ============================================
// GET SCHEME BY ID
// ============================================

export async function fetchScheme(id) {
  return request(`/schemes/${id}`);
}

// Alias
export const fetchSchemeById = fetchScheme;

// ============================================
// CREATE SCHEME
// ============================================

export async function createScheme(payload) {
  return request("/schemes", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

// ============================================
// UPDATE SCHEME
// ============================================

export async function updateScheme(id, payload) {
  return request(`/schemes/${id}`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });
}

// ============================================
// DELETE SCHEME
// ============================================

export async function deleteScheme(id) {
  return request(`/schemes/${id}`, {
    method: "DELETE",
  });
}

// ============================================
// AI ELIGIBILITY CHECK
// ============================================

export async function checkEligibility(formData) {
  return request("/ai/eligibility", {
    method: "POST",
    body: JSON.stringify(formData),
  });
}

// ============================================
// GENERIC POST
// ============================================

export async function post(endpoint, body) {
  return request(endpoint, {
    method: "POST",
    body: JSON.stringify(body),
  });
}