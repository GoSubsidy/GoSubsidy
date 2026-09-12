/**
 * EMI & Bank Comparison Service
 * Used by EMI routes and AI intelligence layer
 */

/**
 * Calculate EMI for given loan parameters
 */
export function calculateEMI({
  principal,
  annualInterestRate,
  tenureMonths,
  subsidyPercent = 0,
}) {
  if (!principal || !annualInterestRate || !tenureMonths) {
    throw new Error("Missing EMI calculation parameters");
  }

  // Apply subsidy directly on interest
  const effectiveRate =
    annualInterestRate * (1 - subsidyPercent / 100);

  const monthlyRate = effectiveRate / 12 / 100;

  const emi =
    (principal * monthlyRate * Math.pow(1 + monthlyRate, tenureMonths)) /
    (Math.pow(1 + monthlyRate, tenureMonths) - 1);

  return {
    principal,
    tenureMonths,
    annualInterestRate,
    subsidyPercent,
    monthlyEMI: Math.round(emi),
  };
}

/**
 * Compare EMI across banks and auto-pick cheapest
 */
export function compareBankEMI({
  principal,
  tenureMonths,
  subsidyPercent = 0,
}) {
  const banks = [
    { name: "SBI", rate: 8.5 },
    { name: "HDFC", rate: 8.75 },
    { name: "ICICI", rate: 9.0 },
    { name: "PNB", rate: 8.4 },
  ];

  const comparisons = banks.map((bank) => {
    const emiResult = calculateEMI({
      principal,
      tenureMonths,
      annualInterestRate: bank.rate,
      subsidyPercent,
    });

    return {
      bank: bank.name,
      interestRate: bank.rate,
      emi: emiResult.monthlyEMI,
    };
  });

  const cheapest = comparisons.reduce((min, b) =>
    b.emi < min.emi ? b : min
  );

  return {
    subsidyPercent,
    cheapestBank: cheapest.bank,
    cheapestEMI: cheapest.emi,
    comparison: comparisons,
  };
}
