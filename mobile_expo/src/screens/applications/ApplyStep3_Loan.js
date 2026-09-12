import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from "react-native";
import { colors } from "../../theme/colors";

export default function ApplyStep3_Loan({ navigation, route }) {
  const params = route?.params || {};
  const [amount, setAmount] = useState("");
  const [tenure, setTenure] = useState("");

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Loan Details</Text>

      <TextInput
        style={styles.input}
        placeholder="Loan Amount"
        keyboardType="numeric"
        value={amount}
        onChangeText={setAmount}
      />

      <TextInput
        style={styles.input}
        placeholder="Tenure (years)"
        keyboardType="numeric"
        value={tenure}
        onChangeText={setTenure}
      />

      <TouchableOpacity
        style={styles.button}
        onPress={() =>
          navigation.navigate("ApplyStep4", {
            ...params,
            amount,
            tenure,
          })
        }
      >
        <Text style={styles.buttonText}>Next</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, backgroundColor: colors.background },
  title: { fontSize: 20, fontWeight: "bold", marginBottom: 20, color: colors.text },
  input: { borderWidth: 1, bordercolor: "#ccc", borderRadius: 8, padding: 12, marginBottom: 15 },
  button: { backgroundColor: colors.primary, padding: 14, borderRadius: 8 },
  buttonText: { color: "#fff", textAlign: "center", fontSize: 16, fontWeight: "600" },
});

