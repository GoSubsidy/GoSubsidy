import React from "react";
import { View, Text, Button } from "react-native";
import { calculateEMI } from "../utils/emi";

export default function LoanDetailScreen({ route, navigation }) {
  const { loan } = route.params;
  const amount = 500000;
  const tenure = loan.tenure[1];
  const rate = loan.interest[0];

  const emi = calculateEMI(amount, rate, tenure);

  return (
    <View style={{ padding: 16 }}>
      <Text style={{ fontSize: 20, fontWeight: "700" }}>{loan.name}</Text>
      <Text>Interest Rate: {rate}%</Text>
      <Text>Tenure: {tenure} months</Text>

      <Text style={{ fontWeight: "700", marginVertical: 10 }}>
        EMI: ₹{emi}
      </Text>

      <Button
        title="Compare EMI (Banks)"
        onPress={() =>
          navigation.navigate("EMICompare", { loan, amount })
        }
      />

      <Button
        title="View Amortization"
        onPress={() =>
          navigation.navigate("Amortization", {
            loan,
            amount,
            tenure,
          })
        }
      />

      <Button
        title="Apply for this Loan"
        onPress={() =>
          navigation.navigate("Apply", {
            loanType: loan.name,
            amount,
            tenure,
            interest: rate,
          })
        }
      />
    </View>
  );
}
