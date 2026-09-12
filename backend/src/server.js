const express = require("express");
const cors = require("cors");

const app = express();
const PORT = 4000;

// Middleware
app.use(cors());
app.use(express.json());

// Existing Schemes Route
const schemes = [
  {
    id: "EDU_001",
    scheme_name: "Education Loan Subsidy",
    description: "Student loan subsidy & interest support",
    benefit_amount: "Up to ₹5,00,000",
    eligibility: "Family income below threshold",
    aiAdvice:
      "Lower income improves subsidy eligibility."
  }
];

// Get All Schemes
app.get("/schemes", (req, res) => {
  res.json(schemes);
});

// Get Scheme Details
app.get("/schemes/:id", (req, res) => {
  const scheme = schemes.find(s => s.id === req.params.id);

  if (!scheme) {
    return res.status(404).json({
      message: "Scheme not found"
    });
  }

  res.json(scheme);
});

// AI Eligibility API
app.post("/ai/eligibility", (req, res) => {

  const { category, sector, state, income } = req.body;

  res.json({
    eligible: true,
    scheme_name: "Education Loan Subsidy",
    benefit_amount: "Up to ₹5,00,000",
    eligibility: "Family income below threshold",
    aiAdvice:
      `Based on your profile (${category}, ${sector}, ${state}), you are likely eligible for this subsidy.`
  });

});

// Health Check
app.get("/", (req, res) => {
  res.json({
    service: "GoSubsidy Backend",
    status: "running"
  });
});

// Start Server
app.listen(PORT, () => {
  console.log(`✅ GoSubsidy Backend running at http://localhost:${PORT}`);
});