// placeholder
import React from "react";
import { View, Text, Button, StyleSheet } from "react-native";

export default function OnboardingScreen({ navigation }) {
  return (
    <View style={s.container}>
      <Text style={s.title}>Welcome to Subsidy</Text>
      <Text style={s.text}>
        Apply for loans & subsidies easily with bank-level security.
      </Text>
      <Button title="Get Started" onPress={() => navigation.replace("Login")} />
    </View>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", padding: 24 },
  title: { fontSize: 24, fontWeight: "700", marginBottom: 10 },
  text: { color: "#555", marginBottom: 20 },
});
