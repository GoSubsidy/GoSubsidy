import React from "react";
import { View, Text, FlatList, TouchableOpacity } from "react-native";
import { schemes } from "../data/schemes";

export default function SchemeListScreen({ navigation }) {
  return (
    <FlatList
      data={schemes}
      keyExtractor={(item) => item.id}
      contentContainerStyle={{ padding: 16 }}
      renderItem={({ item }) => (
        <TouchableOpacity
          onPress={() =>
            navigation.navigate("SchemeDetails", {
              schemeId: item.id,
            })
          }
          style={{
            backgroundColor: "#fff",
            padding: 16,
            borderRadius: 12,
            marginBottom: 12,
            elevation: 2,
          }}
        >
          <Text style={{ fontSize: 16, fontWeight: "bold" }}>
            {item.title}
          </Text>
          <Text style={{ color: "#2563eb", marginTop: 4 }}>
            {item.category}
          </Text>
          <Text style={{ color: "#666", marginTop: 6 }}>
            {item.description}
          </Text>
        </TouchableOpacity>
      )}
    />
  );
}
