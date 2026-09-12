// GoSubsidy universal DPR profile layer.
// Every service/product can optionally supply a profile.
// Unknown products use the universal fallback rather than inventing
// technical facts.

export const UNIVERSAL_DPR_PROFILE = {
  profileName: "Universal Enterprise DPR",
  sector: "Enterprise / Business Activity",
  technicalHeading: "Activity-specific Technical Proposal",
  requiredInputs: [
    "Business activity / product or service",
    "Location and operating premises",
    "Capacity / service volume",
    "Project cost and capital-cost breakup",
    "Promoter experience",
    "Revenue and operating-cost assumptions",
    "Working-capital requirement",
    "Applicable registrations / licences",
  ],
};

export const DPR_PROFILES = {
  poultry: {
    profileName: "Poultry / Broiler Farming",
    sector: "Poultry & Allied Activities",
    technicalHeading: "Poultry Farm Technical Configuration",
    keywords: ["poultry", "broiler", "layer", "farm", "chicken"],
  },
  foodProcessing: {
    profileName: "Food Processing",
    sector: "Food Processing",
    technicalHeading: "Food Processing Plant & Process Configuration",
    keywords: ["food processing", "rice mill", "flour", "spice", "bakery", "processing"],
  },
  manufacturing: {
    profileName: "Manufacturing",
    sector: "Manufacturing",
    technicalHeading: "Manufacturing Unit Technical Configuration",
    keywords: ["manufacturing", "factory", "fabrication", "engineering"],
  },
  retail: {
    profileName: "Retail / Trading",
    sector: "Retail & Trading",
    technicalHeading: "Retail / Trading Operating Model",
    keywords: ["retail", "trading", "store", "shop", "wholesale"],
  },
  services: {
    profileName: "Service Enterprise",
    sector: "Services",
    technicalHeading: "Service Delivery & Operating Configuration",
    keywords: ["service", "consultancy", "repair", "salon", "clinic", "studio"],
  },
  agriculture: {
    profileName: "Agriculture & Allied",
    sector: "Agriculture & Allied Activities",
    technicalHeading: "Agriculture / Allied Activity Configuration",
    keywords: ["agriculture", "dairy", "goat", "fishery", "horticulture", "farm"],
  },
};

export function resolveDPRProfile(project = {}) {
  if (project?.dprProfile && typeof project.dprProfile === "object") {
    return { ...UNIVERSAL_DPR_PROFILE, ...project.dprProfile };
  }

  const text = [
    project.businessType,
    project.projectName,
    project.productName,
    project.serviceName,
    project.category,
    project.sector,
  ].filter(Boolean).join(" ").toLowerCase();

  const found = Object.values(DPR_PROFILES).find((profile) =>
    profile.keywords?.some((keyword) => text.includes(keyword))
  );

  return found || UNIVERSAL_DPR_PROFILE;
}
