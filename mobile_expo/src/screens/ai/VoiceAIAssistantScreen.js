import React, { useState } from "react";
import { View, Text, Button, TextInput } from "react-native";
import { speak } from "../../voice/textToSpeech";
import { languages } from "../../voice/languageManager";
import { generateRecommendation } from "../../ai/recommendationEngine";

export default function VoiceAIAssistantScreen() {
  const [lang, setLang] = useState("en");
  const [query, setQuery] = useState("");
  const [response, setResponse] = useState("");

  const askAI = () => {
    // Example context (replace with real data)
    const aiReply = generateRecommendation({
      userProfile: { income: 25000 },
      loanDetails: { type: "home", emi: 21000 },
    }).join(" ");

    setResponse(aiReply);
    speak(aiReply, languages[lang].code);
  };

  return (
    <View style={{ padding: 16 }}>
      <Text>Select Language</Text>

      <Button title="English" onPress={() => setLang("en")} />
      <Button title="Hindi" onPress={() => setLang("hi")} />
      <Button title="Telugu" onPress={() => setLang("te")} />

      <TextInput
        placeholder="Speak or type your question"
        value={query}
        onChangeText={setQuery}
      />

      <Button title="Ask AI" onPress={askAI} />

      {response ? <Text>AI: {response}</Text> : null}
    </View>
  );
}
