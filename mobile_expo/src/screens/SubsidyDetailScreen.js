"./src/screens/SubsidyDetailScreen";
// mobile_expo/src/screens/SubsidyDetailScreen.js
import React from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function SubsidyDetailScreen({ route }) {
  const item = route.params?.item || {};

  return (
    <SafeAreaView style={s.container}>
      <ScrollView contentContainerStyle={s.inner}>
        <Text style={s.title}>{item.scheme_name || "No name"}</Text>
        <Text style={s.subtitle}>{item.description || "No description"}</Text>

        <View style={{ height: 12 }} />

        <View style={s.row}>
          <Text style={s.label}>Benefit:</Text>
          <Text style={s.value}>{item.benefit_amount || "—"}</Text>
        </View>

        <View style={{ height: 10 }} />

        <View style={s.row}>
          <Text style={s.label}>ID:</Text>
          <Text style={s.value}>{item.id ?? "—"}</Text>
        </View>

        {/* more fields can go here */}
      </ScrollView>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  inner: { padding: 18 },
  title: { fontSize: 28, fontWeight: "800", marginBottom: 8 },
  subtitle: { fontSize: 16, color: "#444" },
  row: {
    flexDirection: "row",
    justifyContent: "flex-start",
    marginTop: 8,
  },
  label: { fontWeight: "700", width: 100 },
  value: { color: "#222" },
});
