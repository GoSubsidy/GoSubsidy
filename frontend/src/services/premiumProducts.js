export const PREMIUM_PRODUCTS = {
  CIBIL_FULL: {
    code: "CIBIL_FULL",
    name: "CIBIL Intelligence",
    shortName: "CIBIL",
    price: 2999,
    validityDays: 1,
    route: "/cibil",
    icon: "bi-graph-up-arrow",
    description: "Detailed credit-readiness analysis and personalised improvement guidance."
  },
  SUBSIDY_CALCULATOR_PRO: {
    code: "SUBSIDY_CALCULATOR_PRO",
    name: "Subsidy Calculator Pro",
    shortName: "Calculator",
    price: 49,
    validityDays: 30,
    route: "/subsidy-loan-emi-calculator",
    icon: "bi-calculator",
    description: "Detailed subsidy, promoter contribution, loan and EMI analysis."
  },
  DPR_PRO: {
    code: "DPR_PRO",
    name: "DPR Intelligence",
    shortName: "DPR",
    price: 999,
    validityDays: 30,
    route: "/dpr",
    icon: "bi-file-earmark-bar-graph",
    description: "Generate a professional, finance-oriented project report."
  }
};

export const getProduct = (code) => PREMIUM_PRODUCTS[code] || null;
