/* ===========================================================
   GoSubsidy Insurance API
=========================================================== */

const API_BASE_URL = "http://localhost:4000";

/* ===========================================================
   HEALTH
=========================================================== */

export async function insuranceHealth() {
  const response = await fetch(
    `${API_BASE_URL}/api/insurance/health`
  );

  if (!response.ok) {
    throw new Error("Insurance service unavailable");
  }

  return response.json();
}

/* ===========================================================
   PROVIDERS
=========================================================== */

export async function getProviders() {
  const response = await fetch(
    `${API_BASE_URL}/api/insurance/providers`
  );

  if (!response.ok) {
    throw new Error("Failed to load providers");
  }

  return response.json();
}

/* ===========================================================
   GET LIVE QUOTES
=========================================================== */

export async function getInsuranceQuotes(payload) {
  const response = await fetch(
    `${API_BASE_URL}/api/insurance/quotes`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    }
  );

  if (!response.ok) {
    const error = await response.text();
    throw new Error(error || "Failed to fetch insurance quotes");
  }

  return response.json();
}

/* ===========================================================
   CREATE INSURANCE JOURNEY
=========================================================== */

export async function createInsuranceQuote(payload) {
  const response = await fetch(
    `${API_BASE_URL}/api/insurance/journey`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    }
  );

  if (!response.ok) {
    const error = await response.text();
    throw new Error(error || "Failed to create insurance journey");
  }

  return response.json();
}