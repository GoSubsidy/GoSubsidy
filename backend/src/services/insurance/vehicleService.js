// backend/services/insurance/vehicleService.js
import axios from "axios";
import supabase from "../../../utils/supabase.js";

const SANDBOX_BASE_URL = process.env.SANDBOX_BASE_URL || "https://api.sandbox.co.in";
let cachedAccessToken = null;
let tokenExpiresAt = null;

// Authenticate and get JWT Access Token
async function getSandboxToken() {
  if (cachedAccessToken && tokenExpiresAt && Date.now() < tokenExpiresAt) {
    return cachedAccessToken;
  }

  const res = await axios.post(
    `${SANDBOX_BASE_URL}/authenticate`,
    {},
    {
      headers: {
        "x-api-key": process.env.SANDBOX_API_KEY,
        "x-api-secret": process.env.SANDBOX_API_SECRET,
        "x-api-version": "1.0.0",
      },
    }
  );

  cachedAccessToken = res.data.data.access_token;
  tokenExpiresAt = Date.now() + 23 * 60 * 60 * 1000; // 24hr validity
  return cachedAccessToken;
}

export async function fetchVehicleDetails(vehicleNumber) {
  const cleanRegNo = vehicleNumber.toUpperCase().replace(/[^A-Z0-9]/g, "");

  // 1. Check local Supabase database cache first (saves API costs)
  if (supabase) {
    const { data: cached } = await supabase
      .from("vehicle_rc_cache")
      .select("*")
      .eq("registration_number", cleanRegNo)
      .maybeSingle();

    if (cached?.raw_data) {
      return { success: true, source: "cache", data: cached.raw_data };
    }
  }

  // 2. Call Sandbox.co.in API
  try {
    const token = await getSandboxToken();
    const response = await axios.post(
      `${SANDBOX_BASE_URL}/kyc/vehicle/rc-search`,
      { reg_no: cleanRegNo },
      {
        headers: {
          "x-api-key": process.env.SANDBOX_API_KEY,
          authorization: token,
          "x-api-version": "1.0",
          "Content-Type": "application/json",
        },
      }
    );

    const rcData = response.data.data;

    // Normalize for frontend
    const normalized = {
      title: rcData.maker_model || rcData.brand_name || "Vehicle",
      subtitle: cleanRegNo,
      logo: (rcData.maker_model || "V").charAt(0).toUpperCase(),
      logoColor: "#0077e6",
      specs: [
        { label: "Fuel Type", value: rcData.fuel_type || "Petrol" },
        { label: "Variant", value: rcData.variant || rcData.body_type || "Standard" },
        { label: "Registration Year", value: rcData.manufacturing_date || rcData.registration_date?.split("-")[0] || "N/A" },
        { label: "RTO City", value: rcData.registered_at || "RTO Office" },
      ],
      expiryDate: rcData.insurance_validity || "Expired",
    };

    // Save to Cache
    if (supabase) {
      await supabase.from("vehicle_rc_cache").upsert({
        registration_number: cleanRegNo,
        raw_data: normalized,
        updated_at: new Date().toISOString(),
      });
    }

    return { success: true, source: "sandbox", data: normalized };
  } catch (error) {
    console.error("[Vehicle RC API] Sandbox error:", error.response?.data || error.message);
    return { success: false, fallback: true };
  }
}