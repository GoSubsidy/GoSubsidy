import "dotenv/config";
import express from "express";
import { createClient } from "@supabase/supabase-js";

const router = express.Router();

const supabaseAdmin =
  process.env.SUPABASE_URL &&
  process.env.SUPABASE_SERVICE_ROLE_KEY
    ? createClient(
        process.env.SUPABASE_URL,
        process.env.SUPABASE_SERVICE_ROLE_KEY,
        {
          auth: {
            persistSession: false,
            autoRefreshToken: false,
          },
        }
      )
    : null;

function getClientIp(req) {
  const forwarded = String(
    req.headers["x-forwarded-for"] || ""
  )
    .split(",")[0]
    .trim();

  const raw =
    req.headers["cf-connecting-ip"] ||
    forwarded ||
    req.headers["x-real-ip"] ||
    req.socket?.remoteAddress ||
    "";

  return String(raw)
    .trim()
    .replace(/^::ffff:/, "");
}

function isPrivateOrLocalIp(ip) {
  if (!ip) return true;

  if (
    ip === "127.0.0.1" ||
    ip === "::1" ||
    ip === "localhost"
  ) {
    return true;
  }

  if (
    /^10\./.test(ip) ||
    /^192\.168\./.test(ip) ||
    /^172\.(1[6-9]|2\d|3[0-1])\./.test(ip)
  ) {
    return true;
  }

  return false;
}

async function getAuthenticatedUser(req) {
  if (!supabaseAdmin) return null;

  const authorization = String(
    req.headers.authorization || ""
  );

  if (!authorization.startsWith("Bearer ")) {
    return null;
  }

  const accessToken = authorization
    .slice(7)
    .trim();

  if (!accessToken) return null;

  const {
    data: { user },
    error,
  } = await supabaseAdmin.auth.getUser(accessToken);

  if (error || !user) return null;

  return user;
}

async function requireAdmin(req, res) {
  if (!supabaseAdmin) {
    res.status(500).json({
      success: false,
      message:
        "Supabase server configuration is missing.",
    });
    return null;
  }

  const user = await getAuthenticatedUser(req);

  if (!user) {
    res.status(401).json({
      success: false,
      message: "Admin authentication required.",
    });
    return null;
  }

  const { data: profile, error } =
    await supabaseAdmin
      .from("profiles")
      .select("is_admin, role")
      .eq("id", user.id)
      .maybeSingle();

  if (error) {
    console.error(
      "[Analytics] Admin profile check failed:",
      error
    );
    res.status(500).json({
      success: false,
      message: "Unable to verify admin access.",
    });
    return null;
  }

  const role = String(
    profile?.role || ""
  ).toLowerCase();

  const isAdmin =
    profile?.is_admin === true ||
    role === "admin" ||
    role === "administrator";

  if (!isAdmin) {
    res.status(403).json({
      success: false,
      message: "Analytics access denied.",
    });
    return null;
  }

  return user;
}

async function lookupLocation(ip) {
  const fallbackCountryCode = String(
    process.env.DEFAULT_ANALYTICS_COUNTRY_CODE || ""
  ).trim();

  if (isPrivateOrLocalIp(ip)) {
    return {
      city: "Localhost",
      state: "Local Development",
      country: "Local Development",
      country_code: "LOCAL",
    };
  }

  const controller = new AbortController();
  const timeout = setTimeout(
    () => controller.abort(),
    4000
  );

  try {
    const response = await fetch(
      `https://ipapi.co/${encodeURIComponent(ip)}/json/`,
      {
        headers: {
          Accept: "application/json",
          "User-Agent": "GoSubsidy-Analytics/1.0",
        },
        signal: controller.signal,
      }
    );

    if (!response.ok) {
      throw new Error(
        `Geo lookup failed (${response.status})`
      );
    }

    const data = await response.json();

    return {
      city:
        String(data?.city || "").trim() || null,
      state:
        String(data?.region || "").trim() || null,
      country:
        String(data?.country_name || "").trim() || null,
      country_code:
        String(
          data?.country_code || fallbackCountryCode
        )
          .trim()
          .toUpperCase() || null,
    };
  } catch (error) {
    console.warn(
      "[GoSubsidy Analytics] Location lookup failed:",
      error?.message || error
    );

    return {
      city: null,
      state: null,
      country: null,
      country_code: fallbackCountryCode || null,
    };
  } finally {
    clearTimeout(timeout);
  }
}

// ============================================================
// POST /api/analytics/track-visit
// Public endpoint. It never stores the visitor IP address.
// ============================================================
router.post("/track-visit", async (req, res) => {
  try {
    if (!supabaseAdmin) {
      return res.status(500).json({
        success: false,
        message:
          "Supabase server configuration is missing.",
      });
    }

    const {
      session_id,
      page_path,
      page_title,
      referrer,
    } = req.body || {};

    if (!session_id || !page_path) {
      return res.status(400).json({
        success: false,
        message:
          "session_id and page_path are required.",
      });
    }

    const user = await getAuthenticatedUser(req);
    const ip = getClientIp(req);
    const location = await lookupLocation(ip);

    const payload = {
      user_id: user?.id || null,
      session_id: String(session_id).slice(0, 120),
      page_path: String(page_path).slice(0, 500),
      page_title: String(page_title || "").slice(
        0,
        300
      ),
      referrer: referrer
        ? String(referrer).slice(0, 1000)
        : null,
      city: location.city,
      state: location.state,
      country: location.country,
      country_code: location.country_code,
    };

    const { error } = await supabaseAdmin
      .from("portal_visits")
      .insert(payload);

    if (error) {
      console.error(
        "[GoSubsidy Analytics] Visit insert failed:",
        error
      );

      return res.status(500).json({
        success: false,
        message: "Unable to save analytics visit.",
      });
    }

    return res.json({
      success: true,
      location: {
        city: location.city,
        state: location.state,
        country: location.country,
        country_code: location.country_code,
      },
    });
  } catch (error) {
    console.error(
      "[GoSubsidy Analytics] Track visit error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Analytics visit tracking failed.",
    });
  }
});

// ============================================================
// GET /api/analytics/locations?days=7
// Admin-only location aggregation.
// ============================================================
router.get("/locations", async (req, res) => {
  try {
    const admin = await requireAdmin(req, res);
    if (!admin) return;

    const days = Math.min(
      90,
      Math.max(1, Number(req.query.days) || 7)
    );

    const since = new Date(
      Date.now() - days * 24 * 60 * 60 * 1000
    ).toISOString();

    const { data, error } =
      await supabaseAdmin
        .from("portal_visits")
        .select(
          "city, state, country, country_code, page_path, created_at, session_id"
        )
        .gte("created_at", since)
        .order("created_at", {
          ascending: false,
        })
        .limit(20000);

    if (error) {
      throw error;
    }

    const rows = Array.isArray(data) ? data : [];

    const aggregate = (keyFields) => {
      const map = new Map();

      rows.forEach((row) => {
        const values = keyFields.map((key) =>
          String(row?.[key] || "")
            .trim()
        );

        if (!values[0]) return;

        const key = values
          .map((value) => value.toLowerCase())
          .join("|");

        const existing = map.get(key) || {
          visits: 0,
        };

        keyFields.forEach((field, index) => {
          existing[field] = values[index];
        });

        existing.visits += 1;
        map.set(key, existing);
      });

      return Array.from(map.values())
        .sort((a, b) => b.visits - a.visits)
        .slice(0, 25);
    };

    const recentVisits = rows
      .filter(
        (row) =>
          row.city ||
          row.state ||
          row.country
      )
      .slice(0, 30)
      .map((row) => ({
        city: row.city || "Unknown",
        state: row.state || "Unknown",
        country: row.country || "Unknown",
        country_code:
          row.country_code || null,
        page_path: row.page_path || "/",
        created_at: row.created_at,
      }));

    return res.json({
      success: true,
      period_days: days,
      total_location_visits: rows.filter(
        (row) =>
          row.city ||
          row.state ||
          row.country
      ).length,
      countries: aggregate(["country", "country_code"]),
      states: aggregate(["state", "country"]),
      cities: aggregate([
        "city",
        "state",
        "country",
      ]),
      recent_visits: recentVisits,
    });
  } catch (error) {
    console.error(
      "[GoSubsidy Analytics] Location analytics error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        error?.message ||
        "Unable to load location analytics.",
    });
  }
});

export default router;
