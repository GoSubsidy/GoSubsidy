// ============================================================
// GoSubsidy Portal Analytics
// File:
//   frontend/src/services/analytics.js
//
// Tracks:
//   1. Portal page visits
//   2. Portal search submissions
//   3. Logged-in customers
//   4. Anonymous visitors
//   5. Browser sessions
//   6. Search result counts
//
// Database tables:
//   public.portal_visits
//   public.portal_searches
//
// IMPORTANT:
// - Never collects passwords
// - Never collects Razorpay secrets
// - Never collects payment card information
// - Analytics failures NEVER break the website
// ============================================================

import { supabase } from "../lib/supabase";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:4000";

// ============================================================
// CONFIGURATION
// ============================================================

const SESSION_STORAGE_KEY =
  "gosubsidy_analytics_session_id";

const VISIT_PREFIX =
  "gosubsidy_visit:";

// ============================================================
// CREATE / GET ANALYTICS SESSION
// ============================================================

function createSessionId() {
  try {
    if (typeof window === "undefined") {
      return null;
    }

    const existing =
      window.sessionStorage.getItem(
        SESSION_STORAGE_KEY
      );

    if (existing) {
      return existing;
    }

    const newId =
      typeof crypto !== "undefined" &&
      typeof crypto.randomUUID === "function"
        ? crypto.randomUUID()
        : `${Date.now()}-${Math.random()
            .toString(36)
            .slice(2, 12)}`;

    window.sessionStorage.setItem(
      SESSION_STORAGE_KEY,
      newId
    );

    return newId;
  } catch (error) {
    console.warn(
      "[GoSubsidy Analytics] Session storage unavailable:",
      error
    );

    return `fallback-${Date.now()}-${Math.random()
      .toString(36)
      .slice(2, 10)}`;
  }
}

// ============================================================
// GET CURRENT SUPABASE USER
// ============================================================
//
// Returns:
//   user.id       → logged-in customer
//   null          → anonymous visitor
//
// ============================================================

async function getAnalyticsUserId() {
  try {
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();

    if (error) {
      return null;
    }

    return user?.id || null;
  } catch (error) {
    console.warn(
      "[GoSubsidy Analytics] Unable to identify user:",
      error
    );

    return null;
  }
}

// ============================================================
// GET CURRENT PAGE PATH
// ============================================================

function getCurrentPath() {
  if (typeof window === "undefined") {
    return "/";
  }

  return (
    window.location.pathname +
    window.location.search
  );
}

// ============================================================
// NORMALIZE SEARCH QUERY
// ============================================================
//
// Example:
//
// "  Poultry   Subsidy "
// becomes
//
// "poultry subsidy"
//
// This allows the Admin Analytics dashboard to group
// searches correctly.
// ============================================================

function normalizeSearchQuery(value) {
  return String(value || "")
    .trim()
    .replace(/\s+/g, " ")
    .toLowerCase()
    .slice(0, 300);
}

// ============================================================
// SAFE RESULTS COUNT
// ============================================================

function normalizeResultsCount(value) {
  const number = Number(value);

  if (!Number.isFinite(number)) {
    return 0;
  }

  return Math.max(
    0,
    Math.floor(number)
  );
}

// ============================================================
// TRACK PORTAL PAGE VISIT
// ============================================================
//
// Example:
//
// useEffect(() => {
//   trackVisit("Home");
// }, []);
//
// OR:
//
// trackVisit(
//   "Government Schemes",
//   "/schemes"
// );
//
// Duplicate page visits during the SAME browser session
// are prevented.
// ============================================================

export async function trackVisit(
  pageTitle = "",
  pagePath = null
) {
  try {
    if (
      typeof window === "undefined"
    ) {
      return {
        success: false,
        skipped: true,
      };
    }

    const path =
      pagePath || getCurrentPath();

    if (!path) {
      return {
        success: false,
        skipped: true,
      };
    }

    // --------------------------------------------------------
    // Prevent duplicate page tracking in same session
    // --------------------------------------------------------

    const visitKey =
      `${VISIT_PREFIX}${path}`;

    if (
      window.sessionStorage.getItem(
        visitKey
      )
    ) {
      return {
        success: true,
        skipped: true,
      };
    }

    // --------------------------------------------------------
    // Mark immediately
    //
    // This prevents React StrictMode from creating
    // duplicate records.
    // --------------------------------------------------------

    window.sessionStorage.setItem(
      visitKey,
      "1"
    );

    const sessionId = createSessionId();
    const { data: sessionData } =
      await supabase.auth.getSession();
    const accessToken =
      sessionData?.session?.access_token || "";

    // Visit records go through the backend so the server can
    // determine approximate IP-based location without storing
    // the visitor IP in the analytics table.
    const response = await fetch(
      `${API_BASE_URL}/api/analytics/track-visit`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(accessToken
            ? { Authorization: `Bearer ${accessToken}` }
            : {}),
        },
        body: JSON.stringify({
          session_id: sessionId,
          page_path: path,
          page_title:
            pageTitle ||
            document.title ||
            "",
          referrer:
            document.referrer ||
            null,
        }),
      }
    );

    let result = null;
    try {
      result = await response.json();
    } catch {
      result = null;
    }

    if (!response.ok || !result?.success) {
      console.error(
        "[GoSubsidy Analytics] Visit tracking failed:",
        result || response.statusText
      );

      // Remove marker so a later attempt can retry.
      try {
        window.sessionStorage.removeItem(visitKey);
      } catch {
        // Ignore storage errors.
      }

      return {
        success: false,
        error: result || response.statusText,
      };
    }

    return {
      success: true,
    };
  } catch (error) {
    console.error(
      "[GoSubsidy Analytics] Visit tracking error:",
      error
    );

    return {
      success: false,
      error,
    };
  }
}

// ============================================================
// TRACK SEARCH
// ============================================================
//
// IMPORTANT:
// Call this ONLY when the user actually submits a search.
//
// DO NOT call it on every keyboard input.
//
// Example:
//
// await trackSearch(
//   "poultry subsidy",
//   8,
//   "/schemes"
// );
//
// ============================================================

export async function trackSearch(
  searchQuery,
  resultsCount = 0,
  pagePath = null
) {
  try {
    const normalizedQuery =
      normalizeSearchQuery(
        searchQuery
      );

    // --------------------------------------------------------
    // Ignore empty searches
    // --------------------------------------------------------

    if (!normalizedQuery) {
      return {
        success: false,
        skipped: true,
      };
    }

    // --------------------------------------------------------
    // Get logged-in user if available
    // --------------------------------------------------------

    const userId =
      await getAnalyticsUserId();

    // --------------------------------------------------------
    // Normalize result count
    // --------------------------------------------------------

    const safeResultsCount =
      normalizeResultsCount(
        resultsCount
      );

    // --------------------------------------------------------
    // Build payload
    // --------------------------------------------------------

    const payload = {
      user_id: userId,

      session_id:
        createSessionId(),

      // Original user search
      search_query:
        String(searchQuery)
          .trim()
          .slice(0, 300),

      // Normalized version for analytics
      search_query_normalized:
        normalizedQuery,

      // Page where search happened
      page_path:
        pagePath ||
        getCurrentPath(),

      // Number of matching results
      results_count:
        safeResultsCount,
    };

    // --------------------------------------------------------
    // Insert search record
    // --------------------------------------------------------

    const { error } =
      await supabase
        .from("portal_searches")
        .insert(payload);

    if (error) {
      console.error(
        "[GoSubsidy Analytics] Search tracking failed:",
        error
      );

      return {
        success: false,
        error,
      };
    }

    return {
      success: true,
    };
  } catch (error) {
    // --------------------------------------------------------
    // Analytics must NEVER break the actual search.
    // --------------------------------------------------------

    console.error(
      "[GoSubsidy Analytics] Search tracking error:",
      error
    );

    return {
      success: false,
      error,
    };
  }
}

// ============================================================
// FRIENDLY SEARCH HELPER
// ============================================================
//
// This is useful for pages that prefer an object:
//
// await trackPortalSearch({
//   query: "poultry subsidy",
//   resultsCount: 10,
//   pagePath: "/schemes"
// });
//
// ============================================================

export async function trackPortalSearch({
  query,
  resultsCount = 0,
  pagePath = null,
} = {}) {
  return trackSearch(
    query,
    resultsCount,
    pagePath
  );
}

// ============================================================
// TRACK SEARCH WITHOUT RESULT COUNT
// ============================================================
//
// Useful for Home search or AI search where the result count
// may not be available.
//
// Example:
//
// await trackSearchQuery(
//   "PMEGP",
//   "/"
// );
//
// ============================================================

export async function trackSearchQuery(
  query,
  pagePath = null
) {
  return trackSearch(
    query,
    0,
    pagePath
  );
}

// ============================================================
// TRACK A PAGE MANUALLY
// ============================================================
//
// Alias for trackVisit.
//
// Example:
//
// await trackPageVisit(
//   "CIBIL Credit Check",
//   "/cibil"
// );
//
// ============================================================

export async function trackPageVisit(
  pageTitle = "",
  pagePath = null
) {
  return trackVisit(
    pageTitle,
    pagePath
  );
}

// ============================================================
// GET CURRENT ANALYTICS SESSION ID
// ============================================================
//
// Useful later for Admin Analytics.
//
// ============================================================

export function getAnalyticsSessionId() {
  return createSessionId();
}

// ============================================================
// RESET ANALYTICS SESSION
// ============================================================
//
// Development/testing only.
//
// After calling this, the next page visit will be recorded
// again.
//
// ============================================================

export function resetAnalyticsSession() {
  try {
    if (
      typeof window === "undefined"
    ) {
      return;
    }

    // Remove session ID
    window.sessionStorage.removeItem(
      SESSION_STORAGE_KEY
    );

    // Remove all visit markers
    const keysToRemove = [];

    for (
      let index = 0;
      index <
      window.sessionStorage.length;
      index += 1
    ) {
      const key =
        window.sessionStorage.key(
          index
        );

      if (
        key &&
        key.startsWith(
          VISIT_PREFIX
        )
      ) {
        keysToRemove.push(key);
      }
    }

    keysToRemove.forEach(
      (key) => {
        window.sessionStorage.removeItem(
          key
        );
      }
    );

    console.log(
      "[GoSubsidy Analytics] Session reset."
    );
  } catch (error) {
    console.warn(
      "[GoSubsidy Analytics] Unable to reset analytics session:",
      error
    );
  }
}

// ============================================================
// DEFAULT EXPORT
// ============================================================

const analytics = {
  trackVisit,
  trackSearch,
  trackPortalSearch,
  trackSearchQuery,
  trackPageVisit,
  getAnalyticsSessionId,
  resetAnalyticsSession,
};

export default analytics;