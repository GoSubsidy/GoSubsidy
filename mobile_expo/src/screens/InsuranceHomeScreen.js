import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";

export default function InsuranceHomeScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.card}>
        <Text style={styles.title}>Health Insurance</Text>
        <Text style={styles.desc}>
          Covers hospitalization and medical expenses
        </Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.card}>
        <Text style={styles.title}>Life Insurance</Text>
        <Text style={styles.desc}>
          Financial protection for family
        </Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.card}>
        <Text style={styles.title}>Motor Insurance</Text>
        <Text style={styles.desc}>
          Insurance for two-wheeler and car
        </Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.card}>
        <Text style={styles.title}>Crop Insurance</Text>
        <Text style={styles.desc}>
          Protection against crop loss
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  card: {
    backgroundColor: "#f2f2f2",
    padding: 16,
    borderRadius: 10,
    marginBottom: 12,
  },
  title: {
    fontSize: 16,
    fontWeight: "600",
  },
  desc: {
    marginTop: 6,
    color: "#555",
  },
});
