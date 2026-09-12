import React from "react";
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from "react-native";

const schemes = [
  { id: "1", name: "PMEGP Subsidy Scheme" },
  { id: "2", name: "Mudra Loan Scheme" },
  { id: "3", name: "Housing Subsidy Scheme" },
];

export default function SchemesListScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <FlatList
        data={schemes}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.card}
            onPress={() =>
              navigation.navigate("SchemeDetails", { Scheme: item })
            }
          >
            <Text style={styles.title}>{item.name}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  card: {
    padding: 16,
    backgroundColor: "#f2f2f2",
    borderRadius: 8,
    marginBottom: 12,
  },
  title: { fontSize: 16, fontWeight: "600" },
});
