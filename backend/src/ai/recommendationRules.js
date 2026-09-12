function runRules(context = {}) {
  const insights = [];

  const category = String(context.category || "").toLowerCase();
  const sector = String(
    context.sector ||
    context.business ||
    context.businessType ||
    ""
  ).toLowerCase();

  const state = String(context.state || "").toLowerCase();

  const projectCost = Number(
    context.projectCost ||
    context.investment ||
    context.project_cost ||
    0
  );

  const combined = `${category} ${sector}`;

  // Agriculture
  if (
    combined.includes("agriculture") ||
    combined.includes("farmer") ||
    combined.includes("farming")
  ) {
    insights.push(
      "Agriculture-related project detected. Check agriculture infrastructure, farm mechanisation, post-harvest and farmer support schemes."
    );
  }

  // Poultry
  if (
    combined.includes("poultry") ||
    combined.includes("broiler") ||
    combined.includes("layer")
  ) {
    insights.push(
      "Poultry project detected. Check livestock, poultry infrastructure, agriculture infrastructure and eligible credit-linked schemes."
    );
  }

  // Dairy
  if (
    combined.includes("dairy") ||
    combined.includes("milk") ||
    combined.includes("buffalo") ||
    combined.includes("cattle")
  ) {
    insights.push(
      "Dairy/livestock project detected. Check dairy infrastructure, animal husbandry and eligible credit-linked schemes."
    );
  }

  // Food Processing
  if (
    combined.includes("food") ||
    combined.includes("processing") ||
    combined.includes("cold storage") ||
    combined.includes("cold chain")
  ) {
    insights.push(
      "Food-processing or cold-chain activity detected. Check Ministry of Food Processing Industries and related infrastructure schemes."
    );
  }

  // MSME
  if (
    combined.includes("msme") ||
    combined.includes("manufacturing") ||
    combined.includes("enterprise")
  ) {
    insights.push(
      "MSME activity detected. Check MSME credit, entrepreneurship and credit-linked support schemes."
    );
  }

  // Solar
  if (
    combined.includes("solar") ||
    combined.includes("renewable") ||
    combined.includes("energy")
  ) {
    insights.push(
      "Renewable-energy activity detected. Check applicable Central and State renewable-energy programmes."
    );
  }

  // State
  if (state) {
    insights.push(
      `Applicant/project state is ${context.state}. Check both Central Government schemes and schemes applicable in ${context.state}.`
    );
  }

  // Project cost
  if (projectCost > 0) {
    insights.push(
      `Reported project cost is approximately ₹${projectCost.toLocaleString(
        "en-IN"
      )}. Scheme limits and eligible project-cost components should be checked.`
    );
  }

  if (insights.length === 0) {
    insights.push(
      "No specific rule match was detected. Search across Central and State Government schemes based on the complete user profile."
    );
  }

  return insights;
}

module.exports = {
  runRules,
};