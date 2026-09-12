import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { colors } from "../../theme/colors";

export default function ApplyStep4_Documents({ navigation, route }) {
  const params = route?.params || {};

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Upload Documents</Text>

      <Text style={styles.info}>
        Aadhaar, PAN, Bank Statement, Business Proof
      </Text>

      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate("ApplyStep5", params)}
      >
        <Text style={styles.buttonText}>Continue</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, backgroundColor: colors.background },
  title: { fontSize: 20, fontWeight: "bold", marginBottom: 20, color: colors.text },
  info: { fontSize: 14, marginBottom: 30, color: colors.muted },
  button: { backgroundColor: colors.primary, padding: 14, borderRadius: 8 },
  buttonText: { color: "#fff", textAlign: "center", fontSize: 16, fontWeight: "600" },
});

