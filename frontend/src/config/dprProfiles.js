// Product-driven DPR profile registry.
// Add/override a profile per GoSubsidy product. The renderer remains universal.
export const DPR_PROFILES = {
  poultry: {
    category: "Agriculture & Allied",
    flow: ["Inputs", "Brooding / Growing", "Quality & Biosecurity", "Birds / Output", "Market", "Revenue"],
    parameters: ["Capacity", "Cycles per year", "Feed", "Mortality / yield", "Utilities", "Manpower"],
    risks: ["Feed-cost volatility", "Disease / biosecurity", "Market-price movement"],
  },
  food_processing: {
    category: "Food Processing",
    flow: ["Raw Material", "Processing", "Quality Control", "Finished Goods", "Distribution", "Revenue"],
    parameters: ["Installed capacity", "Production yield", "Utilities", "Packaging", "Manpower", "Compliance"],
    risks: ["Raw-material cost", "Quality / compliance", "Demand volatility"],
  },
  manufacturing: {
    category: "Manufacturing",
    flow: ["Raw Material", "Production", "Quality", "Finished Product", "Sales", "Revenue"],
    parameters: ["Plant capacity", "Machinery", "Power", "Manpower", "Production cycle", "QC"],
    risks: ["Input cost", "Machine downtime", "Demand volatility"],
  },
  retail_trading: {
    category: "Retail / Trading",
    flow: ["Procurement", "Inventory", "Merchandising", "Customer", "Sales", "Cash Realization"],
    parameters: ["Inventory", "Turnover", "Gross margin", "Store / facility", "Manpower", "Working capital"],
    risks: ["Inventory risk", "Competition", "Margin pressure"],
  },
  services: {
    category: "Services",
    flow: ["Lead", "Customer Onboarding", "Service Delivery", "Quality", "Billing", "Cash Realization"],
    parameters: ["Service capacity", "Team", "Technology", "Customer acquisition", "Pricing", "Working capital"],
    risks: ["Customer concentration", "Execution", "Pricing pressure"],
  },
  agriculture_allied: {
    category: "Agriculture & Allied",
    flow: ["Inputs", "Production", "Quality", "Harvest / Output", "Market", "Revenue"],
    parameters: ["Area / capacity", "Cycle", "Yield", "Inputs", "Manpower", "Irrigation / utilities"],
    risks: ["Input costs", "Weather / biological risk", "Market-price movement"],
  },
  universal: {
    category: "Project",
    flow: ["Inputs", "Operations", "Quality / Control", "Output", "Market", "Revenue"],
    parameters: ["Capacity", "Assets", "Manpower", "Utilities", "Operating cycle", "Working capital"],
    risks: ["Cost risk", "Market risk", "Execution risk"],
  },
};

export function resolveDPRProfile(product = {}) {
  const key = String(product.slug || product.category || "").toLowerCase();
  if (product.dprProfile) return { ...DPR_PROFILES.universal, ...product.dprProfile };
  if (key.includes("poultry")) return DPR_PROFILES.poultry;
  if (key.includes("food")) return DPR_PROFILES.food_processing;
  if (key.includes("manufact")) return DPR_PROFILES.manufacturing;
  if (key.includes("retail") || key.includes("trading")) return DPR_PROFILES.retail_trading;
  if (key.includes("service")) return DPR_PROFILES.services;
  if (key.includes("agri") || key.includes("farm")) return DPR_PROFILES.agriculture_allied;
  return DPR_PROFILES.universal;
}
