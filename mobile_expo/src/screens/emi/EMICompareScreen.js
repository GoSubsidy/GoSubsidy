import React from "react";
import { View, Text } from "react-native";
import { calculateEMI } from "../utils/emi";

export default function EMICompareScreen({ route }) {
  const { loan, amount } = route.params;

  return (
    <View style={{ padding: 16 }}>
      <Text style={{ fontSize: 18, fontWeight: "700" }}>
        {loan.name} – EMI Comparison
      </Text>

      {loan.banks.map((bank, idx) => {
        const rate = loan.interest[0] + idx * 0.3;
        const emi = calculateEMI(amount, rate, 60);
        return (
          <Text key={bank}>
            {bank}: ₹{emi} @ {rate}%
          </Text>
        );
      })}
    </View>
  );
}
