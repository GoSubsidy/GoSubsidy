// placeholder
import React from "react";
import { View, Text, Button } from "react-native";
import { colors } from "../theme/colors";

export default function FinalDecisionScreen({ route }) {
  const { app } = route.params;

  return (
    <View style={{ flex: 1, padding: 16 }}>
      <Text style={{ fontSize: 20, fontWeight: "700" }}>
        Application Approved 🎉
      </Text>

      <Text style={{ marginTop: 12 }}>
        Scheme: {app.scheme}
      </Text>

      <Text>Loan Amount: ₹5,00,000</Text>
      <Text>Subsidy: ₹1,75,000</Text>
      <Text>Final Payable: ₹3,25,000</Text>

      <View style={{ marginTop: 20 }}>
        <Button title="Download Sanction Letter" onPress={() => {}} />
      </View>
    </View>
  );
}
