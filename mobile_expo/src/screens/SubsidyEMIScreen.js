"./src/screens/SubsidyEMIScreen";
// mobile_expo/src/screens/SubsidyEMIScreen.js
import React, { useState, useEffect } from "react";
import { View, Text, Button, ScrollView } from "react-native";
import SubsidyEMIWidget from "../components/SubsidyEMIWidget";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Toast from "react-native-toast-message";

export default function SubsidyEMIScreen({ route, navigation }) {
  const { scheme, subsidy } = route.params || {};
  const defaultProjectCost = Number(scheme?.max_project_cost) || 100000;

  const defaultSubsidyAmount = Math.round((defaultProjectCost * (subsidy?.percentage || 0)) / 100);
  const defaultLoanAmount = Math.max(0, defaultProjectCost - defaultSubsidyAmount);

  const [profile, setProfile] = useState(null);
  const [showPreview, setShowPreview] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const raw = await AsyncStorage.getItem("user_profile");
        if (raw) setProfile(JSON.parse(raw));
      } catch (e) {
        console.warn("Failed to load profile:", e);
      }
    })();
  }, []);

  function goToApplyWithRecommended(recommended_loan = defaultLoanAmount, prefillObj = null) {
    const params = {
      scheme_id: scheme?.id,
      subsidy_id: subsidy?.id,
      recommended_loan: Number(recommended_loan || 0),
      prefill: prefillObj === null ? true : prefillObj // true => use stored profile on ApplyScreen
    };
    navigation.navigate("Apply", params);
  }

  async function handleUseProfile() {
    if (!profile) {
      try {
        if (Toast && Toast.show) {
          Toast.show({
            type: "info",
            text1: "No profile found",
            text2: "Save profile via Home → Edit Profile.",
            visibilityTime: 2400
          });
        }
      } catch (e) { console.warn("Toast error", e); }
      return;
    }
    setShowPreview(true);
  }

  return (
    <ScrollView style={{ flex: 1, backgroundColor: "#f6f7fb" }} contentContainerStyle={{ paddingBottom: 24 }}>
      <View style={{ padding: 12 }}>
        <Text style={{ fontSize: 20, fontWeight: "800" }}>{scheme?.title}</Text>
        <Text style={{ marginTop: 8 }}>{subsidy?.name} — {subsidy?.percentage}%</Text>
        <Text style={{ marginTop: 6, color: "#444" }}>
          Default project cost: ₹{defaultProjectCost.toLocaleString()} · Subsidy: ₹{defaultSubsidyAmount.toLocaleString()} · Loan: ₹{defaultLoanAmount.toLocaleString()}
        </Text>
      </View>

      <SubsidyEMIWidget
        defaultProjectCost={defaultProjectCost}
        defaultSubsidyPercent={subsidy?.percentage || 0}
        defaultRate={10}
        defaultTenure={36}
      />

      <View style={{ padding: 12 }}>
        <Button title="Proceed to Apply (use recommended loan)" onPress={() => goToApplyWithRecommended()} />
        <View style={{ height: 8 }} />
        <Button title="Apply with custom values" onPress={() => goToApplyWithRecommended()} />

        <View style={{ height: 12 }} />

        <Button title="Use saved profile to preview autofill" onPress={handleUseProfile} />
      </View>

      {showPreview && profile && (
        <View style={{ margin: 12, padding: 12, borderRadius: 8, backgroundColor: "#fff", elevation: 2 }}>
          <Text style={{ fontWeight: "700", marginBottom: 6 }}>Profile preview</Text>
          <Text>Name: {profile.name || "-"}</Text>
          <Text>Phone: {profile.phone || "-"}</Text>
          <Text>Email: {profile.email || "-"}</Text>
          <Text>Income: {profile.income ? `₹${Number(profile.income).toLocaleString()}` : "-"}</Text>

          <View style={{ height: 10 }} />
          <Button
            title="Proceed with this profile (prefill)"
            onPress={() => {
              const recommendedLoan = defaultLoanAmount;
              try {
                if (Toast && Toast.show) {
                  Toast.show({
                    type: "subsidy",
                    text1: "Prefill Applied",
                    text2: `Recommended loan: ₹${recommendedLoan.toLocaleString()}`,
                    visibilityTime: 2000
                  });
                }
              } catch (e) { console.warn("Toast show failed", e); }
              // pass profile object as prefill so ApplyScreen uses it immediately
              setTimeout(() => {
                goToApplyWithRecommended(recommendedLoan, profile);
              }, 350);
            }}
          />

          <View style={{ height: 8 }} />
          <Button title="Cancel" color="#999" onPress={() => setShowPreview(false)} />
        </View>
      )}
    </ScrollView>
  );
}
