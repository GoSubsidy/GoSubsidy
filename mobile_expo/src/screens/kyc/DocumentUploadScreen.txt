import React, { useState } from "react";
import { View, Button, Alert } from "react-native";
import UploadButton from "../../components/kyc/UploadButton";
import api from "../../api/api";

export default function DocumentUploadScreen({ route, navigation }) {
  const { kycData } = route.params;

  const [panFile, setPanFile] = useState(null);
  const [aadhaarFile, setAadhaarFile] = useState(null);
  const [incomeFile, setIncomeFile] = useState(null);

  const submitKyc = async () => {
    if (!panFile || !aadhaarFile) {
      Alert.alert("Upload all required documents");
      return;
    }

    const formData = new FormData();
    formData.append("pan", kycData.pan);
    formData.append("aadhaar", kycData.aadhaar);

    formData.append("panFile", {
      uri: panFile.uri,
      name: panFile.name,
      type: panFile.mimeType,
    });

    formData.append("aadhaarFile", {
      uri: aadhaarFile.uri,
      name: aadhaarFile.name,
      type: aadhaarFile.mimeType,
    });

    if (incomeFile) {
      formData.append("incomeProof", {
        uri: incomeFile.uri,
        name: incomeFile.name,
        type: incomeFile.mimeType,
      });
    }

    try {
      await api.post("/kyc/submit", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      navigation.replace("KycSuccess");
    } catch (err) {
      Alert.alert("KYC Failed", "Please try again");
    }
  };

  return (
    <View style={{ padding: 16 }}>
      <UploadButton label="Upload PAN" onPick={setPanFile} />
      <UploadButton label="Upload Aadhaar" onPick={setAadhaarFile} />
      <UploadButton label="Upload Income Proof (Optional)" onPick={setIncomeFile} />

      <Button title="Submit KYC" onPress={submitKyc} />
    </View>
  );
}
