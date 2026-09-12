import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { getSchemeById } from "../data/schemes";
import LoanCalculator from "../components/LoanCalculator";

export default function SchemeDetailsScreen({ route }) {
  const { schemeId } = route.params || {};
  const scheme = getSchemeById(schemeId);
  const [activeTab, setActiveTab] = useState("Overview");

  if (!scheme) {
    return (
      <View style={styles.center}>
        <Text>Scheme not found</Text>
      </View>
    );
  }

  const renderTab = () => {
    switch (activeTab) {
      case "Overview":
        return (
          <Text style={styles.text}>
            {scheme.overview || "No overview available"}
          </Text>
        );

      case "Eligibility":
        return (
          <View>
            {Object.entries(scheme.eligibility || {}).map(([key, value]) => (
              <Text key={key} style={styles.text}>
                <Text style={styles.label}>{key}:</Text>{" "}
                {Array.isArray(value) ? value.join(", ") : String(value)}
              </Text>
            ))}
          </View>
        );

      case "Loan":
        return (
          <View>
            {Object.entries(scheme.loanDetails || {}).map(([key, value]) => (
              <Text key={key} style={styles.text}>
                <Text style={styles.label}>{key}:</Text>{" "}
                {String(value)}
              </Text>
            ))}
          </View>
        );

      case "Documents":
        return (
          <View>
            {(scheme.documents || []).map((doc, index) => (
              <Text key={index} style={styles.text}>
                • {doc}
              </Text>
            ))}
          </View>
        );

      case "Calculator":
        return <LoanCalculator />;

      default:
        return null;
    }
  };

  return (
    <View style={styles.container}>
      {/* HEADER */}
      <Text style={styles.title}>{scheme.title}</Text>
      <Text style={styles.category}>{scheme.category}</Text>

      {/* TABS */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {["Overview", "Eligibility", "Loan", "Documents", "Calculator"].map(
          (tab) => (
            <TouchableOpacity
              key={tab}
              onPress={() => setActiveTab(tab)}
              style={[
                styles.tab,
                activeTab === tab && styles.activeTab,
              ]}
            >
              <Text
                style={[
                  styles.tabText,
                  activeTab === tab && styles.activeTabText,
                ]}
              >
                {tab}
              </Text>
            </TouchableOpacity>
          )
        )}
      </ScrollView>

      {/* CONTENT */}
      <ScrollView style={styles.content}>
        {renderTab()}
      </ScrollView>
    </View>
  );
}

/* ===================== STYLES ===================== */

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#fff",
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  category: {
    color: "#666",
    marginBottom: 10,
  },
  tab: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    marginRight: 8,
    borderRadius: 20,
    backgroundColor: "#eee",
  },
  activeTab: {
    backgroundColor: "#2563eb",
  },
  tabText: {
    fontSize: 14,
    color: "#000",
  },
  activeTabText: {
    color: "#fff",
    fontWeight: "bold",
  },
  content: {
    marginTop: 16,
  },
  label: {
    fontWeight: "bold",
    textTransform: "capitalize",
  },
  text: {
    marginBottom: 8,
    fontSize: 14,
  },
});
