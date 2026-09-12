import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";

export default function LoansHomeScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.card}
        onPress={() => navigation.navigate("LoanCalculator")}
      >
        <Text style={styles.title}>Loan EMI Calculator</Text>
        <Text style={styles.desc}>
          Calculate EMI & subsidy benefit impact
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
