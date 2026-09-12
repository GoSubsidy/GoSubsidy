import React from "react";
import {
  FlatList,
  Text,
  TouchableOpacity,
  StyleSheet,
  View,
} from "react-native";

import { SCHEMES } from "../data/schemes";

export default function SchemesScreen({ navigation }) {
  // Debug (safe)
  console.log("SCHEMES COUNT:", Array.isArray(SCHEMES) ? SCHEMES.length : 0);

  return (
    <View style={{ flex: 1 }}>
      <FlatList
        data={Array.isArray(SCHEMES) ? SCHEMES : []}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContainer}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.card}
            activeOpacity={0.8}
            onPress={() =>
              navigation.navigate("SchemeDetails", {
                id: item.id, // ✅ MUST MATCH SchemeDetailsScreen
              })
            }
          >
            <Text style={styles.title}>{item.title}</Text>

            <Text style={styles.category}>{item.category}</Text>

            <Text style={styles.description}>{item.description}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  listContainer: {
    paddingBottom: 20,
  },
  card: {
    padding: 16,
    backgroundColor: "#ffffff",
    marginHorizontal: 12,
    marginVertical: 8,
    borderRadius: 12,
    elevation: 3,
  },
  title: {
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 4,
  },
  category: {
    color: "#1976d2",
    fontSize: 13,
    marginBottom: 6,
  },
  description: {
    color: "#555",
    fontSize: 14,
  },
});
