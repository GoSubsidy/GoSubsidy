/**
 * GoSubsidy — Intelligent DPR Template Engine
 *
 * Turns a catalog project name/source into a sensible starting DPR profile.
 * These are STARTING ASSUMPTIONS only; the applicant can edit every financial
 * field before generating the final DPR.
 */

const PROFILES = {
  agriculture: {
    id: "agriculture",
    label: "Agriculture & Allied",
    businessType: "Agriculture",
    projectCost: 3000000,
    salesMultiplier: 1.25,
    rawMaterialPercent: 35,
    salaryPercent: 10,
    powerPercent: 4,
    adminPercent: 4,
    marketingPercent: 3,
    otherExpensePercent: 2,
    depreciationRate: 10,
    workingCapitalPercent: 15,
    assetRatios: { land: .15, building: .15, plantMachinery: .45, electrical: .05, furniture: .05, preliminary: .03, contingency: .05, otherFixedAssets: .07 },
  },
  food: {
    id: "food",
    label: "Food Processing",
    businessType: "Food Processing",
    projectCost: 5000000,
    salesMultiplier: 1.35,
    rawMaterialPercent: 45,
    salaryPercent: 9,
    powerPercent: 6,
    adminPercent: 4,
    marketingPercent: 4,
    otherExpensePercent: 2,
    depreciationRate: 10,
    workingCapitalPercent: 18,
    assetRatios: { land: .10, building: .20, plantMachinery: .50, electrical: .06, furniture: .04, preliminary: .03, contingency: .05, otherFixedAssets: .02 },
  },
  dairy: {
    id: "dairy",
    label: "Dairy",
    businessType: "Dairy",
    projectCost: 5000000,
    salesMultiplier: 1.30,
    rawMaterialPercent: 50,
    salaryPercent: 8,
    powerPercent: 5,
    adminPercent: 4,
    marketingPercent: 3,
    otherExpensePercent: 2,
    depreciationRate: 10,
    workingCapitalPercent: 18,
    assetRatios: { land: .12, building: .20, plantMachinery: .45, electrical: .06, furniture: .04, preliminary: .03, contingency: .05, otherFixedAssets: .05 },
  },
  poultry: {
    id: "poultry",
    label: "Poultry",
    businessType: "Poultry",
    projectCost: 4000000,
    salesMultiplier: 1.28,
    rawMaterialPercent: 42,
    salaryPercent: 9,
    powerPercent: 5,
    adminPercent: 4,
    marketingPercent: 3,
    otherExpensePercent: 2,
    depreciationRate: 10,
    workingCapitalPercent: 18,
    assetRatios: { land: .12, building: .20, plantMachinery: .45, electrical: .06, furniture: .04, preliminary: .03, contingency: .05, otherFixedAssets: .05 },
  },
  solar: {
    id: "solar",
    label: "Solar & Renewable",
    businessType: "Solar",
    projectCost: 7500000,
    salesMultiplier: 1.25,
    rawMaterialPercent: 25,
    salaryPercent: 8,
    powerPercent: 3,
    adminPercent: 5,
    marketingPercent: 4,
    otherExpensePercent: 3,
    depreciationRate: 10,
    workingCapitalPercent: 10,
    assetRatios: { land: .05, building: .08, plantMachinery: .70, electrical: .08, furniture: .02, preliminary: .02, contingency: .03, otherFixedAssets: .02 },
  },
  coldchain: {
    id: "coldchain",
    label: "Cold Chain",
    businessType: "Cold Chain",
    projectCost: 10000000,
    salesMultiplier: 1.25,
    rawMaterialPercent: 30,
    salaryPercent: 10,
    powerPercent: 12,
    adminPercent: 4,
    marketingPercent: 3,
    otherExpensePercent: 3,
    depreciationRate: 10,
    workingCapitalPercent: 18,
    assetRatios: { land: .08, building: .25, plantMachinery: .45, electrical: .08, furniture: .04, preliminary: .03, contingency: .05, otherFixedAssets: .02 },
  },
  textile: {
    id: "textile",
    label: "Textile",
    businessType: "Manufacturing",
    projectCost: 4000000,
    salesMultiplier: 1.35,
    rawMaterialPercent: 42,
    salaryPercent: 12,
    powerPercent: 7,
    adminPercent: 4,
    marketingPercent: 3,
    otherExpensePercent: 2,
    depreciationRate: 10,
    workingCapitalPercent: 18,
    assetRatios: { land: .08, building: .18, plantMachinery: .55, electrical: .05, furniture: .05, preliminary: .03, contingency: .05, otherFixedAssets: .01 },
  },
  healthcare: {
    id: "healthcare",
    label: "Healthcare",
    businessType: "MSME",
    projectCost: 8000000,
    salesMultiplier: 1.25,
    rawMaterialPercent: 22,
    salaryPercent: 20,
    powerPercent: 5,
    adminPercent: 6,
    marketingPercent: 4,
    otherExpensePercent: 3,
    depreciationRate: 10,
    workingCapitalPercent: 12,
    assetRatios: { land: .10, building: .30, plantMachinery: .35, electrical: .08, furniture: .07, preliminary: .03, contingency: .04, otherFixedAssets: .03 },
  },
  service: {
    id: "service",
    label: "Service",
    businessType: "MSME",
    projectCost: 2000000,
    salesMultiplier: 1.50,
    rawMaterialPercent: 20,
    salaryPercent: 22,
    powerPercent: 4,
    adminPercent: 7,
    marketingPercent: 5,
    otherExpensePercent: 4,
    depreciationRate: 10,
    workingCapitalPercent: 12,
    assetRatios: { land: .05, building: .15, plantMachinery: .35, electrical: .10, furniture: .10, preliminary: .05, contingency: .05, otherFixedAssets: .15 },
  },
  manufacturing: {
    id: "manufacturing",
    label: "Manufacturing",
    businessType: "Manufacturing",
    projectCost: 6000000,
    salesMultiplier: 1.35,
    rawMaterialPercent: 45,
    salaryPercent: 10,
    powerPercent: 7,
    adminPercent: 4,
    marketingPercent: 3,
    otherExpensePercent: 2,
    depreciationRate: 10,
    workingCapitalPercent: 18,
    assetRatios: { land: .10, building: .20, plantMachinery: .55, electrical: .05, furniture: .03, preliminary: .02, contingency: .04, otherFixedAssets: .01 },
  },
  general: {
    id: "general",
    label: "General MSME",
    businessType: "MSME",
    projectCost: 5000000,
    salesMultiplier: 1.25,
    rawMaterialPercent: 40,
    salaryPercent: 10,
    powerPercent: 5,
    adminPercent: 4,
    marketingPercent: 3,
    otherExpensePercent: 2,
    depreciationRate: 10,
    workingCapitalPercent: 15,
    assetRatios: { land: .10, building: .20, plantMachinery: .50, electrical: .05, furniture: .05, preliminary: .03, contingency: .05, otherFixedAssets: .02 },
  },
};

const KEYWORDS = [
  ["coldchain", /cold\s*storage|cold\s*chain|refrigerat|ice\s*plant|frozen|deep\s*freeze/i],
  ["solar", /solar|photovoltaic|pv\s|renewable|biogas|bio\s*energy|wind\s*energy/i],
  ["dairy", /dairy|milk|paneer|ghee|curd|cheese|khoya/i],
  ["poultry", /poultry|broiler|layer|hatchery|egg\s*(farm|production)/i],
  ["food", /food|bakery|biscuit|snack|rice\s*mill|flour|atta|spice|masala|pickle|jam|sauce|juice|candy|confection|papad|namkeen|honey|cashew|oil\s*mill|edible\s*oil/i],
  ["textile", /textile|garment|apparel|saree|carpet|loom|weaving|tailor|hosiery|jute|cotton|fabric/i],
  ["healthcare", /hospital|clinic|diagnostic|pathology|pharmacy|medical|dental|health\s*care/i],
  ["service", /repair|servicing|barber|salon|beauty|computer|cyber|printing|design|transport|garage|workshop|laundry|consult|training|education|restaurant|hotel|tent\s*house/i],
  ["agriculture", /agri|agriculture|farm|nursery|apiary|bee|beekeep|bamboo|lac|shellac|floriculture|horticulture|mushroom|vermicompost|cattle\s*feed/i],
  ["manufacturing", /manufactur|fabricat|assembly|assembling|engineering|metal|steel|plastic|rubber|chemical|electrical|electronic|automobile|machine|component|furniture/i],
];

function normalize(value) {
  return String(value || "").trim().toLowerCase();
}

export function getIntelligentTemplateProfile(project = {}, category = {}) {
  const text = `${normalize(project.name)} ${normalize(project.source)} ${normalize(category.title)}`;

  // Strong keyword match from the actual project profile wins over the broad category.
  for (const [profileId, pattern] of KEYWORDS) {
    if (pattern.test(text)) return { ...PROFILES[profileId], matchedBy: "project-name/source" };
  }

  const categoryId = normalize(category.id);
  const categoryMap = {
    agriculture: "agriculture",
    food: "food",
    dairy: "dairy",
    poultry: "poultry",
    solar: "solar",
    green: "solar",
    coldchain: "coldchain",
    services: "service",
    textile: "textile",
    healthcare: "healthcare",
    manufacturing: "manufacturing",
  };

  const fallbackId = categoryMap[categoryId] || "general";
  return { ...PROFILES[fallbackId], matchedBy: "category" };
}

export function buildIntelligentTemplateUpdates(project = {}, projectProfile = {}, category = {}) {
  const profile = getIntelligentTemplateProfile(projectProfile, category);
  const projectCost = profile.projectCost;
  const wcAmount = Math.round(projectCost * (profile.workingCapitalPercent / 100));
  const wcBankPercent = 75;
  const wcMargin = Math.round(wcAmount * (1 - wcBankPercent / 100));
  const assetBudget = Math.max(0, projectCost - wcMargin);

  const assets = {};
  Object.entries(profile.assetRatios).forEach(([key, ratio]) => {
    assets[key] = Math.round(assetBudget * ratio);
  });

  // Remove rounding drift from the largest asset so the capital statement reconciles exactly.
  const assetKeys = Object.keys(profile.assetRatios);
  const roundedAssetTotal = assetKeys.reduce((sum, key) => sum + (assets[key] || 0), 0);
  const drift = assetBudget - roundedAssetTotal;
  const largestAsset = assetKeys.reduce((best, key) =>
    (profile.assetRatios[key] > profile.assetRatios[best] ? key : best), assetKeys[0]
  );
  assets[largestAsset] += drift;

  return {
    projectName: projectProfile?.name || "",
    businessType: profile.businessType,
    templateId: projectProfile?.id ?? "",
    templateSource: projectProfile?.source || "",
    templateCategoryId: category?.id || profile.id,
    templateCategoryTitle: category?.title || profile.label,
    templateProfileId: profile.id,
    templateProfileLabel: profile.label,
    projectCost,
    year1Sales: Math.round(projectCost * profile.salesMultiplier),
    rawMaterialPercent: profile.rawMaterialPercent,
    salaryPercent: profile.salaryPercent,
    powerPercent: profile.powerPercent,
    adminPercent: profile.adminPercent,
    marketingPercent: profile.marketingPercent,
    otherExpensePercent: profile.otherExpensePercent,
    depreciationRate: profile.depreciationRate,
    requiresWorkingCapital: true,
    workingCapitalAmount: wcAmount,
    workingCapitalBankLoanPercent: wcBankPercent,
    workingCapitalMargin: wcMargin,
    autoScaleSales: true,
    ...assets,
  };
}

export { PROFILES as DPR_TEMPLATE_PROFILES };
