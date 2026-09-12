/* =========================================================
   GOSUBSIDY INSURANCE API CLIENT

   Frontend integration layer for:
   React Frontend
        ↓
   GoSubsidy Backend
        ↓
   Insurance Providers / Partners / VAHAN RC API

   IMPORTANT:
   - Never put insurer API secrets in this file.
   - All insurer credentials stay in backend .env.
========================================================= */

/* =========================================================
   API CONFIGURATION
========================================================= */

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:4000";

const INSURANCE_API = `${API_BASE_URL}/api/insurance`;

/* =========================================================
   INTERNAL FETCH HELPER
========================================================= */

async function insuranceFetch(endpoint, options = {}) {
  const url = `${INSURANCE_API}${endpoint}`;

  const config = {
    method: options.method || "GET",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
    ...options,
  };

  try {
    const response = await fetch(url, config);
    const contentType = response.headers.get("content-type") || "";
    let data;

    if (contentType.includes("application/json")) {
      data = await response.json();
    } else {
      const text = await response.text();
      data = {
        success: response.ok,
        message: text || "Unexpected server response.",
      };
    }

    if (!response.ok) {
      const error = new Error(
        data?.message ||
        data?.error ||
        `Insurance API request failed (${response.status})`
      );
      error.status = response.status;
      error.data = data;
      throw error;
    }

    return data;
  } catch (error) {
    if (error instanceof TypeError) {
      console.error("[Insurance API] Network error:", error);
      const networkError = new Error(
        "Unable to connect to the GoSubsidy insurance server."
      );
      networkError.code = "INSURANCE_NETWORK_ERROR";
      throw networkError;
    }

    console.error("[Insurance API] Request failed:", error);
    throw error;
  }
}

/* =========================================================
   HEALTH / STATUS
========================================================= */

export async function getInsuranceApiHealth() {
  return insuranceFetch("/health");
}

/* =========================================================
   VEHICLE RC LOOKUP (VAHAN / SANDBOX.CO.IN)
========================================================= */

export async function fetchVehicleDetails(vehicleNumber) {
  if (!vehicleNumber) {
    throw new Error("Vehicle registration number is required.");
  }

  const cleanRegNo = String(vehicleNumber)
    .toUpperCase()
    .replace(/[^A-Z0-9]/g, "");

  console.log(`[Insurance API] Looking up vehicle: ${cleanRegNo}`);

  return insuranceFetch("/vehicle-lookup", {
    method: "POST",
    body: JSON.stringify({ vehicleNumber: cleanRegNo }),
  });
}

/* =========================================================
   REQUEST INSURANCE QUOTES
========================================================= */

export async function requestInsuranceQuotes({
  reference,
  insuranceType,
  lead,
  ...additionalData
}) {
  if (!insuranceType) {
    throw new Error("Insurance type is required.");
  }

  if (!lead) {
    throw new Error("Customer information is required.");
  }

  const finalReference = reference || createInsuranceReference();

  const payload = {
    reference: finalReference,
    insuranceType,
    lead,
    ...additionalData,
  };

  console.log("[Insurance API] Requesting quotes:", {
    reference: finalReference,
    insuranceType,
  });

  const response = await insuranceFetch("/quotes", {
    method: "POST",
    body: JSON.stringify(payload),
  });

  if (!response || response.success !== true) {
    throw new Error(
      response?.message || "Unable to retrieve insurance quotes."
    );
  }

  return {
    success: true,
    requestId: response.requestId || null,
    reference: response.reference || finalReference,
    insuranceType: response.insuranceType || insuranceType,
    quotes: Array.isArray(response.quotes) ? response.quotes : [],
    providers: response.providers || {
      requested: 0,
      successful: 0,
      failed: 0,
    },
    providerResults: Array.isArray(response.providerResults)
      ? response.providerResults
      : [],
    duration: response.duration ?? null,
    generatedAt: response.generatedAt || new Date().toISOString(),
  };
}

/* =========================================================
   CREATE PROVIDER JOURNEY
========================================================= */

export async function createInsuranceJourney({
  reference,
  quoteId,
  insuranceType,
  lead,
  metadata,
}) {
  if (!reference) {
    throw new Error("Insurance reference is required.");
  }

  if (!quoteId) {
    throw new Error("Quote ID is required.");
  }

  const payload = {
    reference,
    quoteId,
    insuranceType: insuranceType || null,
    lead: lead || null,
    metadata: metadata || {},
  };

  return insuranceFetch("/journey", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

/* =========================================================
   GET QUOTE
========================================================= */

export async function getInsuranceQuote(quoteId) {
  if (!quoteId) {
    throw new Error("Quote ID is required.");
  }

  return insuranceFetch(`/quotes/${encodeURIComponent(quoteId)}`);
}

/* =========================================================
   CREATE GOSUBSIDY INSURANCE REFERENCE
========================================================= */

export function createInsuranceReference() {
  const timestamp = Date.now().toString().slice(-8);
  const random = Math.random().toString(36).substring(2, 7).toUpperCase();
  return `GI-${timestamp}-${random}`;
}

/* =========================================================
   SESSION STORAGE HELPERS
========================================================= */

const QUOTE_SESSION_KEY = "gosubsidy_insurance_quote_session";

export function saveInsuranceQuoteSession(data) {
  if (!data) return;

  try {
    sessionStorage.setItem(QUOTE_SESSION_KEY, JSON.stringify(data));
  } catch (error) {
    console.warn("[Insurance API] Unable to save quote session:", error);
  }
}

export function getInsuranceQuoteSession() {
  try {
    const value = sessionStorage.getItem(QUOTE_SESSION_KEY);
    return value ? JSON.parse(value) : null;
  } catch (error) {
    console.warn("[Insurance API] Unable to read quote session:", error);
    return null;
  }
}

export function clearInsuranceQuoteSession() {
  try {
    sessionStorage.removeItem(QUOTE_SESSION_KEY);
  } catch (error) {
    console.warn("[Insurance API] Unable to clear quote session:", error);
  }
}

export async function generateInsuranceQuotes(quoteRequest) {
  const result = await requestInsuranceQuotes(quoteRequest);

  saveInsuranceQuoteSession({
    ...result,
    lead: quoteRequest.lead || null,
  });

  return result;
}

/* =========================================================
   DEFAULT EXPORT
========================================================= */

const insuranceApi = {
  getInsuranceApiHealth,
  fetchVehicleDetails,
  requestInsuranceQuotes,
  generateInsuranceQuotes,
  createInsuranceJourney,
  getInsuranceQuote,
  createInsuranceReference,
  saveInsuranceQuoteSession,
  getInsuranceQuoteSession,
  clearInsuranceQuoteSession,
};

export default insuranceApi;