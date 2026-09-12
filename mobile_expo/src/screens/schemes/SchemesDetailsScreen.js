import React from "react";
import { View, Text, StyleSheet } from "react-native";

export default function SchemeDetailsScreen({ route }) {
  const { scheme } = route.params;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{scheme.name}</Text>

      <Text style={styles.text}>• Eligibility: Based on scheme rules</Text>
      <Text style={styles.text}>• Loan Amount: As per bank norms</Text>
      <Text style={styles.text}>• Subsidy: Govt supported</Text>

      <Text style={styles.note}>
        (EMI + AI recommendation coming next)
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  title: { fontSize: 20, fontWeight: "bold", marginBottom: 16 },
  text: { fontSize: 14, marginBottom: 8 },
  note: { marginTop: 20, fontStyle: "italic", color: "gray" },
});
