export const languages = {
  en: { code: "en-IN", label: "English" },
  hi: { code: "hi-IN", label: "Hindi" },
  te: { code: "te-IN", label: "Telugu" },
};

export function getLanguagePrompt(lang) {
  if (lang === "hi") return "Respond in Hindi.";
  if (lang === "te") return "Respond in Telugu.";
  return "Respond in English.";
}
