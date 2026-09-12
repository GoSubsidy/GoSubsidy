export const schemes = [
  {
    id: "education-loan",
    title: "Education Loan Subsidy",
    category: "Education",
    description: "Government-supported education loan subsidy",
    eligibility: {
      incomeLimit: "₹8,00,000",
      categories: ["General", "SC", "ST", "OBC"],
      location: ["Urban", "Rural"],
    },
    subsidy: "3% interest subsidy",
    projectCostRange: "₹1,00,000 – ₹20,00,000",
  },
  {
    id: "exporter-credit",
    title: "Exporter Credit Loan",
    category: "Export",
    description: "Credit support for exporters",
    eligibility: {
      categories: ["Exporter", "MSME"],
      location: ["Urban"],
    },
    subsidy: "Interest support as per policy",
    projectCostRange: "₹5,00,000 – ₹5,00,00,000",
  },
  {
    id: "renewable-energy",
    title: "Renewable Energy Loan",
    category: "Energy",
    description: "Loans for solar and renewable energy projects",
    eligibility: {
      categories: ["Individual", "Enterprise"],
      location: ["Urban", "Rural"],
    },
    subsidy: "Capital subsidy as applicable",
    projectCostRange: "₹50,000 – ₹50,00,000",
  },
  {
    id: "livelihood-loan",
    title: "Livelihood Loan Scheme",
    category: "Livelihood",
    description: "Financial support for self-employment",
    eligibility: {
      categories: ["SHG", "Individual"],
      location: ["Urban", "Rural"],
    },
    subsidy: "Interest support",
    projectCostRange: "₹50,000 – ₹5,00,000",
  },
];

export const getSchemeById = (id) =>
  schemes.find((s) => s.id === id);
