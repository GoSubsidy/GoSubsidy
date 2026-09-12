import React, { useState } from "react";
import { View, Text, TextInput, Button, ScrollView } from "react-native";
import { buildAIContext } from "../../ai/contextBuilder";
import { generateRecommendation } from "../../ai/recommendationEngine";

export default function AIAssistantScreen() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");

  const handleSend = () => {
    const userMessage = { role: "user", text: input };

    // SAMPLE CONTEXT (replace with real app data)
    const context = buildAIContext({
      user: { age: 32, income: 25000, dependents: 2 },
      loan: { type: "home", emi: 21000 },
      subsidy: { applied: true },
    });

    const recommendations = generateRecommendation(context);

    const aiMessage = {
      role: "assistant",
      text: recommendations.join("\n"),
    };

    setMessages([...messages, userMessage, aiMessage]);
    setInput("");
  };

  return (
    <View style={{ flex: 1, padding: 16 }}>
      <ScrollView>
        {messages.map((m, i) => (
          <Text key={i}>
            {m.role === "user" ? "You: " : "AI: "}
            {m.text}
          </Text>
        ))}
      </ScrollView>

      <TextInput
        placeholder="Ask about loans, insurance, subsidy..."
        value={input}
        onChangeText={setInput}
      />

      <Button title="Ask AI" onPress={handleSend} />
    </View>
  );
}
