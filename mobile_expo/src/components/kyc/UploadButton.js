import React from "react";
import { Button } from "react-native";
import * as DocumentPicker from "expo-document-picker";

export default function UploadButton({ label, onPick }) {
  const pickDocument = async () => {
    const result = await DocumentPicker.getDocumentAsync({
      type: ["image/*", "application/pdf"],
    });

    if (!result.canceled) {
      onPick(result.assets[0]);
    }
  };

  return <Button title={label} onPress={pickDocument} />;
}
