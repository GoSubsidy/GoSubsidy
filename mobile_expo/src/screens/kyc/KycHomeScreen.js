import React from "react";
import { View } from "react-native";
import KycForm from "../../components/kyc/KycForm";

export default function KycHomeScreen({ navigation }) {
  const handleNext = (data) => {
    navigation.navigate("DocumentUpload", {
      kycData: data,
    });
  };

  return (
    <View style={{ padding: 16 }}>
      <KycForm onNext={handleNext} />
    </View>
  );
}
