import React from "react";
import { View, Text, StyleSheet } from "react-native";

export default function InsuranceDetailsScreen({ route }) {
  const { product } = route.params || {};

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        {product?.title || "Insurance Details"}
      </Text>

      <Text style={styles.section}>Description</Text>
      <Text style={styles.text}>{product?.description}</Text>

      <Text style={styles.section}>Eligibility</Text>
      <Text style={styles.text}>{product?.eligibility}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
  },
  section: {
    marginTop: 16,
    fontSize: 16,
    fontWeight: "600",
  },
  text: {
    marginTop: 6,
    fontSize: 14,
    color: "#444",
  },
});
