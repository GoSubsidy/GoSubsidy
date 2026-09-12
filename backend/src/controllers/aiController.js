import { GoogleGenAI } from "@google/genai";
import { findMatchingSchemes } from "../services/schemeMatcher.js";

// ======================================================
// GEMINI CLIENT
// ======================================================

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

// ======================================================
// HELPER - SAFE TEXT
// ======================================================

const safeText = (value, fallback = "Not available") => {
  if (value === null || value === undefined || value === "") {
    return fallback;
  }

  if (Array.isArray(value)) {
    return value.join(", ");
  }

  if (typeof value === "object") {
    return JSON.stringify(value);
  }

  return String(value);
};

// ======================================================
// AI ADVISOR CONTROLLER
// POST /api/ai/recommend
// ======================================================

export const getAdvice = async (req, res) => {
  try {
    console.log("====================================");
    console.log("🤖 GoSubsidy AI request received");
    console.log("Request Body:", req.body);
    console.log("====================================");

    // ==================================================
    // READ FRONTEND REQUEST
    // ==================================================

    const {
      question = "",
      message = "",
      context = {},
      language = "English",
    } = req.body || {};

    // Accept question from multiple frontend formats
    const userQuestion =
      question ||
      message ||
      context.question ||
      context.message ||
      "";

    // ==================================================
    // PROJECT DETAILS
    // ==================================================

    const business =
      context.business ||
      context.businessType ||
      context.category ||
      context.sector ||
      "";

    const state =
      context.state ||
      context.location ||
      "";

    const projectCost =
      Number(
        context.projectCost ||
          context.investment ||
          context.project_cost ||
          0
      ) || 0;

    // ==================================================
    // VALIDATION
    // ==================================================

    if (!process.env.GEMINI_API_KEY) {
      console.error("❌ GEMINI_API_KEY missing");

      return res.status(500).json({
        success: false,
        message:
          "GEMINI_API_KEY is missing in the backend .env file.",
      });
    }

    if (!userQuestion || !String(userQuestion).trim()) {
      return res.status(400).json({
        success: false,
        message: "Please enter a question.",
      });
    }

    console.log("📌 Business:", business);
    console.log("📌 State:", state);
    console.log("📌 Project Cost:", projectCost);
    console.log("📌 Question:", userQuestion);

    // ==================================================
    // SEARCH VERIFIED SCHEMES FROM SUPABASE
    // ==================================================

    console.log("");
    console.log(
      "🔎 Searching GoSubsidy Supabase database..."
    );

    const matchedSchemes = await findMatchingSchemes(
      {
        business,
        category: business,
        sector: business,
        state,
        projectCost,
        investment: projectCost,
      },
      10
    );

    console.log(
      `✅ Supabase matching completed: ${matchedSchemes.length} scheme(s)`
    );

    // ==================================================
    // PREPARE DATABASE RESULTS FOR GEMINI
    // ==================================================

    let schemeContext = "";

    if (matchedSchemes.length > 0) {
      schemeContext = matchedSchemes
        .map((scheme, index) => {
          return `
--------------------------------------------------
SCHEME ${index + 1}
--------------------------------------------------

Scheme Name:
${safeText(scheme.scheme_name || scheme.name)}

Category:
${safeText(scheme.category)}

Ministry:
${safeText(scheme.ministry)}

Department:
${safeText(scheme.department)}

Beneficiary:
${safeText(scheme.beneficiary)}

Sector:
${safeText(scheme.sector)}

Description:
${safeText(scheme.description)}

Benefits:
${safeText(scheme.benefits)}

Eligibility:
${safeText(scheme.eligibility)}

Required Documents:
${safeText(scheme.required_documents)}

Application Process:
${safeText(scheme.application_process)}

State Applicability:
${safeText(scheme.state_applicability)}

Official Website:
${safeText(scheme.official_website)}

Official Apply Link:
${safeText(scheme.official_apply_link)}

Official Guideline PDF:
${safeText(scheme.official_guideline_pdf)}

Last Verified Date:
${safeText(scheme.last_verified_date)}

Status:
${safeText(scheme.status)}

GoSubsidy Match Score:
${scheme.match_score || 0}%

Matched Business Keywords:
${
  scheme.match_reasons?.business?.length
    ? scheme.match_reasons.business.join(", ")
    : "Not available"
}
`;
        })
        .join("\n");
    } else {
      schemeContext = `
No matching verified schemes were found in the current
GoSubsidy Supabase schemes database for this project.

Do not invent a scheme to compensate for missing database results.

You may explain what type of government support the user
should investigate, but clearly state that GoSubsidy has not
yet found a verified matching scheme in its database.
`;
    }

    // ==================================================
    // GEMINI PROMPT
    // ==================================================

    const prompt = `
You are GoSubsidy AI Advisor.

GoSubsidy is an Indian Government subsidy and scheme
discovery platform.

Your job is to help entrepreneurs, farmers, MSMEs and
business owners understand potentially relevant verified
Government schemes.

==================================================
USER PROJECT DETAILS
==================================================

Business / Sector:
${business || "Not provided"}

State:
${state || "Not provided"}

Project Cost:
₹${
      projectCost
        ? projectCost.toLocaleString("en-IN")
        : "Not provided"
    }

==================================================
VERIFIED GOSUBSIDY DATABASE RESULTS
==================================================

The following schemes were retrieved from the GoSubsidy
Supabase schemes database.

${schemeContext}

==================================================
VERY IMPORTANT DATABASE RULES
==================================================

1. The GoSubsidy database results above are your PRIMARY
   source for recommending specific Government schemes.

2. Prioritize schemes with higher GoSubsidy Match Scores.

3. Do NOT invent:
   - Scheme names
   - Subsidy percentages
   - Grant amounts
   - Loan limits
   - Eligibility limits
   - Application links
   - Government departments
   - Deadlines
   - Official notifications

4. If a specific detail is not available in the database,
   say that the latest official guidelines should be checked.

5. Do not convert a normal bank loan into a subsidy.

6. Clearly distinguish between:
   - Grant
   - Capital subsidy
   - Interest subsidy
   - Interest subvention
   - Government-backed loan
   - Credit guarantee
   - Tax incentive

7. A database match is NOT final eligibility.

8. Final eligibility depends on the latest official scheme
   guidelines and approval by the concerned Government
   department, implementing agency, bank or financial
   institution.

9. If no verified database schemes were found, clearly say:

   "No verified matching scheme is currently available in
   the GoSubsidy database for the supplied project details."

10. Do not claim that the applicant is definitely eligible.

==================================================
USER QUESTION
==================================================

${String(userQuestion).trim()}

==================================================
RESPONSE INSTRUCTIONS
==================================================

Respond in ${language}.

Start with a short project analysis.

Then create a section:

"Potentially Relevant Schemes"

For every recommended scheme provide:

Scheme Name:
Ministry / Department:
GoSubsidy Match Score:
Why It Matches:
Main Benefit:
Key Eligibility:
State Applicability:
How to Apply / Verify:

After the schemes, create:

"Eligibility Assessment"

Explain whether the project appears potentially suitable,
but do not guarantee eligibility.

Then create:

"Recommended Next Steps"

Give practical next steps such as:

- Verify latest official guidelines
- Prepare required documents
- Check project cost limits
- Check promoter contribution
- Check bank finance requirements
- Check subsidy application timing
- Check State-specific incentives

Keep the response professional and easy to understand.

Avoid unnecessarily long generic explanations.

End with:

"Final eligibility, subsidy amount and approval are subject
to the latest official Government guidelines and the
concerned implementing authority."
`;

    // ==================================================
    // SEND TO GEMINI
    // ==================================================

    console.log("");
    console.log("🚀 Sending verified scheme data to Gemini...");

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: prompt,
    });

    // ==================================================
    // GEMINI RESPONSE
    // ==================================================

    const advice = response?.text?.trim();

    if (!advice) {
      throw new Error(
        "Gemini returned an empty response."
      );
    }

    console.log(
      "✅ Gemini recommendation generated successfully"
    );

    // ==================================================
    // RETURN RESULT TO FRONTEND
    // ==================================================

    return res.status(200).json({
      success: true,

      provider: "Google Gemini",

      advice,

      project: {
        business,
        state,
        projectCost,
      },

      totalMatches: matchedSchemes.length,

      matchedSchemes: matchedSchemes.map((scheme) => ({
        id: scheme.id,

        scheme_name:
          scheme.scheme_name ||
          scheme.name ||
          "Unnamed Scheme",

        category: scheme.category || null,

        ministry: scheme.ministry || null,

        department: scheme.department || null,

        sector: scheme.sector || null,

        beneficiary: scheme.beneficiary || null,

        benefits: scheme.benefits || null,

        eligibility: scheme.eligibility || null,

        state_applicability:
          scheme.state_applicability || null,

        official_website:
          scheme.official_website || null,

        official_apply_link:
          scheme.official_apply_link || null,

        official_guideline_pdf:
          scheme.official_guideline_pdf || null,

        last_verified_date:
          scheme.last_verified_date || null,

        status: scheme.status || null,

        match_score: scheme.match_score || 0,

        match_reasons:
          scheme.match_reasons || {},
      })),
    });
  } catch (error) {
    // ==================================================
    // ERROR HANDLING
    // ==================================================

    console.error("");
    console.error("====================================");
    console.error("❌ GoSubsidy AI Advisor Error");
    console.error(error);
    console.error("====================================");

    let message =
      "Unable to generate AI recommendation.";

    const errorMessage =
      error?.message?.toLowerCase() || "";

    // Gemini API key
    if (
      errorMessage.includes("api key") ||
      error?.status === 401
    ) {
      message =
        "Gemini API key is invalid or not configured correctly.";
    }

    // Gemini quota
    else if (
      errorMessage.includes("quota") ||
      errorMessage.includes("rate limit") ||
      error?.status === 429
    ) {
      message =
        "Gemini API quota or rate limit reached. Please try again later.";
    }

    // Gemini model
    else if (
      errorMessage.includes("model") &&
      errorMessage.includes("not found")
    ) {
      message =
        "The configured Gemini model is unavailable. Please check the Gemini model configuration.";
    }

    // Supabase
    else if (
      errorMessage.includes("supabase")
    ) {
      message =
        "Unable to retrieve schemes from the GoSubsidy database.";
    }

    return res.status(500).json({
      success: false,
      message,

      error:
        process.env.NODE_ENV === "development"
          ? error?.message
          : undefined,
    });
  }
};