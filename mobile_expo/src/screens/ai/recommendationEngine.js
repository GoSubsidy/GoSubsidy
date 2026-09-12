export function generateRecommendation(context) {
  const { userProfile, loanDetails } = context;

  let suggestions = [];

  if (loanDetails?.emi > userProfile.income * 0.4) {
    suggestions.push(
      "EMI is more than 40% of income. Consider longer tenure or subsidy."
    );
  }

  if (loanDetails?.type === "home") {
    suggestions.push(
      "Term insurance is recommended to protect family from loan liability."
    );
  }

  return suggestions;
}
