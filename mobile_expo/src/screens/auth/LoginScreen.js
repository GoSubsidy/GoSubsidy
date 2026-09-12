import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  StyleSheet,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { API_BASE_URL } from "../../config/api";

export default function LoginScreen() {
  const navigation = useNavigation();
  const [mobile, setMobile] = useState("");
  const [loading, setLoading] = useState(false);

  const sendOtp = async () => {
    // ✅ OPTION 2 — FRONTEND VALIDATION (IMPORTANT)
    if (!mobile || mobile.trim().length === 0) {
      Alert.alert("Error", "Please enter mobile number");
      return;
    }

    if (!/^[6-9]\d{9}$/.test(mobile)) {
      Alert.alert("Error", "Invalid mobile number");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ mobile }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.message || "OTP failed");
      }

      Alert.alert("Success", "OTP sent successfully");

      navigation.navigate("Otp", { mobile });

    } catch (error) {
      Alert.alert("Error", error.message || "Server not reachable");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Mobile Number</Text>

      <TextInput
        style={styles.input}
        placeholder="Enter mobile number"
        keyboardType="number-pad"
        maxLength={10}
        value={mobile}
        onChangeText={setMobile}
      />

      <TouchableOpacity
        style={styles.button}
        onPress={sendOtp}
        disabled={loading}
      >
        <Text style={styles.buttonText}>
          {loading ? "PLEASE WAIT..." : "LOGIN"}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: "center",
    backgroundColor: "#f2f2f2",
  },
  label: {
    fontSize: 16,
    marginBottom: 6,
    color: "#333",
  },
  input: {
    height: 45,
    backgroundColor: "#fff",
    borderRadius: 5,
    paddingHorizontal: 12,
    fontSize: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#ccc",
  },
  button: {
    height: 45,
    backgroundColor: "#1e88e5",
    borderRadius: 5,
    justifyContent: "center",
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});
