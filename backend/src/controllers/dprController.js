// ======================================================
// GoSubsidy - AI DPR Controller
// File: backend/src/controllers/dprController.js
// ======================================================

import { GoogleGenAI } from "@google/genai";

// ======================================================
// GEMINI CLIENT
// ======================================================

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

// ======================================================
// SAFE NUMBER
// ======================================================

const numberValue = (value) => {
  const number = Number(value);

  if (!Number.isFinite(number)) {
    return 0;
  }

  return number;
};

// ======================================================
// INR FORMATTER
// ======================================================

const formatINR = (value) => {
  const number = numberValue(value);

  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(number);
};

// ======================================================
// GENERATE DPR
// POST /api/dpr/generate
// ======================================================

export const generateDPR = async (req, res) => {
  try {
    console.log("");
    console.log("========================================");
    console.log("📘 GoSubsidy AI DPR Generator");
    console.log("========================================");

    // ==================================================
    // 1. CHECK GEMINI KEY
    // ==================================================

    if (!process.env.GEMINI_API_KEY) {
      console.error("❌ GEMINI_API_KEY missing");

      return res.status(500).json({
        success: false,
        message:
          "GEMINI_API_KEY is missing in backend .env file.",
      });
    }

    // ==================================================
    // 2. RECEIVE DPR DATA
    // ==================================================

    const body = req.body || {};

    /*
      Current DPR.jsx sends:

      {
        project: {
          project: {...},
          capitalCost: {...},
          summary: {...},
          calculations: {...},
          savedAt: "..."
        }
      }
    */

    const payload =
      body?.project || body || {};

    const project =
      payload?.project ||
      payload ||
      {};

    const capitalCost =
      payload?.capitalCost ||
      body?.capitalCost ||
      {};

    const summary =
      payload?.summary ||
      body?.summary ||
      {};

    const calculations =
      payload?.calculations ||
      body?.calculations ||
      {};

    console.log("📥 DPR project data received");

    // ==================================================
    // 3. PROJECT COST
    // ==================================================

    const projectCost =
      numberValue(summary.projectCost) > 0
        ? numberValue(summary.projectCost)
        : numberValue(project.projectCost);

    console.log("📋 Project Information:", {
      projectName: project.projectName,
      promoterName: project.promoterName,
      businessType: project.businessType,
      state: project.state,
      projectCost,
    });

    // ==================================================
    // 4. BASIC VALIDATION
    // ==================================================

    if (!String(project.projectName || "").trim()) {
      return res.status(400).json({
        success: false,
        message: "Project name is required.",
      });
    }

    if (!String(project.promoterName || "").trim()) {
      return res.status(400).json({
        success: false,
        message: "Promoter name is required.",
      });
    }

    if (!String(project.businessType || "").trim()) {
      return res.status(400).json({
        success: false,
        message: "Business / sector is required.",
      });
    }

    if (projectCost <= 0) {
      return res.status(400).json({
        success: false,
        message: "Valid project cost is required.",
      });
    }

    // ==================================================
    // 5. FINANCIAL INPUTS
    // ==================================================

    const promoterContributionPercent =
      numberValue(
        project.promoterContributionPercent
      );

    const subsidyPercent =
      numberValue(project.subsidyPercent);

    const interestRate =
      numberValue(project.interestRate);

    // ==================================================
    // 5A. FLEXIBLE CUSTOMER-SELECTED TENURE
    // ==================================================
    // 7 years is only a frontend default.
    // Customer can select any repayment period from
    // 1 to 15 years.

    const requestedLoanTenure =
      numberValue(project.loanTenure);

    let loanTenure = Math.min(
      15,
      Math.max(
        1,
        Math.floor(
          requestedLoanTenure || 1
        )
      )
    );

    // SINGLE CUSTOMER-SELECTED HORIZON:
    // PremiumDPR sends projectionYears explicitly. When it is present,
    // that value is authoritative for the DPR. This prevents an older
    // saved projectionYears value from overriding the customer's current
    // 1–15 year selection.
    const requestedProjectionYears =
      numberValue(
        payload?.projectionYears ??
        payload?.project?.projectionYears ??
        body?.projectionYears
      );

    const projectionYears = Math.min(
      15,
      Math.max(
        1,
        Math.floor(
          requestedProjectionYears > 0
            ? requestedProjectionYears
            : loanTenure
        )
      )
    );

    // Keep the existing financial method intact while synchronizing the
    // visible loan tenure with the single selected DPR horizon. This avoids
    // the AI receiving "15-year projection / 7-year loan" from stale state.
    loanTenure = projectionYears;

    const moratorium = Math.min(
      loanTenure * 12,
      Math.max(
        0,
        Math.floor(
          numberValue(project.moratorium)
        )
      )
    );

    console.log(
      "📅 DPR Tenure Configuration:",
      {
        requestedLoanTenure,
        loanTenure,
        projectionYears,
        moratorium,
      }
    );

    // ==================================================
    // 6. AUTHORITATIVE FINANCIAL VALUES
    // ==================================================

    const promoterContributionAmount =
      numberValue(
        summary.promoterContribution
      ) > 0
        ? numberValue(
            summary.promoterContribution
          )
        : projectCost *
          (promoterContributionPercent / 100);

    const estimatedSubsidy =
      numberValue(
        summary.expectedSubsidy
      ) > 0
        ? numberValue(
            summary.expectedSubsidy
          )
        : projectCost *
          (subsidyPercent / 100);

    const estimatedTermLoan =
      numberValue(
        summary.estimatedTermLoan
      ) > 0
        ? numberValue(
            summary.estimatedTermLoan
          )
        : Math.max(
            0,
            projectCost -
              promoterContributionAmount -
              estimatedSubsidy
          );

    const totalMeansOfFinance =
      promoterContributionAmount +
      estimatedTermLoan +
      estimatedSubsidy;

    const financeDifference =
      projectCost -
      totalMeansOfFinance;

    const financeIsBalanced =
      Math.abs(
        financeDifference
      ) <= 1;

    console.log(
      "💰 GoSubsidy Financial Structure:",
      {
        projectCost,
        promoterContributionPercent,
        promoterContributionAmount,
        subsidyPercent,
        estimatedSubsidy,
        estimatedTermLoan,
        totalMeansOfFinance,
        financeDifference,
        financeIsBalanced,
      }
    );

    // ==================================================
    // 7. CAPITAL COST
    // ==================================================

    const landCost =
      numberValue(capitalCost.land) ||
      numberValue(project.land) ||
      numberValue(project.landCost);

    const buildingCost =
      numberValue(capitalCost.building) ||
      numberValue(project.building) ||
      numberValue(project.buildingCost);

    const plantMachinery =
      numberValue(
        capitalCost.plantMachinery
      ) ||
      numberValue(
        project.plantMachinery
      );

    const electricalEquipment =
      numberValue(
        capitalCost.electrical
      ) ||
      numberValue(project.electrical) ||
      numberValue(
        project.electricalEquipment
      );

    const furnitureFixtures =
      numberValue(
        capitalCost.furniture
      ) ||
      numberValue(project.furniture) ||
      numberValue(
        project.furnitureFixtures
      );

    const preliminaryExpenses =
      numberValue(
        capitalCost.preliminary
      ) ||
      numberValue(project.preliminary) ||
      numberValue(
        project.preliminaryExpenses
      );

    const contingency =
      numberValue(
        capitalCost.contingency
      ) ||
      numberValue(
        project.contingency
      );

    const workingCapitalMargin =
      numberValue(
        capitalCost.workingCapitalMargin
      ) ||
      numberValue(
        project.workingCapitalMargin
      );

    const otherFixedAssets =
      numberValue(
        capitalCost.otherFixedAssets
      ) ||
      numberValue(
        project.otherFixedAssets
      );

    const calculatedCapitalCostTotal =
      landCost +
      buildingCost +
      plantMachinery +
      electricalEquipment +
      furnitureFixtures +
      preliminaryExpenses +
      contingency +
      workingCapitalMargin +
      otherFixedAssets;

    const frontendCapitalCostTotal =
      numberValue(
        capitalCost.totalCapitalCost
      ) > 0
        ? numberValue(
            capitalCost.totalCapitalCost
          )
        : numberValue(
            summary.totalCapitalCost
          );

    const capitalCostTotal =
      frontendCapitalCostTotal > 0
        ? frontendCapitalCostTotal
        : calculatedCapitalCostTotal;

    const capitalCostDifference =
      projectCost -
      capitalCostTotal;

    const capitalCostReconciled =
      Math.abs(
        capitalCostDifference
      ) <= 1;

    console.log(
      "🏗️ Capital Cost Reconciliation:",
      {
        landCost,
        buildingCost,
        plantMachinery,
        electricalEquipment,
        furnitureFixtures,
        preliminaryExpenses,
        contingency,
        workingCapitalMargin,
        otherFixedAssets,
        calculatedCapitalCostTotal,
        capitalCostTotal,
        projectCost,
        capitalCostDifference,
        capitalCostReconciled,
      }
    );

    // ==================================================
    // 8. BACKEND CAPITAL COST SAFETY CHECK
    // ==================================================

    if (!capitalCostReconciled) {
      console.error(
        "❌ Capital Cost is not reconciled."
      );

      return res.status(400).json({
        success: false,

        message:
          `Capital Cost Statement is not reconciled. ` +
          `Project Cost: ${formatINR(
            projectCost
          )}, ` +
          `Capital Cost: ${formatINR(
            capitalCostTotal
          )}, ` +
          `Difference: ${formatINR(
            capitalCostDifference
          )}.`,

        capitalCost: {
          projectCost,
          capitalCostTotal,
          capitalCostDifference,
          reconciled: false,
        },
      });
    }

    // ==================================================
    // 9. OPERATING ASSUMPTIONS
    // ==================================================

    const year1Sales =
      numberValue(
        project.year1Sales
      );

    const salesGrowth =
      numberValue(
        project.salesGrowth
      );

    const rawMaterialPercent =
      numberValue(
        project.rawMaterialPercent
      );

    const salaryPercent =
      numberValue(
        project.salaryPercent
      );

    const powerPercent =
      numberValue(
        project.powerPercent
      );

    const adminPercent =
      numberValue(
        project.adminPercent
      );

    const marketingPercent =
      numberValue(
        project.marketingPercent
      );

    const otherExpensePercent =
      numberValue(
        project.otherExpensePercent
      );

    const depreciationRate =
      numberValue(
        project.depreciationRate
      );

    const workingCapital =
      numberValue(
        project.workingCapital
      );

    // ==================================================
    // 10. FRONTEND FINANCIAL PROJECTIONS
    // ==================================================

    const years =
      Array.isArray(
        calculations?.years
      )
        ? calculations.years
        : [];

    const projectionYearCount =
      years.length;

    const projectionAligned =
      projectionYearCount ===
      projectionYears;

    // Never silently truncate or invent
    // financial years.
    //
    // Frontend financial engine is source
    // of truth.

    if (!projectionAligned) {
      console.error(
        "❌ Projection horizon mismatch:",
        {
          selectedProjectionYears:
            projectionYears,

          receivedProjectionYears:
            projectionYearCount,
        }
      );

      return res.status(400).json({
        success: false,

        message:
          `Projection mismatch: customer selected ${projectionYears} years, ` +
          `but DPR financial calculations contain ${projectionYearCount} years.`,

        projection: {
          selectedYears:
            projectionYears,

          receivedYears:
            projectionYearCount,

          aligned:
            false,
        },
      });
    }

    const averageDSCR =
      numberValue(
        summary.averageDSCR ??
          calculations.averageDSCR
      );

    // ==================================================
    // FINANCIAL PROJECTION TEXT
    // ==================================================

    const financialProjectionText =
      years.length > 0
        ? years
            .map((year) => {
              return `
Year ${year.year} of ${projectionYears}

Sales:
${formatINR(year.sales)}

Raw Material:
${formatINR(year.rawMaterial)}

Salaries:
${formatINR(year.salaries)}

Power:
${formatINR(year.power)}

Administration:
${formatINR(year.admin)}

Marketing:
${formatINR(year.marketing)}

Other Expenses:
${formatINR(
  year.otherExpenses
)}

Total Operating Expenses:
${formatINR(
  year.operatingExpenses
)}

EBITDA:
${formatINR(
  year.ebitda
)}

Depreciation:
${formatINR(
  year.depreciation
)}

Interest:
${formatINR(
  year.interest
)}

Profit Before Tax:
${formatINR(
  year.profitBeforeTax
)}

Estimated Tax:
${formatINR(
  year.estimatedTax
)}

Profit After Tax:
${formatINR(
  year.profitAfterTax
)}

Opening Term Loan:
${formatINR(
  year.openingLoan
)}

Principal Repayment:
${formatINR(
  year.repayment
)}

Closing Term Loan:
${formatINR(
  year.closingLoan
)}

Debt Service:
${formatINR(
  year.debtService
)}

DSCR:
${numberValue(
  year.dscr
).toFixed(2)}

Net Fixed Assets:
${formatINR(
  year.netFixedAssets
)}

Current Assets:
${formatINR(
  year.currentAssets
)}

Total Assets:
${formatINR(
  year.totalAssets
)}

Current Liabilities:
${formatINR(
  year.currentLiabilities
)}

Indicative Net Worth:
${formatINR(
  year.netWorth
)}

Operating Cash Flow:
${formatINR(
  year.operatingCashFlow
)}

Financing Cash Flow:
${formatINR(
  year.financingCashFlow
)}

Net Cash Flow:
${formatINR(
  year.netCashFlow
)}
`;
            })
            .join("\n")
        : "No frontend financial projection data available.";

    // ==================================================
    // 11. AI BUSINESS CONTEXT
    // ==================================================

    // The selected business/sector is the authoritative domain context
    // for AI-generated narrative. Financial values remain locked to the
    // GoSubsidy calculation engine.
    const businessContext = String(
      project.businessType || ""
    ).trim();

    // ==================================================
    // 12. CREATE GEMINI PROMPT
    // ==================================================

    const prompt = `
You are the GoSubsidy AI Detailed Project Report Generator.

Prepare a professional Indian bank-ready Detailed
Project Report using the information and financial
calculations supplied below.

The GoSubsidy frontend financial engine is the
SOURCE OF TRUTH for all supplied financial figures.

Do not independently alter supplied financial values.

Do not fabricate missing project-specific information.

========================================================
MANDATORY FINANCIAL CONTROL
========================================================

Total Project Cost:
${formatINR(projectCost)}

Promoter Contribution:
${formatINR(
  promoterContributionAmount
)}
(${promoterContributionPercent}%)

Expected Subsidy:
${formatINR(
  estimatedSubsidy
)}
(${subsidyPercent}%)

Estimated Bank Term Loan:
${formatINR(
  estimatedTermLoan
)}

Total Means of Finance:
${formatINR(
  totalMeansOfFinance
)}

Financial Reconciliation Difference:
${formatINR(
  financeDifference
)}

The following equation is financially locked:

PROJECT COST =
PROMOTER CONTRIBUTION +
BANK TERM LOAN +
EXPECTED SUBSIDY

Therefore:

${formatINR(projectCost)}
=
${formatINR(
  promoterContributionAmount
)}
+
${formatINR(
  estimatedTermLoan
)}
+
${formatINR(
  estimatedSubsidy
)}

Do not change these figures anywhere
in the DPR.

========================================================
PROJECT INFORMATION
========================================================

Project Name:
${project.projectName || "Not provided"}

Promoter Name:
${project.promoterName || "Not provided"}

Mobile:
${project.mobile || "Not provided"}

Email:
${project.email || "Not provided"}

Business / Sector:
${businessContext || "Not provided"}

AI DOMAIN RULE:
Use the selected Business / Sector above as the primary context for all
business, industry, market, product/service and technical narrative.

Constitution:
${project.constitution || "Not provided"}

State:
${project.state || "Not provided"}

District:
${project.district || "Not provided"}

Project Location:
${project.location || "Not provided"}

========================================================
FINANCIAL ASSUMPTIONS
========================================================

Total Project Cost:
${formatINR(projectCost)}

Promoter Contribution:
${promoterContributionPercent}%

Expected Subsidy Assumption:
${subsidyPercent}%

Interest Rate:
${interestRate}% per annum

DPR Projection Horizon:
${projectionYears} years

Moratorium:
${moratorium} months

Working Capital:
${formatINR(
  workingCapital
)}

Year 1 Sales:
${formatINR(
  year1Sales
)}

Annual Sales Growth:
${salesGrowth}%

Raw Material Cost:
${rawMaterialPercent}% of sales

Salary & Wages:
${salaryPercent}% of sales

Power & Utilities:
${powerPercent}% of sales

Administrative Expenses:
${adminPercent}% of sales

Marketing Expenses:
${marketingPercent}% of sales

Other Expenses:
${otherExpensePercent}% of sales

Depreciation Rate:
${depreciationRate}%

========================================================
CAPITAL COST STATEMENT
========================================================

THIS CAPITAL COST STATEMENT IS
FINANCIALLY LOCKED.

Use ONLY the following values.

Land / Site Development:
${formatINR(
  landCost
)}

Building / Civil Works:
${formatINR(
  buildingCost
)}

Plant & Machinery:
${formatINR(
  plantMachinery
)}

Electrical Installation:
${formatINR(
  electricalEquipment
)}

Furniture & Equipment:
${formatINR(
  furnitureFixtures
)}

Preliminary & Pre-operative Expenses:
${formatINR(
  preliminaryExpenses
)}

Contingency:
${formatINR(
  contingency
)}

Working Capital Margin:
${formatINR(
  workingCapitalMargin
)}

Other Fixed Assets / Miscellaneous Project Cost:
${formatINR(
  otherFixedAssets
)}

Total Capital Cost:
${formatINR(
  capitalCostTotal
)}

Total Project Cost:
${formatINR(
  projectCost
)}

Reconciliation Difference:
${formatINR(
  capitalCostDifference
)}

Capital Cost Reconciled:
${
  capitalCostReconciled
    ? "YES"
    : "NO"
}

MANDATORY CAPITAL COST RULES:

1. Do not invent any capital-cost component.

2. Do not redistribute amounts between
   capital-cost heads.

3. Do not replace supplied values
   with estimated values.

4. Do not change the Total Project Cost.

5. Do not create an "Unallocated" amount
   when the Reconciliation Difference is zero.

6. Because Capital Cost Reconciled is:

${
  capitalCostReconciled
    ? "YES"
    : "NO"
}

the DPR must reflect the exact
reconciliation status.

7. When Capital Cost Reconciled is YES,
write:

"Capital cost components are fully
reconciled with the Total Project Cost."

8. When Capital Cost Reconciled is YES,
DO NOT show:

"Capital Cost Reconciliation Pending"

and DO NOT show a positive:

"Unallocated / Reconciliation Difference"

9. Prepare the Capital Cost Statement
   using this format:

| Particulars | Amount (₹) |
|---|---:|
| Land / Site Development | ${formatINR(
  landCost
)} |
| Building / Civil Works | ${formatINR(
  buildingCost
)} |
| Plant & Machinery | ${formatINR(
  plantMachinery
)} |
| Electrical Installation | ${formatINR(
  electricalEquipment
)} |
| Furniture & Equipment | ${formatINR(
  furnitureFixtures
)} |
| Preliminary & Pre-operative Expenses | ${formatINR(
  preliminaryExpenses
)} |
| Contingency | ${formatINR(
  contingency
)} |
| Working Capital Margin | ${formatINR(
  workingCapitalMargin
)} |
| Other Fixed Assets / Miscellaneous Project Cost | ${formatINR(
  otherFixedAssets
)} |
| Total Capital Cost | ${formatINR(
  capitalCostTotal
)} |
| Total Project Cost | ${formatINR(
  projectCost
)} |
| Reconciliation Difference | ${formatINR(
  capitalCostDifference
)} |

========================================================
MEANS OF FINANCE
========================================================

THIS SECTION IS FINANCIALLY LOCKED.

Use exactly:

Promoter Contribution:
${formatINR(
  promoterContributionAmount
)}

Bank Term Loan:
${formatINR(
  estimatedTermLoan
)}

Expected Subsidy:
${formatINR(
  estimatedSubsidy
)}

Total:
${formatINR(
  projectCost
)}

Do not alter these values.

Clearly state that subsidy is an estimated
financial modelling assumption subject to
official scheme eligibility.

========================================================
GOSUBSIDY FINANCIAL PROJECTIONS
— SELECTED HORIZON
========================================================

Selected Financial Projection Period:
${projectionYears} years

The following projections were calculated
by the GoSubsidy frontend financial engine.

Use these exact values wherever corresponding
financial tables are prepared.

MANDATORY PROJECTION RULES:

1. Generate financial statements for
   Year 1 through Year ${projectionYears}.

2. Do not add years beyond
   Year ${projectionYears}.

3. Do not remove any supplied year.

4. Do not replace the supplied values
   with AI calculations.

5. Income Statement, Expenditure Statement,
   P&L, Balance Sheet, Cash Flow,
   Depreciation and DSCR must use
   the same horizon.

6. If projection period is 1 year,
   show only Year 1.

7. If projection period is 15 years,
   show Year 1 through Year 15.

${financialProjectionText}

GoSubsidy Calculated Average DSCR:

${
  averageDSCR > 0
    ? averageDSCR.toFixed(2)
    : "Not available"
}

========================================================
IMPORTANT SUBSIDY DISCLAIMER
========================================================

Do not invent government subsidy eligibility.

The subsidy percentage supplied is a
financial modelling assumption entered
by the applicant.

Actual subsidy eligibility, eligible
project cost, maximum subsidy,
applicable subsidy percentage and
scheme conditions must be verified
against official Government scheme
guidelines.

Do not state that subsidy approval
is guaranteed.

Do not state that bank finance
is guaranteed.

========================================================
DPR STRUCTURE
========================================================

Prepare the DPR with the following
numbered sections.

1. EXECUTIVE SUMMARY

Provide a professional overview
of the project.

Use the exact Project Cost,
Promoter Contribution, Term Loan
and Expected Subsidy supplied above.

2. PROJECT AT A GLANCE

Prepare a professional table including:

Project Name
Promoter Name
Business / Sector
Constitution
State
District
Location
Project Cost
Promoter Contribution
Bank Term Loan
Expected Subsidy
Interest Rate
DPR Projection Horizon
Moratorium

3. PROMOTER PROFILE

Use only information supplied
by the applicant.

Do not invent:

education,
experience,
net worth,
assets,
professional qualifications,
business history.

When information is unavailable state:

"Additional promoter information is required."

4. BUSINESS / PROJECT DESCRIPTION

The selected Business / Sector is:

${project.businessType || "business"}

Treat this selected Business / Sector as the PRIMARY DOMAIN CONTEXT.

Generate category-specific content, not generic business-plan wording.
Do not display a separate “Loan Repayment Period” or “Loan Tenure” field in the narrative. The single customer-selected “DPR Projection Horizon” is the visible horizon/term label; it controls both projection years and repayment schedule.

Cover:
- business model and commercial purpose
- typical products and/or services relevant to the selected category
- high-level operating/service workflow
- relevant customer segments
- how the proposed activity creates revenue

MANDATORY SUBSECTION:

### Product / Service & Capacity

Explain the relevant product/service mix, capacity-planning considerations,
utilisation considerations, operating scale and scale-up logic for the selected
business category.

Do NOT invent:
- production quantities
- installed capacity
- machinery counts
- customer contracts
- confirmed customers
- project-specific product specifications

If a project-specific fact is unavailable, state that additional project
information is required rather than guessing.

5. INDUSTRY OVERVIEW

Provide a concise Indian industry overview specifically relevant to:

${project.businessType || "the selected business"}

Cover:
- nature of the industry
- typical value chain
- major operating/commercial characteristics
- relevant demand conditions
- broad regulatory/compliance considerations where appropriate

Do not fabricate market-size figures, growth rates, rankings or statistics.
Use general industry observations unless reliable project-specific information
has been supplied.

6. MARKET POTENTIAL

Generate market analysis specifically for the selected Business / Sector.

Cover:
- Target Customers
- Demand Drivers
- Competition
- Marketing Strategy
- Distribution Strategy
- Sales Strategy
- customer acquisition considerations
- pricing/revenue considerations at a general category level

Clearly distinguish general industry observations from applicant-supplied facts.
Do not invent named customers, signed orders, contracts, market shares or
guaranteed sales.

7. TECHNICAL FEASIBILITY

Generate technical content specifically for the selected Business / Sector.

MANDATORY SUBSECTION — use this exact heading:
### Raw Materials, Utilities & Supply Chain

This subsection must always be returned. If project-specific details are unavailable, provide category-level inputs/utilities/sourcing/storage/quality-control considerations and clearly mark quantities, vendors, contracts and other project-specific details as requiring confirmation. Do not omit the subsection.

Cover:
- Project Location considerations
- Site / Infrastructure requirements
- Plant & Machinery or service equipment categories
- Utilities
- Manpower categories and roles
- Production / Service Process
- Raw Materials / Inputs where applicable
- Procurement / Supply Chain
- Quality Control
- Regulatory / operational compliance considerations
- Implementation requirements

Do not invent machinery capacities, equipment quantities, staffing numbers,
supplier names, licences, approvals or implementation dates.

BUSINESS-CONTENT LENGTH AND STYLE CONTROL

For Sections 4, 5, 6 and 7:
- Keep each section concise and bank-ready.
- Target approximately 140–240 words per section.
- Do not exceed approximately 260 words per section.
- Use clear subheadings where useful.
- Use bold labels for important highlights.
- Avoid generic filler that could apply equally to every business.
- Make the narrative visibly specific to the selected Business / Sector.
- Never replace supplied financial values with AI-generated estimates.

8. CAPITAL COST STATEMENT

Use the financially locked Capital
Cost Statement provided above.

The authoritative Total Project Cost is:

${formatINR(
  projectCost
)}

The authoritative Total Capital Cost is:

${formatINR(
  capitalCostTotal
)}

The Reconciliation Difference is:

${formatINR(
  capitalCostDifference
)}

Capital Cost Reconciled:

${
  capitalCostReconciled
    ? "YES"
    : "NO"
}

When reconciled, explicitly state:

"Capital cost components are fully
reconciled with the Total Project Cost."

Do not create an unallocated difference
when the difference is zero.

9. MEANS OF FINANCE

Use exactly:

Promoter Contribution:
${formatINR(
  promoterContributionAmount
)}

Bank Term Loan:
${formatINR(
  estimatedTermLoan
)}

Expected Subsidy:
${formatINR(
  estimatedSubsidy
)}

Total:
${formatINR(
  projectCost
)}

10. INCOME STATEMENT

Use the supplied GoSubsidy projections
for the selected ${projectionYears}-year period.

Prepare a professional table showing:

Sales
EBITDA
Profit Before Tax
Profit After Tax

Do not recalculate values when
GoSubsidy has already supplied them.

11. EXPENDITURE STATEMENT

Use supplied GoSubsidy projections.

Show:

Raw Material
Salaries
Power
Administration
Marketing
Other Expenses
Total Operating Expenses

12. PROFIT AND LOSS ACCOUNT

Use the supplied GoSubsidy projections.

Show:

Sales
Operating Expenses
EBITDA
Depreciation
Interest
Profit Before Tax
Estimated Tax
Profit After Tax

13. BALANCE SHEET

Use supplied indicative GoSubsidy
values where available.

Show:

Net Fixed Assets
Current Assets
Total Assets
Outstanding Term Loan
Current Liabilities
Indicative Net Worth

Clearly state that a final bank-ready
balance sheet may require detailed
inventory, receivables, creditors,
cash/bank balances and other
working-capital information.

14. CASH FLOW STATEMENT

Use supplied GoSubsidy financial
projections.

Show:

Profit After Tax
Depreciation
Operating Cash Flow
Principal Repayment
Financing Cash Flow
Net Cash Flow

15. REPAYMENT SCHEDULE

Use the exact GoSubsidy repayment
projections supplied inside the
financial projection data.

Authoritative DPR Projection Horizon:

${projectionYears} years

Authoritative financial projection horizon:

${projectionYears} years

If the projection horizon is longer
than the loan tenure, show zero
principal repayment after the loan
has been fully repaid.

Do not extend the loan beyond
the selected tenure.

Opening Term Loan:

${formatINR(
  estimatedTermLoan
)}

Interest Rate:

${interestRate}% per annum

DPR Projection Horizon:

${projectionYears} years

Moratorium:

${moratorium} months

Show:

Year
Opening Loan
Principal Repayment
Interest
Total Debt Service
Closing Loan

16. DEPRECIATION STATEMENT

Use supplied GoSubsidy depreciation
projections for Year 1 through
Year ${projectionYears}.

Show:

Opening Written Down Value
Depreciation
Closing Written Down Value

State that final depreciation treatment
should comply with applicable accounting
and tax requirements.

17. DSCR STATEMENT

Use the supplied GoSubsidy DSCR
calculations for Year 1 through
Year ${projectionYears}.

DSCR =
Cash Available for Debt Service /
Total Debt Service

Show yearly DSCR and average DSCR.

Average GoSubsidy DSCR:

${
  averageDSCR > 0
    ? averageDSCR.toFixed(2)
    : "Not available"
}

Do not invent alternative cash
accrual figures when GoSubsidy
calculations are supplied.

18. BREAK-EVEN ANALYSIS

Provide an indicative break-even
analysis only when sufficient data
is available.

If sufficient information is unavailable
state:

"Additional information is required
for final break-even calculation."

19. EMPLOYMENT GENERATION

Discuss relevant employment categories.

Do not invent a specific employee
count unless supplied.

20. GOVERNMENT SUBSIDY /
SCHEME CONSIDERATION

Discuss potential Government support
only in general terms.

Do not claim confirmed scheme eligibility.

Do not invent scheme names
or subsidy limits.

Clearly state that the:

${subsidyPercent}%

subsidy used in this DPR is an
estimated financial modelling assumption.

21. SWOT ANALYSIS

Provide:

Strengths
Weaknesses
Opportunities
Threats

specific to the proposed business category.

22. RISK ANALYSIS

Discuss:

Market Risk
Operational Risk
Financial Risk
Regulatory Risk
Technology Risk

Provide practical mitigation measures.

23. IMPLEMENTATION SCHEDULE

Provide an indicative implementation
sequence:

Project Planning
Finance Approval
Site Preparation
Procurement
Installation
Trial Run
Commercial Operations

Do not invent confirmed implementation dates.

24. CONCLUSION & BANKABILITY

Provide a professional preliminary
conclusion.

Maintain exact consistency with:

Project Cost:
${formatINR(
  projectCost
)}

Promoter Contribution:
${formatINR(
  promoterContributionAmount
)}

Bank Term Loan:
${formatINR(
  estimatedTermLoan
)}

Expected Subsidy:
${formatINR(
  estimatedSubsidy
)}

Capital Cost:
${formatINR(
  capitalCostTotal
)}

Capital Cost Difference:
${formatINR(
  capitalCostDifference
)}

Do not guarantee:

bank sanction,
subsidy approval,
project approval.

State that final bankability depends
on lender appraisal, promoter credentials,
quotations, market assessment, technical
feasibility, financial verification and
Government scheme eligibility.

========================================================
OUTPUT STYLE
========================================================

Use professional Indian banking
and DPR terminology.

Use clear numbered headings.

Use markdown tables for
financial statements.

Use Indian Rupee formatting.

Keep all calculations
internally consistent.

The GoSubsidy supplied financial values
are the authoritative source of truth.

Do not fabricate missing
financial information.

Do not use LaTeX.

Do not use $$ mathematical blocks.

Do not use \\frac.

Write formulas as plain text.

The final output must look like a
professional Detailed Project Report
rather than a conversational AI response.

FINAL BUSINESS-SPECIFICITY CHECK:
Before returning the DPR, verify that Sections 4–7 are genuinely relevant
to the selected Business / Sector and do not contain generic placeholder
language. If a project-specific fact is not supplied, explicitly identify
the information as requiring confirmation rather than inventing it.
`;

    // ==================================================
    // 12. SEND TO GEMINI
    // ==================================================

    console.log("");

    console.log(
      "🚀 Sending GoSubsidy verified financial data to Gemini..."
    );

    console.log(
      "📊 FINAL DPR PROJECTION:",
      {
        loanTenure,
        projectionYears,
        projectionYearCount,
        projectionAligned,
        moratorium,
      }
    );

    const response =
      await ai.models.generateContent({
        model: "gemini-3.6-flash",
        contents: prompt,
      });

    // ==================================================
    // 13. GET GEMINI RESPONSE
    // ==================================================

    const dpr =
      response?.text;

    if (
      !dpr ||
      !dpr.trim()
    ) {
      throw new Error(
        "Gemini returned an empty DPR response."
      );
    }

    console.log(
      "✅ AI DPR generated successfully"
    );

    // ==================================================
    // 14. RETURN DPR TO FRONTEND
    // ==================================================

    return res.status(200).json({
      success: true,

      message:
        "Detailed Project Report generated successfully.",

      provider:
        "Google Gemini",

      project: {
        projectName:
          project.projectName,

        promoterName:
          project.promoterName,

        mobile:
          project.mobile,

        email:
          project.email,

        businessType:
          project.businessType,

        constitution:
          project.constitution,

        state:
          project.state,

        district:
          project.district,

        location:
          project.location,

        projectCost,

        promoterContributionPercent,

        promoterContributionAmount,

        subsidyPercent,

        estimatedSubsidy,

        estimatedTermLoan,

        totalMeansOfFinance,

        interestRate,

        loanTenure,

        moratorium,

        projectionYears,

        projectionYearCount,

        projectionAligned,

        averageDSCR,

        financeIsBalanced,

        financeDifference,

        capitalCost: {
          land:
            landCost,

          building:
            buildingCost,

          plantMachinery,

          electrical:
            electricalEquipment,

          furniture:
            furnitureFixtures,

          preliminary:
            preliminaryExpenses,

          contingency,

          workingCapitalMargin,

          otherFixedAssets,

          totalCapitalCost:
            capitalCostTotal,

          totalProjectCost:
            projectCost,

          reconciliationDifference:
            capitalCostDifference,

          reconciled:
            capitalCostReconciled,
        },
      },

      projection: {
        selectedYears:
          projectionYears,

        receivedYears:
          projectionYearCount,

        aligned:
          projectionAligned,

        firstYear:
          projectionYearCount > 0
            ? numberValue(
                years[0]?.year
              )
            : null,

        lastYear:
          projectionYearCount > 0
            ? numberValue(
                years[
                  projectionYearCount - 1
                ]?.year
              )
            : null,
      },

      calculations: {
        years,
        averageDSCR,
      },

      financialSummary: {
        projectCost,

        promoterContributionAmount,

        estimatedTermLoan,

        estimatedSubsidy,

        totalMeansOfFinance,

        promoterContributionPercent,

        subsidyPercent,

        interestRate,

        loanTenure,

        moratorium,

        projectionYears,

        projectionYearCount,

        projectionAligned,

        averageDSCR,

        totalCapitalCost:
          capitalCostTotal,

        capitalCostDifference,

        capitalCostReconciled,
      },

      dpr,
    });
  } catch (error) {
    // ==================================================
    // 15. ERROR HANDLING
    // ==================================================

    console.error("");

    console.error(
      "========================================"
    );

    console.error(
      "❌ GoSubsidy DPR Generation Error"
    );

    console.error(
      "========================================"
    );

    console.error(error);

    const status =
      error?.status ||
      error?.response?.status ||
      500;

    // ==================================================
    // RATE LIMIT
    // ==================================================

    if (
      status === 429
    ) {
      return res.status(429).json({
        success: false,

        message:
          "Gemini API rate limit or quota reached. Please try again later.",
      });
    }

    // ==================================================
    // MODEL ERROR
    // ==================================================

    if (
      status === 404
    ) {
      return res.status(500).json({
        success: false,

        message:
          "The configured Gemini model is unavailable.",

        error:
          error?.message ||
          "Gemini model not found.",
      });
    }

    // ==================================================
    // GENERAL ERROR
    // ==================================================

    return res.status(500).json({
      success: false,

      message:
        "Unable to generate the Detailed Project Report.",

      error:
        error?.message ||
        "Unknown Gemini API error.",
    });
  }
};

export default generateDPR;