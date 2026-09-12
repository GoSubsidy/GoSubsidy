// mobile_expo/src/screens/AdminScreen.js
import React, { useEffect, useState } from "react";
import { View, Text, FlatList, TextInput, Button, Linking, Alert } from "react-native";
import axios from "axios";

// <-- CORRECT relative import from src/screens -> src/config.js
import { BRAND_COLOR } from "../config";

export default function AdminScreen() {
  const [adminKey, setAdminKey] = useState("letmein");
  const [data, setData] = useState([]);

  async function load() {
    try {
      const res = await axios.get(`${API_BASE}/v1/applications`, { params: { admin_key: adminKey || "letmein" }});
      setData(res.data || []);
    } catch (e) {
      Alert.alert("Load failed", "Ensure backend is running and admin_key is correct.");
    }
  }

  function exportCSV() {
    const url = `${API_BASE}/v1/applications/export?admin_key=${encodeURIComponent(adminKey || "letmein")}`;
    Linking.openURL(url).catch(err => {
      Alert.alert("Unable to open", "Open the URL in a browser: " + url);
    });
  }

  useEffect(() => { /* no auto-load */ }, []);

  return (
    <View style={{ flex: 1, padding: 12 }}>
      <Text style={{ fontWeight: "700", fontSize: 18 }}>Admin - Applications</Text>
      <View style={{ flexDirection: "row", marginTop: 8 }}>
        <TextInput placeholder="admin_key" value={adminKey} onChangeText={setAdminKey} style={{ borderWidth: 1, flex: 1, marginRight: 8, padding: 8 }} />
        <Button title="Load" onPress={load} />
      </View>

      <View style={{ flexDirection: "row", marginTop: 8, justifyContent: "space-between" }}>
        <Button title="Export CSV" onPress={exportCSV} />
        <Button title="Clear" onPress={() => setData([])} />
      </View>

      <FlatList data={data} keyExtractor={i => i.id} renderItem={({ item }) => (
        <View style={{ padding: 10, borderBottomWidth: 1 }}>
          <Text style={{ fontWeight: "700" }}>{item.name} ({item.phone})</Text>
          <Text>{item.type} {item.product_id || item.scheme_id || item.subsidy_id}</Text>
          <Text>Loan Req: {item.loan_amount || item.recommended_loan || "-"}</Text>
          <Text>Status: {item.status}</Text>
        </View>
      )} />
    </View>
  );
}
