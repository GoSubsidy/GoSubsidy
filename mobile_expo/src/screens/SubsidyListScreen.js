"./src/screens/SubsidyListScreen";
// mobile_expo/src/screens/SubsidyListScreen.js
import React, { useEffect, useState } from "react";
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";

// <-- CORRECT relative import from src/screens -> src/config.js
import { BRAND_COLOR } from "../config";

export default function SubsidyListScreen({ navigation }) {
  const [items, setItems] = useState([]);

  async function fetchData() {
    try {
      const res = await fetch(`${API_BASE}/v1/subsidies`);
      const json = await res.json();
      // If your backend returns bodyText string as earlier screenshots (stringified JSON),
      // try parsing fallback:
      const list = json.subsidies || (json.bodyText ? JSON.parse(json.bodyText) : json);
      setItems(list || []);
    } catch (e) {
      Toast.show({ type: "error", text1: "Failed to load", text2: e.message, visibilityTime: 2500 });
    }
  }

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <SafeAreaView style={s.container}>
      <Text style={s.title}>Subsidy List</Text>
      <FlatList
        data={items}
        keyExtractor={(it, i) => `${it.id || i}`}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={s.card}
            onPress={() => navigation.navigate("Details", { subsidy: item })}
          >
            <Text style={s.cardTitle}>{item.scheme_name || "No name"}</Text>
            <Text>{item.description || ""}</Text>
          </TouchableOpacity>
        )}
      />
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  title: { fontSize: 22, fontWeight: "700", marginBottom: 12 },
  card: { paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: "#e0e0e0" },
  cardTitle: { fontWeight: "700", fontSize: 16 },
});
