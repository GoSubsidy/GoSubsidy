import React from "react";
import { View, Text, Button } from "react-native";

export default function OTP({ navigation }) {
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text>OTP Screen</Text>
      <Button title="Back to Login" onPress={() => navigation.goBack()} />
    </View>
  );
}


