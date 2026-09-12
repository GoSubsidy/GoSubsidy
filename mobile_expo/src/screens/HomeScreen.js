import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";

export default function HomeScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.card}>
        <Text style={styles.title}>Agriculture Subsidy Loan</Text>
        <Text style={styles.desc}>View details →</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.card}>
        <Text style={styles.title}>MSME Subsidy Scheme</Text>
        <Text style={styles.desc}>View details →</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.card}>
        <Text style={styles.title}>Housing Subsidy (PMAY)</Text>
        <Text style={styles.desc}>View details →</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.card}>
        <Text style={styles.title}>Education Loan Subsidy</Text>
        <Text style={styles.desc}>View details →</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  card: {
    backgroundColor: "#ffffff",
    padding: 16,
    borderRadius: 10,
    marginBottom: 12,
    elevation: 2,
  },
  title: {
    fontSize: 16,
    fontWeight: "600",
  },
  desc: {
    marginTop: 6,
    color: "#666",
  },
});
