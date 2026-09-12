import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
} from "react-native";

import { colors } from "../../theme/colors";

export default function TrackerListScreen({ navigation }) {
  const [applications, setApplications] = useState([]);

  useEffect(() => {
    // Dummy data for now
    setApplications([
      { id: "1", scheme: "PMEGP Subsidy", status: "Submitted" },
      { id: "2", scheme: "Poultry Subsidy", status: "Approved" },
    ]);
  }, []);

  return (
    <View style={{ flex: 1, padding: 16 }}>
      <FlatList
        data={applications}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() =>
              navigation.navigate("TrackerDetail", { app: item })
            }
            style={{
              padding: 16,
              marginBottom: 12,
              backgroundColor: "#fff",
              borderRadius: 8,
              borderWidth: 1,
              bordercolor: colors.primary,
            }}
          >
            <Text style={{ fontSize: 16, fontWeight: "bold" }}>
              {item.scheme}
            </Text>
            <Text>Status: {item.status}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}
