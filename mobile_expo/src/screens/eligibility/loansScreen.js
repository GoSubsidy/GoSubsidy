import React from "react";
import { View, Text, FlatList, TouchableOpacity } from "react-native";
import { LOANS } from "../data/loans";
import { colors } from "../theme/colors";

export default function LoansScreen({ navigation }) {
  return (
    <View style={{ flex: 1, padding: 16 }}>
      <FlatList
        data={LOANS}
        keyExtractor={(i) => i.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={{
              backgroundcolor: colors.white,
              padding: 16,
              borderRadius: 10,
              marginBottom: 12,
            }}
            onPress={() => navigation.navigate("LoanDetail", { loan: item })}
          >
            <Text style={{ fontSize: 16, fontWeight: "600" }}>{item.name}</Text>
            <Text style={{ color: colors.muted }}>
              Interest {item.interest[0]}% – {item.interest[1]}%
            </Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}
