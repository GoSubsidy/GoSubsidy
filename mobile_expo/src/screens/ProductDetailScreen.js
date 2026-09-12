"./src/screens/ProductDetailScreen";
// mobile_expo/src/screens/ProductDetailScreen.js
import React, { useEffect, useState } from "react";
import { View, Text, ScrollView, Button, ActivityIndicator, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { getProduct } from "../api/client";
import EMIWidget from "../components/EMIWidget";

export default function ProductDetailScreen({ route, navigation }) {
  const id = route.params?.id ?? route.params?.product_id; // accept both shapes
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(Boolean(id));
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!id) {
      setError("No product id provided");
      setLoading(false);
      return;
    }

    let mounted = true;
    (async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await getProduct(id);
        if (mounted) setItem(res);
      } catch (err) {
        console.warn("getProduct error:", err);
        if (mounted) setError(err?.message || "Failed to load product");
      } finally {
        if (mounted) setLoading(false);
      }
    })();

    return () => { mounted = false; };
  }, [id]);

  if (loading) {
    return (
      <SafeAreaView style={styles.center}>
        <ActivityIndicator size="large" />
        <Text style={{ marginTop: 10 }}>Loading product...</Text>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={styles.center}>
        <Text style={{ color: "#d9534f", fontWeight: "700" }}>Error</Text>
        <Text style={{ marginVertical: 8 }}>{error}</Text>
        <Button title="Retry" onPress={() => {
          setError(null);
          setLoading(true);
          // re-trigger effect by toggling id (simple approach)
          setItem(null);
          setTimeout(() => setLoading(false), 20); // small no-op to cause rerender
        }} />
      </SafeAreaView>
    );
  }

  if (!item) {
    return (
      <SafeAreaView style={styles.center}>
        <Text>No product found.</Text>
      </SafeAreaView>
    );
  }

  const productName = item.product_name || item.name || "Product";
  const details = item.details || item.description || "No details available.";

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>{productName}</Text>
        <Text style={styles.details}>{details}</Text>

        {item.type === "loan" && (
          <View style={{ marginTop: 12, width: "100%" }}>
            <EMIWidget
              defaultPrincipal={Number(item.min_loan) || Number(item.recommended_loan) || 100000}
              defaultRate={Number(item.interest_rate) || 10}
              defaultTenure={(item.tenure_months && item.tenure_months[0]) || 36}
            />
          </View>
        )}

        <View style={{ marginTop: 18, width: "100%" }}>
          <Button
            title="Apply / Request Quote"
            onPress={() => navigation.navigate("Apply", { product_id: item.id ?? id })}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16, alignItems: "flex-start" },
  title: { fontSize: 22, fontWeight: "800" },
  details: { marginTop: 8, color: "#333", lineHeight: 20 },
  center: { flex: 1, justifyContent: "center", alignItems: "center", padding: 16 }
});
