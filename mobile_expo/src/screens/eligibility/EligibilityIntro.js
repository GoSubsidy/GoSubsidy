import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { colors } from "../../theme/colors";

export default function EligibilityQuestions({ navigation, route }) {
  const params = route?.params || {};
  const [answer, setAnswer] = useState(null);

  const handleNext = () => {
    navigation.navigate("EligibilityResults", {
      ...params,
      eligible: answer === "yes",
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Eligibility Questions</Text>

      <Text style={styles.question}>
        Are you above 18 years of age?
      </Text>

      <TouchableOpacity
        style={[
          styles.option,
          answer === "yes" && styles.selected,
        ]}
        onPress={() => setAnswer("yes")}
      >
        <Text style={styles.optionText}>Yes</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[
          styles.option,
          answer === "no" && styles.selected,
        ]}
        onPress={() => setAnswer("no")}
      >
        <Text style={styles.optionText}>No</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[
          styles.nextButton,
          !answer && { opacity: 0.5 },
        ]}
        disabled={!answer}
        onPress={handleNext}
      >
        <Text style={styles.nextText}>Next</Text>
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
  question: {
    fontSize: 16,
    marginBottom: 20,
    color: colors.text,
  },
  option: {
    padding: 14,
    borderWidth: 1,
    borderColor: colors.primary,
    borderRadius: 8,
    marginBottom: 12,
  },
  selected: {
    backgroundColor: colors.primary,
  },
  optionText: {
    color: colors.text,
    textAlign: "center",
    fontSize: 16,
  },
  nextButton: {
    marginTop: 30,
    backgroundColor: colors.primary,
    padding: 14,
    borderRadius: 8,
  },
  nextText: {
    color: "#fff",
    textAlign: "center",
    fontSize: 16,
    fontWeight: "600",
  },
});
