export function calculateEligibility(payload) {
  const {
    income,
    age,
    category,
    loanAmount,
    schemeType,
  } = payload || {};

  if (!income || !loanAmount || !schemeType) {
    throw new Error("Missing eligibility parameters");
  }

  let score = 50;

  if (income < 200000) score += 30;
  else if (income < 500000) score += 20;
  else score += 5;

  if (["SC", "ST", "OBC", "WOMEN"].includes(category)) {
    score += 10;
  }

  if (loanAmount < 1000000) score += 10;

  if (schemeType === "AGRICULTURE") score += 10;
  if (schemeType === "EDUCATION") score += 8;
  if (schemeType === "HOUSING") score += 6;
  if (schemeType === "MSME") score += 5;

  if (score > 100) score = 100;

  return {
    eligibilityScore: score,
    subsidyPercent: getSubsidyPercent(score),
    eligible: score >= 60,
  };
}

function getSubsidyPercent(score) {
  if (score >= 90) return 40;
  if (score >= 80) return 30;
  if (score >= 70) return 20;
  if (score >= 60) return 10;
  return 0;
}
