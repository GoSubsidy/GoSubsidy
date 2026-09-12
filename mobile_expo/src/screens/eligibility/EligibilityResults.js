import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { colors } from "../../theme/colors";

export default function EligibilityResults({ navigation, route }) {
  const { eligible = false } = route?.params || {};

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Eligibility Result</Text>

      <Text
        style={[
          styles.result,
          { color: eligible ? colors.success : colors.danger },
        ]}
      >
        {eligible ? "You are eligible 🎉" : "You are not eligible ❌"}
      </Text>

      {eligible && (
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate("ApplyStep1")}
        >
          <Text style={styles.buttonText}>Proceed to Apply</Text>
        </TouchableOpacity>
      )}

      <TouchableOpacity
        style={[styles.button, styles.secondary]}
        onPress={() => navigation.popToTop()}
      >
        <Text style={styles.secondaryText}>Back to Schemes</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.background,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 20,
    color: colors.text,
  },
  result: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 30,
  },
  button: {
    backgroundColor: colors.primary,
    paddingVertical: 14,
    paddingHorizontal: 30,
    borderRadius: 8,
    marginBottom: 12,
    width: "80%",
  },
  buttonText: {
    color: "#fff",
    textAlign: "center",
    fontSize: 16,
    fontWeight: "600",
  },
  secondary: {
    backgroundColor: "#eee",
  },
  secondaryText: {
    color: colors.text,
    textAlign: "center",
    fontSize: 16,
  },
});
