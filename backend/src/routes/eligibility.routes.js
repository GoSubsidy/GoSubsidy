import express from "express";

const router = express.Router();

// ===============================
// Test Route
// ===============================
router.get("/test", (req, res) => {
  res.json({
    success: true,
    message: "Eligibility API is working."
  });
});

// ===============================
// AI Eligibility Check
// ===============================
router.post("/eligibility", (req, res) => {
  const { category, sector, state, investment } = req.body;

  let recommendation = "";
  let schemes = [];

  switch ((sector || "").toLowerCase()) {
    case "education":
      recommendation = "You are eligible for Education Loan Subsidy.";
      schemes = [
        {
          id: "EDU_001",
          name: "Education Loan Subsidy",
          benefit: "Up to ₹5,00,000"
        }
      ];
      break;

    case "poultry":
      recommendation = "You may be eligible for Poultry Farm Subsidy.";
      schemes = [
        {
          id: "POULTRY_001",
          name: "Poultry Farm Subsidy",
          benefit: "35% Capital Subsidy"
        }
      ];
      break;

    case "dairy":
      recommendation = "You may qualify for Dairy Development Scheme.";
      schemes = [
        {
          id: "DAIRY_001",
          name: "Dairy Development Scheme",
          benefit: "Up to 50% Subsidy"
        }
      ];
      break;

    default:
      recommendation =
        "Multiple Central & State Government schemes are available.";
      schemes = [];
  }

  res.json({
    success: true,
    input: {
      category,
      sector,
      state,
      investment
    },
    recommendation,
    schemes
  });
});

export default router;