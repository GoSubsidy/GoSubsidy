"./src/screens/ProductListScreen";
// mobile_expo/src/screens/ProductListScreen.js
import React, { useEffect, useState, useCallback } from "react";
import { View, Text, FlatList, ActivityIndicator, RefreshControl, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { getProducts } from "../api/client";
import ProductCard from "../components/ProductCard";

export default function ProductListScreen({ navigation }) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);

  const load = useCallback(async (opts = { showLoading: true }) => {
    if (opts.showLoading) setLoading(true);
    setError(null);
    try {
      const list = await getProducts();
      setData(Array.isArray(list) ? list : []);
    } catch (e) {
      console.error("getProducts error:", e);
      setError(e?.message || "Failed to load products");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    load({ showLoading: true });
  }, [load]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    load({ showLoading: false });
  }, [load]);

  if (loading) {
    return (
      <SafeAreaView style={styles.center}>
        <ActivityIndicator size="large" />
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={styles.center}>
        <Text style={styles.errorTitle}>Error</Text>
        <Text style={styles.errorText}>{error}</Text>
        <Text style={styles.hint}>Pull down to retry.</Text>
        <FlatList
          data={[]}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        />
      </SafeAreaView>
    );
  }

  if (!data || data.length === 0) {
    return (
      <SafeAreaView style={styles.center}>
        <Text style={styles.emptyTitle}>No products found</Text>
        <Text style={styles.hint}>Try refreshing or check back later.</Text>
        <FlatList
          data={[]}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={data}
        keyExtractor={(item, index) => (item && (item.id ?? item._id) ? String(item.id ?? item._id) : String(index))}
        renderItem={({ item }) => (
          <ProductCard item={item} onPress={() => navigation.navigate("ProductDetail", { id: item.id ?? item._id })} />
        )}
        contentContainerStyle={{ padding: 12 }}
        ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f6f7fb" },
  center: { flex: 1, justifyContent: "center", alignItems: "center", padding: 16 },
  emptyTitle: { fontSize: 18, fontWeight: "700", marginBottom: 6 },
  errorTitle: { fontSize: 18, fontWeight: "700", color: "#d9534f", marginBottom: 6 },
  errorText: { color: "#666", marginBottom: 8, textAlign: "center" },
  hint: { color: "#888", marginTop: 6 }
});
