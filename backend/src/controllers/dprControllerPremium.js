// ============================================================
// GoSubsidy Premium AI DPR V2
// backend/src/controllers/dprControllerPremium.js
// ============================================================

import { GoogleGenAI } from "@google/genai";
import { resolveDPRProfile } from "../config/dprProfiles.js";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

const MODEL = process.env.GEMINI_MODEL || "gemini-3.6-flash";

const n = (value) => {
  const x = Number(value);
  return Number.isFinite(x) ? x : 0;
};

const clean = (value, fallback = "") =>
  String(value ?? fallback).trim();

const money = (value) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(n(value));

function buildAuthoritativeFinancialSnapshot(project, summary, calculations) {
  const years = Array.isArray(calculations?.years)
    ? calculations.years.map((y, index) => ({
        year: n(y?.year) || index + 1,
        sales: n(y?.sales),
        rawMaterial: n(y?.rawMaterial),
        salaries: n(y?.salaries),
        power: n(y?.power),
        admin: n(y?.admin),
        marketing: n(y?.marketing),
        otherExpenses: n(y?.otherExpenses),
        operatingExpenses: n(y?.operatingExpenses),
        ebitda: n(y?.ebitda),
        depreciation: n(y?.depreciation),
        interest: n(y?.interest),
        profitBeforeTax: n(y?.profitBeforeTax),
        estimatedTax: n(y?.estimatedTax),
        profitAfterTax: n(y?.profitAfterTax),
        openingLoan: n(y?.openingLoan),
        repayment: n(y?.repayment),
        debtService: n(y?.debtService),
        closingLoan: n(y?.closingLoan),
        dscr: n(y?.dscr),
        openingWDV: n(y?.openingWDV),
        closingWDV: n(y?.closingWDV),
        operatingCashFlow: n(y?.operatingCashFlow),
        financingCashFlow: n(y?.financingCashFlow),
        netCashFlow: n(y?.netCashFlow),
        netFixedAssets: n(y?.netFixedAssets),
        currentAssets: n(y?.currentAssets),
        totalAssets: n(y?.totalAssets),
        currentLiabilities: n(y?.currentLiabilities),
        netWorth: n(y?.netWorth),
      }))
    : [];

  return {
    projectCost: n(summary?.projectCost || project?.projectCost),
    promoterContribution: n(
      summary?.promoterContribution ||
      summary?.promoterContributionAmount ||
      n(project?.projectCost) * n(project?.promoterContributionPercent) / 100
    ),
    expectedSubsidy: n(
      summary?.expectedSubsidy ||
      summary?.estimatedSubsidy ||
      n(project?.projectCost) * n(project?.subsidyPercent) / 100
    ),
    estimatedTermLoan: n(
      summary?.estimatedTermLoan ||
      n(project?.projectCost) -
      n(summary?.promoterContribution || summary?.promoterContributionAmount) -
      n(summary?.expectedSubsidy || summary?.estimatedSubsidy)
    ),
    averageDSCR: n(calculations?.averageDSCR),
    years,
  };
}

function buildPrompt({ project, summary, capitalCost, calculations, profile }) {
  const financials = buildAuthoritativeFinancialSnapshot(
    project,
    summary,
    calculations
  );

  return `
You are the Premium DPR Narrative Engine for GoSubsidy.

Your job is to create a lender-facing Detailed Project Report for the selected
business/product/service.

CRITICAL RULES:
1. The supplied GoSubsidy financial numbers are AUTHORITATIVE.
2. Never change, recalculate, reinterpret or invent financial figures.
3. Never invent promoter experience, licences, quotations, customers, market share,
   production capacity, approvals, subsidy sanction or government benefits.
4. If information is missing, explicitly write:
   "Additional information is required for final DPR calculation."
5. The report must be professional, factual, concise and appraisal-oriented.
6. Use the selected product/service profile only to structure technical language.
7. The supplied reference DPR structure must be preserved:
   promoter -> executive summary -> project need/vision/mission/objectives ->
   project proposal -> technical details -> parameters -> implementation ->
   business model -> scheduling -> feasibility -> detailed project cost ->
   10 financial statements -> conclusion.
8. Do not mention that you are a chatbot.
9. Do not output Markdown.
10. Return ONLY valid JSON matching the schema below.

SELECTED PRODUCT / SERVICE PROFILE:
${JSON.stringify(profile, null, 2)}

PROJECT DATA:
${JSON.stringify(project, null, 2)}

CAPITAL COST DATA:
${JSON.stringify(capitalCost, null, 2)}

AUTHORITATIVE FINANCIAL SNAPSHOT:
${JSON.stringify(financials, null, 2)}

JSON SCHEMA:
{
  "promoterProfile": "string",
  "executiveSummary": "string",
  "projectRationale": "string",
  "need": "string",
  "vision": "string",
  "mission": "string",
  "objectives": ["string"],
  "businessModel": "string",
  "marketAssessment": "string",
  "scheduling": "string",
  "resourceReadiness": ["string"],
  "technicalPoints": ["string"],
  "process": ["string"],
  "parameters": [{"label":"string","value":"string"}],
  "implementation": [{"title":"string","duration":"string"}],
  "feasibility": [{"type":"Technical|Managerial|Economic|Commercial|Financial","text":"string"}],
  "risks": [{"risk":"string","mitigation":"string"}],
  "swot": {
    "strengths":["string"],
    "weaknesses":["string"],
    "opportunities":["string"],
    "threats":["string"]
  },
  "conditions": ["string"],
  "creditView": "string",
  "conclusion": "string"
}

Use only project facts that are present. For sector-specific technical content,
describe what should be verified rather than asserting unsupported facts.
`;
}

function safeJson(text) {
  const raw = String(text || "").trim();
  try {
    return JSON.parse(raw);
  } catch {}

  const fenced = raw.replace(/^```json\s*/i, "").replace(/```$/i, "").trim();
  try {
    return JSON.parse(fenced);
  } catch {
    return {
      executiveSummary: raw,
      conclusion: raw,
    };
  }
}

export const generatePremiumDPR = async (req, res) => {
  try {
    if (!process.env.GEMINI_API_KEY) {
      return res.status(500).json({
        success: false,
        message: "GEMINI_API_KEY is missing in backend .env file.",
      });
    }

    const body = req.body || {};
    const payload = body.project || body;

    const project = payload?.project || payload || {};
    const summary = payload?.summary || {};
    const capitalCost = payload?.capitalCost || {};
    const calculations = payload?.calculations || {};
    const profile = resolveDPRProfile(project);

    if (!clean(project.projectName)) {
      return res.status(400).json({
        success: false,
        message: "Project name is required.",
      });
    }

    if (!clean(project.promoterName)) {
      return res.status(400).json({
        success: false,
        message: "Promoter name is required.",
      });
    }

    const financialSnapshot = buildAuthoritativeFinancialSnapshot(
      project,
      summary,
      calculations
    );

    const prompt = buildPrompt({
      project,
      summary,
      capitalCost,
      calculations,
      profile,
    });

    const response = await ai.models.generateContent({
      model: MODEL,
      contents: prompt,
      config: {
        temperature: 0.25,
        responseMimeType: "application/json",
      },
    });

    const aiText = response?.text || "";
    const structuredDPR = safeJson(aiText);

    return res.status(200).json({
      success: true,
      message: "Premium AI DPR generated successfully.",
      provider: "Google Gemini",
      model: MODEL,
      dprProfile: profile,
      structuredDPR,
      financialSnapshot,
      project: {
        projectName: project.projectName,
        promoterName: project.promoterName,
        businessType: project.businessType,
        constitution: project.constitution,
        state: project.state,
        district: project.district,
        location: project.location,
        projectCost: financialSnapshot.projectCost,
        promoterContributionAmount: financialSnapshot.promoterContribution,
        estimatedSubsidy: financialSnapshot.expectedSubsidy,
        estimatedTermLoan: financialSnapshot.estimatedTermLoan,
        averageDSCR: financialSnapshot.averageDSCR,
        interestRate: n(project.interestRate),
        loanTenure: n(project.loanTenure),
        moratorium: n(project.moratorium),
        capitalCost,
      },
    });
  } catch (error) {
    console.error("Premium DPR V2 generation error:", error);

    const status =
      error?.status ||
      error?.response?.status ||
      500;

    if (status === 429) {
      return res.status(429).json({
        success: false,
        message: "Gemini quota or rate limit reached. Please try again later.",
      });
    }

    if (status === 404) {
      return res.status(500).json({
        success: false,
        message: "Configured Gemini model is unavailable.",
        error: error?.message || "Model not found.",
      });
    }

    return res.status(500).json({
      success: false,
      message: "Premium AI DPR generation failed.",
      error: error?.message || "Unknown DPR generation error.",
    });
  }
};
