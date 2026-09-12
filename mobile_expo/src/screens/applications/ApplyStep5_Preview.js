import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { colors } from "../../theme/colors";

export default function ApplyStep5_Preview({ navigation, route }) {
  const params = route?.params || {};

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Preview Application</Text>

      <Text style={styles.info}>
        Please review your details before submission.
      </Text>

      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate("ApplySubmit", params)}
      >
        <Text style={styles.buttonText}>Submit Application</Text>
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
  info: {
    fontSize: 14,
    marginBottom: 30,
    color: colors.muted,
  },
  button: {
    backgroundColor: colors.primary,
    padding: 14,
    borderRadius: 8,
  },
  buttonText: {
    color: "#fff",
    textAlign: "center",
    fontSize: 16,
    fontWeight: "600",
  },
});
