import OpenAI from "openai";

/**
 * Safe OpenAI wrapper
 * Never crashes backend
 */

let client = null;

if (process.env.OPENAI_API_KEY && process.env.OPENAI_API_KEY.trim()) {
  client = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
  });
  console.log("✅ OpenAI client ready");
} else {
  console.warn("⚠️ OPENAI_API_KEY missing → fallback mode");
}

/**
 * ✅ NAMED EXPORT (IMPORTANT)
 */
export async function generateAdvice({ schemeName }) {
  const fallback = {
    advice: [
      "AI service temporarily unavailable",
      "Ensure KYC is completed",
      "Lower income improves subsidy eligibility",
      "Apply via official government portal"
    ],
    fallback: true
  };

  if (!client) {
    console.warn("⚠️ AI FALLBACK USED");
    return fallback;
  }

  try {
    const res = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: "You are a government subsidy advisor." },
        { role: "user", content: `Give advice for scheme: ${schemeName}` }
      ],
      temperature: 0.4
    });

    const text = res.choices?.[0]?.message?.content || "";

    const advice = text
      .split("\n")
      .map(l => l.replace(/^[-•]\s*/, "").trim())
      .filter(Boolean);

    console.log("✅ AI RESPONSE GENERATED");

    return {
      advice: advice.length ? advice : fallback.advice,
      fallback: false
    };

  } catch (err) {
    console.error("❌ OpenAI error:", err.message);
    return fallback;
  }
}
