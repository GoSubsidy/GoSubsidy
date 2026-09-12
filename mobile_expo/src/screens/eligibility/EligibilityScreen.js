import React, { useState } from "react";
import { View, Text, Button, TextInput } from "react-native";

export default function EligibilityScreen({ route }) {
  const { scheme } = route.params;
  const [income, setIncome] = useState("");
  const [result, setResult] = useState(null);

  const checkEligibility = () => {
    if (Number(income) < 500000) {
      setResult("✅ You are eligible for this scheme");
    } else {
      setResult("❌ Income exceeds eligibility limit");
    }
  };

  return (
    <View style={{ padding: 20 }}>
      <Text style={{ fontSize: 18, fontWeight: "bold" }}>
        Eligibility – {scheme.name}
      </Text>

      <Text style={{ marginTop: 20 }}>Annual Income</Text>
      <TextInput
        value={income}
        onChangeText={setIncome}
        keyboardType="numeric"
        placeholder="Enter income"
        style={{
          borderWidth: 1,
          padding: 10,
          marginTop: 10,
        }}
      />

      <View style={{ marginTop: 20 }}>
        <Button title="Check" onPress={checkEligibility} />
      </View>

      {result && (
        <Text style={{ marginTop: 20, fontSize: 16 }}>
          {result}
        </Text>
      )}
    </View>
  );
}
