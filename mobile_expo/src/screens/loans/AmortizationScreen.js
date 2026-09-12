import React from "react";
import { ScrollView, Text } from "react-native";
import { amortizationSchedule } from "../utils/emi";

export default function AmortizationScreen({ route }) {
  const { loan, amount, tenure } = route.params;
  const rows = amortizationSchedule(amount, loan.interest[0], tenure);

  return (
    <ScrollView style={{ padding: 14 }}>
      {rows.map((r) => (
        <Text key={r.month}>
          Month {r.month}: EMI ₹{r.emi} | Interest ₹{r.interest} | Balance ₹{r.balance}
        </Text>
      ))}
    </ScrollView>
  );
}
