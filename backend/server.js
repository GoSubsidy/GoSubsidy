const express = require("express");
const cors = require("cors");
const app = express();
const PORT = 4000;
const supabase = require("./utils/supabase");

app.use(cors());
app.use(express.json());

// ===========================
// Sample Schemes Database
// ===========================
const schemes = [
  {
    id: "EDU_001",
    scheme_name: "Education Loan Subsidy",
    description: "Student loan subsidy & interest support",
    benefit_amount: "Up to ₹5,00,000",
    eligibility: "Family income below threshold",
    aiAdvice: "Lower income improves subsidy eligibility",
    category: "Education"
  },
  {
    id: "POULTRY_001",
    scheme_name: "Poultry Farm Subsidy",
    description: "Financial assistance for poultry farms",
    benefit_amount: "Up to 35%",
    eligibility: "Registered poultry farmer",
    aiAdvice: "Apply through NABARD or State Animal Husbandry Department",
    category: "Poultry"
  },
  {
    id: "DAIRY_001",
    scheme_name: "Dairy Development Scheme",
    description: "Support for dairy entrepreneurs",
    benefit_amount: "Up to 50%",
    eligibility: "Milk producers & dairy units",
    aiAdvice: "Prepare DPR before applying",
    category: "Dairy"
  }
];

// ===========================
// HOME
// ===========================
app.get("/", (req, res) => {
  res.json({
    service: "GoSubsidy Backend",
    status: "Running"
  });
});

// ===========================
// ALL SCHEMES
// ===========================
app.get("/schemes", async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("schemes")
      .select("*")
      .order("scheme_name");

    if (error) {
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }

    res.json(data);
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
});
// ===========================
// SINGLE SCHEME
// ===========================
app.get("/schemes/:id", (req, res) => {

  const scheme = schemes.find(
    s => s.id === req.params.id
  );

  if (!scheme) {
    return res.status(404).json({
      success: false,
      message: "Scheme not found"
    });
  }

  res.json(scheme);

});

// ===========================
// AI ELIGIBILITY
// ===========================
app.post("/ai/eligibility", (req, res) => {

  const {
    category,
    sector,
    state,
    investment
  } = req.body;

  let recommendation = "";

  if (
    sector &&
    sector.toLowerCase() === "education"
  ) {

    recommendation =
      "Eligible for Education Loan Subsidy.";

  } else if (
    sector &&
    sector.toLowerCase() === "poultry"
  ) {

    recommendation =
      "Eligible for Poultry Farm Subsidy and NABARD support.";

  } else if (
    sector &&
    sector.toLowerCase() === "dairy"
  ) {

    recommendation =
      "Eligible for Dairy Development Scheme.";

  } else {

    recommendation =
      "Multiple Central & State Government schemes are available.";

  }

  res.json({
    success: true,
    input: {
      category,
      sector,
      state,
      investment
    },
    recommendation
  });

});

// ===========================
// 404
// ===========================
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "API route not found"
  });
});

// ===========================
app.listen(PORT, () => {
  console.log(
    `GoSubsidy Backend running on http://localhost:${PORT}`
  );
});