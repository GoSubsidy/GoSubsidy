export function buildAIContext({
  user,
  loan,
  subsidy,
  insurance,
}) {
  return {
    userProfile: {
      age: user.age,
      income: user.income,
      dependents: user.dependents,
    },
    loanDetails: loan,
    subsidyDetails: subsidy,
    insuranceDetails: insurance,
  };
}
