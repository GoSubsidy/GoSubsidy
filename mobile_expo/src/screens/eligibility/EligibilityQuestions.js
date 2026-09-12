import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

export default function EligibilityQuestions({ navigation, route }) {
  const params = route?.params || {};

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Eligibility Questions</Text>

      <Text style={styles.question}>
        Are you eligible to apply for this scheme?
      </Text>

      <TouchableOpacity
        style={styles.button}
        onPress={() =>
          navigation.navigate("EligibilityResults", {
            ...params,
            eligible: true,
          })
        }
      >
        <Text style={styles.buttonText}>Yes</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.button, styles.noButton]}
        onPress={() =>
          navigation.navigate("EligibilityResults", {
            ...params,
            eligible: false,
          })
        }
      >
        <Text style={styles.buttonText}>No</Text>
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
    backgroundColor: "#ffffff",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
  },
  question: {
    fontSize: 16,
    marginBottom: 30,
    textAlign: "center",
  },
  button: {
    backgroundColor: "#1e88e5",
    paddingVertical: 14,
    paddingHorizontal: 40,
    borderRadius: 8,
    marginBottom: 12,
    width: "80%",
  },
  noButton: {
    backgroundColor: "#757575",
  },
  buttonText: {
    color: "#ffffff",
    fontSize: 16,
    textAlign: "center",
    fontWeight: "600",
  },
});

