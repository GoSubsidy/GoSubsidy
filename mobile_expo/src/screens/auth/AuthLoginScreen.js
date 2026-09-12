import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';

export default function AuthLoginScreen({ navigation }) {
  const [mobile, setMobile] = useState('');
  const [loading, setLoading] = useState(false);

  const sendOtp = async () => {
    if (mobile.length !== 10) {
      Alert.alert('Error', 'Enter valid mobile number');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('https://YOUR_API_URL/auth/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mobile }),
      });

      const data = await response.json();

      if (data.success) {
        navigation.navigate('Otp', { mobile });
      } else {
        Alert.alert('Error', data.message || 'Failed to send OTP');
      }
    } catch (error) {
      Alert.alert('Error', 'Server not reachable');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>

      <TextInput
        placeholder="Enter mobile number"
        keyboardType="number-pad"
        maxLength={10}
        value={mobile}
        onChangeText={setMobile}
        style={styles.input}
      />

      <TouchableOpacity style={styles.button} onPress={sendOtp} disabled={loading}>
        <Text style={styles.buttonText}>
          {loading ? 'Sending...' : 'CONTINUE'}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 24 },
  title: { fontSize: 24, marginBottom: 20 },
  input: {
    borderWidth: 1,
    borderRadius: 6,
    padding: 12,
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#2196F3',
    padding: 14,
    borderRadius: 6,
    alignItems: 'center',
  },
  buttonText: { color: '#fff', fontWeight: 'bold' },
});
