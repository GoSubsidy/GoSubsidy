// src/screens/SchemesHomeScreen.js
import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

const SCHEMES = [
  {
    id: "agriculture",
    title: "Agriculture Subsidy",
    description:
      "Crop loans, farm equipment, irrigation & allied activities",
  },
  {
    id: "housing",
    title: "Housing Schemes",
    description:
      "Affordable housing & interest subsidy support",
  },
  {
    id: "education",
    title: "Education Loans",
    description:
      "Student loan subsidy & interest support",
  },
  {
    id: "msme",
    title: "MSME / Business",
    description:
      "Mudra, startup & small business loans",
  },
];

export default function SchemesHomeScreen({ navigation }) {
  return (
    <View style={styles.container}>
      {SCHEMES.map((scheme) => (
        <TouchableOpacity
          key={scheme.id}
          style={styles.card}
          onPress={() =>
            navigation.navigate("SchemeDetails", { scheme })
          }
        >
          <Text style={styles.title}>{scheme.title}</Text>
          <Text style={styles.desc}>{scheme.description}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: "#fff",
    flex: 1,
  },
  card: {
    paddingVertical: 18,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },
  title: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 4,
  },
  desc: {
    fontSize: 14,
    color: "#6B7280",
  },
});
