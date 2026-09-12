import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from "react-native";
import { colors } from "../../theme/colors";

export default function ApplyStep2_Business({ navigation, route }) {
  const params = route?.params || {};

  const [businessName, setBusinessName] = useState("");
  const [businessType, setBusinessType] = useState("");

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Business Details</Text>

      <TextInput
        style={styles.input}
        placeholder="Business Name"
        value={businessName}
        onChangeText={setBusinessName}
      />

      <TextInput
        style={styles.input}
        placeholder="Business Type (e.g. Poultry, Dairy)"
        value={businessType}
        onChangeText={setBusinessType}
      />

      <TouchableOpacity
        style={styles.button}
        onPress={() =>
          navigation.navigate("ApplyStep3", {
            ...params,
            businessName,
            businessType,
          })
        }
      >
        <Text style={styles.buttonText}>Next</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: colors.background,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
    color: colors.text,
  },
  input: {
    borderWidth: 1,
    bordercolor: "#ccc",
    borderRadius: 8,
    padding: 12,
    marginBottom: 15,
  },
  button: {
    backgroundColor: colors.primary,
    padding: 14,
    borderRadius: 8,
    marginTop: 10,
  },
  buttonText: {
    color: "#fff",
    textAlign: "center",
    fontSize: 16,
    fontWeight: "600",
  },
});
