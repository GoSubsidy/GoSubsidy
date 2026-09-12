const express = require("express");
const router = express.Router();

router.post("/eligibility", (req, res) => {
  const { category, sector, state, investment } = req.body;

  let advice = "";

  if (sector.toLowerCase() === "poultry") {
    advice = "You may be eligible for NABARD, PMEGP and State Poultry Subsidy.";
  } else if (sector.toLowerCase() === "dairy") {
    advice = "You may qualify for Dairy Entrepreneurship schemes.";
  } else if (sector.toLowerCase() === "education") {
    advice = "You may qualify for Education Loan Subsidy.";
  } else {
    advice = "Multiple Central & State schemes are available.";
  }

  res.json({
    success: true,
    recommendation: advice
  });
});

module.exports = router;