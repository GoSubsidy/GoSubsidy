import React, { useState } from "react";
import { View, Text, TextInput, StyleSheet } from "react-native";

export default function LoanCalculatorScreen() {
  const [amount, setAmount] = useState("");
  const [rate, setRate] = useState("");
  const [tenure, setTenure] = useState("");
  const [subsidy, setSubsidy] = useState("");

  const calculateEMI = () => {
    const P = Number(amount);
    const R = Number(rate) / 12 / 100;
    const N = Number(tenure) * 12;

    if (!P || !R || !N) return 0;

    return (
      (P * R * Math.pow(1 + R, N)) /
      (Math.pow(1 + R, N) - 1)
    );
  };

  const emi = calculateEMI();
  const subsidyAmount = subsidy ? Number(subsidy) : 0;
  const effectiveEMI = emi - subsidyAmount / (tenure * 12 || 1);

  return (
    <View style={styles.container}>
      <Text style={styles.header}>EMI Calculator</Text>

      <TextInput
        style={styles.input}
        placeholder="Loan Amount"
        keyboardType="numeric"
        value={amount}
        onChangeText={setAmount}
      />

      <TextInput
        style={styles.input}
        placeholder="Interest Rate (%)"
        keyboardType="numeric"
        value={rate}
        onChangeText={setRate}
      />

      <TextInput
        style={styles.input}
        placeholder="Tenure (Years)"
        keyboardType="numeric"
        value={tenure}
        onChangeText={setTenure}
      />

      <TextInput
        style={styles.input}
        placeholder="Subsidy Amount (Optional)"
        keyboardType="numeric"
        value={subsidy}
        onChangeText={setSubsidy}
      />

      <View style={styles.result}>
        <Text style={styles.resultText}>
          EMI: ₹ {emi ? emi.toFixed(0) : 0}
        </Text>
        <Text style={styles.resultText}>
          Effective EMI (after subsidy): ₹{" "}
          {effectiveEMI ? effectiveEMI.toFixed(0) : 0}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16 },
  header: { fontSize: 22, fontWeight: "bold", marginBottom: 16 },
  input: {
    borderWidth: 1,
    borderColor: "#CCC",
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
  },
  result: {
    marginTop: 20,
    padding: 16,
    backgroundColor: "#EFEFEF",
    borderRadius: 10,
  },
  resultText: { fontSize: 16, marginBottom: 6 },
});
