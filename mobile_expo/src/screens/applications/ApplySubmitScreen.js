import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { colors } from "../../theme/colors";

export default function ApplySubmitScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Application Submitted 🎉</Text>

      <Text style={styles.info}>
        Your application has been successfully submitted.
      </Text>

      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.popToTop()}
      >
        <Text style={styles.buttonText}>Go to Home</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
    backgroundColor: colors.background,
  },
  title: { fontSize: 22, fontWeight: "bold", marginBottom: 20, color: colors.success },
  info: { fontSize: 14, marginBottom: 30, color: colors.text },
  button: { backgroundColor: colors.primary, padding: 14, borderRadius: 8, width: "80%" },
  buttonText: { color: "#fff", textAlign: "center", fontSize: 16, fontWeight: "600" },
});

