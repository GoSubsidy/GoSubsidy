import React from "react";
import { View, Text, StyleSheet } from "react-native";

export default function AIAdviceCard({ advice }) {
  if (!advice) return null;

  return (
    <View style={styles.card}>
      <Text style={styles.title}>🤖 AI Advice</Text>
      <Text style={styles.text}>{advice}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    marginTop: 16,
    padding: 16,
    backgroundColor: "#EEF6FF",
    borderRadius: 10,
    borderLeftWidth: 4,
    borderLeftColor: "#2563EB",
  },
  title: {
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 6,
    color: "#1E3A8A",
  },
  text: {
    fontSize: 14,
    color: "#1F2937",
    lineHeight: 20,
  },
});
