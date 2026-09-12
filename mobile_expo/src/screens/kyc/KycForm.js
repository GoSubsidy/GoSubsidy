import React, { useState } from "react";
import { View, TextInput, Button, Alert } from "react-native";
import { validatePAN } from "../../utils/validators/panValidator";

export default function KycForm({ onNext }) {
  const [pan, setPan] = useState("");
  const [aadhaar, setAadhaar] = useState("");

  const handleNext = () => {
    if (!validatePAN(pan)) {
      Alert.alert("Invalid PAN");
      return;
    }
    if (aadhaar.length !== 12) {
      Alert.alert("Invalid Aadhaar");
      return;
    }
    onNext({ pan, aadhaar });
  };

  return (
    <View>
      <TextInput
        placeholder="PAN Number"
        autoCapitalize="characters"
        value={pan}
        onChangeText={setPan}
      />
      <TextInput
        placeholder="Aadhaar Number"
        keyboardType="numeric"
        value={aadhaar}
        onChangeText={setAadhaar}
      />

      <Button title="Upload Documents" onPress={handleNext} />
    </View>
  );
}
