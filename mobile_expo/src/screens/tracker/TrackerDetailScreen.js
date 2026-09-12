// placeholder
import React from "react";
import { View, Text } from "react-native";
import { APPLICATION_STEPS } from "../../data/applicationStatus";

export default function TrackerDetailScreen({ route, navigation }) {
  const { app } = route.params;

  return (
    <View style={{ padding: 16 }}>
      <Text style={{ fontSize: 18, fontWeight: "700" }}>{app.scheme}</Text>

      {APPLICATION_STEPS.map((s) => (
        <Text key={s.key}>
          {s.key === app.status ? "✔ " : "○ "} {s.label}
        </Text>
      ))}

      {app.status === "query" && (
        <Text style={{ marginTop: 12, color: "red" }}>
          Bank requested additional documents
        </Text>
      )}
    </View>
  );
}
