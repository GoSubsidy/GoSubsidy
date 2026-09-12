import express from "express";

const router = express.Router();

router.post("/eligibility", (req, res) => {
  const { category, sector, state, investment } = req.body;

  let recommendation = "";

  if (sector?.toLowerCase() === "poultry") {
    recommendation =
      "You may be eligible for NABARD, PMEGP and State Poultry Subsidy.";
  } else if (sector?.toLowerCase() === "dairy") {
    recommendation =
      "You may qualify for Dairy Entrepreneurship schemes.";
  } else if (sector?.toLowerCase() === "education") {
    recommendation =
      "You may qualify for Education Loan Subsidy.";
  } else {
    recommendation =
      "Multiple Central & State Government schemes are available.";
  }

  res.json({
    success: true,
    category,
    sector,
    state,
    investment,
    recommendation,
  });
});

export default router;